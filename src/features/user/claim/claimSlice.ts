import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/services/axiosInstance';
import toast from 'react-hot-toast';

// Define the initial state for the claim
const initialState = {
  loading: false,
  error: null,
  success: false,
  data: null,
};

// Async thunk for submitting the claim
export const submitClaim = createAsyncThunk('claim/submitClaim', async (payload: any, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/Claim/DirectClaimRequest', payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
if(response.data.statusCode == 200 || 201) {
  toast.success('Claim submitted successfully!');// Show error toast
}else{
  toast.error('Failed to submit claim. Please try again.');// Show error toast
}
    
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitClaim.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitClaim.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
      })
      .addCase(submitClaim.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
        state.success = false;
      });
  },
});

export const { resetClaimState } = claimSlice.actions;
export default claimSlice.reducer;
