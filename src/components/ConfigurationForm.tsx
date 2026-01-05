import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Scissors, Loader2 } from 'lucide-react';

interface ConfigurationFormProps {
  prefix: string;
  suffix: string;
  zipName: string;
  ranges: string;
  exclusions: string;
  isProcessing: boolean;
  onPrefixChange: (value: string) => void;
  onSuffixChange: (value: string) => void;
  onZipNameChange: (value: string) => void;
  onRangesChange: (value: string) => void;
  onExclusionsChange: (value: string) => void;
  onProcess: () => void;
  disabled: boolean;
}

export const ConfigurationForm = React.memo<ConfigurationFormProps>(({
  prefix,
  suffix,
  zipName,
  ranges,
  exclusions,
  isProcessing,
  onPrefixChange,
  onSuffixChange,
  onZipNameChange,
  onRangesChange,
  onExclusionsChange,
  onProcess,
  disabled
}) => {
  return (
    <Card className="p-8 shadow-large border-primary/20 bg-card/80 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-secondary p-2 rounded-xl">
          <Settings className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gradient">Configuration</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="prefix">Prefix (optional)</Label>
          <Input
            id="prefix"
            placeholder="e.g., DMC"
            value={prefix}
            onChange={(e) => onPrefixChange(e.target.value)}
            className="transition-smooth focus:shadow-soft"
            aria-describedby="prefix-help"
          />
          <p id="prefix-help" className="sr-only">Text to add before each page number, like 'DMC' for DMC001.pdf</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="suffix">Suffix (optional)</Label>
          <Input
            id="suffix"
            placeholder="e.g., _final"
            value={suffix}
            onChange={(e) => onSuffixChange(e.target.value)}
            className="transition-smooth focus:shadow-soft"
            aria-describedby="suffix-help"
          />
          <p id="suffix-help" className="sr-only">Text to add after each page number, like '_final' for 001_final.pdf</p>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="ranges">Page Ranges (comma-separated)</Label>
          <Input
            id="ranges"
            placeholder="e.g., 1-5,10-15,20-25"
            value={ranges}
            onChange={(e) => onRangesChange(e.target.value)}
            className="transition-smooth focus:shadow-soft"
            aria-describedby="ranges-help"
          />
          <p id="ranges-help" className="sr-only">Page ranges to process, separated by commas, like '1-5,10-15,20-25' for multiple ranges</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="exclusions">Exclusions (comma-separated)</Label>
          <Input
            id="exclusions"
            placeholder="e.g., 3,4,7"
            value={exclusions}
            onChange={(e) => onExclusionsChange(e.target.value)}
            className="transition-smooth focus:shadow-soft"
            aria-describedby="exclusions-help"
          />
          <p id="exclusions-help" className="sr-only">Page numbers to skip, separated by commas, like 3,4,7</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipName">ZIP File Name</Label>
          <Input
            id="zipName"
            placeholder="e.g., my_files"
            value={zipName}
            onChange={(e) => onZipNameChange(e.target.value)}
            className="transition-smooth focus:shadow-soft"
            aria-describedby="zip-name-help"
          />
          <p id="zip-name-help" className="sr-only">Name for the downloaded ZIP file containing all split PDFs</p>
        </div>
      </div>

      <Button 
        onClick={onProcess} 
        disabled={disabled}
        className="w-full py-6 text-lg font-semibold bg-gradient-primary hover:shadow-glow transition-smooth hover:scale-[1.02] mt-8"
        size="lg"
        aria-label={isProcessing ? "Processing PDF file, please wait" : "Split PDF into individual pages"}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Scissors className="mr-2 h-5 w-5" />
            Split PDF
          </>
        )}
      </Button>
    </Card>
  );
});