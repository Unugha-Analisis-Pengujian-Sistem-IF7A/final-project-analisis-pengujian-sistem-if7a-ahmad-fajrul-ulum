import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getTestimonials,
} from "../service/api";

// Fetch
export const fetchTestimonials = createAsyncThunk(
  "testimonial/fetchTestimonials",
  async () => {
    const res = await getTestimonials();
    // pastikan data yang direturn array
    return res?.testimoni || [];
  }
);

// Create
export const addTestimonial = createAsyncThunk(
  "testimonial/addTestimonial",
  async (formData) => {
    const res = await createTestimonial(formData);
    return res?.testimoni || res?.data; // fallback
  }
);

// Update
export const editTestimonial = createAsyncThunk(
  "testimonial/updateTestimonial",
  async ({ id, formData }) => {
    const res = await updateTestimonial(id, formData);
    return res?.testimoni || res?.data;
  }
);

// Delete
export const removeTestimonial = createAsyncThunk(
  "testimonial/removeTestimonial",
  async (id) => {
    await deleteTestimonial(id);
    return id;
  }
);

// Slice
const testimonialSlice = createSlice({
  name: "testimonials",
  initialState: {
    testimonials: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestimonials.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
       
        state.isLoading = false;
        state.testimonials = action.payload;
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(addTestimonial.fulfilled, (state, action) => {
        if (!Array.isArray(state.testimonials)) {
          state.testimonials = [];
        }
        if (action.payload) {
          state.testimonials.push(action.payload);
        }
      })
      .addCase(editTestimonial.fulfilled, (state, action) => {
        const idx = state.testimonials.findIndex(
          (t) => t._id === action.payload._id
        );
        if (idx !== -1) state.testimonials[idx] = action.payload;
      })
      .addCase(removeTestimonial.fulfilled, (state, action) => {
        state.testimonials = state.testimonials.filter(
          (t) => t._id !== action.payload
        );
      });
  },
});

export default testimonialSlice.reducer;
