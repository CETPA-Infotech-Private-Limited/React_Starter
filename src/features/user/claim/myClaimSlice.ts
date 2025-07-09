import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/services/axiosInstance';

// ✅ Claim type
export interface ClaimItem {
  claimId: number;
  advanceId: number;
  empId: number;
  patientId: number;
  advanceAmount: number;
  cliamAmount: number;
  requestDate: string;
  approvedAmount: number;
  approvedDate: string;
  statusId: number;
  status: string;
  claimTypeName: string;
  claimTypeId: number;
}

// ✅ Slice state
interface ClaimState {
  data: ClaimItem[];
  loading: boolean;
  error: string | null;
}

const initialState: ClaimState = {
  data: [],
  loading: false,
  error: null,
};

// ✅ Thunk to fetch claims
export const getMyClaims = createAsyncThunk('claim/getMyClaims', async (empId: number, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/claim/GetMyClaims/${empId}`);
    return response.data.data as ClaimItem[];
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch claims');
  }
});

// ✅ Slice
const myClaimSlice = createSlice({
  name: 'claim',
  initialState,
  reducers: {
    resetClaimState: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
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

export const { resetClaimState } = myClaimSlice.actions;
export default myClaimSlice.reducer;
