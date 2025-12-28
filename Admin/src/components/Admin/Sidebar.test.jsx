import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Sidebar from './Sidebar';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import React from 'react';

// Mocks
// Mock framer-motion to render children directly without animation
vi.mock('framer-motion', () => ({
    motion: {
        aside: ({ children, ...props }) => <aside {...props}>{children}</aside>
    }
}));

const mockStore = configureStore([]);

describe('Sidebar Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            auth: {
                user: {
                    name: 'Admin Test',
                    email: 'test@example.com',
                    imgProfile: '/test-avatar.png'
                }
            }
        });
    });

    const renderSidebar = (children = null) => {
        return render(
            <Provider store={store}>
                <BrowserRouter>
                    <Sidebar>{children}</Sidebar>
                </BrowserRouter>
            </Provider>
        );
    };

    it('renders user profile correctly', () => {
        renderSidebar();
        expect(screen.getByText('Admin Test')).toBeInTheDocument();
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
        expect(screen.getByRole('img', { name: /Avatar/i })).toHaveAttribute('src', '/test-avatar.png');
    });

    it('renders default user if no auth data', () => {
        store = mockStore({ auth: { user: null } });
        renderSidebar();
        expect(screen.getByText('Admin')).toBeInTheDocument();
        expect(screen.getByText('admin@example.com')).toBeInTheDocument();
        expect(screen.getByRole('img', { name: /Avatar/i })).toHaveAttribute('src', '/default-avatar.png');
    });

    it('renders all menu items', () => {
        renderSidebar();
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Blog')).toBeInTheDocument();
        expect(screen.getByText('Testimonials')).toBeInTheDocument();
        expect(screen.getByText('Hero Background')).toBeInTheDocument();
        expect(screen.getByText('Iklan')).toBeInTheDocument();
        expect(screen.getByText('Logo Partner')).toBeInTheDocument();
    });

    it('renders children content', () => {
        renderSidebar(<div data-testid="child-content">Main Content</div>);
        expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });
});
