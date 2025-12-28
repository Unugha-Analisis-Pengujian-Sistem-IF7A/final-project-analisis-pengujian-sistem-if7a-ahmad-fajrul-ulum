import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { AdminThemeProvider, useAdminTheme } from './ThemeContext';
import React from 'react';

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        store,
        getItem: vi.fn((key) => store[key] || null),
        setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
        clear: vi.fn(() => { store = {}; })
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Helper component to consume context
const TestComponent = () => {
    const { theme, toggleTheme } = useAdminTheme();
    return (
        <div>
            <span data-testid="theme-value">{theme}</span>
            <button onClick={toggleTheme}>Toggle</button>
        </div>
    );
};

describe('ThemeContext', () => {
    beforeEach(() => {
        localStorageMock.clear();
        document.documentElement.dataset.theme = '';
        document.documentElement.className = '';
        vi.restoreAllMocks();
        localStorageMock.getItem.mockImplementation((key) => localStorageMock.store?.[key] || null);
    });

    it('provides default theme (light)', () => {
        const { getByTestId } = render(
            <AdminThemeProvider>
                <TestComponent />
            </AdminThemeProvider>
        );
        expect(getByTestId('theme-value').textContent).toBe('light');
    });

    it('uses saved theme from localStorage', () => {
        localStorageMock.getItem.mockReturnValue('dark');
        const { getByTestId } = render(
            <AdminThemeProvider>
                <TestComponent />
            </AdminThemeProvider>
        );
        expect(getByTestId('theme-value').textContent).toBe('dark');
    });

    it('updates document.documentElement dataset on theme change', () => {
        render(
            <AdminThemeProvider>
                <TestComponent />
            </AdminThemeProvider>
        );

        // Initial state
        expect(document.documentElement.dataset.theme).toBe('light');
    });

    it('toggles theme when button is clicked', () => {
        const { getByText, getByTestId } = render(
            <AdminThemeProvider>
                <TestComponent />
            </AdminThemeProvider>
        );

        const button = getByText('Toggle');
        fireEvent.click(button);
        expect(getByTestId('theme-value').textContent).toBe('dark');

        fireEvent.click(button);
        expect(getByTestId('theme-value').textContent).toBe('light');
    });
});
