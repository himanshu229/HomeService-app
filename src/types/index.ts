// ─── User Types ───────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  addresses: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  label: string; // Home, Work, Other
  fullAddress: string;
  city: string;
  state: string;
  pincode: string;
  lat?: number;
  lng?: number;
  isDefault: boolean;
}

// ─── Auth Types ───────────────────────────────────────────────
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface OtpPayload {
  phone: string;
  otp: string;
}

// ─── Service Types ────────────────────────────────────────────
export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  duration: string;
  description?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  image?: string;
  isPopular?: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  emoji: string;
  color: string;
  bgColor: string;
  services: ServiceItem[];
}

export interface ServicesState {
  categories: ServiceCategory[];
  popularServices: ServiceItem[];
  recentlyBooked: ServiceItem[];
  selectedService: ServiceItem | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  searchResults: ServiceItem[];
}

// ─── Technician Types ─────────────────────────────────────────
export interface Technician {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  experience: string;
  phone: string;
  specializations: string[];
  isAvailable: boolean;
  estimatedArrival?: string;
}

// ─── Booking Types ────────────────────────────────────────────
export interface Booking {
  id: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  technician?: Technician;
  status: BookingStatus;
  scheduledDate: string;
  timeSlot: string;
  address: Address;
  notes?: string;
  price: number;
  finalAmount?: number;
  paymentMethod?: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'technician_assigned'
  | 'on_the_way'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface BookingState {
  bookings: Booking[];
  activeBooking: Booking | null;
  currentBookingDraft: Partial<BookingDraft>;
  isLoading: boolean;
  error: string | null;
}

export interface BookingDraft {
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  price: number;
  scheduledDate: string;
  timeSlot: string;
  address: Address;
  notes: string;
  paymentMethod: string;
}

// ─── Payment Types ────────────────────────────────────────────
export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface PaymentState {
  methods: PaymentMethod[];
  selectedMethod: string | null;
  walletBalance: number;
  isProcessing: boolean;
  error: string | null;
}

// ─── Review Types ─────────────────────────────────────────────
export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  bookingId: string;
  technicianId: string;
  serviceId: string;
  rating: number;
  comment: string;
  photos?: string[];
  createdAt: string;
}

// ─── Navigation Types ─────────────────────────────────────────
export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  OtpVerification: { phone: string; email: string; mode: 'signup' | 'forgot' };
  ForgotPassword: undefined;
  ResetPassword: { token: string };
};

export type MainTabParamList = {
  Home: undefined;
  Services: undefined;
  Bookings: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  ServiceCategories: undefined;
  ServiceList: { categoryId: string; categoryName: string };
  ServiceDetail: { serviceId: string; service: ServiceItem };
  Booking: { service: ServiceItem };
  BookingConfirmation: { bookingId: string };
  BookingTracking: { bookingId: string };
  PaymentScreen: { bookingDraft: BookingDraft };
  Review: { bookingId: string; technicianId: string };
  AddressManager: undefined;
  EditProfile: undefined;
};

export type RootStackParamList = AuthStackParamList & HomeStackParamList & MainTabParamList;

// ─── API Types ────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
