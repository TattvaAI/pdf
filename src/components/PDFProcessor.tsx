import { useCallback, useEffect, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import { useToast } from "@/hooks/use-toast";
import { usePDFProcessor, ProcessingResult } from "@/hooks/usePDFProcessor";
import {
  buildFileName,
  buildSequenceFromState,
  determinePaddingLength,
  validateConfiguration,
} from "@/lib/pdf-utils";
import { FileUpload } from "./FileUpload";
import { ConfigurationForm } from "./ConfigurationForm";
import { ProgressDisplay } from "./ProgressDisplay";
import { ResultsList } from "./ResultsList";

export default function PDFProcessor() {
  const { state, actions } = usePDFProcessor();
  const { toast } = useToast();

  const previousDownloadUrl = useRef<string | null>(null);

  useEffect(() => {
    const currentUrl = state.downloadUrl;

    if (previousDownloadUrl.current && previousDownloadUrl.current !== currentUrl) {
      URL.revokeObjectURL(previousDownloadUrl.current);
    }

    previousDownloadUrl.current = currentUrl ?? null;

    return () => {
      if (previousDownloadUrl.current) {
        URL.revokeObjectURL(previousDownloadUrl.current);
        previousDownloadUrl.current = null;
      }
    };
  }, [state.downloadUrl]);

  const processPDF = useCallback(async () => {
    const validationError = validateConfiguration(state);
    if (validationError) {
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    actions.setProcessing(true);
    actions.setProgress(0);
    actions.setResults([]);
    actions.setDownloadUrl(null);

    try {
      const arrayBuffer = await state.file!.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pageCount = pdfDoc.getPageCount();

      actions.setProgress(10);

      let sequence: number[] = [];

      try {
        sequence = buildSequenceFromState(state);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Invalid range configuration";
        throw new Error(message);
      }

      if (sequence.length === 0) {
        throw new Error("No valid pages to process after applying ranges and exclusions");
      }

      const maxSequenceNumber = Math.max(...sequence);
      if (maxSequenceNumber > pageCount) {
        throw new Error(`Not enough pages. The highest page requested is ${maxSequenceNumber}, but PDF has only ${pageCount} pages.`);
      }

      actions.setProgress(20);

      const zip = new JSZip();
      const processedResults: ProcessingResult[] = [];
      const paddingLength = determinePaddingLength(sequence, state.ranges);

      for (let i = 0; i < sequence.length; i += 1) {
        try {
          const sequenceNumber = sequence[i];
          const fileName = buildFileName({
            prefix: state.prefix,
            suffix: state.suffix,
            sequenceNumber,
            paddingLength,
          });

          const newPdf = await PDFDocument.create();
          const [copiedPage] = await newPdf.copyPages(pdfDoc, [sequenceNumber - 1]);
          newPdf.addPage(copiedPage);

          const pdfBytes = await newPdf.save();
          zip.file(fileName, pdfBytes);

          processedResults.push({
            fileName,
            success: true
          });

          actions.setProgress(20 + ((i + 1) / sequence.length) * 70);
        } catch (error) {
          const sequenceNumber = sequence[i];
          const fileName = buildFileName({
            prefix: state.prefix,
            suffix: state.suffix,
            sequenceNumber,
            paddingLength,
          });

          processedResults.push({
            fileName,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      actions.setResults(processedResults);
      actions.setProgress(90);

      const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
      const url = URL.createObjectURL(zipBlob);
      actions.setDownloadUrl(url);

      actions.setProgress(100);

      toast({
        title: "✨ Processing complete!",
        description: `Successfully processed ${processedResults.filter(r => r.success).length} pages.`,
      });

    } catch (error) {
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: "destructive",
      });
    } finally {
      actions.setProcessing(false);
    }
  }, [state, actions, toast]);

  const downloadZip = useCallback(() => {
    if (state.downloadUrl) {
      const link = document.createElement('a');
      link.href = state.downloadUrl;
      link.download = `${state.zipName.trim() || 'split_files'}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [state.downloadUrl, state.zipName]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <FileUpload
        file={state.file}
        onFileChange={actions.setFile}
        onClearResults={actions.clearResults}
      />

      <ConfigurationForm
        prefix={state.prefix}
        suffix={state.suffix}
        zipName={state.zipName}
        ranges={state.ranges}
        exclusions={state.exclusions}
        isProcessing={state.isProcessing}
        onPrefixChange={actions.setPrefix}
        onSuffixChange={actions.setSuffix}
        onZipNameChange={actions.setZipName}
        onRangesChange={actions.setRanges}
        onExclusionsChange={actions.setExclusions}
        onProcess={processPDF}
        disabled={!state.file || state.isProcessing}
      />

      <ProgressDisplay
        progress={state.progress}
        isVisible={state.isProcessing}
      />

      <ResultsList
        results={state.processedFiles}
        downloadUrl={state.downloadUrl}
        onDownload={downloadZip}
      />
    </div>
  );
}