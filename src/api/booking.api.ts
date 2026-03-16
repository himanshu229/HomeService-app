import api from './axios';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse, Booking, BookingDraft } from '../types';

export interface SubmitReviewPayload {
  bookingId:    string;
  technicianId: string;
  rating:       number;
  comment?:     string;
  tags?:        string[];
}

export const bookingApi = {
  create: (data: BookingDraft) =>
    api.post<ApiResponse<Booking>>(ENDPOINTS.BOOKINGS.BASE, data),

  getAll: () =>
    api.get<ApiResponse<Booking[]>>(ENDPOINTS.BOOKINGS.BASE),

  getById: (id: string) =>
    api.get<ApiResponse<Booking>>(ENDPOINTS.BOOKINGS.DETAIL(id)),

  cancel: (id: string) =>
    api.post<ApiResponse<Booking>>(ENDPOINTS.BOOKINGS.CANCEL(id)),

  updateStatus: (id: string, status: string) =>
    api.patch<ApiResponse<Booking>>(ENDPOINTS.BOOKINGS.STATUS(id), { status }),

  review: (data: SubmitReviewPayload) =>
    api.post<ApiResponse<null>>(ENDPOINTS.BOOKINGS.REVIEW, data),
};
