import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getIklan,
  createIklan,
  updateIklan,
  deleteIklan,
} from "../service/api";

export const fetchIklan = createAsyncThunk("iklan/fetch", async () => {
  const response = await getIklan();
  return response.iklan;
});

export const addIklan = createAsyncThunk("iklan/create", async (formData) => {
  const response = await createIklan(formData);
  return response.iklan;
});

export const editIklan = createAsyncThunk(
  "iklan/update",
  async ({ id, formData }) => {
    const response = await updateIklan(id, formData);
    return response.iklan;
  }
);

export const removeIklan = createAsyncThunk("iklan/delete", async (id) => {
  await deleteIklan(id);
  return id;
});

const iklanSlice = createSlice({
  name: "iklan",
  initialState: {
    iklan: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIklan.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchIklan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.iklan = action.payload;
      })
      .addCase(fetchIklan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(addIklan.fulfilled, (state, action) => {
        state.iklan.push(action.payload);
      })
      .addCase(editIklan.fulfilled, (state, action) => {
        const index = state.iklan.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) state.iklan[index] = action.payload;
      })
      .addCase(removeIklan.fulfilled, (state, action) => {
        state.iklan = state.iklan.filter((item) => item._id !== action.payload);
      });
  },
});

export default iklanSlice.reducer;
