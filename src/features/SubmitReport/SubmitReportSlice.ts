// features/SubmitReport/SubmitReportSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiInstance from "@/services/axiosInstance";
import toast from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SubmitReportState {
  loading: boolean;
  success: boolean;
  error: string | null;
  submittedData: any | null;
  draftBatchId: number | null;
}

const initialState: SubmitReportState = {
  loading: false,
  success: false,
  error: null,
  submittedData: null,
  draftBatchId: null,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getQuarterDateRange = (quarter: string, year: string) => {
  const quarterMap: Record<string, { start: string; end: string }> = {
    Q1: { start: `${year}-01-01`, end: `${year}-03-31` },
    Q2: { start: `${year}-04-01`, end: `${year}-06-30` },
    Q3: { start: `${year}-07-01`, end: `${year}-09-30` },
    Q4: { start: `${year}-10-01`, end: `${year}-12-31` },
  };
  return quarterMap[quarter] || { start: '', end: '' };
};

// ✅ Category Roman → numeric ID
const categoryMap: Record<string, string> = { I: '1', II: '2', III: '3' };

// ─── buildFormData ────────────────────────────────────────────────────────────

export const buildFormData = (
  formData: any,
  tableEntries: any[],
  user: any,
  isDraft: boolean = false,
  comment: string = '',
  batchId: number = 0
): FormData => {
  const { start, end } = getQuarterDateRange(formData.quarter, formData.year);

  // ✅ Resolve category tab (I/II/III) → numeric string (1/2/3)
  const categoryId = categoryMap[formData.category] || '1';

  const fd = new FormData();

  // ── Batch-level fields ──
  fd.append('SubmissionBatchId', batchId.toString());
  fd.append('EmpCode',           user?.EmpCode?.toString() || '0');
  fd.append('IsDraftMode',       isDraft.toString());
  fd.append('Comment',           comment);
  fd.append('SenderRole',        user?.Designation || '');

  // ── Per-entry fields ──
  tableEntries.forEach((entry, index) => {
    const p = `Reports[${index}]`;

    fd.append(`${p}.id`,           '0');
    fd.append(`${p}.poNo`,         entry.poNumber || entry.poId || '');
    fd.append(`${p}.unitId`,       user?.unitId?.toString() || '0');
    fd.append(`${p}.department`,   user?.Department || '');

    // ✅ Category type — from the active tab (same for all entries in this batch)
    fd.append(`${p}.categoryType`, categoryId);

    // ✅ Nature of contract ID — per-entry value from the dialog dropdown
    fd.append(`${p}.contractCategoryId`, entry.natureOfContractId || '0');

    fd.append(`${p}.periodStartDate`,        new Date(start).toISOString());
    fd.append(`${p}.periodEndDate`,          new Date(end).toISOString());
    fd.append(`${p}.nameOfWorkAndLocation`,  entry.nameOfWork || '');
    fd.append(`${p}.estimatedCostLacs`,      (entry.estimatedCostLacs  || 0).toString());
    fd.append(`${p}.tenderedCostLacs`,       (entry.tenderedCostLacs   || 0).toString());
    fd.append(`${p}.percentAboveBelowSOR`,   (entry.percentageAboveBelowSOR || 0).toString());
    fd.append(`${p}.agreementNo`,            entry.agmtLOANo || '');
    fd.append(`${p}.agency`,                 entry.agency    || '');
    fd.append(`${p}.dateOfStart`,
      entry.dateOfStart
        ? new Date(entry.dateOfStart).toISOString()
        : new Date().toISOString()
    );
    fd.append(`${p}.physicalProgress`,       (parseFloat(entry.physicalProgress) || 0).toString());
    fd.append(`${p}.engineerInChargeDetails`, entry.engineerInCharge || '');
    fd.append(`${p}.remarks`,                entry.remarks || '');

    if (entry.timeOfCompletion) {
      fd.append(`${p}.timeOfCompletions[0].id`,             '0');
      fd.append(`${p}.timeOfCompletions[0].completionDate`, new Date(entry.timeOfCompletion).toISOString());
      fd.append(`${p}.timeOfCompletions[0].type`,           'Estimated');
    }
  });

  return fd;
};

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const submitReport = createAsyncThunk(
  'submit/Report',
  async (
    { formData, tableEntries, user, comment = '' }:
    { formData: any; tableEntries: any[]; user: any; comment?: string },
    { rejectWithValue }
  ) => {
    try {
      const payload = buildFormData(formData, tableEntries, user, false, comment, 0);

      const response = await apiInstance.post(
        'QuarterlyReport/SaveQuaterlyReport',
        payload,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.statusCode === 200 || response.data.statusCode === 201) {
        toast.success(response.data.message || 'Report submitted successfully');
        return response.data;
      }

      toast.error(response.data.message || 'Failed to submit report');
      return rejectWithValue(response.data.message);
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'An unknown error occurred';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const saveReportDraft = createAsyncThunk(
  'submit/SaveDraft',
  async (
    { formData, tableEntries, user, comment = 'Draft saved', batchId = 0 }:
    { formData: any; tableEntries: any[]; user: any; comment?: string; batchId?: number },
    { rejectWithValue }
  ) => {
    try {
      const payload = buildFormData(formData, tableEntries, user, true, comment, batchId);

      const response = await apiInstance.post(
        'QuarterlyReport/SaveQuaterlyReport',
        payload,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.statusCode === 200 || response.data.statusCode === 201) {
        toast.success('Draft saved successfully');
        return {
          ...response.data,
          batchId:
            response.data.SubmissionBatchId ||
            response.data.data?.SubmissionBatchId ||
            batchId,
        };
      }

      toast.error(response.data.message || 'Failed to save draft');
      return rejectWithValue(response.data.message);
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'An unknown error occurred';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const updateReport = createAsyncThunk(
  'submit/UpdateReport',
  async (
    { formData, tableEntries, user, batchId, comment = '' }:
    { formData: any; tableEntries: any[]; user: any; batchId: number; comment?: string },
    { rejectWithValue }
  ) => {
    try {
      const payload = buildFormData(formData, tableEntries, user, false, comment, batchId);

      const response = await apiInstance.post(
        'QuarterlyReport/SaveQuaterlyReport',
        payload,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.statusCode === 200 || response.data.statusCode === 201) {
        toast.success(response.data.message || 'Report updated successfully');
        return response.data;
      }

      toast.error(response.data.message || 'Failed to update report');
      return rejectWithValue(response.data.message);
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'An unknown error occurred';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const submitReportSlice = createSlice({
  name: 'submitReport',
  initialState,
  reducers: {
    resetSubmitState: (state) => {
      state.loading      = false;
      state.success      = false;
      state.error        = null;
      state.submittedData = null;
    },
    clearSubmitError: (state) => {
      state.error = null;
    },
    setDraftBatchId: (state, action) => {
      state.draftBatchId = action.payload;
    },
    clearDraftBatchId: (state) => {
      state.draftBatchId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── submitReport ──
      .addCase(submitReport.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error   = null;
      })
      .addCase(submitReport.fulfilled, (state, action) => {
        state.loading       = false;
        state.success       = true;
        state.error         = null;
        state.submittedData = action.payload;
      })
      .addCase(submitReport.rejected, (state, action) => {
        state.loading       = false;
        state.success       = false;
        state.error         = action.payload as string;
        state.submittedData = null;
      })

      // ── saveReportDraft ──
      .addCase(saveReportDraft.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(saveReportDraft.fulfilled, (state, action) => {
        state.loading       = false;
        state.success       = true;
        state.error         = null;
        state.submittedData = action.payload;
        if (action.payload?.batchId) {
          state.draftBatchId = action.payload.batchId;
        }
      })
      .addCase(saveReportDraft.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error   = action.payload as string;
      })

      // ── updateReport ──
      .addCase(updateReport.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error   = null;
      })
      .addCase(updateReport.fulfilled, (state, action) => {
        state.loading       = false;
        state.success       = true;
        state.error         = null;
        state.submittedData = action.payload;
      })
      .addCase(updateReport.rejected, (state, action) => {
        state.loading       = false;
        state.success       = false;
        state.error         = action.payload as string;
        state.submittedData = null;
      });
  },
});

// ─── Exports ──────────────────────────────────────────────────────────────────

export const {
  resetSubmitState,
  clearSubmitError,
  setDraftBatchId,
  clearDraftBatchId,
} = submitReportSlice.actions;

export const selectSubmitLoading  = (state: { submitReport: SubmitReportState }) => state.submitReport.loading;
export const selectSubmitSuccess  = (state: { submitReport: SubmitReportState }) => state.submitReport.success;
export const selectSubmitError    = (state: { submitReport: SubmitReportState }) => state.submitReport.error;
export const selectSubmittedData  = (state: { submitReport: SubmitReportState }) => state.submitReport.submittedData;
export const selectDraftBatchId   = (state: { submitReport: SubmitReportState }) => state.submitReport.draftBatchId;

export default submitReportSlice.reducer;