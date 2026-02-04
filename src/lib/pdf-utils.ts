import type { PDFProcessorState } from "@/hooks/usePDFProcessor";
import {
  RANGE_TOKEN_REGEX,
  RANGE_LIST_REGEX,
  MAX_FILE_SIZE_BYTES,
  SIZE_UNITS,
  DEFAULT_SIZE_FRACTION_DIGITS,
  BYTES_PER_KB,
  MIN_PADDING_LENGTH,
  INVALID_FILENAME_CHARS,
  MAX_FILENAME_COMPONENT_LENGTH,
} from "./constants";

export { MAX_FILE_SIZE_BYTES };

/**
 * Formats a byte count into a human-readable file size string
 * @param bytes - The number of bytes to format
 * @param fractionDigits - Number of decimal places to show (default: 2)
 * @returns Formatted string like "1.5 MB"
 * @example
 * formatFileSize(1536) // "1.50 KB"
 * formatFileSize(1048576) // "1.00 MB"
 */
export const formatFileSize = (bytes: number, fractionDigits = DEFAULT_SIZE_FRACTION_DIGITS): string => {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return "0 B";
  }

  let value = bytes;
  let unitIndex = 0;

  while (value >= BYTES_PER_KB && unitIndex < SIZE_UNITS.length - 1) {
    value /= BYTES_PER_KB;
    unitIndex += 1;
  }

  const decimals = unitIndex === 0 ? 0 : fractionDigits;
  return `${value.toFixed(decimals)} ${SIZE_UNITS[unitIndex]}`;
};

// ==================== Filename Utilities ====================

/* @param input - The filename component to sanitize
 * @returns Sanitized string safe for use in filenames across all operating systems
 */
export const sanitizeFilenameComponent = (input: string): string => {
  if (!input) return "";
  
 */
export const sanitizeFilenameComponent = (input: string): string => {
  return input
    .replace(INVALID_FILENAME_CHARS, "")
    .trim()
    .slice(0, MAX_FILENAME_COMPONENT_LENGTH);
}; "1,3,5")
 * @returns Array of unique page numbers sorted in ascending order
 * @example
 * parseExclusions("1,3,5,3") // [1, 3, 5]
 * parseExclusions("5,1,3") // [1, 3, 5]
 */
export const parseExclusions = (exclusionString: string): number[] => {
  if (!exclusionString?.trim()) {
 * @example
 * parseExclusions("1,3,5,3") // [1, 3, 5]
 */
export const parseExclusions = (exclusionString: string): number[] => {
  if (!exclusionString.trim()) {
    return [];
  }

  const unique = new Set<number>();
  exclusionString.split(",").forEach((token) => {
    const value = Number.parseInt(token.trim(), 10);
    if (Number.isFinite(value)) {
      unique.add(value);
    }
  });

  return Array.from(unique
 * @throws Error if the token format is invalid
 * @example
 * expandRangeToken("5") // [5]
 * expandRangeToken("1-3") // [1, 2, 3]
 */
const expandRangeToken = (token: string): number[] => {
  if (!token) {
    return [];
  }

  if (!RANGE_TOKEN_REGEX.test(token)) {
    throw new Error(`Invalid range segment: ${token}`);
  }

  if (!token.includes("-")) {
    return [Number.parseInt(token, 10)];
  }

  const [startToken, endToken] = token.split("-");
  const start = Number.parseInt(startToken, 10);
  const end = Number.parseInt(endToken, 10);

  if (!Number.isFinite(start) || !Number.isFinite(end) || start > end) {
    throw new Error(`Invalid range: ${token}`);
  }

  const values: number[] = [];
  for (let value = start; value <= end; value += 1) {
    values.push(value);
  }
  return values;
};

/**
 * Removes duplicate values from an array while preserving order
 * @param values - Array of numbers
 * @returns Array with duplicates removed
 */
const dedupePreserveOrder = (values: number[]): number[] => {
  const seen = new Set<number>();
  const result: number[] = [];

  values.forEach((value) => {
    if (!seen.has(value)) {
      seen.add(value);
      result.push(value);
    }
  });

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
      requestedLength = startStr.trim().length;
    } else {
      // Single number like "01"
      requestedLength = firstToken.length;
    }
  }

  const maxSequenceDigits = sequence.reduce((max, value) => {
    return Math.max(max, value.toString().length);
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
 */
export const padNumber = (value: number, length: number): string => {
  return value.toString().padStart(length, "0");
};

/**
 * Builds a filename for a split PDF page
 * @param options - Filename components
 * @returns Complete filename with .pdf extension
 * @example
 * buildFileName({ prefix: "DMC", suffix: "", sequenceNumber: 5, paddingLength: 3 })
 * // "DMC005.pdf"
 */
export const buildFileName = (options: FileNameOptions): string => {
  const { prefix, suffix, sequenceNumber, paddingLength } = options;
  const sanitizedPrefix = sanitizeFilenameComponent(prefix);
  const sanitizedSuffix = sanitizeFilenameComponent(suffix);
  const paddedValue = padNumber(sequenceNumber, paddingLength);

  return `${sanitizedPrefix}${paddedValue}${sanitizedSuffix}.pdf`;
};{
  prefix,
  suffix,
  sequenceNumber,
  paddingLength,
}: {
  prefix: string;
  suffix: string;
  sequenceNumber: number;
  paddingLength: number;
}): string => {
/**
 * Validates the PDF processor configuration
 * @param state - Current PDF processor state
 * @returns"Please upload a PDF file";
  }

  if (!state.ranges.trim()) {
    return "Please enter page ranges";
  }

  if (!RANGE_LIST_REGEX.test(state.ranges.replace(/\s/g, ""))) {
    return "Invalid range format. Use values like '1-5,8,10-12'"
  }

  if (!RANGE_LIST_REGEX.test(state.ranges.replace(/\s/g, ""))) {
    return ERROR_MESSAGES.INVALID_RANGE_FORMAT;
  }

  return null;
};

