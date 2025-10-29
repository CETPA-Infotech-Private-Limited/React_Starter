// src/features/raiseClaim/getRaiseClaimSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/services/axiosInstance";
import type { RootState } from "@/app/store";
import axios from "axios";

/* =========================
   Types
   ========================= */

export type TourId = number | string;

// If you know the exact API shape, replace `unknown` with a proper interface.
export interface RaiseClaimPayload {
  // Example fields (optional) — replace with your real API response fields:
  // tourId: number;
  // employeeName: string;
  // startDate: string;
  // endDate: string;
  // status: string;
  // ...
  [key: string]: unknown;
}

export interface APIError {
  message: string;
  status?: number;
  details?: unknown;
}

export interface RaiseClaimState {
  data: RaiseClaimPayload | null;
  loading: boolean;
  error: string | null;
  lastFetchedAt: string | null; // ISO string, helpful for caching/UI
}



export const getRaiseClaimData = createAsyncThunk<
  RaiseClaimPayload,        // Return type on success
  TourId,                   // Thunk arg type
  { rejectValue: APIError } // rejectWithValue type
>(
  "RaiseClaim/GetRaiseClaimData",
  async (tourId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/Claim/RaiseClaimRequest/${tourId}`);
      return response.data as RaiseClaimPayload;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue({
          message: err.message || "Request failed",
          status: err.response?.status,
          details: err.response?.data,
        });
      }
      return rejectWithValue({
        message: (err as Error)?.message ?? "Unknown error",
      });
    }
  }
);


const initialState: RaiseClaimState = {
  data: null,
  loading: false,
  error: null,
  lastFetchedAt: null,
};


const getRaiseClaimSlice = createSlice({
  name: "raiseClaim",
  initialState,
  reducers: {
    clearRaiseClaim(state) {
      state.data = null;
      state.error = null;
      state.lastFetchedAt = null;
    },
    clearRaiseClaimError(state) {
      state.error = null;
    },
    // Optional: directly set data (e.g., from cache/preload)
    setRaiseClaimData(state, action: PayloadAction<RaiseClaimPayload | null>) {
      state.data = action.payload;
      state.error = null;
      state.lastFetchedAt = action.payload ? new Date().toISOString() : null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRaiseClaimData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRaiseClaimData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastFetchedAt = new Date().toISOString();
      })
      .addCase(getRaiseClaimData.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ??
          action.error.message ??
          "Failed to load raise claim data";
      });
  },
});


export const {
  clearRaiseClaim,
  clearRaiseClaimError,
  setRaiseClaimData,
} = getRaiseClaimSlice.actions;

export default getRaiseClaimSlice.reducer;
