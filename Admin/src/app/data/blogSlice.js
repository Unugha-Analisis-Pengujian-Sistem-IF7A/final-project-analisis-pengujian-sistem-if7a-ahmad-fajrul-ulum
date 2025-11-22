
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getBlogs, createBlog, updateBlog, deleteBlog } from "../service/api";

export const fetchBlogs = createAsyncThunk("blogs/fetchBlogs", async () => {
  const response = await getBlogs();
  return response.blogs; 
});

export const createNewBlog = createAsyncThunk(
  "blogs/createNewBlog",
  async (formData) => {
    const response = await createBlog(formData);
    return response.blog; 
  }
);

export const updateExistingBlog = createAsyncThunk(
  "blogs/updateExistingBlog",
  async ({ id, formData }) => {
    const response = await updateBlog(id, formData);
    return response.blog;
  }
);

export const deleteExistingBlog = createAsyncThunk(
  "blogs/deleteExistingBlog",
  async (id) => {
    const response = await deleteBlog(id);
    return id; 
  }
);

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

    builder.addCase(createNewBlog.fulfilled, (state, action) => {
      state.blogs.push(action.payload);
    });

    builder.addCase(updateExistingBlog.fulfilled, (state, action) => {
      const index = state.blogs.findIndex(
        (blog) => blog.id === action.payload.id
      );
      if (index !== -1) {
        state.blogs[index] = action.payload;
      }
    });

    builder.addCase(deleteExistingBlog.fulfilled, (state, action) => {
      state.blogs = state.blogs.filter((blog) => blog.id !== action.payload);
    });
  },
});

export default blogSlice.reducer;
