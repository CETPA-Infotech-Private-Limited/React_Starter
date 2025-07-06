import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';
import axiosInstance from '@/services/axiosInstance';

export interface Role {
  id: number;
  value: string;
}

interface RoleState {
  roles: Role[];
  loading: boolean;
  error: string | null;
}

const initialState: RoleState = {
  roles: [],
  loading: false,
  error: null,
};

export const fetchMasterRole = createAsyncThunk<Role[], void, { rejectValue: string }>('roles/GetRoleMasterList', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/User/GetRoleMasterList');
    return response.data.data as Role[];
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Failed to fetch roles';
    return rejectWithValue(errorMessage);
  }
});

export const masterRoleSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMasterRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMasterRole.fulfilled, (state, action: PayloadAction<Role[]>) => {
        state.roles = action.payload;
        state.loading = false;
      })
      .addCase(fetchMasterRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An unknown error occurred';
      });
  },
});

export default masterRoleSlice.reducer;
