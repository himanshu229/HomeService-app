import api from './axios';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse, User, VerifyOtpResponse, CompleteProfilePayload } from '../types';

export const authApi = {
  sendOtp: (phone: string) =>
    api.post<ApiResponse<{ message: string }>>(ENDPOINTS.AUTH.SEND_OTP, { phone }),

  verifyOtp: (phone: string, otp: string) =>
    api.post<ApiResponse<VerifyOtpResponse>>(ENDPOINTS.AUTH.VERIFY_OTP, { phone, otp }),

  completeProfile: (data: CompleteProfilePayload) =>
    api.post<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>>(
      ENDPOINTS.AUTH.COMPLETE_PROFILE,
      data,
    ),

  refreshToken: (refreshToken: string) =>
    api.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      ENDPOINTS.AUTH.REFRESH,
      { refreshToken },
    ),

  getProfile: () =>
    api.get<ApiResponse<{ user: User }>>(ENDPOINTS.AUTH.PROFILE),

  updateProfile: (data: { firstName?: string; lastName?: string; email?: string }) =>
    api.put<ApiResponse<{ user: User }>>(ENDPOINTS.AUTH.PROFILE, data),

  logout: () =>
    api.post<ApiResponse<null>>(ENDPOINTS.AUTH.LOGOUT),
};

