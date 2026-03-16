// ─── User Types ───────────────────────────────────────────────
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface User {
  id: string;
  phone: string;          // primary identifier
  firstName: string;
  lastName: string;
  gender: Gender;
  dob: string;
  email?: string;
  isVerified: boolean;
  isActive?: boolean;
  avatar?: string;
  addresses?: Address[];
  createdAt: string;
  updatedAt?: string;
}

export interface Address {
  id: string;
  label: string;          // Home | Work | Other
  street: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Auth Types ───────────────────────────────────────────────
export type OtpType = 'SIGNUP' | 'LOGIN' | 'FORGOT_PASSWORD';

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface SendOtpPayload {
  phone: string;
}

export interface VerifyOtpPayload {
  phone: string;
  otp: string;
}

export interface CompleteProfilePayload {
  phone: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  dob: string;            // ISO date string e.g. '1995-06-15'
  email?: string;
}

export interface VerifyOtpResponse {
  isNewUser: boolean;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: User;
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
  serviceName?: string;
  serviceCategory?: string;
  technician?: Technician;
  status: BookingStatus;
  scheduledDate: string;
  scheduledSlot: string;
  addressId?: string;
  address?: Address;
  notes?: string;
  totalAmount: number;
  paymentMethod: PaymentMethodType;
  paymentStatus: PaymentStatusType;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'TECHNICIAN_ASSIGNED'
  | 'ON_THE_WAY'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentMethodType = 'CASH' | 'UPI' | 'CARD' | 'WALLET';
export type PaymentStatusType = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface BookingState {
  bookings: Booking[];
  activeBooking: Booking | null;
  currentBookingDraft: Partial<BookingDraft>;
  isLoading: boolean;
  error: string | null;
}

export interface BookingDraft {
  serviceId:     string;
  scheduledDate: string;
  scheduledSlot: string;
  addressId:     string;
  paymentMethod: PaymentMethodType;
  totalAmount:   number;
  notes?:        string;
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
  OtpVerification: { phone: string };
  CompleteProfile: { phone: string };
  ForgotPassword: undefined;
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
