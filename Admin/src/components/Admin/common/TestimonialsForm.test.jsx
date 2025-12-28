import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import TestimonialsForm from './TestimonialsForm';

vi.mock('framer-motion', () => ({
    motion: { div: ({ children, ...props }) => <div {...props}>{children}</div> }
}));

const mockStore = configureStore([]);

describe('TestimonialsForm', () => {
    let store;
    beforeEach(() => {
        store = mockStore({ testimonials: { testimonials: [], isLoading: false } });
        store.dispatch = vi.fn();
    });

    it('renders when open', () => {
        const { container } = render(
            <Provider store={store}><TestimonialsForm open={true} onClose={vi.fn()} testimonial={null} /></Provider>
        );
        expect(container.querySelector('form')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
        const { container } = render(
            <Provider store={store}><TestimonialsForm open={false} onClose={vi.fn()} testimonial={null} /></Provider>
        );
        expect(container.querySelector('.modal-open')).not.toBeInTheDocument();
    });

    it('handles edit mode', () => {
        const testimonial = { _id: '1', name: 'Test', feedback: 'Great!', position: 'CEO' };
        const { container } = render(
            <Provider store={store}><TestimonialsForm open={true} onClose={vi.fn()} testimonial={testimonial} /></Provider>
        );
        expect(container).toBeTruthy();
    });
});
