import axiosInstance from '@/services/axiosInstance';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface AdvanceProcessPayload {
  AdvanceId: number;
  SenderId: number;
  RecipientId: number;
  ClaimTypeId: number;
  StatusId: number;
  SapReferenceDate?: string | null; // ISO date string
  SapRefNumber?: string | null;
  TransactionDate?: string | null; // ISO date string
  UTRNo?: string | null;
}

// Define state shape
interface AdvanceProcessState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

// Initial state
const initialState: AdvanceProcessState = {
  loading: false,
  success: false,
  error: null,
};

// Async thunk to submit form data
export const submitAdvanceProcess = createAsyncThunk('advanceProcess/submit', async (payload: AdvanceProcessPayload, { rejectWithValue }) => {
  try {
    const formData = new FormData();

    formData.append('AdvanceId', String(payload.AdvanceId));
    formData.append('SenderId', String(payload.SenderId));
    formData.append('RecipientId', String(payload.RecipientId));
    formData.append('ClaimTypeId', String(payload.ClaimTypeId));
    formData.append('StatusId', String(payload.StatusId));

    if (payload.SapReferenceDate) {
      formData.append('SapReferenceDate', payload.SapReferenceDate);
    }

    if (payload.SapRefNumber) {
      formData.append('SapRefNumber', payload.SapRefNumber);
    }

    if (payload.TransactionDate) {
      formData.append('TransactionDate', payload.TransactionDate);
    }

    if (payload.UTRNo) {
      formData.append('UTRNo', payload.UTRNo);
    }

    const response = await axiosInstance.post('/Claim/SubmitClaimProcessByFinance', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Submission failed');
  }
});

const approveClaimByFinanceSlice = createSlice({
  name: 'advanceProcess',
  initialState,
  reducers: {
    resetAdvanceProcessState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitAdvanceProcess.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(submitAdvanceProcess.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitAdvanceProcess.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetAdvanceProcessState } = approveClaimByFinanceSlice.actions;
export default approveClaimByFinanceSlice.reducer;
