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

  advanceTopLoading: boolean;
  advanceTopSuccess: boolean;
  advanceTopError: string | null;
}

const initialState: ClaimState = {
  loading: false,
  error: null,
  success: false,
  data: null,

  advanceLoading: false,
  advanceSuccess: false,
  advanceError: null,

  directLoading: false,
  directSuccess: false,
  directError: null,

  advanceTopLoading: false,
  advanceTopSuccess: false,
  advanceTopError: null,
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

/* The `export const getMyClaims` is a function created using `createAsyncThunk` from Redux Toolkit.
This function is responsible for making an asynchronous API call to fetch claims for a specific
employee based on the `empId` provided as a parameter. */
export const getMyClaims = createAsyncThunk('claim/getMyClaims', async (empId: number, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/Claim/GetMyClaims/${empId}`);
    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching claims:', error);
    return rejectWithValue('Failed to fetch claims');
  }
});

/* The `export const submitAdvanceTopUpClaim` is a function created using `createAsyncThunk` from Redux
Toolkit. This function is responsible for making an asynchronous API call to submit an advance
top-up claim. */
export const submitAdvanceTopUpClaim = createAsyncThunk('claim/submitAdvanceTopUpClaim', async (formData: FormData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/Claim/AdvanceTop', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    toast.success('Advance Top-Up submitted successfully!');
    return response.data;
  } catch (err: any) {
    const message = err.response?.data?.message || err.message || 'Submission failed';
    toast.error(message);
    return rejectWithValue(message);
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
    resetDirectClaimState: (state) => {
      state.directLoading = false;
      state.directSuccess = false;
      state.directError = null;
    },
    //advance top rest
    resetAdvanceTopUpClaimState: (state) => {
      state.advanceTopLoading = false;
      state.advanceTopSuccess = false;
      state.advanceTopError = null;
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

      //Advance Claim Top Up

      .addCase(submitAdvanceTopUpClaim.pending, (state) => {
        state.advanceTopLoading = true;
        state.advanceTopError = null;
        state.advanceTopSuccess = false;
      })
      .addCase(submitAdvanceTopUpClaim.fulfilled, (state) => {
        state.advanceTopLoading = false;
        state.advanceTopSuccess = true;
      })
      .addCase(submitAdvanceTopUpClaim.rejected, (state, action) => {
        state.advanceTopLoading = false;
        state.advanceTopError = action.payload as string;
      })

      // 📦 My Claims
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

export const { resetClaimState, resetAdvanceTopUpClaimState, resetAdvanceClaimState, resetDirectClaimState } = claimSlice.actions;

export default claimSlice.reducer;
