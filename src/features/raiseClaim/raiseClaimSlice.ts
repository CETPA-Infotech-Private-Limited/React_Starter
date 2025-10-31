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

interface RaiseClaimResponse {
  claimId: number;
  status: string;
  message: string;
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
  claim: {
    loading: boolean;
    error: string | null;
    data: RaiseClaimResponse | null;
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
  claim: {
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

// Async thunk for POST Raise Claim Request
export const raiseClaimRequest = createAsyncThunk(
  'tourRequest/raiseClaimRequest',
  async (formData: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/Claim/RaiseClaimRequest', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Fixed the content type to multipart/form-data
        },
      });
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
    resetClaimState: (state) => {
      state.claim.loading = false;
      state.claim.error = null;
      state.claim.data = null;
    },
    clearRecipientToursError: (state) => {
      state.recipientTours.error = null;
    },
    clearClaimError: (state) => {
      state.claim.error = null;
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
      })
      
      // Raise Claim Request cases
      .addCase(raiseClaimRequest.pending, (state) => {
        state.claim.loading = true;
        state.claim.error = null;
      })
      .addCase(raiseClaimRequest.fulfilled, (state, action: PayloadAction<RaiseClaimResponse>) => {
        state.claim.loading = false;
        state.claim.data = action.payload;
      })
      .addCase(raiseClaimRequest.rejected, (state, action: PayloadAction<any>) => {
        state.claim.loading = false;
        state.claim.error = action.payload;
      });
  },
});

export const { 
  resetTourRequestState, 
  resetRecipientToursState, 
  resetClaimState,
  clearRecipientToursError,
  clearClaimError,
} = tourRequest.actions;

export default tourRequest.reducer;
