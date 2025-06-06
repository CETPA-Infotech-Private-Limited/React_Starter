import axiosInstance from '@/services/axiosInstance';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

interface UserState {
  Roles: string | null;
  unique_name: string | null;
  EmpCode: string | null;
  Designation: string | null;
  Unit: string | null;
  unitId: string | null;
  Lavel: string | null;
  Department: string | null;
  exp: number | null;
  loading: boolean;
  error: string | null;
}

interface ProfileResponse {
  statusCode: number;
  message: string;
  data: {
    empId: number;
    empCode: string;
    name: string;
    email: string;
    mobile: string;
    designation: string;
    unit: string;
    unitId: number;
    department: string;
    level: string;
    roles: string[];
    ssoUserInfo: {
      username: string;
      unitName: string;
      unitId: string;
      designation: string;
      level: string;
      department: string;
    };
  };
  dataLength: number;
  totalRecords: number;
  error: boolean;
  errorDetail: null | string;
}

const initialState: UserState = {
  Roles: null,
  unique_name: null,
  EmpCode: null,
  Designation: null,
  Unit: null,
  unitId: null,
  Lavel: null,
  Department: null,
  exp: null,
  loading: false,
  error: null,
};

// Create async thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk('user/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<ProfileResponse>('/Account/profile');

    const data = response.data;

    if (data.error) {
      throw new Error(data.errorDetail || 'Unknown error occurred');
    }

    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch user profile');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser(state, action: PayloadAction<Partial<UserState>>) {
      return { ...state, ...action.payload };
    },
    resetUser() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;

        const { data } = action.payload;

        // Map API response to existing state structure
        state.EmpCode = data.empCode;
        state.unique_name = data.name;
        state.Designation = data.designation;
        state.Unit = data.unit;
        state.unitId = data.unitId.toString();
        state.Department = data.department;
        state.Lavel = data.level;
        state.Roles = data.roles.join(',');
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
