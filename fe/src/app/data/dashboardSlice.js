import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getBlogs,
  getHeroes,
  getIklan,
  getLogoPTs,
  getTestimonials,
} from "../service/api";

export const fecthDataDashboard = createAsyncThunk(
  "/dashboard/fecthData",
  async (_, { rejectWithValue }) => {
    try {
      const [blogRes, testimonialsRes, heroesRes, logoPTsRes, iklanRes] =
        await Promise.all([
          getBlogs(),
          getTestimonials(),
          getHeroes(),
          getLogoPTs(),
          getIklan(),
        ]);
      return {
        blogs: blogRes.blogs,
        testimonials: testimonialsRes.testimoni,
        heroes: heroesRes.heroes,
        logoPTs: logoPTsRes.logoPT,
        iklan: iklanRes.iklan,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  blogs: [],
  testimonials: [],
  heroes: [],
  logoPTs: [],
  isLoading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fecthDataDashboard.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fecthDataDashboard.fulfilled, (state, action) => {
      state.isLoading = false;
      state.blogs = action.payload.blogs;
      state.testimonials = action.payload.testimonials;
      state.heroes = action.payload.heroes;
      state.logoPTs = action.payload.logoPTs;
      state.iklan = action.payload.iklan;
      state.error = null;
    });
    builder.addCase(fecthDataDashboard.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export default dashboardSlice.reducer;
