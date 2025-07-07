import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/services/axiosInstance';
import toast from 'react-hot-toast';
import { useAppSelector } from '@/app/hooks';

// Define the initial state for the claim
const initialState = {
  loading: false,
  error: null as string | null,
  success: false,
  data: [] as any[], // Always an array for table compatibility
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

export const getMyClaims = createAsyncThunk(
  'claim/getMyClaims',
  async (empId: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/Claim/GetMyClaims/${empId}`);
      // Defensive: ensure always array
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (Array.isArray(response.data.data)) {
        return response.data.data;
      } else if (response.data.data) {
        return [response.data.data];
      } else {
        return [];
      }
    } catch (error: any) {
      console.error('Error fetching claims:', error);
      return rejectWithValue('Failed to fetch claims');
    }
  }
);



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
        // If submit returns a single object, push to array, else use as array
        if (Array.isArray(action.payload)) {
          state.data = action.payload;
        } else if (action.payload) {
          state.data = [action.payload];
        } else {
          state.data = [];
        }
      })
      .addCase(submitClaim.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
        state.success = false;
      })
      .addCase(getMyClaims.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyClaims.fulfilled, (state, action) => {
        state.loading = false;
        state.data = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getMyClaims.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch claims';
        state.data = [];
      });
  },
});

export const { resetClaimState } = claimSlice.actions;
export default claimSlice.reducer;
