// features/GetPODetails/PODetailsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { openApiInstance } from "@/services/axiosInstance";
import toast from "react-hot-toast";

// Types
interface PODetail {
  pktblSapDump: number;
  poNo: string;
  supplierCode: string;
  contractNo: string;
  capexOpex: string;
  createdBy: string;
  unit: string;
  department: string;
  poOrderValue: number;
  deliveredValue: number;
  balanceToBeInvoice: number;
  currency: string;
  sapSyncDate: string;
  podate: string;
  bankPayment: number;
  sgst: number;
  cgst: number;
  igst: number;
  tds: number;
  glaccount: string;
  [key: string]: any;
}

interface GetPODetailsParams {
  Unit?: string;
  Dept?: string;
}

interface PODetailsState {
  data: PODetail[];
  loading: boolean;
  error: string | null;
  message: string | null;
  success: boolean;
}

// Initial State
const initialState: PODetailsState = {
  data: [],
  loading: false,
  error: null,
  message: null,
  success: false,
};

// Async Thunk
export const getPODetails = createAsyncThunk<PODetail[], GetPODetailsParams, { rejectValue: string }>(
  'poDetails/getPODetails',
  async (params = {}, { rejectWithValue }) => {
    try {
      // Build query string - only add params if they have values
      const queryParts: string[] = [];
      
      if (params.Unit && params.Unit !== '0' && params.Unit !== '') {
        queryParts.push(`Unit=${params.Unit}`);
      }
      if (params.Dept && params.Dept !== '0' && params.Dept !== '') {
        queryParts.push(`Dept=${params.Dept}`);
      }
      
      const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
      const url = `/Util/po-details${queryString}`;
      
      console.log('PO API URL:', url);
      
      const response = await openApiInstance.get(url);
      
      console.log('API Response Status:', response.status);
      console.log('API Response Data:', response.data);
      
      // Check if response is successful
      if (response.status === 200 || response.status === 201) {
        let data = response.data;
        
        // If response has data property, use it
        if (data?.data && Array.isArray(data.data)) {
          return data.data;
        }
        
        // If response itself is an array
        if (Array.isArray(data)) {
          return data;
        }
        
        // If response has result property
        if (data?.result && Array.isArray(data.result)) {
          return data.result;
        }
        
        // If response has records property
        if (data?.records && Array.isArray(data.records)) {
          return data.records;
        }
        
        console.warn('Unexpected API response structure:', data);
        return [];
      } else {
        const errorMessage = response.data?.message || 'Failed to fetch PO details';
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }
      
    } catch (error: any) {
      console.error('PO Details API Error:', error);
      
      let errorMessage = 'Failed to fetch PO details';
      
      if (error.response) {
        errorMessage = error.response.data?.message || 
                       error.response.data?.error ||
                       `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else {
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
      state.data = [];
      state.error = null;
    },
    resetPOState: () => initialState,
    setPOList: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPODetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getPODetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
        state.success = true;
      })
      .addCase(getPODetails.rejected, (state, action) => {
        state.loading = false;
        state.data = [];
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { clearPOList, resetPOState, setPOList } = poDetailsSlice.actions;

export const selectPOList = (state: { poDetails: PODetailsState }) => state.poDetails.data;
export const selectPOLoading = (state: { poDetails: PODetailsState }) => state.poDetails.loading;
export const selectPOError = (state: { poDetails: PODetailsState }) => state.poDetails.error;

export default poDetailsSlice.reducer;