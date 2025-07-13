import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '@/services/axiosInstance';

interface ClaimProcessPayload {
  [key: string]: any; // Because we need dot-notation keys like "HospitalizationBillApprovelDetails.MedicineAmount"
}

interface ClaimState {
  loading: boolean;
  success: boolean;
  error: string | null;
  claimData: any;
}

const initialState: ClaimState = {
  loading: false,
  success: false,
  error: null,
  claimData: null,
};


export const submitClaimProcessByHr = createAsyncThunk<
  any, // response type
  ClaimProcessPayload, // argument type
  { rejectValue: string }
>('claim/submitClaimProcessByHr', async (payload, { rejectWithValue }) => {
  try {
    const formData = new FormData();

    // Flatten payload into FormData
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob);
      }
    });

    const response = await axiosInstance.post('/Claim/SubmitClaimProcess', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Error submitting claim process:', error);
    return rejectWithValue('Failed to submit claim process');
  }
});




const claimSlice = createSlice({
  name: 'claim',
  initialState,
  reducers: {
    resetClaimStatus(state) {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitClaimProcessByHr.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(submitClaimProcessByHr.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.claimData = action.payload;
      })
      .addCase(submitClaimProcessByHr.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Failed to submit claim';
      });
  },
});

export const { resetClaimStatus } = claimSlice.actions;
export default claimSlice.reducer;

