import { dmsAxiosInstance } from '@/services/axiosInstance';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

type UnitsState = {
  units: any[];
  loading: boolean;
  error: string | null;
  lastFetchedAt: string | null;
};

const initialState: UnitsState = {
  units: [],
  loading: false,
  error: null,
  lastFetchedAt: null,
};

export const getNewUnit = createAsyncThunk('units/newunits', async (_, { rejectWithValue }) => {
  try {
    const response = await dmsAxiosInstance.get('/ModuleManagement/GetAllMasterData');
    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.response?.data || error?.message || 'Something went wrong';
    return rejectWithValue(message);
  }
});

const unitsSlice = createSlice({
  name: 'units',
  initialState,
  reducers: {
    clearUnitsError: (state) => {
      state.error = null;
    },
    resetUnitsState: () => initialState,
    setUnits: (state, action: PayloadAction<any[]>) => {
      state.units = action.payload || [];
      state.lastFetchedAt = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNewUnit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNewUnit.fulfilled, (state, action) => {
        state.loading = false;
        state.units = Array.isArray(action.payload) ? action.payload : action.payload?.data ?? [];
        state.lastFetchedAt = new Date().toISOString();
      })
      .addCase(getNewUnit.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch units';
      });
  },
});

export const { clearUnitsError, resetUnitsState, setUnits } = unitsSlice.actions;

export default unitsSlice.reducer;
