/**
 * Tests for PDF Service
 */

import { describe, it, expect, vi } from 'vitest';
import { validatePDFFile } from './pdfService';

describe('validatePDFFile', () => {
  it('should validate correct PDF file', () => {
    const file = new File([''], 'test.pdf', { type: 'application/pdf' });
    const result = validatePDFFile(file, 1024 * 1024 * 100); // 100MB max
    
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should reject non-PDF file', () => {
    const file = new File([''], 'test.txt', { type: 'text/plain' });
    const result = validatePDFFile(file, 1024 * 1024 * 100);
    
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error).toContain('Invalid file type');
  });

  it('should reject file that exceeds size limit', () => {
    const largeFile = new File(['x'.repeat(1000)], 'large.pdf', { type: 'application/pdf' });
    Object.defineProperty(largeFile, 'size', { value: 1024 * 1024 * 200 }); // 200MB
    
    const result = validatePDFFile(largeFile, 1024 * 1024 * 100); // 100MB max
    
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error).toContain('too large');
  });

  it('should accept file within size limit', () => {
    const file = new File(['x'.repeat(100)], 'small.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 1024 * 1024 * 50 }); // 50MB
    
    const result = validatePDFFile(file, 1024 * 1024 * 100); // 100MB max
    
    expect(result.valid).toBe(true);
  });
});
