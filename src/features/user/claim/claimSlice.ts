import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/services/axiosInstance';
import toast from 'react-hot-toast';

// ----------------------------
// Types
// ----------------------------
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

  advanceLoading: boolean;
  advanceSuccess: boolean;
  advanceError: string | null;

  directLoading: boolean;
  directSuccess: boolean;
  directError: string | null;

  advanceTopLoading: boolean;
  advanceTopSuccess: boolean;
  advanceTopError: string | null;

  approveAdvanceLoading: boolean;
  approveAdvanceSuccess: boolean;
  approveAdvanceError: string | null;

  advanceSettleLoading: boolean;
  advanceSettleSuccess: boolean;
  advanceSettleError: string | null;
}

// ----------------------------
// Initial State
// ----------------------------
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

  approveAdvanceLoading: false,
  approveAdvanceSuccess: false,
  approveAdvanceError: null,

  advanceSettleLoading: false,
  advanceSettleSuccess: false,
  advanceSettleError: null,
};

// ----------------------------
// Thunks
// ----------------------------

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

export const submitAdvanceClaimSettle = createAsyncThunk('claim/submitAdvanceClaimSettle', async (formData: FormData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/Claim/AdvanceClaimSettle', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (response.data.statusCode === 200 || response.data.statusCode === 201) {
      toast.success('Advance claim settled successfully!');
    } else {
      toast.error('Failed to settle claim. Please try again.');
    }

    return response.data.data;
  } catch (error: any) {
    const res = error.response?.data;

    if (res?.errors) {
      // Flatten the errors into a string
      const messages = Object.entries(res.errors)
        .map(([field, errs]: [string, string[]]) => `${field}: ${errs.join(', ')}`)
        .join(' | ');

      toast.error('Validation error occurred.');
      return rejectWithValue(messages);
    }

    const message = res?.message || error.message || 'Submission failed';
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const submitDirectClaim = createAsyncThunk('claim/submitDirectClaim', async (payload: FormData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/Claim/DirectClaimRequest', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (response.data.statusCode === 200 || response.data.statusCode === 201) {
      toast.success('Direct claim submitted successfully!');
    } else {
      toast.error('Failed to submit claim. Please try again.');
    }

    return response.data.data;
  } catch (error: any) {
    toast.error('Error occurred while submitting claim.');
    return rejectWithValue(error.response?.data || error.message);
  }
});

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

export const approveAdvanceClaim = createAsyncThunk('claim/approveAdvanceClaim', async (advanceId: number, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/Claim/ApproveAdvance/${advanceId}`);
    toast.success('Advance claim approved successfully!');
    return response.data;
  } catch (err: any) {
    const message = err.response?.data?.message || err.message || 'Approval failed';
    toast.error(message);
    return rejectWithValue(message);
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

// ----------------------------
// Slice
// ----------------------------
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
    resetAdvanceTopUpClaimState: (state) => {
      state.advanceTopLoading = false;
      state.advanceTopSuccess = false;
      state.advanceTopError = null;
    },
    resetApproveAdvanceState: (state) => {
      state.approveAdvanceLoading = false;
      state.approveAdvanceSuccess = false;
      state.approveAdvanceError = null;
    },
    resetAdvanceClaimSettleState: (state) => {
      state.advanceSettleLoading = false;
      state.advanceSettleSuccess = false;
      state.advanceSettleError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 📦 Get Claims
      .addCase(getMyClaims.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyClaims.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = Array.isArray(action.payload) ? action.payload : [action.payload];
      })
      .addCase(getMyClaims.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      })

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

      // 🟨 Advance Top-Up
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

      // ✅ Approve Advance
      .addCase(approveAdvanceClaim.pending, (state) => {
        state.approveAdvanceLoading = true;
        state.approveAdvanceError = null;
        state.approveAdvanceSuccess = false;
      })
      .addCase(approveAdvanceClaim.fulfilled, (state) => {
        state.approveAdvanceLoading = false;
        state.approveAdvanceSuccess = true;
      })
      .addCase(approveAdvanceClaim.rejected, (state, action) => {
        state.approveAdvanceLoading = false;
        state.approveAdvanceError = action.payload as string;
      })

      // 🟧 Advance Claim Settle
      .addCase(submitAdvanceClaimSettle.pending, (state) => {
        state.advanceSettleLoading = true;
        state.advanceSettleError = null;
        state.advanceSettleSuccess = false;
      })
      .addCase(submitAdvanceClaimSettle.fulfilled, (state) => {
        state.advanceSettleLoading = false;
        state.advanceSettleSuccess = true;
      })
      .addCase(submitAdvanceClaimSettle.rejected, (state, action) => {
        state.advanceSettleLoading = false;
        state.advanceSettleError = action.payload as string;
      });
  },
});

// ----------------------------
export const {
  resetClaimState,
  resetAdvanceClaimState,
  resetDirectClaimState,
  resetAdvanceTopUpClaimState,
  resetApproveAdvanceState,
  resetAdvanceClaimSettleState,
} = claimSlice.actions;

export default claimSlice.reducer;
