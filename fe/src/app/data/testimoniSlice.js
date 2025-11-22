import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getTestimonials } from "../service/api";

// Fetch testimonials
export const fetchTestimonials = createAsyncThunk(
  "testimonial/fetchTestimonials",
  async () => {
    const res = await getTestimonials();
    // Pastikan data yang direturn adalah array
    return res?.testimoni || [];
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
      });
  },
});

export default testimonialSlice.reducer;
