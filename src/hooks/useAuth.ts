import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  sendOtp,
  verifyOtp,
  completeProfile,
  logoutUser,
  clearError,
  loadUserFromStorage,
  updateUser,
} from '../store/slices/authSlice';
import type { CompleteProfilePayload, User } from '../types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, isLoading, error } =
    useAppSelector((s) => s.auth);

  const handleSendOtp = useCallback(
    (phone: string) => dispatch(sendOtp(phone)),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleVerifyOtp = useCallback(
    (phone: string, otp: string) => dispatch(verifyOtp({ phone, otp })),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleCompleteProfile = useCallback(
    (payload: CompleteProfilePayload) => dispatch(completeProfile(payload)),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleLogout = useCallback(
    () => dispatch(logoutUser()),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleClearError = useCallback(
    () => dispatch(clearError()),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleLoadUser = useCallback(
    () => dispatch(loadUserFromStorage()),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleUpdateUser = useCallback(
    (data: Partial<User>) => dispatch(updateUser(data)),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    sendOtp:          handleSendOtp,
    verifyOtp:        handleVerifyOtp,
    completeProfile:  handleCompleteProfile,
    logout:           handleLogout,
    clearError:       handleClearError,
    loadUser:         handleLoadUser,
    updateUser:       handleUpdateUser,
  };
};

