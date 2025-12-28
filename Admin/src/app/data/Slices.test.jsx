import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';

// Import reducers
import blogReducer from './blogSlice';
import dashboardReducer from './dashboardSlice';
import heroReducer from './heroSlice';
import iklanReducer from './iklanSlice';
import logoPTReducer from './logoPTSlice';
import testimoniReducer from './testimoniSlice';

// Import thunks
import { fetchBlogs, createNewBlog, updateExistingBlog, deleteExistingBlog } from './blogSlice';
import { fecthDataDashboard } from './dashboardSlice';
import { fetchHeroes, addHero, editHero, removeHero } from './heroSlice';
import { fetchIklan, addIklan, removeIklan } from './iklanSlice';
import { fetchLogoPTs, addLogoPT, removeLogoPT } from './logoPTSlice';
import { fetchTestimonials, addTestimonial, editTestimonial, removeTestimonial } from './testimoniSlice';

// Mock all API services - these MUST return resolved promises
vi.mock('../service/api', () => ({
    getBlogs: vi.fn(() => Promise.resolve({ blogs: [{ id: 1, title: 'Test' }] })),
    createBlog: vi.fn(() => Promise.resolve({ blog: { id: 2, title: 'New' } })),
    updateBlog: vi.fn(() => Promise.resolve({ blog: { id: 1, title: 'Updated' } })),
    deleteBlog: vi.fn(() => Promise.resolve()),
    getHeroes: vi.fn(() => Promise.resolve({ heroes: [{ _id: 'h1' }] })),
    createHeroes: vi.fn(() => Promise.resolve({ hero: { _id: 'h2' } })),
    updateHeroes: vi.fn(() => Promise.resolve({ hero: { _id: 'h1', name: 'Updated' } })),
    deleteHeroes: vi.fn(() => Promise.resolve()),
    getIklan: vi.fn(() => Promise.resolve({ iklan: [{ _id: 'i1' }] })),
    createIklan: vi.fn(() => Promise.resolve({ iklan: { _id: 'i2' } })),
    deleteIklan: vi.fn(() => Promise.resolve()),
    getLogoPTs: vi.fn(() => Promise.resolve({ logoPT: [{ _id: 'l1' }] })),
    createLogoPT: vi.fn(() => Promise.resolve({ logoPT: { _id: 'l2' } })),
    deleteLogoPT: vi.fn(() => Promise.resolve()),
    getTestimonials: vi.fn(() => Promise.resolve({ testimoni: [{ _id: 't1' }] })),
    createTestimonial: vi.fn(() => Promise.resolve({ testimoni: { _id: 't2' } })),
    updateTestimonial: vi.fn(() => Promise.resolve({ testimoni: { _id: 't1', name: 'Updated' } })),
    deleteTestimonial: vi.fn(() => Promise.resolve()),
}));

const createTestStore = () => configureStore({
    reducer: {
        blog: blogReducer,
        dashboard: dashboardReducer,
        hero: heroReducer,
        iklan: iklanReducer,
        logoPTs: logoPTReducer,
        testimonials: testimoniReducer,
    },
});

describe('Blog Slice Thunks', () => {
    let store;
    beforeEach(() => { store = createTestStore(); });

    it('fetchBlogs executes thunk body', async () => {
        await store.dispatch(fetchBlogs());
        expect(store.getState().blog.blogs).toEqual([{ id: 1, title: 'Test' }]);
    });

    it('createNewBlog executes thunk body', async () => {
        await store.dispatch(createNewBlog({}));
        expect(store.getState().blog.blogs).toContainEqual({ id: 2, title: 'New' });
    });

    it('updateExistingBlog executes thunk body', async () => {
        store = configureStore({ reducer: { blog: blogReducer }, preloadedState: { blog: { blogs: [{ id: 1, title: 'Old' }] } } });
        await store.dispatch(updateExistingBlog({ id: 1, formData: {} }));
        expect(store.getState().blog.blogs[0].title).toBe('Updated');
    });

    it('deleteExistingBlog executes thunk body', async () => {
        store = configureStore({ reducer: { blog: blogReducer }, preloadedState: { blog: { blogs: [{ id: 1 }] } } });
        await store.dispatch(deleteExistingBlog(1));
        expect(store.getState().blog.blogs).toEqual([]);
    });
});

describe('Dashboard Slice Thunks', () => {
    let store;
    beforeEach(() => { store = createTestStore(); });

    it('fecthDataDashboard executes thunk body', async () => {
        await store.dispatch(fecthDataDashboard());
        expect(store.getState().dashboard.blogs).toEqual([{ id: 1, title: 'Test' }]);
    });
});

describe('Hero Slice Thunks', () => {
    let store;
    beforeEach(() => { store = createTestStore(); });

    it('fetchHeroes executes thunk body', async () => {
        await store.dispatch(fetchHeroes());
        expect(store.getState().hero.heroes).toEqual([{ _id: 'h1' }]);
    });

    it('addHero executes thunk body', async () => {
        await store.dispatch(addHero({}));
        expect(store.getState().hero.heroes).toContainEqual({ _id: 'h2' });
    });

    it('editHero executes thunk body', async () => {
        store = configureStore({ reducer: { hero: heroReducer }, preloadedState: { hero: { heroes: [{ _id: 'h1', id: 'h1' }] } } });
        await store.dispatch(editHero({ id: 'h1', formData: {} }));
        expect(store.getState().hero.heroes).toHaveLength(1);
    });

    it('removeHero executes thunk body', async () => {
        store = configureStore({ reducer: { hero: heroReducer }, preloadedState: { hero: { heroes: [{ _id: 'h1' }] } } });
        await store.dispatch(removeHero('h1'));
        expect(store.getState().hero.heroes).toEqual([]);
    });
});

describe('Iklan Slice Thunks', () => {
    let store;
    beforeEach(() => { store = createTestStore(); });

    it('fetchIklan executes thunk body', async () => {
        await store.dispatch(fetchIklan());
        expect(store.getState().iklan.iklan).toEqual([{ _id: 'i1' }]);
    });

    it('createNewIklan executes thunk body', async () => {
        await store.dispatch(addIklan({}));
        expect(store.getState().iklan.iklan).toContainEqual({ _id: 'i2' });
    });

    it('removeIklan executes thunk body', async () => {
        store = configureStore({ reducer: { iklan: iklanReducer }, preloadedState: { iklan: { iklan: [{ _id: 'i1' }] } } });
        await store.dispatch(removeIklan('i1'));
        expect(store.getState().iklan.iklan).toEqual([]);
    });
});

describe('LogoPT Slice Thunks', () => {
    let store;
    beforeEach(() => { store = createTestStore(); });

    it('fetchLogoPTs executes thunk body', async () => {
        await store.dispatch(fetchLogoPTs());
        expect(store.getState().logoPTs.logoPTs).toEqual([{ _id: 'l1' }]);
    });

    it('addLogoPT executes thunk body', async () => {
        await store.dispatch(addLogoPT({}));
        expect(store.getState().logoPTs.logoPTs).toContainEqual({ _id: 'l2' });
    });

    it('removeLogoPT executes thunk body', async () => {
        store = configureStore({ reducer: { logoPTs: logoPTReducer }, preloadedState: { logoPTs: { logoPTs: [{ _id: 'l1' }] } } });
        await store.dispatch(removeLogoPT('l1'));
        expect(store.getState().logoPTs.logoPTs).toEqual([]);
    });
});

describe('Testimonial Slice Thunks', () => {
    let store;
    beforeEach(() => { store = createTestStore(); });

    it('fetchTestimonials executes thunk body', async () => {
        await store.dispatch(fetchTestimonials());
        expect(store.getState().testimonials.testimonials).toEqual([{ _id: 't1' }]);
    });

    it('addTestimonial executes thunk body', async () => {
        await store.dispatch(addTestimonial({}));
        expect(store.getState().testimonials.testimonials).toContainEqual({ _id: 't2' });
    });

    it('editTestimonial executes thunk body', async () => {
        store = configureStore({ reducer: { testimonials: testimoniReducer }, preloadedState: { testimonials: { testimonials: [{ _id: 't1' }] } } });
        await store.dispatch(editTestimonial({ id: 't1', formData: {} }));
        expect(store.getState().testimonials.testimonials).toHaveLength(1);
    });

    it('removeTestimonial executes thunk body', async () => {
        store = configureStore({ reducer: { testimonials: testimoniReducer }, preloadedState: { testimonials: { testimonials: [{ _id: 't1' }] } } });
        await store.dispatch(removeTestimonial('t1'));
        expect(store.getState().testimonials.testimonials).toEqual([]);
    });
});
