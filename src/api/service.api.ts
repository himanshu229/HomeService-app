import api from './axios';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse, ServiceCategory, ServiceItem } from '../types';

export const serviceApi = {
  getCategories: () =>
    api.get<ApiResponse<ServiceCategory[]>>(ENDPOINTS.SERVICES.CATEGORIES),

  getPopular: () =>
    api.get<ApiResponse<ServiceItem[]>>(ENDPOINTS.SERVICES.POPULAR),

  getByCategory: (categoryId: string) =>
    api.get<ApiResponse<ServiceItem[]>>(
      ENDPOINTS.SERVICES.BY_CATEGORY(categoryId)
    ),

  getById: (id: string) =>
    api.get<ApiResponse<ServiceItem>>(ENDPOINTS.SERVICES.DETAIL(id)),

  search: (query: string) =>
    api.get<ApiResponse<ServiceItem[]>>(ENDPOINTS.SERVICES.SEARCH, {
      params: { q: query },
    }),
};
