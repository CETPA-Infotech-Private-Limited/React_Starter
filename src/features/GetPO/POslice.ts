// features/GetPODetails/PODetailsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { openApiInstance } from "@/services/axiosInstance";
import toast from "react-hot-toast";

// Types
interface PODetail {
  id: string;
  poNumber: string;
  value: string;
  vendorName?: string;
  amount?: number;
  date?: string;
  [key: string]: any;
}

interface PODetailsState {
  poList: PODetail[];
  loading: boolean;
  error: string | null;
}

// Initial State
const initialState: PODetailsState = {
  poList: [],
  loading: false,
  error: null,
};

// Async Thunk
export const getPODetails = createAsyncThunk(
  'poDetails/getPODetails',
  async ({ Unit = '0', Dept = '0' }: { unitId?: string; deptId?: string }, { rejectWithValue }) => {
    try {
      const response = await openApiInstance.get(
        `/Util/po-details?Unit=${Unit}&Dept=${Dept}`
      );
      
      console.log('API Response Status:', response.status);
      console.log('API Response Data:', response.data);
      
      // Check if response is successful
      if (response.status === 200 || response.status === 201) {
        // Handle different response structures
        let data = response.data;
        
        // If response has data property, use it
        if (data?.data && Array.isArray(data.data)) {
          return data.data;
        }
        
        // If response itself is an array
        if (Array.isArray(data)) {
          return data;
        }
        
        // If response has some other structure with array
        if (data?.result && Array.isArray(data.result)) {
          return data.result;
        }
        
        // If response has records/data/list property
        if (data?.records && Array.isArray(data.records)) {
          return data.records;
        }
        
        // If no recognizable array found, return empty array
        console.warn('Unexpected API response structure:', data);
        return [];
      } else {
        const errorMessage = response.data?.message || 'Failed to fetch PO details';
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }
      
    } catch (error: any) {
      console.error('PO Details API Error:', error);
      
      // Handle different error structures
      let errorMessage = 'Failed to fetch PO details';
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || 
                       error.response.data?.error ||
                       `Server error: ${error.response.status}`;
        console.error('Error Response:', error.response.data);
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'No response from server. Please check your connection.';
        console.error('Error Request:', error.request);
      } else {
        // Something else happened
        errorMessage = error.message || errorMessage;
      }
      
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Slice
const poDetailsSlice = createSlice({
  name: 'poDetails',
  initialState,
  reducers: {
    clearPOList: (state) => {
      state.poList = [];
      state.error = null;
    },
    resetPOState: () => initialState,
    // Add a manual set PO list action for debugging
    setPOList: (state, action) => {
      state.poList = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPODetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('PO Details Loading...');
      })
      .addCase(getPODetails.fulfilled, (state, action) => {
        state.loading = false;
        state.poList = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
        console.log('PO Details Fulfilled:', state.poList.length, 'items');
      })
      .addCase(getPODetails.rejected, (state, action) => {
        state.loading = false;
        state.poList = [];
        state.error = action.payload as string;
        console.error('PO Details Rejected:', action.payload);
      });
  },
});

export const { clearPOList, resetPOState, setPOList } = poDetailsSlice.actions;

export const selectPOList = (state: { poDetails: PODetailsState }) => state.poDetails.poList;
export const selectPOLoading = (state: { poDetails: PODetailsState }) => state.poDetails.loading;
export const selectPOError = (state: { poDetails: PODetailsState }) => state.poDetails.error;

export default poDetailsSlice.reducer;