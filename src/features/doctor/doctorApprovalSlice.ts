import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '@/services/axiosInstance';
import toast from 'react-hot-toast';

// Payload Type
export interface SubmitClaimProcessPayload {
  AdvanceId: number;
  SenderId: number;
  RecipientId: number;
  ClaimTypeId: number;
  StatusId: number;
}

// Slice State
interface SubmitClaimState {
  loading: boolean;
  success: boolean;
  error: string | null;
  claimList: any;

  docReviewLoading: boolean;
  docReviewSuccess: boolean;
  docReviewError: string | null;
}

// Initial State
const initialState: SubmitClaimState = {
  loading: false,
  success: false,
  error: null,
  claimList: [],

  docReviewLoading: false,
  docReviewSuccess: false,
  docReviewError: null,
};

// Thunks

export const submitClaimProcess = createAsyncThunk('claim/submitClaimProcess', async (formData: FormData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/Claim/SubmitClaimProcess', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Submission failed';
    return rejectWithValue(message);
  }
});

// Doctor Review
export const postDocReview = createAsyncThunk('claim/docReview', async (formData: FormData, { rejectWithValue }) => {
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
});

export const getDoctorClaimListData = createAsyncThunk('claim/getDoctorClaimListData', async (recipientId: number, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/Claim/GetDoctorsClaimList/${recipientId}`);
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to fetch claim list data';
    return rejectWithValue(message);
  }
});

// Slice
const doctorApprovalSlice = createSlice({
  name: 'claim',
  initialState,
  reducers: {
    resetSubmitClaimState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.claimList = null;

      state.docReviewLoading = false;
      state.docReviewSuccess = false;
      state.docReviewError = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Normal Claim
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

      // Doctor Review
      .addCase(postDocReview.pending, (state) => {
        state.docReviewLoading = true;
        state.docReviewSuccess = false;
        state.docReviewError = null;
      })
      .addCase(postDocReview.fulfilled, (state, action: PayloadAction<any>) => {
        state.docReviewLoading = false;
        state.docReviewSuccess = true;
        state.claimList = action.payload;
      })
      .addCase(postDocReview.rejected, (state, action: PayloadAction<unknown>) => {
        state.docReviewLoading = false;
        state.docReviewSuccess = false;
        state.docReviewError = action.payload as string;
      })

      // Get Doctor Claim List
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

export const { resetSubmitClaimState } = doctorApprovalSlice.actions;
export default doctorApprovalSlice.reducer;
