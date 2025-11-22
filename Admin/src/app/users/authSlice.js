import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  EditProfile,
  FAVerify,
  fetchUser,
  ForgotPassword,
  loginUser,
  logoutUser,
  ResetPassword,
} from "../service/api";

// Thunks
export const login = createAsyncThunk(
  "/auth/login",
  async (credentials, thunkAPI) => {
    try {
      await loginUser(credentials.email, credentials.password);
      const user = await fetchUser();
      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getMe = createAsyncThunk("/auth/me", async (token, thunkAPI) => {
  try {
    const user = await fetchUser(token);
    
    return user;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const twoFAVerify = createAsyncThunk(
  "/auth/verify-2fa",
  async (code, thunkAPI) => {
    try {
      const user = await FAVerify(code);
      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "/auth/forgot-password",
  async (email, thunkAPI) => {
    try {
      const response = await ForgotPassword(email);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "/auth/reset-password",
  async ({ token, password }, thunkAPI) => {
    try {
      const response = await ResetPassword(token, password);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "/auth/profile",
  async (formData, thunkAPI) => {
    try {
      const response = await EditProfile(formData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk("/auth/logout", async (_, thunkAPI) => {
  try {
    const user = await logoutUser();
    return user;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    isAuthReady: false, // 👈 Tambahkan ini
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET ME
      .addCase(getMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
        state.isAuthReady = true; // ✅ login check selesai, success
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload;
        state.isAuthReady = true; // ✅ login check selesai, gagal
      })

      // 2FA
      .addCase(twoFAVerify.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(twoFAVerify.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(twoFAVerify.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Forgot password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reset password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.error = null;
        state.isAuthReady = true; // ✅ logout juga menandai auth check selesai
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
