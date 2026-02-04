import { describe, it, expect } from 'vitest';
import {
    formatFileSize,
    sanitizeFilenameComponent,
    parseExclusions,
    parsePageSegments,
    generateInclusiveRange,
    buildPageSequenceFromState,
    buildFilenameSequence,
    determinePaddingLength,
    padNumber,
    buildFileName,
    validateConfiguration,
} from '@/lib/pdf-utils';
import type { PDFProcessorState } from '@/hooks/usePDFProcessor';

describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
        expect(formatFileSize(0)).toBe('0 B');
        expect(formatFileSize(500)).toBe('500 B');
        expect(formatFileSize(1023)).toBe('1023 B');
    });

    it('should format kilobytes correctly', () => {
        expect(formatFileSize(1024)).toBe('1.00 KB');
        expect(formatFileSize(1536)).toBe('1.50 KB');
        expect(formatFileSize(2048)).toBe('2.00 KB');
    });

    it('should format megabytes correctly', () => {
        expect(formatFileSize(1048576)).toBe('1.00 MB');
        expect(formatFileSize(5242880)).toBe('5.00 MB');
    });

    it('should format gigabytes correctly', () => {
        expect(formatFileSize(1073741824)).toBe('1.00 GB');
    });

    it('should handle custom fraction digits', () => {
        expect(formatFileSize(1536, 1)).toBe('1.5 KB');
        expect(formatFileSize(1536, 3)).toBe('1.500 KB');
    });

    it('should handle negative numbers', () => {
        expect(formatFileSize(-100)).toBe('0 B');
    });

    it('should handle non-finite numbers', () => {
        expect(formatFileSize(NaN)).toBe('0 B');
        expect(formatFileSize(Infinity)).toBe('0 B');
    });
});

describe('sanitizeFilenameComponent', () => {
    it('should remove invalid characters', () => {
        expect(sanitizeFilenameComponent('file<name>')).toBe('filename');
        expect(sanitizeFilenameComponent('file:name')).toBe('filename');
        expect(sanitizeFilenameComponent('file/name')).toBe('filename');
        expect(sanitizeFilenameComponent('file\\name')).toBe('filename');
        expect(sanitizeFilenameComponent('file|name')).toBe('filename');
        expect(sanitizeFilenameComponent('file?name')).toBe('filename');
        expect(sanitizeFilenameComponent('file*name')).toBe('filename');
    });

    it('should trim whitespace', () => {
        expect(sanitizeFilenameComponent('  filename  ')).toBe('filename');
    });

    it('should limit length to max', () => {
        const longString = 'a'.repeat(150);
        const result = sanitizeFilenameComponent(longString);
        expect(result.length).toBe(100);
    });

    it('should handle empty strings', () => {
        expect(sanitizeFilenameComponent('')).toBe('');
        expect(sanitizeFilenameComponent('   ')).toBe('');
    });

    it('should allow valid characters', () => {
        expect(sanitizeFilenameComponent('file-name_123')).toBe('file-name_123');
    });
});

describe('parseExclusions', () => {
    it('should parse comma-separated numbers', () => {
        expect(parseExclusions('1,2,3')).toEqual([1, 2, 3]);
        expect(parseExclusions('5,10,15')).toEqual([5, 10, 15]);
    });

    it('should handle whitespace', () => {
        expect(parseExclusions('1, 2, 3')).toEqual([1, 2, 3]);
        expect(parseExclusions(' 1 , 2 , 3 ')).toEqual([1, 2, 3]);
    });

    it('should remove duplicates', () => {
        expect(parseExclusions('1,2,2,3,3,3')).toEqual([1, 2, 3]);
    });

    it('should handle empty string', () => {
        expect(parseExclusions('')).toEqual([]);
        expect(parseExclusions('   ')).toEqual([]);
    });

    it('should ignore invalid values', () => {
        expect(parseExclusions('1,abc,3')).toEqual([1, 3]);
        expect(parseExclusions('1,,3')).toEqual([1, 3]);
    });
});

describe('parsePageSegments', () => {
    it('should parse single pages', () => {
        expect(parsePageSegments('1')).toEqual([1]);
        expect(parsePageSegments('5')).toEqual([5]);
    });

    it('should parse ranges', () => {
        expect(parsePageSegments('1-3')).toEqual([1, 2, 3]);
        expect(parsePageSegments('5-8')).toEqual([5, 6, 7, 8]);
    });

    it('should parse mixed single pages and ranges', () => {
        expect(parsePageSegments('1,3-5,7')).toEqual([1, 3, 4, 5, 7]);
        expect(parsePageSegments('1-3,5,7-9')).toEqual([1, 2, 3, 5, 7, 8, 9]);
    });

    it('should handle whitespace', () => {
        expect(parsePageSegments('1, 3-5, 7')).toEqual([1, 3, 4, 5, 7]);
    });

    it('should remove duplicates while preserving order', () => {
        expect(parsePageSegments('1,2,1,3')).toEqual([1, 2, 3]);
        expect(parsePageSegments('1-3,2-4')).toEqual([1, 2, 3, 4]);
    });

    it('should handle empty string', () => {
        expect(parsePageSegments('')).toEqual([]);
        expect(parsePageSegments('   ')).toEqual([]);
    });

    it('should throw error for invalid format', () => {
        expect(() => parsePageSegments('abc')).toThrow('Invalid range segment');
        expect(() => parsePageSegments('1-')).toThrow('Invalid range segment');
        expect(() => parsePageSegments('-5')).toThrow('Invalid range segment');
    });

    it('should throw error for invalid range', () => {
        expect(() => parsePageSegments('5-3')).toThrow('Invalid range');
    });
});

describe('generateInclusiveRange', () => {
    it('should generate range from start to end', () => {
        expect(generateInclusiveRange(1, 5)).toEqual([1, 2, 3, 4, 5]);
        expect(generateInclusiveRange(10, 12)).toEqual([10, 11, 12]);
    });

    it('should handle single value range', () => {
        expect(generateInclusiveRange(5, 5)).toEqual([5]);
    });

    it('should throw error for invalid range', () => {
        expect(() => generateInclusiveRange(5, 3)).toThrow('Invalid range');
        expect(() => generateInclusiveRange(NaN, 5)).toThrow('Invalid range');
        expect(() => generateInclusiveRange(1, Infinity)).toThrow('Invalid range');
    });
});

describe('buildPageSequenceFromState', () => {
    const createMockState = (ranges: string): PDFProcessorState => ({
        file: null,
        prefix: '',
        suffix: '',
        zipName: 'test',
        ranges,
        exclusions: '',
        isProcessing: false,
        progress: 0,
        processedFiles: [],
        downloadUrl: null,
    });

    it('should build sequence from ranges', () => {
        const state = createMockState('1-5');
        expect(buildPageSequenceFromState(state)).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle complex ranges', () => {
        const state = createMockState('1-3,5,7-9');
        expect(buildPageSequenceFromState(state)).toEqual([1, 2, 3, 5, 7, 8, 9]);
    });

    it('should handle single pages', () => {
        const state = createMockState('1,3,5');
        expect(buildPageSequenceFromState(state)).toEqual([1, 3, 5]);
    });
});

describe('buildFilenameSequence', () => {
    it('should generate sequence without exclusions', () => {
        expect(buildFilenameSequence(5, [], 1)).toEqual([1, 2, 3, 4, 5]);
    });

    it('should skip excluded numbers', () => {
        expect(buildFilenameSequence(5, [3, 6], 1)).toEqual([1, 2, 4, 5, 7]);
    });

    it('should handle multiple consecutive exclusions', () => {
        expect(buildFilenameSequence(5, [2, 3, 4], 1)).toEqual([1, 5, 6, 7, 8]);
    });

    it('should work with different start numbers', () => {
        expect(buildFilenameSequence(3, [], 5)).toEqual([5, 6, 7]);
        expect(buildFilenameSequence(3, [6], 5)).toEqual([5, 7, 8]);
    });

    it('should handle exclusions at the beginning', () => {
        expect(buildFilenameSequence(5, [1, 2], 1)).toEqual([3, 4, 5, 6, 7]);
    });

    it('should handle large gaps in exclusions', () => {
        expect(buildFilenameSequence(10, [3, 6], 1)).toEqual([1, 2, 4, 5, 7, 8, 9, 10, 11, 12]);
    });

    it('should handle empty exclusions array', () => {
        expect(buildFilenameSequence(3, [], 1)).toEqual([1, 2, 3]);
    });
});

describe('determinePaddingLength', () => {
    it('should determine padding from range format', () => {
        expect(determinePaddingLength([1, 2, 3], '01-03')).toBe(2);
        expect(determinePaddingLength([1, 2, 3], '001-003')).toBe(3);
    });

    it('should determine padding from single number format', () => {
        expect(determinePaddingLength([1], '01')).toBe(2);
        expect(determinePaddingLength([1], '001')).toBe(3);
    });

    it('should use max sequence digits if larger', () => {
        expect(determinePaddingLength([1, 2, 100], '1-100')).toBe(3);
        expect(determinePaddingLength([1, 2, 1000], '1-1000')).toBe(4);
    });

    it('should have minimum padding of 1', () => {
        expect(determinePaddingLength([1], '1')).toBe(1);
    });

    it('should handle empty sequence', () => {
        expect(determinePaddingLength([], '1-5')).toBe(1);
    });
});

describe('padNumber', () => {
    it('should pad numbers with zeros', () => {
        expect(padNumber(1, 3)).toBe('001');
        expect(padNumber(5, 2)).toBe('05');
        expect(padNumber(100, 4)).toBe('0100');
    });

    it('should not truncate if number is longer', () => {
        expect(padNumber(1000, 2)).toBe('1000');
    });

    it('should handle zero padding', () => {
        expect(padNumber(0, 3)).toBe('000');
    });
});

describe('buildFileName', () => {
    it('should build filename with prefix and suffix', () => {
        const result = buildFileName({
            prefix: 'DMC',
            suffix: '_final',
            sequenceNumber: 5,
            paddingLength: 3,
        });
        expect(result).toBe('DMC005_final.pdf');
    });

    it('should build filename without prefix', () => {
        const result = buildFileName({
            prefix: '',
            suffix: '',
            sequenceNumber: 5,
            paddingLength: 2,
        });
        expect(result).toBe('05.pdf');
    });

    it('should sanitize prefix and suffix', () => {
        const result = buildFileName({
            prefix: 'file<name>',
            suffix: '_test:123',
            sequenceNumber: 1,
            paddingLength: 2,
        });
        expect(result).toBe('filename01_test123.pdf');
    });

    it('should handle whitespace in prefix and suffix', () => {
        const result = buildFileName({
            prefix: '  DMC  ',
            suffix: '  final  ',
            sequenceNumber: 1,
            paddingLength: 2,
        });
        expect(result).toBe('DMC01final.pdf');
    });
});

describe('validateConfiguration', () => {
    const createMockState = (
        file: File | null,
        ranges: string
    ): PDFProcessorState => ({
        file,
        prefix: '',
        suffix: '',
        zipName: 'test',
        ranges,
        exclusions: '',
        isProcessing: false,
        progress: 0,
        processedFiles: [],
        downloadUrl: null,
    });

    it('should return error if no file', () => {
        const state = createMockState(null, '1-5');
        expect(validateConfiguration(state)).toBe('Please upload a PDF file');
    });

    it('should return error if no ranges', () => {
        const mockFile = new File([''], 'test.pdf', { type: 'application/pdf' });
        const state = createMockState(mockFile, '');
        expect(validateConfiguration(state)).toBe('Please enter page ranges');
    });

    it('should return error for invalid range format', () => {
        const mockFile = new File([''], 'test.pdf', { type: 'application/pdf' });
        const state = createMockState(mockFile, 'abc');
        expect(validateConfiguration(state)).toContain('Invalid range format');
    });

    it('should return null for valid configuration', () => {
        const mockFile = new File([''], 'test.pdf', { type: 'application/pdf' });
        const state = createMockState(mockFile, '1-5');
        expect(validateConfiguration(state)).toBeNull();
    });

    it('should accept complex valid ranges', () => {
        const mockFile = new File([''], 'test.pdf', { type: 'application/pdf' });
        const state = createMockState(mockFile, '1-5,8,10-12');
        expect(validateConfiguration(state)).toBeNull();
    });
});
