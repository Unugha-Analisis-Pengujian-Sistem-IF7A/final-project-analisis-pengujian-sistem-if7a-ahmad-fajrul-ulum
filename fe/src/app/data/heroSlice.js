import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getHeroes } from "../service/api";

export const fetchHeroes = createAsyncThunk("heroes/fetch", async () => {
  const response = await getHeroes();
  return response.heroes;
});

const heroSlice = createSlice({
  name: "heroes",
  initialState: {
    heroes: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHeroes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchHeroes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.heroes = action.payload;
      })
      .addCase(fetchHeroes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default heroSlice.reducer;
