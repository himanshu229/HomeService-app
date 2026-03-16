import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchCategories,
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
    selectedService,
    isLoading,
    error,
    searchQuery,
    searchResults,
  } = useAppSelector((s) => s.services);

  return {
    categories,
    popularServices,
    selectedService,
    isLoading,
    error,
    searchQuery,
    searchResults,
    loadCategories:  ()                       => dispatch(fetchCategories()),
    loadByCategory:  (categoryId: string)     => dispatch(fetchServicesByCategory(categoryId)),
    search:          (query: string)          => dispatch(searchServices(query)),
    selectService:   (s: ServiceItem | null)  => dispatch(setSelectedService(s)),
    setQuery:        (q: string)              => dispatch(setSearchQuery(q)),
    clearError:      ()                       => dispatch(clearError()),
  };
};
