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

  // 🔹 Separate state for submitClaimProcessByHr
  submitByHr: {
    loading: boolean;
    success: boolean;
    error: string | null;
    data: any;
  };
}

const initialState: SubmitClaimState = {
  loading: false,
  success: false,
  error: null,
  claimList: null,

  submitByHr: {
    loading: false,
    success: false,
    error: null,
    data: null,
  },
};

// Thunks
export const submitClaimProcessByHr = createAsyncThunk('claim/submitClaimProcessByHr', async (formData: FormData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/Claim/SubmitClaimProcessByHr', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Submission failed';
    return rejectWithValue(message);
  }
});

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
const submitClaimProcessSlice = createSlice({
  name: 'claim',
  initialState,
  reducers: {
    resetSubmitClaimState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.claimList = null;

      // Reset submitByHr separately
      state.submitByHr = {
        loading: false,
        success: false,
        error: null,
        data: null,
      };
    },
  },
  extraReducers: (builder) => {
    // 🔹 submitClaimProcessByHr (with separate state)
    builder
      .addCase(submitClaimProcessByHr.pending, (state) => {
        state.submitByHr.loading = true;
        state.submitByHr.success = false;
        state.submitByHr.error = null;
      })
      .addCase(submitClaimProcessByHr.fulfilled, (state, action: PayloadAction<any>) => {
        state.submitByHr.loading = false;
        state.submitByHr.success = true;
        state.submitByHr.data = action.payload;
      })
      .addCase(submitClaimProcessByHr.rejected, (state, action: PayloadAction<unknown>) => {
        state.submitByHr.loading = false;
        state.submitByHr.success = false;
        state.submitByHr.error = action.payload as string;
      });

    // 🔸 Other thunks use shared state
    builder
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
