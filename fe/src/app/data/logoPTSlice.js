import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getLogoPTs } from "../service/api";

// Fetch logo PT
export const fetchLogoPTs = createAsyncThunk("logoPTs/fetch", async () => {
  const response = await getLogoPTs();
  return response.logoPT;
});

// Slice untuk Logo PT
const logoPTSlice = createSlice({
  name: "logoPTs",
  initialState: {
    logoPTs: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogoPTs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchLogoPTs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.logoPTs = action.payload;
      })
      .addCase(fetchLogoPTs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default logoPTSlice.reducer;
