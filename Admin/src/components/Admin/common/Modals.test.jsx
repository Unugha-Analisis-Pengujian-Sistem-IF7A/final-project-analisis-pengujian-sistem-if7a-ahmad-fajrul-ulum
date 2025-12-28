import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import ConfirmLogoutModal from './ConfirmLogoutModal';
import React from 'react';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => <div {...props}>{children}</div>
    }
}));

describe('Modals', () => {
    describe('ConfirmDeleteModal', () => {
        it('renders when open', () => {
            render(<ConfirmDeleteModal isOpen={true} onCancel={vi.fn()} onConfirm={vi.fn()} blogTitle="Test Blog" />);
            expect(screen.getByText('Konfirmasi Penghapusan')).toBeInTheDocument();
            expect(screen.getByText(/Test Blog/)).toBeInTheDocument();
        });

        it('does not render when closed', () => {
            render(<ConfirmDeleteModal isOpen={false} onCancel={vi.fn()} onConfirm={vi.fn()} />);
            expect(screen.queryByText('Konfirmasi Penghapusan')).not.toBeInTheDocument();
        });

        it('calls onCancel when cancel button clicked', () => {
            const onCancel = vi.fn();
            render(<ConfirmDeleteModal isOpen={true} onCancel={onCancel} onConfirm={vi.fn()} />);
            fireEvent.click(screen.getByText('Batal'));
            expect(onCancel).toHaveBeenCalled();
        });

        it('calls onConfirm when confirm button clicked', () => {
            const onConfirm = vi.fn();
            render(<ConfirmDeleteModal isOpen={true} onCancel={vi.fn()} onConfirm={onConfirm} />);
            fireEvent.click(screen.getByText('Hapus'));
            expect(onConfirm).toHaveBeenCalled();
        });

        it('closes on Escape key press', () => {
            const onCancel = vi.fn();
            render(<ConfirmDeleteModal isOpen={true} onCancel={onCancel} onConfirm={vi.fn()} />);

            fireEvent.keyDown(screen.getByTestId('delete-modal-backdrop'), { key: 'Escape' });
            expect(onCancel).toHaveBeenCalled();
        });
    });

    describe('ConfirmLogoutModal', () => {
        it('renders when open', () => {
            render(<ConfirmLogoutModal isOpen={true} onCancel={vi.fn()} onConfirm={vi.fn()} />);
            expect(screen.getByText('Konfirmasi Logout')).toBeInTheDocument();
        });

        it('does not render when closed', () => {
            render(<ConfirmLogoutModal isOpen={false} onCancel={vi.fn()} onConfirm={vi.fn()} />);
            expect(screen.queryByText('Konfirmasi Logout')).not.toBeInTheDocument();
        });

        it('calls onConfirm when logout button clicked', () => {
            const onConfirm = vi.fn();
            render(<ConfirmLogoutModal isOpen={true} onCancel={vi.fn()} onConfirm={onConfirm} />);
            fireEvent.click(screen.getByText('Logout'));
            expect(onConfirm).toHaveBeenCalled();
        });

        it('closes on Escape key press', () => {
            const onCancel = vi.fn();
            render(<ConfirmLogoutModal isOpen={true} onCancel={onCancel} onConfirm={vi.fn()} />);

            fireEvent.keyDown(screen.getByTestId('logout-modal-backdrop'), { key: 'Escape' });
            expect(onCancel).toHaveBeenCalled();
        });
    });
});
