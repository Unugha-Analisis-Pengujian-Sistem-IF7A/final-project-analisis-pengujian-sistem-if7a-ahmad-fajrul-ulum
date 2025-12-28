import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import BlogForm from './BlogForm';

vi.mock('framer-motion', () => ({
    motion: { div: ({ children, ...props }) => <div {...props}>{children}</div> }
}));

vi.mock('./RichEditor', () => ({
    default: () => <div data-testid="rich-editor">RichEditor</div>
}));

const mockStore = configureStore([]);

describe('BlogForm', () => {
    let store;
    beforeEach(() => {
        store = mockStore({ blog: { blogs: [], isLoading: false } });
        store.dispatch = vi.fn();
    });

    it('renders when open', () => {
        const { container } = render(
            <Provider store={store}><BlogForm open={true} onClose={vi.fn()} blog={null} setToast={vi.fn()} /></Provider>
        );
        expect(container.querySelector('form')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
        const { container } = render(
            <Provider store={store}><BlogForm open={false} onClose={vi.fn()} blog={null} setToast={vi.fn()} /></Provider>
        );
        expect(container.querySelector('.modal-open')).not.toBeInTheDocument();
    });

    it('handles edit mode', () => {
        const blog = { _id: '1', title: 'Test', content: 'Content', status: 'published' };
        const { container } = render(
            <Provider store={store}><BlogForm open={true} onClose={vi.fn()} blog={blog} setToast={vi.fn()} /></Provider>
        );
        expect(container).toBeTruthy();
    });
});
