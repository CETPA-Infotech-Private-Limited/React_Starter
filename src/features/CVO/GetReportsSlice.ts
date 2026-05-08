// features/PendingReports/pendingReportsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiInstance from "@/services/axiosInstance";
import toast from "react-hot-toast";

// Types
interface PendingBatch {
  SubmissionBatchId: number;
  EmpCode: number;
  EmpName?: string;
  IsDraftMode: boolean;
  Comment: string;
  SenderRole: string;
  Status?: string;
  CreatedDate?: string;
  ModifiedDate?: string;
  Reports?: any[];
  [key: string]: any;
}

interface ProcessBatchPayload {
  submissionBatchIds: number[];
  approverEmpCode: number;
  approverRole: string;
  action: number;
  remarks: string;
}

interface PendingReportsState {
  pendingReports: PendingBatch[];
  loading: boolean;
  error: string | null;
  selectedBatch: PendingBatch | null;
  submitting: boolean;
  submitError: string | null;
}

// Initial State
const initialState: PendingReportsState = {
  pendingReports: [],
  loading: false,
  error: null,
  selectedBatch: null,
  submitting: false,
  submitError: null,
};

// Async Thunk for fetching pending reports
export const getPendingReports = createAsyncThunk(
  'reports/getPending',
  async (params: GetPendingReportsParams = {}, { rejectWithValue }) => {
    try {
      // ✅ Only send params that have actual values
      const queryParams: Record<string, any> = {};
      if (params.unitId) queryParams.unitId = params.unitId;
      if (params.department) queryParams.department = params.department;
      if (params.poNo) queryParams.poNo = params.poNo;

      const response = await apiInstance.get('/QuarterlyReport/GetAllPendingBatches', {
        params: queryParams,
      });

      if (response.data.statusCode === 200 || response.data.statusCode === 201) {
        const data = response.data.data ?? response.data;
        return Array.isArray(data) ? data : [];
      } else {
        toast.error(response.data.message || 'Failed to fetch pending reports');
        return rejectWithValue(response.data.message);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch pending reports';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk for fetching single batch details
export const getBatchDetails = createAsyncThunk(
  "reports/getBatchDetails",
  async (batchId: number, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get(
        `/QuarterlyReport/GetBatchDetails/${batchId}`
      );

      if (
        response.data.statusCode === 200 ||
        response.data.statusCode === 201
      ) {
        return response.data.data || response.data;
      } else {
        toast.error(response.data.message || "Failed to fetch batch details");
        return rejectWithValue(response.data.message);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch batch details";

      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk for submitting / processing a batch
export const submitReport = createAsyncThunk(
  "reports/submitReport",
  async (payload: ProcessBatchPayload, { rejectWithValue }) => {
    try {
      const response = await apiInstance.post(
        "/QuarterlyReport/ProcessBatch",
        payload
      );

      if (
        response.data.statusCode === 200 ||
        response.data.statusCode === 201
      ) {
        toast.success(response.data.message || "Report processed successfully");
        return response.data.data || response.data;
      } else {
        toast.error(response.data.message || "Failed to process report");
        return rejectWithValue(response.data.message);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to process report";

      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Slice
const pendingReportsSlice = createSlice({
  name: "pendingReports",
  initialState,
  reducers: {
    clearPendingReports: (state) => {
      state.pendingReports = [];
      state.error = null;
    },
    setSelectedBatch: (state, action) => {
      state.selectedBatch = action.payload;
    },
    clearSelectedBatch: (state) => {
      state.selectedBatch = null;
    },
    clearSubmitError: (state) => {
      state.submitError = null;
    },
    resetPendingState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Get Pending Reports
      .addCase(getPendingReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPendingReports.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingReports = Array.isArray(action.payload)
          ? action.payload
          : [];
        state.error = null;
      })
      .addCase(getPendingReports.rejected, (state, action) => {
        state.loading = false;
        state.pendingReports = [];
        state.error = action.payload as string;
      })

      // Get Batch Details
      .addCase(getBatchDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBatchDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBatch = action.payload;
        state.error = null;
      })
      .addCase(getBatchDetails.rejected, (state, action) => {
        state.loading = false;
        state.selectedBatch = null;
        state.error = action.payload as string;
      })

      // Submit / Process Report
      .addCase(submitReport.pending, (state) => {
        state.submitting = true;
        state.submitError = null;
      })
      .addCase(submitReport.fulfilled, (state) => {
        state.submitting = false;
        state.submitError = null;
      })
      .addCase(submitReport.rejected, (state, action) => {
        state.submitting = false;
        state.submitError = action.payload as string;
      });
  },
});

// Export actions
export const {
  clearPendingReports,
  setSelectedBatch,
  clearSelectedBatch,
  clearSubmitError,
  resetPendingState,
} = pendingReportsSlice.actions;

// Export selectors
export const selectPendingReports = (state: {
  pendingReports: PendingReportsState;
}) => state.pendingReports.pendingReports;

export const selectPendingReportsLoading = (state: {
  pendingReports: PendingReportsState;
}) => state.pendingReports.loading;

export const selectPendingReportsError = (state: {
  pendingReports: PendingReportsState;
}) => state.pendingReports.error;

export const selectSelectedBatch = (state: {
  pendingReports: PendingReportsState;
}) => state.pendingReports.selectedBatch;

export const selectSubmitting = (state: {
  pendingReports: PendingReportsState;
}) => state.pendingReports.submitting;

export const selectSubmitError = (state: {
  pendingReports: PendingReportsState;
}) => state.pendingReports.submitError;

// Export reducer
export default pendingReportsSlice.reducer;