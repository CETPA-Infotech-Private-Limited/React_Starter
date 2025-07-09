import axiosInstance from '@/services/axiosInstance';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface AdvanceItem {
  advanceId: number;
  patientId: number;
  claimType: string;
  empId: number;
  advanceAmount: number;
  requestDate: string;
  approvedAmount: number | null;
  approvedDate: string | null;
}

interface AdvanceState {
  data: AdvanceItem[];
  bankingData: AdvanceItem[];
  loading: boolean;
  error: string | null;
}

const initialState: AdvanceState = {
  data: [],
  bankingData: [],
  loading: false,
  error: null,
};

// Fetch for user-specific advance claims
export const fetchAdvanceData = createAsyncThunk('advance/fetchUserAdvanceClaims', async (empId: number, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/claim/GetAdvanceClaim/${empId}`);
    return response.data.data as AdvanceItem[];
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch advance data');
  }
});

// Fetch for banking claims
export const fetchBankingAdvanceData = createAsyncThunk('advance/fetchBankingAdvanceClaims', async (empId: number, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/claim/GetClaimForBankingList/${empId}`);
    return response.data.data as AdvanceItem[];
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch banking data');
  }
});

const getAdvanceClaimSlice = createSlice({
  name: 'advance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle user advance claims
      .addCase(fetchAdvanceData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdvanceData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAdvanceData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Handle banking claims
      .addCase(fetchBankingAdvanceData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBankingAdvanceData.fulfilled, (state, action) => {
        state.loading = false;
        state.bankingData = action.payload;
      })
      .addCase(fetchBankingAdvanceData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default getAdvanceClaimSlice.reducer;
