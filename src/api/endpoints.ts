// Centralised API endpoint constants for the mobile app.
// Use function overloads for parameterised paths so callers never
// hand-craft URL strings in components or slices.

export const ENDPOINTS = {
  AUTH: {
    SEND_OTP:         '/auth/send-otp',
    VERIFY_OTP:       '/auth/verify-otp',
    COMPLETE_PROFILE: '/auth/complete-profile',
    REFRESH:          '/auth/refresh',
    LOGOUT:           '/auth/logout',
    PROFILE:          '/auth/profile',
  },

  SERVICES: {
    CATEGORIES:  '/services/categories',
    POPULAR:     '/services/popular',
    SEARCH:      '/services/search',
    BY_CATEGORY: (id: string) => `/services/category/${id}`,
    DETAIL:      (id: string) => `/services/${id}`,
  },

  BOOKINGS: {
    BASE:   '/bookings',
    DETAIL: (id: string) => `/bookings/${id}`,
    CANCEL: (id: string) => `/bookings/${id}/cancel`,
    STATUS: (id: string) => `/bookings/${id}/status`,
    REVIEW: '/bookings/review',
  },

  ADDRESSES: {
    BASE:    '/addresses',
    DETAIL:  (id: string) => `/addresses/${id}`,
    DEFAULT: (id: string) => `/addresses/${id}/default`,
  },
} as const;
