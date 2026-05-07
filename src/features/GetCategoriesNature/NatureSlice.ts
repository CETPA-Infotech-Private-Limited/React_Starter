// store/slices/natureSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiInstance from "@/services/axiosInstance";
import toast from "react-hot-toast";

// Types
interface NatureItem {
  id: string;
  label: string;
  value: string;
  description?: string;
}

interface NatureState {
  natureList: NatureItem[];
  loading: boolean;
  error: string | null;
  selectedNature: NatureItem | null;
}

// Initial State
const initialState: NatureState = {
  natureList: [],
  loading: false,
  error: null,
  selectedNature: null,
};

// Async Thunk for fetching nature list
export const getNatureList = createAsyncThunk(
  'nature/getNatureList',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get(
        `/ContractCategory/GetContractCategories`, {
            params:{categoryType:id}
        }
      );
      
      if (response.data.statusCode !== 200 && response.data.statusCode !== 201) {
        toast.error(response.data.message);
        return rejectWithValue(response.data.message);
      }
      
      // Return the data on success
      return response.data.data || response.data;
      
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch nature list';
      
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Slice
const natureSlice = createSlice({
  name: 'nature',
  initialState,
  reducers: {
    clearNatureList: (state) => {
      state.natureList = [];
      state.error = null;
    },
    
    setSelectedNature: (state, action) => {
      state.selectedNature = action.payload;
    },
    
    clearSelectedNature: (state) => {
      state.selectedNature = null;
    },
    
    resetNatureState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNatureList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNatureList.fulfilled, (state, action) => {
        state.loading = false;
        state.natureList = action.payload;
        state.error = null;
      })
      .addCase(getNatureList.rejected, (state, action) => {
        state.loading = false;
        state.natureList = [];
        state.error = action.payload as string || 'Failed to fetch nature list';
      });
  },
});

// Export actions
export const {
  clearNatureList,
  setSelectedNature,
  clearSelectedNature,
  resetNatureState,
} = natureSlice.actions;

// Export selectors
export const selectNatureList = (state: { nature: NatureState }) => state.nature.natureList;
export const selectNatureLoading = (state: { nature: NatureState }) => state.nature.loading;
export const selectNatureError = (state: { nature: NatureState }) => state.nature.error;
export const selectSelectedNature = (state: { nature: NatureState }) => state.nature.selectedNature;

// Export reducer
export default natureSlice.reducer;