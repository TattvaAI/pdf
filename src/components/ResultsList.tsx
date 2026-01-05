import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, AlertCircle, Download } from "lucide-react";
import type { ProcessingResult } from "@/hooks/usePDFProcessor";

interface ResultsListProps {
  results: ProcessingResult[];
  downloadUrl: string | null;
  onDownload: () => void;
}

export const ResultsList = React.memo<ResultsListProps>(({ results, downloadUrl, onDownload }) => {
  if (results.length === 0) return null;

  const successCount = results.filter(r => r.success).length;

  return (
    <Card className="p-8 shadow-large border-primary/20 bg-card/80 backdrop-blur-sm animate-fade-in">
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-accent p-2 rounded-xl">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gradient">
              Complete! ({successCount} files ready)
            </h2>
          </div>
          {downloadUrl && (
            <Button onClick={onDownload} size="lg" className="bg-gradient-primary hover:shadow-glow transition-smooth hover:scale-105">
              <Download className="mr-2 h-5 w-5" />
              Download ZIP
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px] w-full rounded-xl border border-primary/20 p-4 bg-background/50">
          <div className="space-y-2">
            {results.map((file, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-xl transition-smooth hover:scale-[1.01] ${
                  file.success
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800 shadow-soft'
                    : 'bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border border-red-200 dark:border-red-800 shadow-soft'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {file.success ? (
                    <div className="bg-green-500 p-1.5 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  ) : (
                    <div className="bg-red-500 p-1.5 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <span className="font-semibold text-sm">{file.fileName}</span>
                </div>
                {file.error && (
                  <span className="text-xs text-red-600 dark:text-red-400 font-medium">{file.error}</span>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
});