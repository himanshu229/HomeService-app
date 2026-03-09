import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, ASYNC_STORAGE_KEYS } from '../utils/constants';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor — attach auth token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.AUTH_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.REFRESH_TOKEN);
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          const newToken = res.data.token;
          await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.AUTH_TOKEN, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch {
          await AsyncStorage.multiRemove([
            ASYNC_STORAGE_KEYS.AUTH_TOKEN,
            ASYNC_STORAGE_KEYS.REFRESH_TOKEN,
          ]);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
