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
    [dispatch]
  );

  const handleVerifyOtp = useCallback(
    (phone: string, otp: string) => dispatch(verifyOtp({ phone, otp })),
    [dispatch]
  );

  const handleCompleteProfile = useCallback(
    (payload: CompleteProfilePayload) => dispatch(completeProfile(payload)),
    [dispatch]
  );

  const handleLogout = useCallback(
    () => dispatch(logoutUser()),
    [dispatch]
  );

  const handleClearError = useCallback(
    () => dispatch(clearError()),
    [dispatch]
  );

  const handleLoadUser = useCallback(
    () => dispatch(loadUserFromStorage()),
    [dispatch]
  );

  const handleUpdateUser = useCallback(
    (data: Partial<User>) => dispatch(updateUser(data)),
    [dispatch]
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

