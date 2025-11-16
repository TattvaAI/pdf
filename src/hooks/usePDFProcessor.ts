import { useReducer, useCallback } from 'react';

export interface ProcessingResult {
  fileName: string;
  success: boolean;
  error?: string;
}

export interface PDFProcessorState {
  file: File | null;
  prefix: string;
  suffix: string;
  zipName: string;
  ranges: string;
  exclusions: string;
  isProcessing: boolean;
  progress: number;
  processedFiles: ProcessingResult[];
  downloadUrl: string | null;
}

type PDFProcessorAction =
  | { type: 'SET_FILE'; payload: File | null }
  | { type: 'SET_PREFIX'; payload: string }
  | { type: 'SET_SUFFIX'; payload: string }
  | { type: 'SET_ZIP_NAME'; payload: string }
  | { type: 'SET_RANGES'; payload: string }
  | { type: 'SET_EXCLUSIONS'; payload: string }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'SET_PROGRESS'; payload: number }
  | { type: 'SET_RESULTS'; payload: ProcessingResult[] }
  | { type: 'SET_DOWNLOAD_URL'; payload: string | null }
  | { type: 'CLEAR_RESULTS' }
  | { type: 'RESET' };

const initialState: PDFProcessorState = {
  file: null,
  prefix: '',
  suffix: '',
  zipName: 'split_files',
  ranges: '',
  exclusions: '',
  isProcessing: false,
  progress: 0,
  processedFiles: [],
  downloadUrl: null,
};

function pdfProcessorReducer(state: PDFProcessorState, action: PDFProcessorAction): PDFProcessorState {
  switch (action.type) {
    case 'SET_FILE':
      return { ...state, file: action.payload };
    case 'SET_PREFIX':
      return { ...state, prefix: action.payload };
    case 'SET_SUFFIX':
      return { ...state, suffix: action.payload };
    case 'SET_ZIP_NAME':
      return { ...state, zipName: action.payload };
    case 'SET_RANGES':
      return { ...state, ranges: action.payload };
    case 'SET_EXCLUSIONS':
      return { ...state, exclusions: action.payload };
    case 'SET_PROCESSING':
      return { ...state, isProcessing: action.payload };
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload };
    case 'SET_RESULTS':
      return { ...state, processedFiles: action.payload };
    case 'SET_DOWNLOAD_URL':
      return { ...state, downloadUrl: action.payload };
    case 'CLEAR_RESULTS':
      return { ...state, processedFiles: [], downloadUrl: null };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function usePDFProcessor() {
  const [state, dispatch] = useReducer(pdfProcessorReducer, initialState);

  const actions = {
    setFile: useCallback((file: File | null) => dispatch({ type: 'SET_FILE', payload: file }), []),
    setPrefix: useCallback((prefix: string) => dispatch({ type: 'SET_PREFIX', payload: prefix }), []),
    setSuffix: useCallback((suffix: string) => dispatch({ type: 'SET_SUFFIX', payload: suffix }), []),
    setZipName: useCallback((zipName: string) => dispatch({ type: 'SET_ZIP_NAME', payload: zipName }), []),
    setRanges: useCallback((ranges: string) => dispatch({ type: 'SET_RANGES', payload: ranges }), []),
    setExclusions: useCallback((exclusions: string) => dispatch({ type: 'SET_EXCLUSIONS', payload: exclusions }), []),
    setProcessing: useCallback((isProcessing: boolean) => dispatch({ type: 'SET_PROCESSING', payload: isProcessing }), []),
    setProgress: useCallback((progress: number) => dispatch({ type: 'SET_PROGRESS', payload: progress }), []),
    setResults: useCallback((results: ProcessingResult[]) => dispatch({ type: 'SET_RESULTS', payload: results }), []),
    setDownloadUrl: useCallback((url: string | null) => dispatch({ type: 'SET_DOWNLOAD_URL', payload: url }), []),
    clearResults: useCallback(() => dispatch({ type: 'CLEAR_RESULTS' }), []),
    reset: useCallback(() => dispatch({ type: 'RESET' }), []),
  };

  return { state, actions };
}