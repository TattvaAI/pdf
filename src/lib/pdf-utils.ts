import type { PDFProcessorState } from "@/hooks/usePDFProcessor";
import {
  INVALID_FILENAME_CHARS,
  MAX_FILENAME_COMPONENT_LENGTH,
  MIN_PADDING_LENGTH,
} from "./constants";

// ==================== File Size Utilities ====================

/**
 * Formats a file size in bytes to a human-readable string
 * @param bytes - File size in bytes
 * @param fractionDigits - Number of decimal places (default: 2)
 * @returns Formatted string with appropriate unit (B, KB, MB, GB)
 * @example
 * formatFileSize(1024) // "1.00 KB"
 * formatFileSize(1536, 1) // "1.5 KB"
 */
export const formatFileSize = (
  bytes: number,
  fractionDigits: number = 2
): string => {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  const formattedSize =
    unitIndex === 0 ? size.toString() : size.toFixed(fractionDigits);

  return `${formattedSize} ${units[unitIndex]}`;
};

// ==================== Filename Utilities ====================

/**
 * Sanitizes a filename component by removing invalid characters
 * @param input - The filename component to sanitize
 * @returns Sanitized string safe for use in filenames across all operating systems
 */
export const sanitizeFilenameComponent = (input: string): string => {
  return input
    .replace(INVALID_FILENAME_CHARS, "")
    .trim()
    .slice(0, MAX_FILENAME_COMPONENT_LENGTH);
};

/**
 * Parses a comma-separated string of page numbers into a sorted array
 * @param exclusionsString - Comma-separated page numbers (e.g., "1,3,5")
 * @returns Array of unique page numbers sorted in ascending order
 * @example
 * parseExclusions("1,3,5,3") // [1, 3, 5]
 * parseExclusions("5,1,3") // [1, 3, 5]
 */
export const parseExclusions = (exclusionsString: string): number[] => {
  if (!exclusionsString.trim()) {
    return [];
  }

  const numbers = exclusionsString
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean)
    .map((token) => parseInt(token, 10))
    .filter((num) => Number.isFinite(num) && num > 0);

  return Array.from(new Set(numbers)).sort((a, b) => a - b);
};

// ==================== Range Parsing Utilities ====================

/**
 * Expands a single range token into an array of page numbers
 * @param token - A single page or range (e.g., "5" or "1-3")
 * @returns Array of page numbers
 * @throws Error if the token format is invalid
 */
const expandRangeToken = (token: string): number[] => {
  if (token.includes("-")) {
    const parts = token.split("-");
    if (parts.length !== 2) {
      throw new Error(`Invalid range format: "${token}"`);
    }

    const start = parseInt(parts[0].trim(), 10);
    const end = parseInt(parts[1].trim(), 10);

    if (!Number.isFinite(start) || !Number.isFinite(end)) {
      throw new Error(`Invalid range format: "${token}"`);
    }

    return generateInclusiveRange(start, end);
  }

  const pageNumber = parseInt(token, 10);
  if (!Number.isFinite(pageNumber) || pageNumber <= 0) {
    throw new Error(`Invalid page number: "${token}"`);
  }

  return [pageNumber];
};

/**
 * Deduplicates an array while preserving the original order
 * @param arr - Array to deduplicate
 * @returns Array with duplicates removed, preserving first occurrence order
 */
const dedupePreserveOrder = (arr: number[]): number[] => {
  const seen = new Set<number>();
  const result: number[] = [];

  for (const value of arr) {
    if (!seen.has(value)) {
      seen.add(value);
      result.push(value);
    }
  }

  return result;
};

/**
 * Parses a comma-separated string of page ranges into an array of page numbers
 * @param rangesString - Page ranges (e.g., "1-5,8,10-12")
 * @returns Array of unique page numbers in order
 * @throws Error if any range segment is invalid
 * @example
 * parsePageSegments("1-3,5") // [1, 2, 3, 5]
 */
export const parsePageSegments = (rangesString: string): number[] => {
  if (!rangesString.trim()) {
    return [];
  }

  const tokens = rangesString.split(",").map((token) => token.trim()).filter(Boolean);

  const expanded = tokens.flatMap(expandRangeToken);
  return dedupePreserveOrder(expanded);
};

/**
 * Generates an inclusive range of numbers from start to end
 * @param start - Starting number (inclusive)
 * @param end - Ending number (inclusive)
 * @returns Array of numbers from start to end
 * @throws Error if range is invalid
 */
export const generateInclusiveRange = (start: number, end: number): number[] => {
  if (!Number.isFinite(start) || !Number.isFinite(end) || start > end) {
    throw new Error(`Invalid range: ${start}-${end}`);
  }

  const values: number[] = [];
  for (let value = start; value <= end; value += 1) {
    values.push(value);
  }
  return values;
};

/**
 * Builds the sequence of pages to extract from the PDF based on ranges
 * Note: Exclusions do NOT remove pages, they only skip numbers in filenames
 * @param state - Current PDF processor state
 * @returns Array of page numbers to extract from PDF
 * @throws Error if range format is invalid
 */
export const buildPageSequenceFromState = (state: PDFProcessorState): number[] => {
  return parsePageSegments(state.ranges);
};

/**
 * Builds the filename number sequence, skipping excluded numbers
 * @param pageCount - Number of pages being processed
 * @param exclusions - Array of numbers to skip in the sequence
 * @param startNumber - Starting number for the sequence (default: 1)
 * @returns Array of filename numbers (same length as pageCount)
 * @example
 * buildFilenameSequence(5, [3, 6], 1) // [1, 2, 4, 5, 7]
 * buildFilenameSequence(3, [], 5) // [5, 6, 7]
 */
export const buildFilenameSequence = (
  pageCount: number,
  exclusions: number[],
  startNumber: number = 1
): number[] => {
  const exclusionSet = new Set(exclusions);
  const filenameNumbers: number[] = [];
  let currentNumber = startNumber;

  for (let i = 0; i < pageCount; i++) {
    // Skip any excluded numbers
    while (exclusionSet.has(currentNumber)) {
      currentNumber++;
    }
    filenameNumbers.push(currentNumber);
    currentNumber++;
  }

  return filenameNumbers;
};

/**
 * Determines the padding length for page numbers based on the ranges string
 * @param sequence - Array of page numbers to process
 * @param rangesString - Original ranges string (e.g., "01-05")
 * @returns Number of digits to use for padding
 * @example
 * determinePaddingLength([1,2,3], "01-03") // 2
 * determinePaddingLength([1,2,100], "1-100") // 3
 */
export const determinePaddingLength = (sequence: number[], rangesString: string): number => {
  // Determine padding from the ranges string format (e.g., "01-05" indicates 2 digits)
  const firstToken = rangesString.split(',')[0]?.trim();
  let requestedLength = MIN_PADDING_LENGTH;

  if (firstToken) {
    // Check if first token has a range like "01-05"
    if (firstToken.includes('-')) {
      const [startStr] = firstToken.split('-');
      if (startStr && /^0+\d+$/.test(startStr)) {
        requestedLength = startStr.length;
      }
    } else if (/^0+\d+$/.test(firstToken)) {
      // Single page with leading zeros like "001"
      requestedLength = firstToken.length;
    }
  }

  // Also consider the maximum number in the sequence
  const maxSequenceDigits = sequence.reduce((max, num) => {
    const digits = num.toString().length;
    return Math.max(max, digits);
  }, 0);

  return Math.max(requestedLength, maxSequenceDigits, MIN_PADDING_LENGTH);
};

/**
 * Pads a number with leading zeros to a specified length
 * @param value - Number to pad
 * @param length - Desired string length
 * @returns Zero-padded string
 * @example
 * padNumber(5, 3) // "005"
 * padNumber(123, 2) // "123" (doesn't truncate)
 */
export const padNumber = (value: number, length: number): string => {
  return value.toString().padStart(length, "0");
};

/**
 * Builds a complete filename from components
 * @param options - Filename components
 * @returns Complete filename with .pdf extension
 * @example
 * buildFileName({ prefix: "DMC", suffix: "_final", sequenceNumber: 5, paddingLength: 3 })
 * // "DMC005_final.pdf"
 */
export const buildFileName = (options: {
  prefix: string;
  suffix: string;
  sequenceNumber: number;
  paddingLength: number;
}): string => {
  const { prefix, suffix, sequenceNumber, paddingLength } = options;

  const sanitizedPrefix = sanitizeFilenameComponent(prefix);
  const sanitizedSuffix = sanitizeFilenameComponent(suffix);
  const paddedNumber = padNumber(sequenceNumber, paddingLength);

  return `${sanitizedPrefix}${paddedNumber}${sanitizedSuffix}.pdf`;
};

/**
 * Validates the PDF processing configuration
 * @param state - Current PDF processor state
 * @returns Validation result with success flag and optional error message
 */
export const validateConfiguration = (state: PDFProcessorState): {
  isValid: boolean;
  error?: string;
} => {
  if (!state.file) {
    return { isValid: false, error: "Please select a PDF file" };
  }

  if (!state.ranges.trim()) {
    return { isValid: false, error: "Please specify page ranges" };
  }

  try {
    parsePageSegments(state.ranges);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid range format";
    return { isValid: false, error: message };
  }

  return { isValid: true };
};
