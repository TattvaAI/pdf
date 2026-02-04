/**
 * PDF Service Layer
 * 
 * This service handles all PDF-related operations including:
 * - Loading PDF documents
 * - Extracting pages
 * - Creating ZIP archives
 */

import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import type { PDFProcessorState, ProcessingResult } from "@/hooks/usePDFProcessor";
import {
  buildFileName,
  buildPageSequenceFromState,
  buildFilenameSequence,
  parseExclusions,
  determinePaddingLength,
  type FileNameOptions,
} from "@/lib/pdf-utils";

export interface ProcessPDFOptions {
  state: PDFProcessorState;
  onProgress?: (progress: number) => void;
  onResult?: (result: ProcessingResult) => void;
}

export interface ProcessPDFResult {
  success: boolean;
  results: ProcessingResult[];
  zipBlob?: Blob;
  error?: string;
}

/**
 * Process a PDF file according to the configuration state
 */
export async function processPDF(options: ProcessPDFOptions): Promise<ProcessPDFResult> {
  const { state, onProgress, onResult } = options;

  try {
    // Validate state
    if (!state.file) {
      throw new Error("No PDF file provided");
    }

    // Load PDF document
    onProgress?.(10);
    const arrayBuffer = await state.file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const totalPages = pdfDoc.getPageCount();

    // Parse page sequence
    onProgress?.(20);
    let pageSequence: number[] = [];
    try {
      pageSequence = buildPageSequenceFromState(state);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Invalid range configuration"
      );
    }

    if (pageSequence.length === 0) {
      throw new Error("No valid pages to process");
    }

    // Build filename sequence
    const exclusions = parseExclusions(state.exclusions);
    const pagesToProcess = Math.min(pageSequence.length, totalPages);

    if (pagesToProcess === 0) {
      throw new Error("No pages to process");
    }

    const startNumber = pageSequence.length > 0 ? pageSequence[0] : 1;
    const filenameSequence = buildFilenameSequence(
      pagesToProcess,
      exclusions,
      startNumber
    );

    const paddingLength = determinePaddingLength(filenameSequence, state.ranges);

    // Process pages
    const zip = new JSZip();
    const processedResults: ProcessingResult[] = [];

    for (let i = 0; i < pagesToProcess; i += 1) {
      try {
        const pdfPageIndex = i;
        const filenameNumber = filenameSequence[i];
        
        const fileNameOptions: FileNameOptions = {
          prefix: state.prefix,
          suffix: state.suffix,
          sequenceNumber: filenameNumber,
          paddingLength,
        };
        
        const fileName = buildFileName(fileNameOptions);

        // Create new PDF with single page
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [pdfPageIndex]);
        newPdf.addPage(copiedPage);

        const pdfBytes = await newPdf.save();
        zip.file(fileName, pdfBytes);

        const result: ProcessingResult = {
          fileName,
          success: true,
        };
        
        processedResults.push(result);
        onResult?.(result);

        // Update progress (20% to 90%)
        const progress = 20 + ((i + 1) / pagesToProcess) * 70;
        onProgress?.(progress);
      } catch (error) {
        const filenameNumber = filenameSequence[i];
        const fileNameOptions: FileNameOptions = {
          prefix: state.prefix,
          suffix: state.suffix,
          sequenceNumber: filenameNumber,
          paddingLength,
        };
        const fileName = buildFileName(fileNameOptions);

        const result: ProcessingResult = {
          fileName,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
        
        processedResults.push(result);
        onResult?.(result);
      }
    }

    // Generate ZIP file
    onProgress?.(90);
    const zipBlob = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
    });

    onProgress?.(100);

    return {
      success: true,
      results: processedResults,
      zipBlob,
    };
  } catch (error) {
    return {
      success: false,
      results: [],
      error: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

/**
 * Validate file before processing
 */
export function validatePDFFile(file: File, maxSize: number): { valid: boolean; error?: string } {
  if (file.type !== "application/pdf") {
    return {
      valid: false,
      error: "Invalid file type. Please upload a PDF file.",
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File is too large. Maximum allowed size is ${Math.floor(maxSize / 1024 / 1024)}MB.`,
    };
  }

  return { valid: true };
}
