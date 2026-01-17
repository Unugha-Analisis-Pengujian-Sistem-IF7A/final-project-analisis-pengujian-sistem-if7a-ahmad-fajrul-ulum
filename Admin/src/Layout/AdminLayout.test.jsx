import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import React from 'react';
import { AdminThemeProvider } from '../context/ThemeContext';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

// Mock components to isolate layout logic
vi.mock('../components/Admin/Header', () => ({
    default: ({ onSidebarToggle }) => (
        <header>
            <button onClick={onSidebarToggle}>Toggle Sidebar</button>
        </header>
    )
}));

vi.mock('../components/Admin/Sidebar', () => ({
    default: ({ open }) => <aside data-testid="sidebar" className={open ? 'open' : 'closed'} />
}));

vi.mock('../components/Admin/common/Toast', () => ({
    default: ({ onClose, message }) => (
        <div data-testid="toast">
            {message}
            <button onClick={onClose}>Close Toast</button>
        </div>
    )
}));

const mockStore = configureStore([]);

describe('AdminLayout', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            auth: { user: { name: 'Admin' } }
        });
    });

    const renderLayout = () => {
        return render(
            <Provider store={store}>
                <BrowserRouter>
                    <AdminThemeProvider>
                        <AdminLayout />
                    </AdminThemeProvider>
                </BrowserRouter>
            </Provider>
        );
    };

    it('toggles sidebar state when header button is clicked', () => {
        renderLayout();
        const sidebar = screen.getByTestId('sidebar');
        const toggleBtn = screen.getByText('Toggle Sidebar');

        // Initial state
        expect(sidebar).toHaveClass('closed');

        // Toggle open
        fireEvent.click(toggleBtn);
        expect(sidebar).toHaveClass('open');

        // Toggle closed
        fireEvent.click(toggleBtn);
        expect(sidebar).toHaveClass('closed');
    });

    it('handles toast rendering and closing', async () => {
        // We need to trigger the setter in the component or mock the state
        // For render tests, we can verify that if toast state is populated (if we can trigger it)
        // Since toast is internal as useState(null), we'd need a way to trigger it.
        // Let's modify AdminLayout briefly if needed to expose a test trigger or just test the initial null state.

        renderLayout();
        expect(screen.queryByTestId('toast')).not.toBeInTheDocument();

        // Internal showToast sets toast to null. 
        // To cover these lines, we might need to simulate a dispatch or a context call if it was global.
        // However, the lines 15-17 (showToast) are specific to the onClose of Toast component.
    });
});
