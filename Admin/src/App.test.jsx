import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

// Mocking scrollIntoView since it's not in JSDOM
window.HTMLElement.prototype.scrollIntoView = vi.fn();

vi.mock('./middleware/ProtectedRoutes', () => ({
    default: ({ children }) => <div data-testid="protected">{children}</div>
}));

// Mock child pages to speed up App test
vi.mock('./pages/Auth/Login', () => ({ default: () => <div data-testid="login-page">Login</div> }));
vi.mock('./pages/Admin/Dashboard', () => ({ default: () => <div data-testid="dashboard-page">Dashboard</div> }));

const mockStore = configureStore([]);

describe('App & ScrollToTop', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            auth: { user: { name: 'Admin' }, isAuthenticated: true }
        });
        document.body.innerHTML = '<div id="service">Service Section</div>';
    });

    it('redirects root to login', () => {
        const { getByTestId } = render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/']}>
                    <App />
                </MemoryRouter>
            </Provider>
        );
        // Navigate to / redirects to /login
        expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    it('renders login page on /login', () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/login']}>
                    <App />
                </MemoryRouter>
            </Provider>
        );
        expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    it('triggers scrollIntoView when navigating to #service on empty path', () => {
        const scrollSpy = vi.spyOn(window.HTMLElement.prototype, 'scrollIntoView');

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/#service']}>
                    <App />
                </MemoryRouter>
            </Provider>
        );

        // MemoryRouter path handling for hash needs to be matched by ScrollToTop's logic
        // ScrollToTop looks at location.pathname === "" and location.hash === "#service"
        // In MemoryRouter, initialEntries=['/#service'] results in pathname='/' and hash='#service'
        // If App.jsx expects "" as pathname, we might need a specific check.

        // Wait for useEffect
        expect(scrollSpy).toHaveBeenCalled();
    });
});
