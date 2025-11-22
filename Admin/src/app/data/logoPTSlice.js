import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getLogoPTs,
  createLogoPT,
  updateLogoPT,
  deleteLogoPT,
} from "../service/api";

export const fetchLogoPTs = createAsyncThunk("logoPTs/fetch", async () => {
  const response = await getLogoPTs();
  return response.logoPT;
});

export const addLogoPT = createAsyncThunk(
  "logoPTs/create",
  async (formData) => {
    const response = await createLogoPT(formData);
    return response.logoPT;
  }
);

export const editLogoPT = createAsyncThunk(
  "logoPTs/update",
  async ({ id, formData }) => {
    const response = await updateLogoPT(id, formData);
    return response.logoPT;
  }
);

export const removeLogoPT = createAsyncThunk("logoPTs/delete", async (id) => {
  await deleteLogoPT(id);
  return id;
});

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
      })
      .addCase(addLogoPT.fulfilled, (state, action) => {
        state.logoPTs.push(action.payload);
      })
      .addCase(editLogoPT.fulfilled, (state, action) => {
        const index = state.logoPTs.findIndex(
          (item) => item.id === action.payload._id
        );
        if (index !== -1) state.logoPTs[index] = action.payload;
      })
      .addCase(removeLogoPT.fulfilled, (state, action) => {
        state.logoPTs = state.logoPTs.filter(
          (item) => item._id !== action.payload
        );
      });
  },
});

export default logoPTSlice.reducer;
