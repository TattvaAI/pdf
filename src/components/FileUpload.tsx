import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileUp, X } from "lucide-react";
import { formatFileSize, MAX_FILE_SIZE_BYTES } from "@/lib/pdf-utils";

interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  onClearResults: () => void;
}

export const FileUpload = React.memo<FileUploadProps>(({ file, onFileChange, onClearResults }) => {
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const pdfFile = acceptedFiles[0];
    
    if (!pdfFile) return;
    
    // Check file type
    if (pdfFile.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }

    // Check file size
    if (pdfFile.size > MAX_FILE_SIZE_BYTES) {
      toast({
        title: "File too large",
        description: `Your file is ${formatFileSize(pdfFile.size)}. Maximum allowed size is ${formatFileSize(MAX_FILE_SIZE_BYTES)}.`,
        variant: "destructive",
      });
      return;
    }

    onFileChange(pdfFile);
    onClearResults();
    toast({
      title: "✅ PDF uploaded",
      description: `${pdfFile.name} (${formatFileSize(pdfFile.size)}) is ready to process.`,
    });
  }, [onFileChange, onClearResults, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  const handleRemoveFile = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onFileChange(null);
    onClearResults();
  }, [onFileChange, onClearResults]);

  return (
    <Card className="p-8 shadow-large border-primary/20 bg-card/80 backdrop-blur-sm">
      <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-smooth ${
        isDragActive
          ? 'border-primary bg-gradient-primary/10 scale-[1.02] shadow-glow'
          : 'border-muted hover:border-primary hover:bg-gradient-primary/5 hover:shadow-medium'
      }`}
      role="button"
      tabIndex={0}
      aria-label={file ? `File uploaded: ${file.name}` : "Upload PDF file - drag and drop or click to browse"}
      aria-describedby="file-upload-description"
      >
        <input {...getInputProps()} aria-label="PDF file input" />
        <div className={`transition-smooth ${isDragActive ? 'scale-110' : ''}`}>
          <div className="bg-gradient-primary p-4 rounded-2xl w-fit mx-auto mb-4 shadow-medium">
            <FileUp className="h-12 w-12 text-white" aria-hidden="true" />
          </div>
        </div>
        {file ? (
          <div className="space-y-3 animate-fade-in">
            <div className="bg-gradient-primary/10 p-4 rounded-xl inline-block">
              <p className="text-lg font-semibold text-foreground">{file.name}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {formatFileSize(file.size)} / {formatFileSize(MAX_FILE_SIZE_BYTES)} max
              </p>
            </div>
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveFile}
                className="mt-3 hover:scale-105 transition-smooth border-primary/20 hover:border-primary"
                aria-label={`Remove uploaded file: ${file.name}`}
              >
                <X className="mr-2 h-4 w-4" aria-hidden="true" />
                Remove File
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xl font-semibold mb-2">
              {isDragActive ? '✨ Drop your PDF here' : '📄 Drag & drop a PDF file here'}
            </p>
            <p className="text-muted-foreground" id="file-upload-description">
              or click to browse your files. Only PDF files up to 500MB are accepted.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
});