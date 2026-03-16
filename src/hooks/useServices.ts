import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchCategories,
  fetchPopularServices,
  fetchServicesByCategory,
  searchServices,
  setSelectedService,
  setSearchQuery,
  clearError,
} from '../store/slices/servicesSlice';
import type { ServiceItem } from '../types';

export const useServices = () => {
  const dispatch = useAppDispatch();
  const {
    categories,
    popularServices,
    servicesByCategory,
    selectedService,
    isLoading,
    error,
    searchQuery,
    searchResults,
    recentlyBooked,
  } = useAppSelector((s) => s.services);

  return {
    categories,
    popularServices,
    servicesByCategory,
    selectedService,
    isLoading,
    error,
    searchQuery,
    searchResults,
    recentlyBooked,
    loadCategories:  ()                       => dispatch(fetchCategories()),
    loadPopular:     ()                       => dispatch(fetchPopularServices()),
    loadByCategory:  (categoryId: string)     => dispatch(fetchServicesByCategory(categoryId)),
    search:          (query: string)          => dispatch(searchServices(query)),
    selectService:   (s: ServiceItem | null)  => dispatch(setSelectedService(s)),
    setQuery:        (q: string)              => dispatch(setSearchQuery(q)),
    clearError:      ()                       => dispatch(clearError()),
  };
};

