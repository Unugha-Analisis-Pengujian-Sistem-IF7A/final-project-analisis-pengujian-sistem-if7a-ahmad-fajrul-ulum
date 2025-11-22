import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getUsers, createUser, updateUser, deleteUser } from '../service/api'; // Pastikan path-nya sesuai dengan lokasi file api.js

// Thunk untuk mendapatkan daftar user
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, thunkAPI) => {
    try {
      const response = await getUsers(); // Mengambil data user
      return response; // Mengembalikan data user
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message); // Menangani error
    }
  }
);

// Thunk untuk menambahkan user baru
export const addUser = createAsyncThunk(
  'users/addUser',
  async (userData, thunkAPI) => {
    try {
      const response = await createUser(userData); 
      return response; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message); 
    }
  }
);

// Thunk untuk mengupdate user
export const editUser = createAsyncThunk(
  'users/editUser',
  async ({ id, userData }, thunkAPI) => {
    try {
      const response = await updateUser(id, userData); // Mengupdate user
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message); // Menangani error
    }
  }
);

// Thunk untuk menghapus user
export const removeUser = createAsyncThunk(
  'users/removeUser',
  async (id, thunkAPI) => {
    try {
      const response = await deleteUser(id); // Menghapus user
      return response; // Mengembalikan id user yang dihapus
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message); // Menangani error
    }
  }
);

// Slice Redux
const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [], // Menyimpan daftar user
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload; // Menyimpan daftar user
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Menangani error
      })
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload); // Menambahkan user baru ke daftar
        state.error = null;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Menangani error
      })
      .addCase(editUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex((user) => user.id === action.payload.id);
        if (index >= 0) {
          state.users[index] = action.payload; // Update user yang diubah
        }
        state.error = null;
      })
      .addCase(editUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Menangani error
      })
      .addCase(removeUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload.id); // Menghapus user yang dihapus
        state.error = null;
      })
      .addCase(removeUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Menangani error
      });
  },
});

export default usersSlice.reducer;
