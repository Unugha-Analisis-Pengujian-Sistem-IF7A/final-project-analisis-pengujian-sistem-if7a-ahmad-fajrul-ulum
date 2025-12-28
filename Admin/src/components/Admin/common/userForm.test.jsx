import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UserForm from './userForm';

vi.mock('framer-motion', () => ({
    motion: { div: ({ children, ...props }) => <div {...props}>{children}</div> }
}));

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

describe('UserForm', () => {
    it('renders when open', () => {
        const { container } = render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <UserForm open={true} onClose={vi.fn()} user={null} />
                </BrowserRouter>
            </QueryClientProvider>
        );
        expect(container.querySelector('dialog')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
        const { container } = render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <UserForm open={false} onClose={vi.fn()} user={null} />
                </BrowserRouter>
            </QueryClientProvider>
        );
        expect(container.querySelector('dialog')).not.toBeInTheDocument();
    });
});
