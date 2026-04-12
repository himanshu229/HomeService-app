import api from './api';
import { Booking, BookingDraft } from '../types';

export const bookingAPI = {
  createBooking: async (draft: BookingDraft): Promise<Booking> => {
    try {
      const res = await api.post('/bookings', draft);
      return res.data.data;
    } catch {
      // Mock fallback for development
      const newBooking: Booking = {
        id: `book_${Date.now()}`,
        userId: 'user_001',
        serviceId: draft.serviceId,
        status: 'CONFIRMED',
        scheduledDate: draft.scheduledDate,
        scheduledSlot: draft.scheduledSlot,
        addressId: draft.addressId,
        notes: draft.notes,
        totalAmount: draft.totalAmount,
        paymentMethod: draft.paymentMethod,
        paymentStatus: draft.paymentMethod === 'CASH' ? 'PENDING' : 'PAID',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return newBooking;
    }
  },

  getUserBookings: async (): Promise<Booking[]> => {
    const res = await api.get('/bookings/my-bookings');
    return res.data.data;
  },

  getBookingById: async (id: string): Promise<Booking> => {
    const res = await api.get(`/bookings/${id}`);
    return res.data.data;
  },

  cancelBooking: async (id: string): Promise<void> => {
    const res = await api.patch(`/bookings/${id}/cancel`);
    return res.data.data;
  },

  rateBooking: async (
    bookingId: string,
    data: { rating: number; comment: string; photos?: string[] }
  ): Promise<void> => {
    const res = await api.post(`/bookings/${bookingId}/review`, data);
    return res.data.data;
  },
};

export const serviceAPI = {
  getCategories: async () => {
    const res = await api.get('/services/categories');
    return res.data.data;
  },

  getServicesByCategory: async (categoryId: string) => {
    const res = await api.get(`/services/category/${categoryId}`);
    return res.data.data;
  },

  getServiceById: async (serviceId: string) => {
    const res = await api.get(`/services/${serviceId}`);
    return res.data.data;
  },

  searchServices: async (query: string) => {
    const res = await api.get('/services/search', { params: { q: query } });
    return res.data.data;
  },

  getPopularServices: async () => {
    const res = await api.get('/services/popular');
    return res.data.data;
  },
};
