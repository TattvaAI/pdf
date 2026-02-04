import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProgressDisplayProps {
  progress: number;
  isVisible: boolean;
}

export const ProgressDisplay = React.memo<ProgressDisplayProps>(({ progress, isVisible }) => {
  if (!isVisible) return null;

  return (
    <Card className="p-6 shadow-large border-primary/20 bg-card/80 backdrop-blur-sm animate-fade-in">
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="font-semibold text-foreground">Processing your PDF...</span>
          <span className="text-primary font-bold">{progress}%</span>
        </div>
        <Progress value={progress} className="h-3 bg-primary/10" />
        <p className="text-xs text-muted-foreground text-center">Please wait while we split your PDF</p>
      </div>
    </Card>
  );
});