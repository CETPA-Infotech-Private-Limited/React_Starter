// src/features/tour/TourNotAvailedPage.tsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/services/axiosInstance";
import toast from "react-hot-toast";

// -------------------- Types --------------------
type Id = string | number;

interface TourNotAvailedState {
  loading: boolean;
  error: string | null;
  data: any; // <- API response type if you have
}

interface NotAvailedArgs {
  tourId: Id;
  recipientId: Id;
}

// -------------------- Thunk --------------------
export const tourNotAvailed = createAsyncThunk(
  "tour/notAvailed",
  async ({ tourId, recipientId }: NotAvailedArgs, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/TourNotAvailed/${tourId}/${recipientId}`);
      toast.success("Request has been submitted successfully");
      return res.data;
    } catch (err: any) {
      // Detailed error handling
      if (err?.response) {
        const msg = err.response?.data?.message || "Server error occurred!";
        toast.error(msg);
        return rejectWithValue(err.response.data);
      }
      if (err?.request) {
        toast.error("No response from server. Please check your connection.");
        return rejectWithValue({ message: "No response from server" });
      }
      toast.error("Something went wrong!");
      return rejectWithValue({ message: err?.message || "Unknown error" });
    }
  }
);

// -------------------- Slice --------------------
const initialState: TourNotAvailedState = {
  loading: false,
  error: null,
  data: null,
};

const tourNotAvailedSlice = createSlice({
  name: "tourNotAvailed",
  initialState,
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.error = null;
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(tourNotAvailed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(tourNotAvailed.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(tourNotAvailed.rejected, (state, action: any) => {
        state.loading = false;
        state.error =
          action?.payload?.message ||
          action?.error?.message ||
          "Failed to submit";
      });
  },
});

export const { resetState } = tourNotAvailedSlice.actions;
export default tourNotAvailedSlice.reducer;

