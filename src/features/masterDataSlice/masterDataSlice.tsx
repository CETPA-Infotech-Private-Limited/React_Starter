import { dmsAxiosInstance } from '@/services/axiosInstance';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Unit {
  id: number;
  name: string;
  sequenceID: number;
  abbrivation: string;
  suCode: string | null;
  fkCorridorId: number;
  corridorName: string;
  corridorDescription: string;
  scCode: string;
}

export interface PositionGrade {
  positionGrade: string;
  pgOrder: number;
}

export interface Post {
  post: string;
  description: string;
  descriptionHindi: string | null;
}

export interface Department {
  department: string;
  departmentid: number;
  departmentHindi: string | null;
}

export interface Contractor {
  contractor: string;
  pkContractid: number;
}

export interface MasterDataResponse {
  unit: Unit[];
  positionGrades: PositionGrade[];
  posts: Post[];
  departments: Department[];
  contractors: Contractor[];
  employeeTypes: string[];
}

interface MasterDataState extends MasterDataResponse {
  loading: boolean;
  error: string | null;
}

const initialState: MasterDataState = {
  unit: [],
  positionGrades: [],
  posts: [],
  departments: [],
  contractors: [],
  employeeTypes: [],
  loading: false,
  error: null,
};

// --- Async Thunk ---
export const fetchMasterData = createAsyncThunk<MasterDataResponse, void, { rejectValue: string }>('masterData/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await dmsAxiosInstance.get<{ data: MasterDataResponse }>('/ModuleManagement/GetAllMasterData');
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch master data');
  }
});

// --- Slice ---
const masterDataSlice = createSlice({
  name: 'masterData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMasterData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMasterData.fulfilled, (state, action: PayloadAction<MasterDataResponse>) => {
        state.unit = action.payload.unit;
        state.positionGrades = action.payload.positionGrades;
        state.posts = action.payload.posts;
        state.departments = action.payload.departments;
        state.contractors = action.payload.contractors;
        state.employeeTypes = action.payload.employeeTypes ?? [];
        state.loading = false;
      })
      .addCase(fetchMasterData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred';
      });
  },
});

export default masterDataSlice.reducer;
