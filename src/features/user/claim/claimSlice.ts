import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/services/axiosInstance';
import toast from 'react-hot-toast';
import { ClaimState } from '@/types/claim';

const initialState: ClaimState = {
  loading: false,
  error: null,
  success: false,
  data: null,
};

export const submitDirectClaim = createAsyncThunk('claim/submitDirectClaim', async (payload: any, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/Claim/DirectClaimRequest', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (response.data.statusCode === 200 || response.data.statusCode === 201) {
      toast.success('Claim submitted successfully!');
    } else {
      toast.error('Failed to submit claim. Please try again.');
    }

    return response.data.data;
  } catch (error: any) {
    toast.error('Error occurred while submitting claim.');
    return rejectWithValue(error.response?.data || error.message);
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
      .addCase(submitDirectClaim.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitDirectClaim.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitDirectClaim.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(getMyClaims.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyClaims.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getMyClaims.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetClaimState } = claimSlice.actions;
export default claimSlice.reducer;
