import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ServiceItem, ServicesState } from '../../types';
import { SERVICE_CATEGORIES } from '../../utils/constants';
import { MOCK_POPULAR_SERVICES } from '../../data/mockData';

const initialState: ServicesState = {
  categories: SERVICE_CATEGORIES as any[],
  popularServices: MOCK_POPULAR_SERVICES,
  recentlyBooked: [],
  selectedService: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  searchResults: [],
};

export const fetchCategories = createAsyncThunk(
  'services/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      // In production, replace with real API call
      return SERVICE_CATEGORIES;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const fetchServicesByCategory = createAsyncThunk(
  'services/fetchByCategory',
  async (categoryId: string, { rejectWithValue }) => {
    try {
      const category = SERVICE_CATEGORIES.find(c => c.id === categoryId);
      return category?.services || [];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch services');
    }
  }
);

export const searchServices = createAsyncThunk(
  'services/search',
  async (query: string, { rejectWithValue }) => {
    try {
      const allServices = SERVICE_CATEGORIES.flatMap(cat =>
        cat.services.map(s => ({ ...s, category: cat.name }))
      );
      const q = query.toLowerCase();
      return allServices.filter(
        s =>
          s.name.toLowerCase().includes(q) ||
          (s.category || '').toLowerCase().includes(q)
      ) as ServiceItem[];
    } catch (err: any) {
      return rejectWithValue('Search failed');
    }
  }
);

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setSelectedService: (state, action: PayloadAction<ServiceItem | null>) => {
      state.selectedService = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      if (!action.payload) {
        state.searchResults = [];
      }
    },
    addToRecentlyBooked: (state, action: PayloadAction<ServiceItem>) => {
      const exists = state.recentlyBooked.find(s => s.id === action.payload.id);
      if (!exists) {
        state.recentlyBooked = [action.payload, ...state.recentlyBooked.slice(0, 4)];
      }
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCategories.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload as any[];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(searchServices.pending, state => {
        state.isLoading = true;
      })
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
