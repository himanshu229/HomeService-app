import api from './api';
import { Booking, BookingDraft } from '../types';
import { MOCK_BOOKINGS } from '../data/mockData';

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
        serviceName: draft.serviceName,
        serviceCategory: draft.serviceCategory,
        status: 'confirmed',
        scheduledDate: draft.scheduledDate,
        timeSlot: draft.timeSlot,
        address: draft.address,
        notes: draft.notes,
        price: draft.price,
        paymentMethod: draft.paymentMethod,
        paymentStatus: draft.paymentMethod === 'cash' ? 'pending' : 'paid',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return newBooking;
    }
  },

  getUserBookings: async (): Promise<Booking[]> => {
    try {
      const res = await api.get('/bookings/my-bookings');
      return res.data.data;
    } catch {
      return MOCK_BOOKINGS;
    }
  },

  getBookingById: async (id: string): Promise<Booking> => {
    try {
      const res = await api.get(`/bookings/${id}`);
      return res.data.data;
    } catch {
      const booking = MOCK_BOOKINGS.find(b => b.id === id);
      if (!booking) throw new Error('Booking not found');
      return booking;
    }
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
