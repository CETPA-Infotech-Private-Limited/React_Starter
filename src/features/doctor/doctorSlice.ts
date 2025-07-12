// submitClaimSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '@/services/axiosInstance';
import toast from 'react-hot-toast';

export interface SubmitClaimProcessPayload {
  AdvanceId: number;
  SenderId: number;
  RecipientId: number;
  ClaimTypeId: number;
  StatusId: number;
}

interface SubmitClaimState {
  loading: boolean;
  success: boolean;
  error: string | null;
  claimList: any;
}

const initialState: SubmitClaimState = {
  loading: false,
  success: false,
  error: null,
  claimList: null,
};

// ✅ 1. Submit by HR
export const submitClaimProcessByHr = createAsyncThunk(
  'claim/submitClaimProcessByHr',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/Claim/SubmitClaimProcessByHr', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Submission failed';
      return rejectWithValue(message);
    }
  }
);

// ✅ 2. Submit by Employee
export const submitClaimProcess = createAsyncThunk(
  'claim/submitClaimProcess',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/Claim/SubmitClaimProcess', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Submission failed';
      return rejectWithValue(message);
    }
  }
);

// ✅ 3. Doctor Review Submit
export const postDocReview = createAsyncThunk(
  'claim/docReview',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/DoctorReview/CreateDoctorReview', formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      toast.success('Claim sent successfully!!!');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Submission failed';
      toast.error('Oh! There is something wrong.');
      return rejectWithValue(message);
    }
  }
);

// ✅ 4. Get Doctor's Claim List
export const getDoctorClaimListData = createAsyncThunk(
  'claim/getDoctorClaimListData',
  async (recipientId: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/Claim/GetDoctorsClaimList/${recipientId}`);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch claim list data';
      return rejectWithValue(message);
    }
  }
);

// ✅ Unified Slice
const submitClaimProcessSlice = createSlice({
  name: 'claim',
  initialState,
  reducers: {
    resetSubmitClaimState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.claimList = null;
    },
  },
  extraReducers: (builder) => {
    // handle all four async thunks
    builder
      .addCase(submitClaimProcessByHr.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(submitClaimProcessByHr.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.success = true;
        state.claimList = action.payload;
      })
      .addCase(submitClaimProcessByHr.rejected, (state, action: PayloadAction<unknown>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      })

      .addCase(submitClaimProcess.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(submitClaimProcess.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.success = true;
        state.claimList = action.payload;
      })
      .addCase(submitClaimProcess.rejected, (state, action: PayloadAction<unknown>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      })

      .addCase(postDocReview.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(postDocReview.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.success = true;
        state.claimList = action.payload;
      })
      .addCase(postDocReview.rejected, (state, action: PayloadAction<unknown>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      })

      .addCase(getDoctorClaimListData.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(getDoctorClaimListData.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.success = true;
        state.claimList = action.payload;
      })
      .addCase(getDoctorClaimListData.rejected, (state, action: PayloadAction<unknown>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetSubmitClaimState } = submitClaimProcessSlice.actions;
export default submitClaimProcessSlice.reducer;
