import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Technician } from '../../types';

interface TechnicianState {
  technicians:         Technician[];
  selectedTechnician:  Technician | null;
  isLoading:           boolean;
  error:               string | null;
}

const initialState: TechnicianState = {
  technicians:        [],
  selectedTechnician: null,
  isLoading:          false,
  error:              null,
};

// Technician data arrives embedded inside Booking objects.
// This slice caches technician records seen across the session
// so screens can look up technician details without extra requests.
const technicianSlice = createSlice({
  name: 'technician',
  initialState,
  reducers: {
    setTechnicians(state, action: PayloadAction<Technician[]>) {
      state.technicians = action.payload;
    },
    upsertTechnician(state, action: PayloadAction<Technician>) {
      const idx = state.technicians.findIndex(
        (t) => t.id === action.payload.id
      );
      if (idx !== -1) state.technicians[idx] = action.payload;
      else state.technicians.push(action.payload);
    },
    setSelectedTechnician(state, action: PayloadAction<Technician | null>) {
      state.selectedTechnician = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const {
  setTechnicians,
  upsertTechnician,
  setSelectedTechnician,
  clearError,
} = technicianSlice.actions;

export default technicianSlice.reducer;
