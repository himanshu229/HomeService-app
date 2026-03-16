import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, User, CompleteProfilePayload, VerifyOtpResponse } from '../../types';
import { ASYNC_STORAGE_KEYS } from '../../utils/constants';
import { authApi } from '../../api/auth.api';

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// ─── Async Thunks ─────────────────────────────────────────────
export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (phone: string, { rejectWithValue }) => {
    try {
      await authApi.sendOtp(phone);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to send OTP');
    }
  }
);

export const verifyOtp = createAsyncThunk<VerifyOtpResponse, { phone: string; otp: string }>(
  'auth/verifyOtp',
  async ({ phone, otp }, { rejectWithValue }) => {
    try {
      const res = await authApi.verifyOtp(phone, otp);
      const data = res.data.data;
      // Only persist tokens for existing users; new users complete profile next
      if (!data.isNewUser && data.accessToken && data.refreshToken && data.user) {
        await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.AUTH_TOKEN, data.accessToken);
        await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
        await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.USER_DATA, JSON.stringify(data.user));
      }
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'OTP verification failed');
    }
  }
);

export const completeProfile = createAsyncThunk(
  'auth/completeProfile',
  async (payload: CompleteProfilePayload, { rejectWithValue }) => {
    try {
      const res = await authApi.completeProfile(payload);
      const { accessToken, refreshToken, user } = res.data.data;
      await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.AUTH_TOKEN, accessToken);
      await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      return { token: accessToken, refreshToken, user };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to complete profile');
    }
  }
);

export const loadUserFromStorage = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const [token, refreshToken, userStr] = await AsyncStorage.multiGet([
        ASYNC_STORAGE_KEYS.AUTH_TOKEN,
        ASYNC_STORAGE_KEYS.REFRESH_TOKEN,
        ASYNC_STORAGE_KEYS.USER_DATA,
      ]);
      const t  = token[1];
      const rt = refreshToken[1];
      const u  = userStr[1];
      if (t && u) {
        return { token: t, refreshToken: rt ?? null, user: JSON.parse(u) as User };
      }
      return null;
    } catch {
      return rejectWithValue('Failed to load user');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try { await authApi.logout(); } catch { /* ignore network errors on logout */ }
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
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) state.user = { ...state.user, ...action.payload };
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    // sendOtp
    builder
      .addCase(sendOtp.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(sendOtp.fulfilled, (state) => { state.isLoading = false; })
      .addCase(sendOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // verifyOtp
    builder
      .addCase(verifyOtp.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!action.payload.isNewUser && action.payload.user && action.payload.accessToken) {
          state.user            = action.payload.user;
          state.token           = action.payload.accessToken;
          state.refreshToken    = action.payload.refreshToken ?? null;
          state.isAuthenticated = true;
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // completeProfile
    builder
      .addCase(completeProfile.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(completeProfile.fulfilled, (state, action) => {
        state.isLoading       = false;
        state.user            = action.payload.user;
        state.token           = action.payload.token;
        state.refreshToken    = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(completeProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // loadUser
    builder
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        if (action.payload) {
          state.user            = action.payload.user;
          state.token           = action.payload.token;
          state.refreshToken    = action.payload.refreshToken;
          state.isAuthenticated = true;
        }
        state.isLoading = false;
      })
      .addCase(loadUserFromStorage.rejected, (state) => { state.isLoading = false; });

    // logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user            = null;
      state.token           = null;
      state.refreshToken    = null;
      state.isAuthenticated = false;
    });
  },
});

export const { clearError, updateUser, setToken } = authSlice.actions;
export default authSlice.reducer;

