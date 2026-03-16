import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ServiceItem, ServiceCategory, ServicesState } from '../../types';
import { serviceApi } from '../../api/service.api';

// ── Data transformers ─────────────────────────────────────────────────────────

const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`;
  const hrs = minutes / 60;
  if (Number.isInteger(hrs)) return `${hrs} hr${hrs > 1 ? 's' : ''}`;
  const lo = Math.floor(hrs);
  return `${lo}-${lo + 1} hrs`;
};

const toServiceItem = (svc: any): ServiceItem => ({
  id:          svc.id,
  name:        svc.name,
  price:       svc.price,
  duration:    typeof svc.duration === 'number' ? formatDuration(svc.duration) : (svc.duration ?? ''),
  description: svc.aboutService || svc.description || '',
  category:    svc.category?.name ?? svc.category,
  rating:      svc.rating,
  reviewCount: svc.reviewCount,
  image:       svc.image,
  isPopular:   svc.popular ?? svc.isPopular,
});

const toServiceCategory = (cat: any): ServiceCategory => ({
  id:           cat.id,
  name:         cat.name,
  icon:         cat.slug ?? cat.icon ?? '',
  emoji:        cat.emoji,
  color:        cat.color,
  bgColor:      cat.bgColor ?? (cat.color + '20'),
  services:     (cat.services ?? []).map(toServiceItem),
  serviceCount: cat._count?.services ?? cat.serviceCount ?? cat.services?.length ?? 0,
});

// ── Initial state ─────────────────────────────────────────────────────────────

const initialState: ServicesState = {
  categories: [],
  popularServices: [],
  servicesByCategory: {},
  recentlyBooked: [],
  selectedService: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  searchResults: [],
};

// ── Async thunks ──────────────────────────────────────────────────────────────

export const fetchCategories = createAsyncThunk(
  'services/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const res = await serviceApi.getCategories();
      return (res.data.data as any[]).map(toServiceCategory);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const fetchPopularServices = createAsyncThunk(
  'services/fetchPopular',
  async (_, { rejectWithValue }) => {
    try {
      const res = await serviceApi.getPopular();
      return (res.data.data as any[]).map(toServiceItem);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch popular services');
    }
  }
);

export const fetchServicesByCategory = createAsyncThunk(
  'services/fetchByCategory',
  async (categoryId: string, { rejectWithValue }) => {
    try {
      const res = await serviceApi.getByCategory(categoryId);
      return { categoryId, services: (res.data.data as any[]).map(toServiceItem) };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch services');
    }
  }
);

export const searchServices = createAsyncThunk(
  'services/search',
  async (query: string, { rejectWithValue }) => {
    try {
      const res = await serviceApi.search(query);
      return (res.data.data as any[]).map(toServiceItem);
    } catch (err: any) {
      return rejectWithValue('Search failed');
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setSelectedService: (state, action: PayloadAction<ServiceItem | null>) => {
      state.selectedService = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      if (!action.payload) state.searchResults = [];
    },
    addToRecentlyBooked: (state, action: PayloadAction<ServiceItem>) => {
      const exists = state.recentlyBooked.find(s => s.id === action.payload.id);
      if (!exists) {
        state.recentlyBooked = [action.payload, ...state.recentlyBooked.slice(0, 4)];
      }
    },
    clearError: state => { state.error = null; },
  },
  extraReducers: builder => {
    // fetchCategories
    builder
      .addCase(fetchCategories.pending, state => { state.isLoading = true; state.error = null; })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // fetchPopularServices
    builder
      .addCase(fetchPopularServices.pending, state => { state.isLoading = true; })
      .addCase(fetchPopularServices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.popularServices = action.payload;
      })
      .addCase(fetchPopularServices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // fetchServicesByCategory
    builder
      .addCase(fetchServicesByCategory.pending, state => { state.isLoading = true; state.error = null; })
      .addCase(fetchServicesByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.servicesByCategory[action.payload.categoryId] = action.payload.services;
      })
      .addCase(fetchServicesByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // searchServices
    builder
      .addCase(searchServices.pending, state => { state.isLoading = true; })
      .addCase(searchServices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchServices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedService, setSearchQuery, addToRecentlyBooked, clearError } =
  servicesSlice.actions;
export default servicesSlice.reducer;
