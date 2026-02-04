/**
 * Application-wide constants and configuration values
 */

/**
 * Maximum allowed file size for PDF uploads (500MB)
 */
export const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024;

/**
 * File size units for display
 */
export const SIZE_UNITS = ["B", "KB", "MB", "GB", "TB"] as const;

/**
 * Regex pattern for validating a single range token (e.g., "1" or "1-5")
 */
export const RANGE_TOKEN_REGEX = /^\d+(?:-\d+)?$/;

/**
 * Regex pattern for validating a comma-separated list of range tokens
 */
export const RANGE_LIST_REGEX = /^(?:\d+(?:-\d+)?)(?:,\s*\d+(?:-\d+)?)*$/;

/**
 * Default ZIP file name for downloads
 */
export const DEFAULT_ZIP_NAME = 'split_files';

/**
 * Minimum padding length for page numbers
 */
export const MIN_PADDING_LENGTH = 1;

/**
 * Default number of fraction digits for file size formatting
 */
export const DEFAULT_SIZE_FRACTION_DIGITS = 2;

/**
 * Bytes per kilobyte
 */
export const BYTES_PER_KB = 1024;

/**
 * Characters that are not allowed in filenames across different operating systems
 */
export const INVALID_FILENAME_CHARS = /[<>:"/\\|?*\x00-\x1F]/g;

/**
 * Maximum length for filename components (prefix/suffix)
 */
export const MAX_FILENAME_COMPONENT_LENGTH = 100;
