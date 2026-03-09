import api from './api';
import { LoginPayload, SignupPayload, User } from '../types';

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authAPI = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await api.post('/auth/login', payload);
    return res.data.data;
  },

  signup: async (payload: SignupPayload): Promise<{ message: string; phone: string }> => {
    const res = await api.post('/auth/signup', payload);
    return res.data.data;
  },

  verifyOtp: async (payload: { email: string; code: string }): Promise<AuthResponse> => {
    const res = await api.post('/auth/verify-otp', payload);
    return res.data.data;
  },

  sendOtp: async (email: string): Promise<{ message: string }> => {
    const res = await api.post('/auth/send-otp', { email });
    return res.data.data;
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data.data;
  },

  resetPassword: async (token: string, password: string): Promise<{ message: string }> => {
    const res = await api.post('/auth/reset-password', { token, password });
    return res.data.data;
  },

  refreshToken: async (refreshToken: string): Promise<{ token: string }> => {
    const res = await api.post('/auth/refresh', { refreshToken });
    return res.data.data;
  },

  getProfile: async (): Promise<User> => {
    const res = await api.get('/auth/profile');
    return res.data.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const res = await api.put('/auth/profile', data);
    return res.data.data;
  },
};
