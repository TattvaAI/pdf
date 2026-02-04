import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePDFProcessor } from '@/hooks/usePDFProcessor';

describe('usePDFProcessor', () => {
    it('should initialize with default state', () => {
        const { result } = renderHook(() => usePDFProcessor());

        expect(result.current.state).toEqual({
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
        });
    });

    it('should set file', () => {
        const { result } = renderHook(() => usePDFProcessor());
        const mockFile = new File([''], 'test.pdf', { type: 'application/pdf' });

        act(() => {
            result.current.actions.setFile(mockFile);
        });

        expect(result.current.state.file).toBe(mockFile);
    });

    it('should set prefix', () => {
        const { result } = renderHook(() => usePDFProcessor());

        act(() => {
            result.current.actions.setPrefix('DMC');
        });

        expect(result.current.state.prefix).toBe('DMC');
    });

    it('should set suffix', () => {
        const { result } = renderHook(() => usePDFProcessor());

        act(() => {
            result.current.actions.setSuffix('_final');
        });

        expect(result.current.state.suffix).toBe('_final');
    });

    it('should set zip name', () => {
        const { result } = renderHook(() => usePDFProcessor());

        act(() => {
            result.current.actions.setZipName('my_files');
        });

        expect(result.current.state.zipName).toBe('my_files');
    });

    it('should set ranges', () => {
        const { result } = renderHook(() => usePDFProcessor());

        act(() => {
            result.current.actions.setRanges('1-5,8,10-12');
        });

        expect(result.current.state.ranges).toBe('1-5,8,10-12');
    });

    it('should set exclusions', () => {
        const { result } = renderHook(() => usePDFProcessor());

        act(() => {
            result.current.actions.setExclusions('2,4,6');
        });

        expect(result.current.state.exclusions).toBe('2,4,6');
    });

    it('should set processing state', () => {
        const { result } = renderHook(() => usePDFProcessor());

        act(() => {
            result.current.actions.setProcessing(true);
        });

        expect(result.current.state.isProcessing).toBe(true);

        act(() => {
            result.current.actions.setProcessing(false);
        });

        expect(result.current.state.isProcessing).toBe(false);
    });

    it('should set progress', () => {
        const { result } = renderHook(() => usePDFProcessor());

        act(() => {
            result.current.actions.setProgress(50);
        });

        expect(result.current.state.progress).toBe(50);
    });

    it('should set results', () => {
        const { result } = renderHook(() => usePDFProcessor());
        const mockResults = [
            { fileName: 'page1.pdf', success: true },
            { fileName: 'page2.pdf', success: true },
        ];

        act(() => {
            result.current.actions.setResults(mockResults);
        });

        expect(result.current.state.processedFiles).toEqual(mockResults);
    });

    it('should set download URL', () => {
        const { result } = renderHook(() => usePDFProcessor());
        const mockUrl = 'blob:http://localhost/test';

        act(() => {
            result.current.actions.setDownloadUrl(mockUrl);
        });

        expect(result.current.state.downloadUrl).toBe(mockUrl);
    });

    it('should clear results', () => {
        const { result } = renderHook(() => usePDFProcessor());
        const mockResults = [{ fileName: 'page1.pdf', success: true }];
        const mockUrl = 'blob:http://localhost/test';

        act(() => {
            result.current.actions.setResults(mockResults);
            result.current.actions.setDownloadUrl(mockUrl);
        });

        expect(result.current.state.processedFiles).toEqual(mockResults);
        expect(result.current.state.downloadUrl).toBe(mockUrl);

        act(() => {
            result.current.actions.clearResults();
        });

        expect(result.current.state.processedFiles).toEqual([]);
        expect(result.current.state.downloadUrl).toBeNull();
    });

    it('should reset to initial state', () => {
        const { result } = renderHook(() => usePDFProcessor());
        const mockFile = new File([''], 'test.pdf', { type: 'application/pdf' });

        act(() => {
            result.current.actions.setFile(mockFile);
            result.current.actions.setPrefix('DMC');
            result.current.actions.setSuffix('_final');
            result.current.actions.setRanges('1-5');
            result.current.actions.setProcessing(true);
            result.current.actions.setProgress(50);
        });

        expect(result.current.state.file).toBe(mockFile);
        expect(result.current.state.prefix).toBe('DMC');

        act(() => {
            result.current.actions.reset();
        });

        expect(result.current.state).toEqual({
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
        });
    });

});
