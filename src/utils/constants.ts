import { APP_NAME as _APP_NAME, APP_TAGLINE as _APP_TAGLINE, API_BASE_URL as _API_BASE_URL } from '@env';
export const APP_NAME: string    = _APP_NAME;
export const APP_TAGLINE: string = _APP_TAGLINE;
export const API_BASE_URL: string = _API_BASE_URL;

export const ASYNC_STORAGE_KEYS = {
  AUTH_TOKEN: '@summerfix_auth_token',
  REFRESH_TOKEN: '@summerfix_refresh_token',
  USER_DATA: '@summerfix_user_data',
  ONBOARDING_DONE: '@summerfix_onboarding',
};

export const SERVICE_CATEGORIES = [
  {
    id: 'ac',
    name: 'AC Services',
    icon: 'air-conditioner',
    emoji: '❄️',
    color: '#1A73E8',
    bgColor: '#E8F4FD',
    services: [
      { id: 'ac_repair', name: 'AC Repair', price: 299, duration: '1-2 hrs' },
      { id: 'ac_install', name: 'AC Installation', price: 499, duration: '2-3 hrs' },
      { id: 'ac_gas', name: 'AC Gas Refill', price: 799, duration: '1 hr' },
      { id: 'ac_clean', name: 'AC Cleaning', price: 199, duration: '45 min' },
      { id: 'ac_shift', name: 'AC Shifting', price: 599, duration: '2-4 hrs' },
    ],
  },
  {
    id: 'fridge',
    name: 'Refrigerator',
    icon: 'fridge',
    emoji: '🧊',
    color: '#00BCD4',
    bgColor: '#E0F7FA',
    services: [
      { id: 'fridge_repair', name: 'Fridge Repair', price: 349, duration: '1-2 hrs' },
      { id: 'fridge_install', name: 'Fridge Installation', price: 299, duration: '1 hr' },
      { id: 'fridge_gas', name: 'Fridge Gas Refill', price: 899, duration: '2 hrs' },
      { id: 'fridge_clean', name: 'Fridge Cleaning', price: 249, duration: '1 hr' },
      { id: 'fridge_shift', name: 'Fridge Shifting', price: 449, duration: '2-3 hrs' },
    ],
  },
  {
    id: 'fan',
    name: 'Fan Services',
    icon: 'fan',
    emoji: '🌀',
    color: '#FF9800',
    bgColor: '#FFF3E0',
    services: [
      { id: 'fan_repair', name: 'Ceiling Fan Repair', price: 149, duration: '30-45 min' },
      { id: 'fan_install', name: 'Fan Installation', price: 199, duration: '30-45 min' },
      { id: 'fan_replace', name: 'Fan Replacement', price: 249, duration: '1 hr' },
    ],
  },
  {
    id: 'other',
    name: 'Other Services',
    icon: 'toolbox',
    emoji: '🔧',
    color: '#9C27B0',
    bgColor: '#F3E5F5',
    services: [
      { id: 'wm_repair', name: 'Washing Machine Repair', price: 399, duration: '1-2 hrs' },
      { id: 'wc_repair', name: 'Water Cooler Repair', price: 299, duration: '1 hr' },
      { id: 'ac_cooler', name: 'Air Cooler Service', price: 249, duration: '1 hr' },
      { id: 'app_clean', name: 'Appliance Cleaning', price: 199, duration: '1 hr' },
      { id: 'app_shift', name: 'Appliance Shifting', price: 349, duration: '1-3 hrs' },
    ],
  },
];

export const TIME_SLOTS = [
  '08:00 AM - 10:00 AM',
  '10:00 AM - 12:00 PM',
  '12:00 PM - 02:00 PM',
  '02:00 PM - 04:00 PM',
  '04:00 PM - 06:00 PM',
  '06:00 PM - 08:00 PM',
];

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  TECHNICIAN_ASSIGNED: 'technician_assigned',
  ON_THE_WAY: 'on_the_way',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const BOOKING_STATUS_STEPS = [
  { key: BOOKING_STATUS.CONFIRMED, label: 'Booking Confirmed', icon: '✅' },
  { key: BOOKING_STATUS.TECHNICIAN_ASSIGNED, label: 'Technician Assigned', icon: '👨‍🔧' },
  { key: BOOKING_STATUS.ON_THE_WAY, label: 'Technician On the Way', icon: '🚗' },
  { key: BOOKING_STATUS.IN_PROGRESS, label: 'Service In Progress', icon: '🔧' },
  { key: BOOKING_STATUS.COMPLETED, label: 'Completed', icon: '🎉' },
];

export const PAYMENT_METHODS = [
  { id: 'upi', name: 'UPI', icon: '📱', description: 'Google Pay, PhonePe, Paytm' },
  { id: 'card', name: 'Card', icon: '💳', description: 'Credit/Debit Card' },
  { id: 'cash', name: 'Cash on Service', icon: '💵', description: 'Pay after service' },
  { id: 'wallet', name: 'Wallet', icon: '👜', description: 'SummerFix Wallet' },
];

import { REGEX } from './common';
export { REGEX };


