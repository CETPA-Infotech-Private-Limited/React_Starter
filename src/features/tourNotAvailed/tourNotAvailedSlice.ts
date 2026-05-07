// src/features/tour/tourNotAvailedSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/services/axiosInstance";
import toast from "react-hot-toast";
import type { RootState } from "@/app/store";

// -------------------- Types --------------------
type Id = string | number;

interface TourNotAvailedResponse {
  statusCode?: number;
  message?: string;
  [k: string]: any;
}

interface OwnArrangementResponse {
  amount?: number;
  [k: string]: any;
}

interface TourNotAvailedState {
  // Not Availed
  loading: boolean;
  error: string | null;
  data: TourNotAvailedResponse | null;

  // Own Arrangement
  ownArrangementLoading: boolean;
  ownArrangementError: string | null;
  ownArrangement: OwnArrangementResponse | null;
}

interface NotAvailedArgs {
  tourId: Id;
  recipientId: Id;
}

// -------------------- Thunks --------------------
export const tourNotAvailed = createAsyncThunk<
  TourNotAvailedResponse,
  NotAvailedArgs,
  { rejectValue: { message: string } }
>("tour/notAvailed", async ({ tourId, recipientId }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post(
      `/TourNotAvailed/${tourId}/${recipientId}`
    );
    toast.success("Request has been submitted successfully");
    return res.data;
  } catch (err: any) {
    if (err?.response) {
      const msg = err.response?.data?.message || "Server error occurred!";
      toast.error(msg);
      return rejectWithValue({ message: msg });
    }
    if (err?.request) {
      const msg = "No response from server. Please check your connection.";
      toast.error(msg);
      return rejectWithValue({ message: msg });
    }
    const msg = err?.message || "Unknown error";
    toast.error("Something went wrong!");
    return rejectWithValue({ message: msg });
  }
});

export const getOwnArrangementAmount = createAsyncThunk<
  OwnArrangementResponse,
  void,
  { rejectValue: { message: string } }
>("user/getOwnArrangement", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(
      "/TourPlan/GetOwnArrangmentAmount"
    );
    return response.data;
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to fetch own arrangement amount";
    return rejectWithValue({ message: msg });
  }
});

// -------------------- Initial State --------------------
const initialState: TourNotAvailedState = {
  // Not Availed
  loading: false,
  error: null,
  data: null,

  // Own Arrangement
  ownArrangementLoading: false,
  ownArrangementError: null,
  ownArrangement: null,
};

// -------------------- Slice --------------------
const tourNotAvailedSlice = createSlice({
  name: "tourNotAvailed",
  initialState,
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.error = null;
      state.data = null;
      state.ownArrangementLoading = false;
      state.ownArrangementError = null;
      state.ownArrangement = null;
    },
  },
  extraReducers: (builder) => {
    // ---- tourNotAvailed
    builder
      .addCase(tourNotAvailed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        tourNotAvailed.fulfilled,
        (state, action: PayloadAction<TourNotAvailedResponse>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(tourNotAvailed.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as any)?.message ||
          action.error?.message ||
          "Failed to submit";
      });

    // ---- getOwnArrangementAmount
    builder
      .addCase(getOwnArrangementAmount.pending, (state) => {
        state.ownArrangementLoading = true;
        state.ownArrangementError = null;
      })
      .addCase(
        getOwnArrangementAmount.fulfilled,
        (state, action: PayloadAction<OwnArrangementResponse>) => {
          state.ownArrangementLoading = false;
          state.ownArrangement = action.payload;
        }
      )
      .addCase(getOwnArrangementAmount.rejected, (state, action) => {
        state.ownArrangementLoading = false;
        state.ownArrangementError =
          (action.payload as any)?.message ||
          action.error?.message ||
          "Failed to fetch";
      });
  },
});

export const { resetState } = tourNotAvailedSlice.actions;
export default tourNotAvailedSlice.reducer;


