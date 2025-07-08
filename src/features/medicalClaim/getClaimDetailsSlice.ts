import axiosInstance from '@/services/axiosInstance';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface Document {
  category: string;
  remark: string;
  pathUrl: string;
}

export interface AdvanceBasicDetails {
  claimId: number;
  claimType: string;
  hospitalTotalBill: number;
  isSpecailDisease: boolean;
  diseaseName: string | null;
  isPostHospitalization: boolean | null;
  isTaxable: boolean | null;
  payTo: string;
  hospitalName: string;
  hospitalRegNo: string;
  likelyDate: string;
  estimatedAmount: number;
  advanceAmount: number;
  requestedDate: string;
  dateOfAdmission: string;
  dateofDischarge: string;
  doctorName: string;
  finalHospitalBill: number;
  claimAmount: number;
  claimStatus: number;
  digonosis: string;
  treatmentType: string;
  advaceClaimApprovedDate: string;
  directClaimApprovedDate: string;
  directCliamApprovedAmount: number;
  advanceClaimApprovedAmount: number;
}

export interface HospitalAccountDetail {
  beneficiaryName: string | null;
  accountNumber: string | null;
  bankName: string | null;
  branchName: string | null;
  ifscCode: string | null;
  hospitalGSTNo: string | null;
  utrNo: string | null;
  transactionDate: string | null;
  isHospitalEmpanpanelled: boolean;
  hospitalId: number | null;
  sapRefNumber: string | null;
  sapRefDate: string | null;
}

export interface BillDetails {
  medicineBill: number;
  consultationBill: number;
  investigationBill: number;
  roomRentBill: number;
  othersBill: number;
  procedureBill: number;
  medicineClaim: number;
  consultationClaim: number;
  investigationClaim: number;
  roomRentClaim: number;
  otherClaim: number;
  procedureClaim: number;
  medicineClaimApproved: number | null;
  consultationClaimApproved: number | null;
  investigationClaimApproved: number | null;
  roomRentClaimApproved: number | null;
  otherClaimApproved: number | null;
  procedureClaimApproved: number | null;
}

export interface PreHospitalizationExpenses {
  isPresHospitalzation: boolean;
  medicineBillDate: string | null;
  consultationBillDate: string | null;
  investigationBillDate: string | null;
  othersBillDate: string | null;
  procedureBillDate: string | null;
  medicineBillAmount: number | null;
  consultationBillAmount: number | null;
  investigationBillAmount: number | null;
  otherBillAmount: number | null;
  procedureBillAmount: number | null;
  medicineClaimAmount: number | null;
  consultationClaimAmount: number | null;
  investigationClaimAmount: number | null;
  otherClaimAmount: number | null;
  procedureClaimAmount: number | null;
  medicineClaimApprovedAmount: number | null;
  consultationClaimApprovedAmount: number | null;
  investigationClaimApprovedAmount: number | null;
  otherClaimApprovedAmount: number | null;
  procedureClaimApprovedAmount: number | null;
}

export interface FinanceDetails {
  financeBillPassingId: number;
  financeBillPassing: string | null;
  sapReferenceDate: string;
  sapRefNumber: string | null;
  transactionDate: string;
  utrNo: string | null;
  id: number;
  createdBy: number;
  createdDate: string;
  updatedBy: number | null;
  updatedDate: string | null;
  isActive: boolean;
}

export interface BillPassingDetails {
  claimId: number;
  empClaim: string | null;
  claimTypeId: number;
  claimType: string | null;
  topUpId: number | null;
  empAdvanceTopUp: string | null;
  referenceDate: string;
  sapRefNumber: string | null;
  amountPaid: number;
  comment: string | null;
  id: number;
  createdBy: number;
  createdDate: string;
  updatedBy: number | null;
  updatedDate: string | null;
  isActive: boolean;
}

export interface ClaimDetailsData {
  advanceBasicDetails: AdvanceBasicDetails;
  hospitalAccoundetail: HospitalAccountDetail;
  billDetails: BillDetails;
  notInMainBills: any[];
  preHospitalizationExpenses: PreHospitalizationExpenses;
  financeDetails: FinanceDetails;
  billPasingDetails: BillPassingDetails;
  topUpDetails: any[];
  documentLists: Document[];
}

interface ClaimDetailsState {
  data: ClaimDetailsData | null;
  loading: boolean;
  error: string | null;
}

const initialState: ClaimDetailsState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk
export const fetchClaimDetails = createAsyncThunk('claimDetails/fetchClaimDetails', async (claimId: number, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/claim/GetClaimDetails/${claimId}`);
    return response.data.data as ClaimDetailsData;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch claim details');
  }
});

const getClaimDetailsSlice = createSlice({
  name: 'claimDetails',
  initialState,
  reducers: {
    clearClaimDetails: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClaimDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClaimDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchClaimDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearClaimDetails } = getClaimDetailsSlice.actions;
export default getClaimDetailsSlice.reducer;
