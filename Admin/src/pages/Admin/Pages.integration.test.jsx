/* eslint-disable react/prop-types */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Pages
import Dashboard from './Dashboard';
import Blog from './Blog';
import Users from './Users';
import Testimonials from './Testimonials';
import Hero from './Hero';
import Iklan from './Iklan';
import LogoPt from './LogoPt';
import Profile from './Profile';

// Common Mocks
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => <div {...props}>{children}</div>,
        aside: ({ children, ...props }) => <aside {...props}>{children}</aside>
    },
    AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock API services used by Users.jsx
vi.mock('../../services/api', () => ({
    getUsers: vi.fn(() => Promise.resolve([{ id: '1', name: 'U1', email: 'e1', role: 'admin', status: 'active' }])),
    deleteUser: vi.fn(() => Promise.resolve()),
}));

// Mock child components to isolate page testing
vi.mock('../../components/Admin/common/BlogForm', () => ({
    default: () => <div data-testid="blog-form">Blog Form</div>
}));
vi.mock('../../components/Admin/common/Toast', () => ({
    default: (props) => <div data-testid="toast">{props.message}</div>
}));
vi.mock('../../components/Admin/common/ConfirmDeleteModal', () => ({
    default: ({ isOpen }) => isOpen ? <div data-testid="delete-modal">Delete Modal</div> : null
}));
// Mock other potential sub-components to prevent crash
vi.mock('../../components/Admin/common/userForm', () => ({ default: () => <div>User Form</div> }));
vi.mock('../../components/Admin/common/TestimonialForm', () => ({ default: () => <div>Testimonial Form</div> }));
vi.mock('../../components/Admin/common/HeroForm', () => ({ default: () => <div>Hero Form</div> }));
vi.mock('../../components/Admin/common/IklanForm', () => ({ default: () => <div>Iklan Form</div> }));
vi.mock('../../components/Admin/common/LogoPtForm', () => ({ default: () => <div>Logo Pt Form</div> }));

const mockStore = configureStore([]);
const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: { retry: false, cacheTime: 0 },
    },
});

describe('Admin Pages Smoke Tests', () => {
    let store;
    let queryClient;

    beforeEach(() => {
        queryClient = createTestQueryClient();
    });

    describe('Dashboard', () => {
        beforeEach(() => {
            store = mockStore({
                dashboard: {
                    blogs: [{}, {}],
                    testimonials: [],
                    heroes: [],
                    logoPTs: [],
                    iklan: [],
                    isLoading: false,
                    error: null
                }
            });
            store.dispatch = vi.fn();
        });

        it('renders dashboard stats', () => {
            render(
                <Provider store={store}>
                    <Dashboard />
                </Provider>
            );
            expect(screen.getByText('Total Blog Posts')).toBeInTheDocument();
        });

        it('renders loading state', () => {
            store = mockStore({
                dashboard: { isLoading: true }
            });
            store.dispatch = vi.fn();
            render(
                <Provider store={store}>
                    <Dashboard />
                </Provider>
            );
            expect(screen.getByText(/Loading/)).toBeInTheDocument();
        });
    });

    describe('Blog', () => {
        beforeEach(() => {
            store = mockStore({
                blog: {
                    blogs: [
                        { _id: '1', title: 'Test Blog 1', status: 'published', updatedAt: new Date().toISOString() },
                        { _id: '2', title: 'Test Blog 2', status: 'draft', updatedAt: new Date().toISOString() }
                    ],
                    isLoading: false
                }
            });
            store.dispatch = vi.fn(() => ({ unwrap: () => Promise.resolve() }));
        });

        it('renders blog list', () => {
            render(
                <Provider store={store}>
                    <Blog />
                </Provider>
            );
            expect(screen.getByText('Kelola Blog')).toBeInTheDocument();
            expect(screen.getByText('Test Blog 1')).toBeInTheDocument();
        });

        it('triggers delete interaction', () => {
            render(<Provider store={store}><Blog /></Provider>);
            const deleteBtn = screen.getAllByTestId('delete-blog-btn')[0];
            fireEvent.click(deleteBtn);
            expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
        });

        it('renders loading state', () => {
            store = mockStore({
                blog: { isLoading: true, blogs: [] }
            });
            store.dispatch = vi.fn();
            render(
                <Provider store={store}>
                    <Blog />
                </Provider>
            );
            expect(screen.getByText(/Memuat/)).toBeInTheDocument();
        });
    });

    describe('Other Admin Pages', () => {
        beforeEach(() => {
            store = mockStore({
                users: { users: [], isLoading: false },
                testimonials: { testimonials: [], isLoading: false },
                hero: { heroes: [], isLoading: false },
                iklan: { iklan: [], isLoading: false },
                logoPTs: { logoPTs: [], isLoading: false },
                auth: { user: { name: 'Admin', email: 'admin@test.com' }, isLoading: false }
            });
            store.dispatch = vi.fn();
        });

        const renderWithProviders = (component) => {
            return render(
                <QueryClientProvider client={queryClient}>
                    <Provider store={store}>
                        <BrowserRouter>
                            {component}
                        </BrowserRouter>
                    </Provider>
                </QueryClientProvider>
            );
        };

        it('renders Users page', async () => {
            renderWithProviders(<Users />);
            // Wait for loading to finish
            expect(await screen.findByText('Kelola User')).toBeInTheDocument();
        });

        it('triggers delete interaction on Users page', async () => {
            vi.spyOn(window, 'confirm').mockImplementation(() => true);
            renderWithProviders(<Users />);
            const deleteBtn = await screen.findByTestId('delete-user-btn');
            fireEvent.click(deleteBtn);
            expect(window.confirm).toHaveBeenCalled();
        });

        it('renders Testimonials page', () => {
            renderWithProviders(<Testimonials />);
            expect(document.body).toBeInTheDocument();
        });
        it('renders Hero page', () => {
            renderWithProviders(<Hero />);
            expect(document.body).toBeInTheDocument();
        });
        it('renders Iklan page', () => {
            renderWithProviders(<Iklan />);
            expect(document.body).toBeInTheDocument();
        });
        it('renders LogoPt page', () => {
            renderWithProviders(<LogoPt />);
            expect(document.body).toBeInTheDocument();
        });
        it('renders Profile page', () => {
            renderWithProviders(<Profile />);
            expect(document.body).toBeInTheDocument();
        });
    });
});
