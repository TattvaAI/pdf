import type { PDFProcessorState } from "@/hooks/usePDFProcessor";

const RANGE_TOKEN_REGEX = /^\d+(?:-\d+)?$/;
const RANGE_LIST_REGEX = /^(?:\d+(?:-\d+)?)(?:,\s*\d+(?:-\d+)?)*$/;

export const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024;

const sizeUnits = ["B", "KB", "MB", "GB", "TB"] as const;

export const formatFileSize = (bytes: number, fractionDigits = 2): string => {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return "0 B";
  }

  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < sizeUnits.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const decimals = unitIndex === 0 ? 0 : fractionDigits;
  return `${value.toFixed(decimals)} ${sizeUnits[unitIndex]}`;
};

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

  return Array.from(unique);
};

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

export const parsePageSegments = (rangesString: string): number[] => {
  if (!rangesString.trim()) {
    return [];
  }

  const tokens = rangesString.split(",").map((token) => token.trim()).filter(Boolean);

  const expanded = tokens.flatMap(expandRangeToken);
  return dedupePreserveOrder(expanded);
};

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

export const buildSequenceFromState = (state: PDFProcessorState): number[] => {
  const sequence = parsePageSegments(state.ranges);
  const exclusions = new Set(parseExclusions(state.exclusions));
  return sequence.filter((page) => !exclusions.has(page));
};

export const determinePaddingLength = (sequence: number[], rangesString: string): number => {
  // Determine padding from the ranges string format (e.g., "01-05" indicates 2 digits)
  const firstToken = rangesString.split(',')[0]?.trim();
  let requestedLength = 1;
  
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

  return Math.max(requestedLength, maxSequenceDigits, 1);
};

export const padNumber = (value: number, length: number): string => {
  return value.toString().padStart(length, "0");
};

export const buildFileName = ({
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
  const trimmedPrefix = prefix.trim();
  const trimmedSuffix = suffix.trim();
  const paddedValue = padNumber(sequenceNumber, paddingLength);

  return `${trimmedPrefix}${paddedValue}${trimmedSuffix}.pdf`;
};

export const validateConfiguration = (state: PDFProcessorState): string | null => {
  if (!state.file) {
    return "Please upload a PDF file";
  }

  if (!state.ranges.trim()) {
    return "Please enter page ranges";
  }

  if (!RANGE_LIST_REGEX.test(state.ranges.replace(/\s/g, ""))) {
    return "Invalid range format. Use values like '1-5,8,10-12'";
  }

  return null;
};
