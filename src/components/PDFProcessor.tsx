import { useCallback, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { usePDFProcessor } from "@/hooks/usePDFProcessor";
import { validateConfiguration } from "@/lib/pdf-utils";
import { processPDF } from "@/services/pdfService";
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

  const processPDFHandler = useCallback(async () => {
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
      const result = await processPDF({
        state,
        onProgress: (progress) => actions.setProgress(progress),
      });

      if (result.success && result.zipBlob) {
        actions.setResults(result.results);
        
        const url = URL.createObjectURL(result.zipBlob);
        actions.setDownloadUrl(url);

        const successCount = result.results.filter((r) => r.success).length;
        toast({
          title: "✨ Processing complete!",
          description: `Successfully processed ${successCount} pages.`,
        });
      } else {
        throw new Error(result.error || "Processing failed");
      }
    } catch (error) {
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
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
}Handler