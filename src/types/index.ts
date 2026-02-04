/**
 * Type definitions for the PDF Splitter application
 */

export interface PageRange {
  start: number;
  end: number;
}

export interface ProcessingOptions {
  prefix?: string;
  suffix?: string;
  ranges: string;
  exclusions?: string;
  zipName?: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export interface FileInfo {
  name: string;
  size: number;
  type: string;
}
