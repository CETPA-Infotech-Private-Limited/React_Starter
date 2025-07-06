import axiosInstance from '@/services/axiosInstance';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface AdvanceClaimState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: AdvanceClaimState = {
  loading: false,
  success: false,
  error: null,
};

// 🔁 Async thunk using axiosInstance
export const submitAdvanceClaim = createAsyncThunk('advanceClaim/submit', async (formData: FormData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/Claim/AdvanceRequest', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (err: any) {
    const message = err.response?.data?.message || err.message || 'Submission failed';
    return rejectWithValue(message);
  }
});

const advanceClaimSlice = createSlice({
  name: 'advanceClaim',
  initialState,
  reducers: {
    resetAdvanceClaimState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitAdvanceClaim.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(submitAdvanceClaim.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitAdvanceClaim.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetAdvanceClaimState } = advanceClaimSlice.actions;
export default advanceClaimSlice.reducer;
