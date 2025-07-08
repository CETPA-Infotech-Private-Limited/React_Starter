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
  loading: boolean;
  error: string | null;
}

const initialState: AdvanceState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchAdvanceData = createAsyncThunk('advance/GetAdvanceClaim', async (empId: number, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/claim/GetAdvanceClaim/${empId}`);
    return response.data.data as AdvanceItem[];
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch advance data');
  }
});

const getAdvanceClaimSlice = createSlice({
  name: 'advance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export default getAdvanceClaimSlice.reducer;
