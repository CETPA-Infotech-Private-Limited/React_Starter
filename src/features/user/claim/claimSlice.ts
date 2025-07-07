import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/services/axiosInstance';
import toast from 'react-hot-toast';

// Claim type
interface Claim {
  claimId: number;
  empId: number;
  patientId: number;
  advanceAmount: number;
  claimAmount: number;
  requestDate: string;
  approvedAmount: number | null;
  approvedDate: string | null;
  statusId: number;
  status: string;
  claimTypeName: string;
  claimTypeId: number;
}

// Slice state
interface ClaimState {
  loading: boolean;
  error: string | null;
  success: boolean;
  data: Claim[] | null;

  advanceLoading: boolean;
  advanceSuccess: boolean;
  advanceError: string | null;

  directLoading: boolean;
  directSuccess: boolean;
  directError: string | null;
}

const initialState: ClaimState = {
  loading: false,
  error: null as string | null,
  success: false,
  data: [] as any[], // Always an array for table compatibility
};

// ✅ Submit Advance Claim
export const submitAdvanceClaim = createAsyncThunk('claim/submitAdvanceClaim', async (formData: FormData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/Claim/AdvanceRequest', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    toast.success('Advance claim submitted successfully!');
    return response.data;
  } catch (err: any) {
    const message = err.response?.data?.message || err.message || 'Submission failed';
    toast.error(message);
    return rejectWithValue(message);
  }
});

// ✅ Submit Direct Claim
export const submitDirectClaim = createAsyncThunk('claim/submitDirectClaim', async (payload: FormData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/Claim/DirectClaimRequest', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (response.data.statusCode === 200 || response.data.statusCode === 201) {
      toast.success('Claim submitted successfully!');
    } else {
      toast.error('Failed to submit claim. Please try again.');
    }

    return response.data.data;
  } catch (error: any) {
    toast.error('Error occurred while submitting claim.');
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const getMyClaims = createAsyncThunk(
  'claim/getMyClaims',
  async (empId: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/Claim/GetMyClaims/${empId}`);
      // Defensive: ensure always array
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (Array.isArray(response.data.data)) {
        return response.data.data;
      } else if (response.data.data) {
        return [response.data.data];
      } else {
        return [];
      }
    } catch (error: any) {
      console.error('Error fetching claims:', error);
      return rejectWithValue('Failed to fetch claims');
    }
  }
);



const claimSlice = createSlice({
  name: 'claim',
  initialState,
  reducers: {
    resetClaimState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.data = null;
    },
    resetAdvanceClaimState: (state) => {
      state.advanceLoading = false;
      state.advanceSuccess = false;
      state.advanceError = null;
    },
    resetDirectClaimState: (state) => {
      state.directLoading = false;
      state.directSuccess = false;
      state.directError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🟩 Direct Claim
      .addCase(submitDirectClaim.pending, (state) => {
        state.directLoading = true;
        state.directError = null;
        state.directSuccess = false;
      })
      .addCase(submitDirectClaim.fulfilled, (state) => {
        state.directLoading = false;
        state.directSuccess = true;
      })
      .addCase(submitDirectClaim.rejected, (state, action) => {
        state.directLoading = false;
        state.directError = action.payload as string;
      })

      // 🟦 Advance Claim
      .addCase(submitAdvanceClaim.pending, (state) => {
        state.advanceLoading = true;
        state.advanceError = null;
        state.advanceSuccess = false;
      })
      .addCase(submitAdvanceClaim.fulfilled, (state) => {
        state.advanceLoading = false;
        state.advanceSuccess = true;
      })
      .addCase(submitAdvanceClaim.rejected, (state, action) => {
        state.advanceLoading = false;
        state.advanceError = action.payload as string;
      })

      // 📦 My Claims
      .addCase(getMyClaims.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyClaims.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // If submit returns a single object, push to array, else use as array
        if (Array.isArray(action.payload)) {
          state.data = action.payload;
        } else if (action.payload) {
          state.data = [action.payload];
        } else {
          state.data = [];
        }
      })
      .addCase(getMyClaims.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
        state.success = false;
      })
      
  },
});

export const { resetClaimState, resetAdvanceClaimState, resetDirectClaimState } = claimSlice.actions;

export default claimSlice.reducer;
