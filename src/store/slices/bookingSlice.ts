import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Booking, BookingDraft, BookingState } from '../../types';
import { bookingApi } from '../../api/booking.api';

const initialState: BookingState = {
  bookings: [],
  activeBooking: null,
  currentBookingDraft: {},
  isLoading: false,
  error: null,
};

export const createBooking = createAsyncThunk(
  'booking/create',
  async (draft: BookingDraft, { rejectWithValue }) => {
    try {
      const res = await bookingApi.create(draft);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Booking failed');
    }
  }
);

export const fetchUserBookings = createAsyncThunk(
  'booking/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await bookingApi.getAll();
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch bookings');
    }
  }
);

export const fetchBookingById = createAsyncThunk(
  'booking/fetchOne',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await bookingApi.getById(id);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Booking not found');
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'booking/cancel',
  async (id: string, { rejectWithValue }) => {
    try {
      await bookingApi.cancel(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Cannot cancel booking');
    }
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    updateBookingDraft: (state, action: PayloadAction<Partial<BookingDraft>>) => {
      state.currentBookingDraft = { ...state.currentBookingDraft, ...action.payload };
    },
    clearBookingDraft: state => {
      state.currentBookingDraft = {};
    },
    setActiveBooking: (state, action: PayloadAction<Booking | null>) => {
      state.activeBooking = action.payload;
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    // Create booking
    builder
      .addCase(createBooking.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = [action.payload, ...state.bookings];
        state.activeBooking = action.payload;
        state.currentBookingDraft = {};
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    // Fetch all bookings
    builder
      .addCase(fetchUserBookings.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    // Fetch one booking
    builder
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.activeBooking = action.payload;
      });
    // Cancel booking
    builder
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.map(b =>
          b.id === action.payload ? { ...b, status: 'CANCELLED' as const } : b
        );
        if (state.activeBooking?.id === action.payload) {
          state.activeBooking = { ...state.activeBooking, status: 'CANCELLED' };
        }
      });
  },
});

export const { updateBookingDraft, clearBookingDraft, setActiveBooking, clearError } =
  bookingSlice.actions;
export default bookingSlice.reducer;
