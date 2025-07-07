import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/services/axiosInstance';
import toast from 'react-hot-toast';

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

interface ClaimState {
  loading: boolean;
  error: string | null;
  success: boolean;
  data: Claim[] | null;

  // Advance claim submission state
  advanceLoading: boolean;
  advanceSuccess: boolean;
  advanceError: string | null;
}

const initialState: ClaimState = {
  loading: false,
  error: null,
  success: false,
  data: null,

  advanceLoading: false,
  advanceSuccess: false,
  advanceError: null,
};

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

export const submitDirectClaim = createAsyncThunk('claim/submitDirectClaim', async (payload: any, { rejectWithValue }) => {
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

export const getMyClaims = createAsyncThunk('claim/getMyClaims', async (empId: number, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/Claim/GetMyClaims/${empId}`);
    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching claims:', error);
    return rejectWithValue('Failed to fetch claims');
  }
});

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
  },
  extraReducers: (builder) => {
    builder
      // 📦 Direct Claim
      .addCase(submitDirectClaim.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitDirectClaim.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitDirectClaim.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })

      // 📦 Advance Claim
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

      // 📦 Get My Claims
      .addCase(getMyClaims.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyClaims.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getMyClaims.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetClaimState, resetAdvanceClaimState } = claimSlice.actions;
export default claimSlice.reducer;
