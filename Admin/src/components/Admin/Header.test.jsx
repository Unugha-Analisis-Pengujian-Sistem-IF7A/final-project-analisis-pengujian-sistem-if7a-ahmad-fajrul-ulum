import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import React from 'react';
import { logout } from '../../app/users/authSlice';

// Mocks
vi.mock('../../app/users/authSlice', () => ({
    getMe: vi.fn(() => ({ type: 'auth/getMe' })),
    logout: vi.fn(() => ({ type: 'auth/logout', payload: Promise.resolve() }))
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        header: ({ children, ...props }) => <header {...props}>{children}</header>,
        div: ({ children, ...props }) => <div {...props}>{children}</div>,
        ul: ({ children, ...props }) => <ul {...props}>{children}</ul>,
    },
    AnimatePresence: ({ children }) => <>{children}</>,
}));

const mockStore = configureStore([]);

describe('Header Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            auth: {
                user: {
                    name: 'Admin User',
                    imgProfile: '/test-avatar.png'
                },
                isLoading: false
            }
        });
        store.dispatch = vi.fn();
    });

    const renderHeader = () => {
        return render(
            <Provider store={store}>
                <BrowserRouter>
                    <Header />
                </BrowserRouter>
            </Provider>
        );
    };

    it('renders user profile and opens menu', () => {
        renderHeader();

        const avatarBtn = screen.getByRole('button');
        fireEvent.click(avatarBtn);

        expect(screen.getByText('Profile')).toBeInTheDocument();
        expect(screen.getByText('Manage Users')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('fetches user data on mount if user is null', () => {
        const storeNullUser = mockStore({
            auth: { user: null, isLoading: false }
        });
        storeNullUser.dispatch = vi.fn();

        render(
            <Provider store={storeNullUser}>
                <BrowserRouter>
                    <Header />
                </BrowserRouter>
            </Provider>
        );

        expect(storeNullUser.dispatch).toHaveBeenCalledWith({ type: 'auth/getMe' });
    });

    it('renders loading state', () => {
        const storeLoading = mockStore({
            auth: { user: null, isLoading: true }
        });

        render(
            <Provider store={storeLoading}>
                <BrowserRouter>
                    <Header />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('closes menu when clicking outside', () => {
        renderHeader();

        // Open menu
        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByText('Profile')).toBeInTheDocument();

        // Click outside
        fireEvent.mouseDown(document.body);

        expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    });

    it('opens logout modal when clicking logout', () => {
        renderHeader();

        // Open menu
        fireEvent.click(screen.getByRole('button'));

        // Click Logout
        fireEvent.click(screen.getByText('Logout'));

        expect(screen.getByText('Konfirmasi Logout')).toBeInTheDocument();
    });

    it('cancels logout', () => {
        renderHeader();
        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByText('Logout'));

        // Click Batal
        fireEvent.click(screen.getByText('Batal'));

        expect(screen.queryByText('Konfirmasi Logout')).not.toBeInTheDocument();
    });

    it('confirms logout', async () => {
        renderHeader();
        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByText('Logout'));

        // Click Confirm Logout
        const confirmBtn = screen.getAllByText('Logout')[1]; // Second one in modal
        fireEvent.click(confirmBtn);

        expect(store.dispatch).toHaveBeenCalledTimes(1);
    });
});
