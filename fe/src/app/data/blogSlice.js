import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getBlogs } from "../service/api";

export const fetchBlogs = createAsyncThunk("blogs/fetchBlogs", async () => {
  const response = await getBlogs();
  return response.blogs; 
});

const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    blogs: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBlogs.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchBlogs.fulfilled, (state, action) => {
      state.isLoading = false;
      state.blogs = action.payload;
    });
    builder.addCase(fetchBlogs.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});

export default blogSlice.reducer;
