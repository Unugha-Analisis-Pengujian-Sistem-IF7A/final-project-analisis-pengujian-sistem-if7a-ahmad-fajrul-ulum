import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getIklan } from "../service/api";

// Fetch iklan
export const fetchIklan = createAsyncThunk("iklan/fetch", async () => {
  const response = await getIklan();
  return response.iklan;
});

// Slice untuk Iklan
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
      });
  },
});

export default iklanSlice.reducer;
