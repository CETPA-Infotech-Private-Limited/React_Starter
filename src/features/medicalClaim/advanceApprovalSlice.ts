import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/services/axiosInstance';

export interface AdvanceApprovalPayload {
  AdvanceId: number;
  SenderId: number;
  ClaimTypeId: number;
  ReferenceDate: string;
  SapRefNumber: string;
  AmountPaid: number;
  Comment?: string;
  StatusId: number;
}

export interface AdvanceApprovalByHRPayload {
  AdvanceId: number;
  SenderId: string;
  RecipientId: number;
  ClaimTypeId: number;
  StatusId: number;
  ApprovalAmount?: string;
}

export const submitAdvanceApprovalByFinance = createAsyncThunk(
  'advanceApproval/submitFinance',
  async (payload: AdvanceApprovalPayload, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('AdvanceId', payload.AdvanceId.toString());
      formData.append('SenderId', payload.SenderId.toString());
      formData.append('ClaimTypeId', payload.ClaimTypeId.toString());
      formData.append('ReferenceDate', payload.ReferenceDate);
      formData.append('SapRefNumber', payload.SapRefNumber);
      formData.append('AmountPaid', payload.AmountPaid.toString());
      formData.append('StatusId', payload.StatusId.toString());
      formData.append('Comment', payload.Comment ?? '');

      const response = await axiosInstance.post('/Claim/submitClaimORAdvanceBYFinance', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

      return response.data;
    } catch (error: any) {
      console.log('error', error);
      return rejectWithValue(error.response?.data?.message || 'Finance submission failed');
    }
  }
);

export const submitAdvanceApprovalByHR = createAsyncThunk('advanceApproval/submitHR', async (payload: AdvanceApprovalByHRPayload, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append('AdvanceId', payload.AdvanceId.toString());
    formData.append('SenderId', payload.SenderId.toString());
    formData.append('RecipientId', payload.RecipientId.toString());
    formData.append('ClaimTypeId', payload.ClaimTypeId.toString());
    formData.append('StatusId', payload.StatusId.toString());
    formData.append('ApprovalAmount', payload.ApprovalAmount);

    const response = await axiosInstance.post('/Claim/SubmitAdvanceProcessDetails', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'HR submission failed');
  }
});

interface ApiStatus {
  loading: boolean;
  success: boolean;
  error: string | null;
}

interface AdvanceApprovalState {
  finance: ApiStatus;
  hr: ApiStatus;
}

const initialState: AdvanceApprovalState = {
  finance: {
    loading: false,
    success: false,
    error: null,
  },
  hr: {
    loading: false,
    success: false,
    error: null,
  },
};

const advanceApprovalSlice = createSlice({
  name: 'advanceApproval',
  initialState,
  reducers: {
    resetFinanceStatus: (state) => {
      state.finance = { loading: false, success: false, error: null };
    },
    resetHRStatus: (state) => {
      state.hr = { loading: false, success: false, error: null };
    },
    resetAdvanceApprovalState: (state) => {
      state.finance = { loading: false, success: false, error: null };
      state.hr = { loading: false, success: false, error: null };
    },
  },
  extraReducers: (builder) => {
    // Finance
    builder
      .addCase(submitAdvanceApprovalByFinance.pending, (state) => {
        state.finance.loading = true;
        state.finance.success = false;
        state.finance.error = null;
      })
      .addCase(submitAdvanceApprovalByFinance.fulfilled, (state) => {
        state.finance.loading = false;
        state.finance.success = true;
      })
      .addCase(submitAdvanceApprovalByFinance.rejected, (state, action) => {
        state.finance.loading = false;
        state.finance.error = action.payload as string;
      });

    // HR
    builder
      .addCase(submitAdvanceApprovalByHR.pending, (state) => {
        state.hr.loading = true;
        state.hr.success = false;
        state.hr.error = null;
      })
      .addCase(submitAdvanceApprovalByHR.fulfilled, (state) => {
        state.hr.loading = false;
        state.hr.success = true;
      })
      .addCase(submitAdvanceApprovalByHR.rejected, (state, action) => {
        state.hr.loading = false;
        state.hr.error = action.payload as string;
      });
  },
});

export const { resetFinanceStatus, resetHRStatus, resetAdvanceApprovalState } = advanceApprovalSlice.actions;

export default advanceApprovalSlice.reducer;
