import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  createBooking,
  fetchUserBookings,
  fetchBookingById,
  cancelBooking,
  updateBookingDraft,
  clearBookingDraft,
  setActiveBooking,
  clearError,
} from '../store/slices/bookingSlice';
import type { Booking, BookingDraft } from '../types';

export const useBooking = () => {
  const dispatch = useAppDispatch();
  const { bookings, activeBooking, currentBookingDraft, isLoading, error } =
    useAppSelector((s) => s.booking);

  return {
    bookings,
    activeBooking,
    currentBookingDraft,
    isLoading,
    error,
    createBooking:  (draft: BookingDraft)          => dispatch(createBooking(draft)),
    fetchAll:       ()                             => dispatch(fetchUserBookings()),
    fetchById:      (id: string)                   => dispatch(fetchBookingById(id)),
    cancel:         (id: string)                   => dispatch(cancelBooking(id)),
    updateDraft:    (data: Partial<BookingDraft>)  => dispatch(updateBookingDraft(data)),
    clearDraft:     ()                             => dispatch(clearBookingDraft()),
    setActive:      (b: Booking | null)            => dispatch(setActiveBooking(b)),
    clearError:     ()                             => dispatch(clearError()),
  };
};
