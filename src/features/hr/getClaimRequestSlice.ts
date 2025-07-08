import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/services/axiosInstance";

// ---------------- Interfaces ---------------- //

export interface GetClaimState {
  loading: boolean;
  error: string | null;
  success: boolean;
  data: DirectClaim[] | null;       // For list view
  claimDetail: DirectClaim | null;  // For single claim view
}

export interface DirectClaim {
  directClaimId: number;
  empId: number;
  claimId: number;
  patientId: number;
  advanceAmount: number;
  cliamAmount: number;
  requestDate: string;
  approvedAmount: number;
  approvedDate: string | null;
}

export interface GetClaimState {
  loading: boolean;
  error: string | null;
  success: boolean;
  data: DirectClaim[] | null;
}

// ---------------- Initial State ---------------- //

const initialState: GetClaimState = {
  loading: false,
  error: null,
  success: false,
  data: null,
  claimDetail: null, // 👈 Added
};


// ---------------- Async Thunk ---------------- //

export const getClaimHr = createAsyncThunk<
  DirectClaim[],             // Return type
  GetClaimParams,            // Parameter type
  { rejectValue: string }    // Rejection payload type
>(
  'claim/getClaimHr',
  async ({ recipientId, pageId, empId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/Claim/GetClaimRequest/${recipientId}/${pageId}`, {
        params: empId ? { empId } : {},
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching claims:', error);
      return rejectWithValue('Failed to fetch claims in HR');
    }
  }
);

export const getClaimDataHr = createAsyncThunk<
  DirectClaim, // 👈 return type
  { advanceid: number }, // 👈 argument
  { rejectValue: string }
>(
  "claims/details",
  async ({ advanceid }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/Claim/GetClaimDetails/${advanceid}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching claims:', error);
      return rejectWithValue('Failed to fetch claims details in HR');
    }
  }
);


// ---------------- Slice ---------------- //

const claimSliceHr = createSlice({
  name: 'claimHr',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getClaimHr.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getClaimHr.fulfilled, (state, action: PayloadAction<DirectClaim[]>) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
      })
      .addCase(getClaimHr.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error';
        state.success = false;
      })
      .addCase(getClaimDataHr.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getClaimDataHr.fulfilled, (state, action: PayloadAction<DirectClaim>) => {
  state.loading = false;
  state.success = true;
  state.claimDetail = action.payload; 
})

      .addCase(getClaimDataHr.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error';
        state.success = false;
      });
  },
});

// ---------------- Exports ---------------- //

export default claimSliceHr.reducer;
