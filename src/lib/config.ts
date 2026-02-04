/**
 * Application Configuration
 * 
 * Central configuration for the PDF Splitter application.
 * Modify these values to customize application behavior.
 */

import { MAX_FILE_SIZE_BYTES, DEFAULT_ZIP_NAME } from "./constants";

export const config = {
  /**
   * File upload configuration
   */
  upload: {
    maxFileSize: MAX_FILE_SIZE_BYTES,
    acceptedTypes: ["application/pdf"],
    acceptedExtensions: [".pdf"],
  },

  /**
   * PDF processing configuration
   */
  processing: {
    defaultZipName: DEFAULT_ZIP_NAME,
    compressionLevel: "DEFLATE" as const,
    defaultPrefix: "",
    defaultSuffix: "",
  },

  /**
   * UI configuration
   */
  ui: {
    defaultTheme: "system" as const,
    themeStorageKey: "app-theme",
    enableAnimations: true,
  },

  /**
   * Query configuration for React Query
   */
  query: {
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  },
} as const;

export type AppConfig = typeof config;
