import axiosInstance from '@/services/axiosInstance';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface AdvanceApprovalPayload {
  AdvanceId?: number;
  SenderId?: number;
  ClaimTypeId?: number;
  ReferenceDate: string;
  SapRefNumber?: string;
  AmountPaid?: number;
  Comment?: string;
  StatusId: Number;
  RecipientId?: Number;
  ApprovalAmount?: Number;
}

interface AdvanceApprovalState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: AdvanceApprovalState = {
  loading: false,
  success: false,
  error: null,
};

export const submitAdvanceApproval = createAsyncThunk('advanceApproval/submit', async (payload: AdvanceApprovalPayload, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append('AdvanceId', parseInt(payload.AdvanceId));
    formData.append('SenderId', parseInt(payload.SenderId));

    formData.append('ClaimTypeId', String(payload.ClaimTypeId));
    formData.append('ReferenceDate', String(payload.ReferenceDate));
    formData.append('SapRefNumber', String(payload.SapRefNumber));
    formData.append('AmountPaid', String(payload.AmountPaid));
    formData.append('StatusId', String(payload.StatusId));

    formData.append('Comment', String(payload.Comment));
    const response = await axiosInstance.post('/Claim/SubmitAdvanceProcessDetails', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Submission failed');
  }
});

// Slice
const advanceApprovalSlice = createSlice({
  name: 'advanceApproval',
  initialState,
  reducers: {
    resetAdvanceApprovalState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitAdvanceApproval.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(submitAdvanceApproval.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitAdvanceApproval.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetAdvanceApprovalState } = advanceApprovalSlice.actions;
export default advanceApprovalSlice.reducer;
