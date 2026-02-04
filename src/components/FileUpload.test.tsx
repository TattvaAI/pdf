import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileUpload } from '@/components/FileUpload';

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
    useToast: () => ({
        toast: vi.fn(),
    }),
}));

describe('FileUpload', () => {
    const mockOnFileChange = vi.fn();
    const mockOnClearResults = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render upload area', () => {
        render(
            <FileUpload
                file={null}
                onFileChange={mockOnFileChange}
                onClearResults={mockOnClearResults}
            />
        );

        expect(screen.getByText(/Drag & drop a PDF file here/i)).toBeInTheDocument();
    });

    it('should display file name when file is uploaded', () => {
        const mockFile = new File([''], 'test.pdf', { type: 'application/pdf' });

        render(
            <FileUpload
                file={mockFile}
                onFileChange={mockOnFileChange}
                onClearResults={mockOnClearResults}
            />
        );

        expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });

    it('should call onFileChange when file is removed', async () => {
        const user = userEvent.setup();
        const mockFile = new File([''], 'test.pdf', { type: 'application/pdf' });

        render(
            <FileUpload
                file={mockFile}
                onFileChange={mockOnFileChange}
                onClearResults={mockOnClearResults}
            />
        );

        const removeButton = screen.getByRole('button', { name: /Remove uploaded file/i });
        await user.click(removeButton);

        expect(mockOnFileChange).toHaveBeenCalledWith(null);
        expect(mockOnClearResults).toHaveBeenCalled();
    });

    it('should have proper accessibility attributes', () => {
        render(
            <FileUpload
                file={null}
                onFileChange={mockOnFileChange}
                onClearResults={mockOnClearResults}
            />
        );

        const dropzone = screen.getByRole('button');
        expect(dropzone).toHaveAttribute('aria-label');
        expect(dropzone).toHaveAttribute('aria-describedby');
    });

    it('should show file size information', () => {
        const mockFile = new File(['a'.repeat(1024)], 'test.pdf', { type: 'application/pdf' });

        render(
            <FileUpload
                file={mockFile}
                onFileChange={mockOnFileChange}
                onClearResults={mockOnClearResults}
            />
        );

        expect(screen.getByText(/max/i)).toBeInTheDocument();
    });
});
