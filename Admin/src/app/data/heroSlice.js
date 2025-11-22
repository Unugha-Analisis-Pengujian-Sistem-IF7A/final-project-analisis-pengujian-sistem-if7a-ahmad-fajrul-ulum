import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getHeroes,
  updateHeroes,
  deleteHeroes,
  createHeroes,
} from "../service/api";

export const fetchHeroes = createAsyncThunk("heroes/fetch", async () => {
  const response = await getHeroes();
  return response.heroes;
});

export const addHero = createAsyncThunk("heroes/create", async (formData) => {
  const response = await createHeroes(formData);
  return response.hero;
});

export const editHero = createAsyncThunk(
  "heroes/update",
  async ({ id, formData }) => {
    const response = await updateHeroes(id, formData);
    return response.hero;
  }
);

export const removeHero = createAsyncThunk("heroes/delete", async (id) => {
  await deleteHeroes(id);
  return id;
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
      })
      .addCase(addHero.fulfilled, (state, action) => {
        state.heroes.push(action.payload);
      })
      .addCase(editHero.fulfilled, (state, action) => {
        const index = state.heroes.findIndex(
          (item) => item.id === action.payload._id
        );
        if (index !== -1) state.heroes[index] = action.payload;
      })
      .addCase(removeHero.fulfilled, (state, action) => {
        state.heroes = state.heroes.filter(
          (item) => item._id !== action.payload
        );
      });
  },
});

export default heroSlice.reducer;
