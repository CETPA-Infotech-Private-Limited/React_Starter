import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '@/services/axiosInstance';
import { environment } from '@/config';

interface CadreAllotment {
  autoId: number;
  employeeCode: number;
  unit: string;
  unitId: number;
  roleAssigned: string;
  assignedUnit: string;
  assignedUnitId: number;
  assignedDepartment: string;
  assignedGrades: string;
}

interface CadreAllotmentState {
  data: CadreAllotment[];
  loading: boolean;
  error: string | null;
  message: string | null;
  success: boolean;
}

const initialState: CadreAllotmentState = {
  data: [],
  loading: false,
  error: null,
  message: null,
  success: false,
};

// ✅ GET API
export const getCadreAllotments = createAsyncThunk<CadreAllotment[], { unitId: number; role: string }, { rejectValue: string }>(
  'cadreAllotment/getCadreAllotments',
  async ({ unitId, role }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${environment?.orgHierarchy}/MobileVisibility/GetCadreAllotementsAsync`, {
        params: { unitId, role },
      });

      const { statusCode, data, message } = response.data;

      if (statusCode === 200) {
        return data;
      } else {
        return rejectWithValue(message || 'Failed to fetch cadre allotments');
      }
    } catch (error: any) {
      return rejectWithValue(error?.message || 'An error occurred');
    }
  }
);

// ✅ Slice
const cadreAllotmentSlice = createSlice({
  name: 'cadreAllotment',
  initialState,
  reducers: {
    resetCadreAllotmentState: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
      state.message = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCadreAllotments.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getCadreAllotments.fulfilled, (state, action: PayloadAction<CadreAllotment[]>) => {
        state.loading = false;
        state.data = action.payload || [];
        state.success = true;
      })
      .addCase(getCadreAllotments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch cadre allotments';
        state.success = false;
      });
  },
});

export const { resetCadreAllotmentState } = cadreAllotmentSlice.actions;

export default cadreAllotmentSlice.reducer;
