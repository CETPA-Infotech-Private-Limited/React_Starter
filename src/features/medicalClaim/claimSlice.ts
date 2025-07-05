
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/services/axiosInstance';

export const submitDirectClaim = createAsyncThunk<
  any,
  FormData,
  { rejectValue: string }
>('claim/submitDirectClaim', async (formData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/api/Claim/DirectClaimRequest', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (err: any) {
    const errorMsg = err.response?.data?.message || 'Failed to submit claim';
    return rejectWithValue(errorMsg);
  }
});
