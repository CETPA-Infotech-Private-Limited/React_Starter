// features/Drafts/MyDraftsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiInstance from "@/services/axiosInstance";
import toast from "react-hot-toast";

// Types
interface TimeOfCompletion {
  id: number;
  completionDate: string;
  type: string;
}

interface Attachment {
  id: number;
  file: string;
  documentType: string;
}

interface DraftReport {
  reportId: number;
  poNo: string;
  unitId: number | null;
  department: string;
  userEmpCode: number;
  categoryType: string;
  thresholdValue: number;
  periodStartDate: string | null;
  periodEndDate: string | null;
  nameOfWorkAndLocation: string | null;
  estimatedCostLacs: number;
  tenderedCostLacs: number | null;
  percentAboveBelowSOR: number | null;
  agreementNo: string | null;
  agency: string;
  dateOfStart: string | null;
  physicalProgress: number;
  engineerInChargeDetails: string | null;
  remarks: string | null;
  gst: number | null;
  cgst: number | null;
  sgst: number | null;
  reportStatusId: number;
  reportIsDraft: boolean;
  timeOfCompletions: TimeOfCompletion[];
  attachments: Attachment[];
}

interface DraftBatch {
  submissionBatchId: number;
  submittedByEmpCode: number;
  submissionDate: string;
  batchComment: string | null;
  isDraftBatch: boolean;
  reports: DraftReport[];
}

interface MyDraftsState {
  draftsList: DraftBatch[];
  loading: boolean;
  error: string | null;
  selectedDraft: DraftBatch | null;
}

// Initial State
const initialState: MyDraftsState = {
  draftsList: [],
  loading: false,
  error: null,
  selectedDraft: null,
};

// Query params type
interface GetMyDraftsParams {
  empCode?: string;
  poNo?: string;
  unitId?: string;
  department?: string;
}

// Async Thunk for fetching drafts
export const getMyDrafts = createAsyncThunk(
  'myDrafts/getMyDrafts',
  async (params: GetMyDraftsParams = {}, { rejectWithValue }) => {
    try {
      // Build query string from provided parameters
      const queryParams = new URLSearchParams();
      if (params.empCode) queryParams.append('empCode', params.empCode);
      if (params.poNo) queryParams.append('poNo', params.poNo);
      if (params.unitId) queryParams.append('unitId', params.unitId);
      if (params.department) queryParams.append('department', params.department);

      const queryString = queryParams.toString();
      const url = `/QuarterlyReport/GetMyDrafts${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiInstance.get(url);
      
      if (response.data.statusCode === 200 || response.data.statusCode === 201) {
        return response.data.data || response.data;
      } else {
        toast.error(response.data.message || 'Failed to fetch drafts');
        return rejectWithValue(response.data.message);
      }
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch drafts';
      
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Slice
const myDraftsSlice = createSlice({
  name: 'myDrafts',
  initialState,
  reducers: {
    clearDraftsList: (state) => {
      state.draftsList = [];
      state.error = null;
    },
    setSelectedDraft: (state, action) => {
      state.selectedDraft = action.payload;
    },
    clearSelectedDraft: (state) => {
      state.selectedDraft = null;
    },
    resetDraftsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyDrafts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyDrafts.fulfilled, (state, action) => {
        state.loading = false;
        state.draftsList = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(getMyDrafts.rejected, (state, action) => {
        state.loading = false;
        state.draftsList = [];
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { 
  clearDraftsList, 
  setSelectedDraft, 
  clearSelectedDraft, 
  resetDraftsState 
} = myDraftsSlice.actions;

// Export selectors
export const selectDraftsList = (state: { myDrafts: MyDraftsState }) => state.myDrafts.draftsList;
export const selectDraftsLoading = (state: { myDrafts: MyDraftsState }) => state.myDrafts.loading;
export const selectDraftsError = (state: { myDrafts: MyDraftsState }) => state.myDrafts.error;
export const selectSelectedDraft = (state: { myDrafts: MyDraftsState }) => state.myDrafts.selectedDraft;

// Export reducer
export default myDraftsSlice.reducer;