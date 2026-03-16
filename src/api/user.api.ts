import api from './axios';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse, Address } from '../types';

export interface AddressPayload {
  label:      string;
  street:     string;
  city:       string;
  state:      string;
  pincode:    string;
  latitude?:  number;
  longitude?: number;
  isDefault?: boolean;
}

export const userApi = {
  getAddresses: () =>
    api.get<ApiResponse<Address[]>>(ENDPOINTS.ADDRESSES.BASE),

  addAddress: (data: AddressPayload) =>
    api.post<ApiResponse<Address>>(ENDPOINTS.ADDRESSES.BASE, data),

  updateAddress: (id: string, data: Partial<AddressPayload>) =>
    api.put<ApiResponse<Address>>(ENDPOINTS.ADDRESSES.DETAIL(id), data),

  deleteAddress: (id: string) =>
    api.delete<ApiResponse<null>>(ENDPOINTS.ADDRESSES.DETAIL(id)),

  setDefaultAddress: (id: string) =>
    api.patch<ApiResponse<Address>>(ENDPOINTS.ADDRESSES.DEFAULT(id)),
};
