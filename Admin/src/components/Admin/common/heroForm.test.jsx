import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import HeroForm from './heroForm';

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => <div {...props}>{children}</div>
    }
}));

const mockStore = configureStore([]);

describe('HeroForm', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            hero: { heroes: [], isLoading: false }
        });
        store.dispatch = vi.fn();
    });

    it('renders form when open is true', () => {
        render(
            <Provider store={store}>
                <HeroForm open={true} onClose={vi.fn()} hero={null} />
            </Provider>
        );
        expect(screen.getByPlaceholderText(/Judul/i)).toBeInTheDocument();
    });

    it('does not render when open is false', () => {
        const { container } = render(
            <Provider store={store}>
                <HeroForm open={false} onClose={vi.fn()} hero={null} />
            </Provider>
        );
        expect(container.firstChild).toBeNull();
    });

    it('populates form when editing existing hero', () => {
        const hero = { _id: '1', title: 'Test Hero', description: 'Test desc' };
        render(
            <Provider store={store}>
                <HeroForm open={true} onClose={vi.fn()} hero={hero} />
            </Provider>
        );
        const titleInput = screen.getByDisplayValue('Test Hero');
        expect(titleInput).toBeInTheDocument();
    });
});
