// features/tourRequest/tourRequestSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '@/services/axiosInstance';

interface TourRequest {
  tourId: number;
  empId: number;
  tourType: string;
  empName: string | null;
  designation: string | null;
  requestDate: string;
  purposeofTour: string;
  tourStartDate: string;
  source: string;
  destination: string;
  totalDays: number;
  status: string;
  statusId: number;
  oldApprovalPDFPath: string;
  sendBackToRemark: string;
}

interface TourRequestState {
  loading: boolean;
  error: string | null;
  data: any | null;
  recipientTours: {
    loading: boolean;
    error: string | null;
    data: TourRequest[] | null;
  };
}

const initialState: TourRequestState = {
  loading: false,
  error: null,
  data: null,
  recipientTours: {
    loading: false,
    error: null,
    data: null,
  },
};



// Async thunk for GET recipient tour requests
export const fetchTourRequests = createAsyncThunk(
  'tourRequest/fetchTourRequests',
  async (empId: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/TourListing/GetTourRequest/${empId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const tourRequest = createSlice({
  name: 'tourRequest',
  initialState,
  reducers: {
    resetTourRequestState: (state) => {
      state.loading = false;
      state.error = null;
      state.data = null;
    },
    resetRecipientToursState: (state) => {
      state.recipientTours.loading = false;
      state.recipientTours.error = null;
      state.recipientTours.data = null;
    },
    clearRecipientToursError: (state) => {
      state.recipientTours.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
     
      // Fetch Recipient Tour Requests cases
      .addCase(fetchTourRequests.pending, (state) => {
        state.recipientTours.loading = true;
        state.recipientTours.error = null;
      })
      .addCase(fetchTourRequests.fulfilled, (state, action: PayloadAction<any>) => {
        state.recipientTours.loading = false;
        state.recipientTours.data = action.payload.data;
      })
      .addCase(fetchTourRequests.rejected, (state, action: PayloadAction<any>) => {
        state.recipientTours.loading = false;
        state.recipientTours.error = action.payload;
      });
  },
});

export const { 
  resetTourRequestState, 
  resetRecipientToursState, 
  clearRecipientToursError 
} = tourRequest.actions;

export default tourRequest.reducer;