import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, ASYNC_STORAGE_KEYS } from '../utils/constants';

// ── Queued-refresh state ──────────────────────────────────────────────────────
let isRefreshing = false;
let failedRequestsQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedRequestsQueue.forEach((p) =>
    error ? p.reject(error) : p.resolve(token!)
  );
  failedRequestsQueue = [];
};

// ── Axios instance ────────────────────────────────────────────────────────────
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: inject JWT ──────────────────────────────────────────
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.AUTH_TOKEN);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

// ── Response interceptor: handle 401 with queued retry ───────────────────────
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    // Enqueue subsequent 401s while a refresh is already in flight
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedRequestsQueue.push({ resolve, reject });
      }).then((newToken) => {
        original.headers = {
          ...original.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return api(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const storedRefresh = await AsyncStorage.getItem(
        ASYNC_STORAGE_KEYS.REFRESH_TOKEN
      );
      const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refreshToken: storedRefresh,
      });
      const newToken: string = data.data.accessToken;

      await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.AUTH_TOKEN, newToken);
      processQueue(null, newToken);

      original.headers = {
        ...original.headers,
        Authorization: `Bearer ${newToken}`,
      };
      return api(original);
    } catch (refreshError) {
      processQueue(refreshError, null);
      await AsyncStorage.multiRemove([
        ASYNC_STORAGE_KEYS.AUTH_TOKEN,
        ASYNC_STORAGE_KEYS.REFRESH_TOKEN,
        ASYNC_STORAGE_KEYS.USER_DATA,
      ]);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
