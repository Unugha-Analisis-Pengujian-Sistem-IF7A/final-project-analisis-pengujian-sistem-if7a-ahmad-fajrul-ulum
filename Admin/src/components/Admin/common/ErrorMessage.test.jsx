import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage', () => {
    it('renders default error message', () => {
        render(<ErrorMessage />);
        expect(screen.getByText('Terjadi kesalahan')).toBeInTheDocument();
    });

    it('renders custom error message', () => {
        render(<ErrorMessage message="Custom error" />);
        expect(screen.getByText('Custom error')).toBeInTheDocument();
    });

    it('renders retry button when onRetry is provided', () => {
        const onRetry = vi.fn();
        render(<ErrorMessage onRetry={onRetry} />);
        expect(screen.getByText('Retry')).toBeInTheDocument();
    });

    it('does not render retry button when onRetry is not provided', () => {
        render(<ErrorMessage />);
        expect(screen.queryByText('Retry')).not.toBeInTheDocument();
    });
});
