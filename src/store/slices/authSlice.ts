import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, LoginPayload, SignupPayload, User } from '../../types';
import { ASYNC_STORAGE_KEYS } from '../../utils/constants';
import { authAPI } from '../../services/authService';

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// ─── Async Thunks ─────────────────────────────────────────────
export const loginUser = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(payload);
      await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.AUTH_TOKEN, response.token);
      await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signup',
  async (payload: SignupPayload, { rejectWithValue }) => {
    try {
      const response = await authAPI.signup(payload);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Signup failed');
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (payload: { email: string; code: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.verifyOtp(payload);
      await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.AUTH_TOKEN, response.accessToken);
      await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'OTP verification failed');
    }
  }
);

export const resendOtp = createAsyncThunk(
  'auth/resendOtp',
  async (email: string, { rejectWithValue }) => {
    try {
      await authAPI.sendOtp(email);
      return { email };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to resend OTP');
    }
  }
);

export const loadUserFromStorage = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.AUTH_TOKEN);
      const userStr = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.USER_DATA);
      if (token && userStr) {
        return { token, user: JSON.parse(userStr) as User };
      }
      return null;
    } catch {
      return rejectWithValue('Failed to load user');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await AsyncStorage.multiRemove([
    ASYNC_STORAGE_KEYS.AUTH_TOKEN,
    ASYNC_STORAGE_KEYS.USER_DATA,
    ASYNC_STORAGE_KEYS.REFRESH_TOKEN,
  ]);
});

// ─── Slice ────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: builder => {
    // Login
    builder
      .addCase(loginUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    // Signup
    builder
      .addCase(signupUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    // Verify OTP
    builder
      .addCase(verifyOtp.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    // Load user
    builder
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
        state.isLoading = false;
      })
      .addCase(loadUserFromStorage.rejected, state => {
        state.isLoading = false;
      });
    // Logout
    builder.addCase(logoutUser.fulfilled, state => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    });
  },
});

export const { clearError, updateUser, setToken } = authSlice.actions;
export default authSlice.reducer;
