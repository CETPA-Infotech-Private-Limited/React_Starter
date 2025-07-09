


import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '@/services/axiosInstance'; // Adjust path as needed
// import { SubmitClaimProcessPayload } from './types'; // Adjust if stored 


export interface SubmitClaimProcessPayload {
  AdvanceId: number;       // int64
  SenderId: number;        // int64
  RecipientId: number;     // int64
  ClaimTypeId: number;     // int32
  StatusId: number;        // int32
}


interface SubmitClaimState {
  loading: boolean;
  success: boolean;
  error: string | null;
  response: any; // Replace `any` with a proper response type if known
}

export const submitClaimProcessByHr = createAsyncThunk(
  'claim/submitClaimProcessByHr',
  async (formData:FormData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/Claim/SubmitClaimProcessByHr', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }});
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Submission failed';
      return rejectWithValue(message);
    }
  }
);

const initialState: SubmitClaimState = {
  loading: false,
  success: false,
  error: null,
  response: null,
};

const submitClaimProcessSlice = createSlice({
  name: 'submitClaimProcessByHr',
  initialState,
  reducers: {
    resetSubmitClaimState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.response = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitClaimProcessByHr.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(submitClaimProcessByHr.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.success = true;
        state.response = action.payload;
      })
      .addCase(submitClaimProcessByHr.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export const { resetSubmitClaimState } = submitClaimProcessSlice.actions;
export default submitClaimProcessSlice.reducer;
