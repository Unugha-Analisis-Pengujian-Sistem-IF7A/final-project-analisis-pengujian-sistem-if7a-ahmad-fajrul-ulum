import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import EditProfileForm from './EditProfileForm';

vi.mock('framer-motion', () => ({
    motion: { div: ({ children, ...props }) => <div {...props}>{children}</div> }
}));

const mockStore = configureStore([]);

describe('EditProfileForm', () => {
    let store;
    beforeEach(() => {
        store = mockStore({ auth: { user: { name: 'Test', email: 'test@test.com' }, isLoading: false } });
        store.dispatch = vi.fn();
    });

    it('renders when open', () => {
        const { container } = render(
            <Provider store={store}><EditProfileForm open={true} onClose={vi.fn()} /></Provider>
        );
        expect(container.querySelector('form')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
        const { container } = render(
            <Provider store={store}><EditProfileForm open={false} onClose={vi.fn()} /></Provider>
        );
        expect(container.querySelector('.modal-open')).not.toBeInTheDocument();
    });
});
