import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfigurationForm } from '@/components/ConfigurationForm';

describe('ConfigurationForm', () => {
    const defaultProps = {
        prefix: '',
        suffix: '',
        zipName: 'split_files',
        ranges: '',
        exclusions: '',
        isProcessing: false,
        onPrefixChange: vi.fn(),
        onSuffixChange: vi.fn(),
        onZipNameChange: vi.fn(),
        onRangesChange: vi.fn(),
        onExclusionsChange: vi.fn(),
        onProcess: vi.fn(),
        disabled: false,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render all form fields', () => {
        render(<ConfigurationForm {...defaultProps} />);

        expect(screen.getByLabelText(/Prefix/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Suffix/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Page Ranges/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Skip Numbers/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/ZIP File Name/i)).toBeInTheDocument();
    });

    it('should call onPrefixChange when prefix input changes', async () => {
        const user = userEvent.setup();
        render(<ConfigurationForm {...defaultProps} />);

        const prefixInput = screen.getByLabelText(/Prefix/i);
        await user.type(prefixInput, 'DMC');

        expect(defaultProps.onPrefixChange).toHaveBeenCalledWith('D');
        expect(defaultProps.onPrefixChange).toHaveBeenCalledWith('M');
        expect(defaultProps.onPrefixChange).toHaveBeenCalledWith('C');
    });

    it('should call onSuffixChange when suffix input changes', async () => {
        const user = userEvent.setup();
        render(<ConfigurationForm {...defaultProps} />);

        const suffixInput = screen.getByLabelText(/Suffix/i);
        await user.type(suffixInput, '_final');

        expect(defaultProps.onSuffixChange).toHaveBeenCalled();
    });

    it('should call onRangesChange when ranges input changes', async () => {
        const user = userEvent.setup();
        render(<ConfigurationForm {...defaultProps} />);

        const rangesInput = screen.getByLabelText(/Page Ranges/i);
        await user.type(rangesInput, '1-5');

        expect(defaultProps.onRangesChange).toHaveBeenCalled();
    });

    it('should call onExclusionsChange when exclusions input changes', async () => {
        const user = userEvent.setup();
        render(<ConfigurationForm {...defaultProps} />);

        const exclusionsInput = screen.getByLabelText(/Skip Numbers/i);
        await user.type(exclusionsInput, '2,4');

        expect(defaultProps.onExclusionsChange).toHaveBeenCalled();
    });

    it('should call onZipNameChange when zip name input changes', async () => {
        const user = userEvent.setup();
        render(<ConfigurationForm {...defaultProps} />);

        const zipNameInput = screen.getByLabelText(/ZIP File Name/i);
        await user.clear(zipNameInput);
        await user.type(zipNameInput, 'my_files');

        expect(defaultProps.onZipNameChange).toHaveBeenCalled();
    });

    it('should call onProcess when split button is clicked', async () => {
        const user = userEvent.setup();
        render(<ConfigurationForm {...defaultProps} />);

        const splitButton = screen.getByRole('button', { name: /Split PDF/i });
        await user.click(splitButton);

        expect(defaultProps.onProcess).toHaveBeenCalled();
    });

    it('should disable button when disabled prop is true', () => {
        render(<ConfigurationForm {...defaultProps} disabled={true} />);

        const splitButton = screen.getByRole('button', { name: /Split PDF/i });
        expect(splitButton).toBeDisabled();
    });

    it('should show processing state', () => {
        render(<ConfigurationForm {...defaultProps} isProcessing={true} />);

        expect(screen.getByText(/Processing/i)).toBeInTheDocument();
    });

    it('should display current values in inputs', () => {
        render(
            <ConfigurationForm
                {...defaultProps}
                prefix="DMC"
                suffix="_final"
                ranges="1-5"
                exclusions="2,4"
                zipName="my_files"
            />
        );

        expect(screen.getByDisplayValue('DMC')).toBeInTheDocument();
        expect(screen.getByDisplayValue('_final')).toBeInTheDocument();
        expect(screen.getByDisplayValue('1-5')).toBeInTheDocument();
        expect(screen.getByDisplayValue('2,4')).toBeInTheDocument();
        expect(screen.getByDisplayValue('my_files')).toBeInTheDocument();
    });

    it('should have proper accessibility attributes', () => {
        render(<ConfigurationForm {...defaultProps} />);

        const prefixInput = screen.getByLabelText(/Prefix/i);
        expect(prefixInput).toHaveAttribute('aria-describedby');

        const splitButton = screen.getByRole('button', { name: /Split PDF/i });
        expect(splitButton).toHaveAttribute('aria-label');
    });
});
