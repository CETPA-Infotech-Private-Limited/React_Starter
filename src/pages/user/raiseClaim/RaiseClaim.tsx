import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { submitClaim, resetClaimState } from '@/features/user/claim/claimSlice';
import type { RootState, AppDispatch } from '@/app/store';
import PatientDetails from './PatientDetails'
import BillDetailsForm from './BillDetails'
import PreHospitalizationForm from './PreHospitalizationForm'
import PostHospitalizationAndDeclaration from './PostHospital'
import { useAppDispatch, useAppSelector } from '@/app/hooks';

interface ClaimRequest {
  IsSpecailDisease: boolean;
  IsTaxAble: boolean;
  SpecialDiseaseName?: string;
  ClaimAmount?: number;
  ClaimPdfUpload?: string; // base64 or binary string
  AdmissionAdviceUpload?: any[]; // adjust type as needed (e.g., File[])
  DischargeSummaryUpload?: any[];
  InvestigationReportsUpload?: any[];
  EmpId?: number;
  Unit?: string;
  FinalHospitalBill?: number;
  FinalHospitalBillUpload?: any[];
  MedicenBill?: {
    BilledAmount: number;
    ClaimedAmount: number;
  }[];
  MedicenNotFinalBill?: {
    Amount: number;
    Files: any[];
    AmountCliam: number;
  };
  Consultation?: {
    BilledAmount: number;
    ClaimedAmount: number;
  }[];
  ConsultationNotFinalBill?: {
    BilledAmount: number;
    Files: any[];
    AmountCliam: number;
  };
  Investigation?: {
    BilledAmount: number;
    ClaimedAmount: number;
  }[];
  InvestigationNotFinalBill?: {
    BilledAmount: number;
    Files: any[];
    AmountCliam: number;
  };
  RoomRent?: {
    BilledAmount: number;
    ClaimedAmount: number;
  }[];
  OtherBill?: {
    BilledAmount: number;
    ClaimedAmount: number;
  };
  Procedure?: {
    BilledAmount: number;
    ClaimedAmount: number;
  }[];
  OtherBillNotFinalBill?: {
    BilledAmount: number;
    Files: any[];
    ClaimedAmount: number;
  };
  PatientId?: number;
  RequestName?: string;
  Reason?: string;
  PayTo?: string;
  HospitalName: string;
  HospitalRegNo: string;
  DateOfAdmission: string; 
  DateofDischarge: string; 
  DoctorName?: string;
  IsPreHospitalizationExpenses: boolean;
  PreHospitalizationExpensesMedicine?: {
    BilledAmount: number;
    Files: any[];
    ClaimedAmount: number;
    ClaimDate: string;
  };
  PreHospitalizationExpensesConsultation?: {
    BilledAmount: number;
    Files: any[];
    ClaimedAmount: number;
    ClaimDate: string;
  };
  PreHospitalizationExpensesInvestigation?: {
    BilledAmount: number;
    Files: any[];
    ClaimedAmount: number;
    ClaimDate: string;
  };
  PreHospitalizationExpensesOther?: {
    BilledAmount: number;
    Files: any[];
    ClaimedAmount: number;
    ClaimDate: string;
  };
  PreHospitalizationProcedure?: {
    BilledAmount: number;
    Files: any[];
    ClaimedAmount: number;
    ClaimDate: string;
  };
  PostHospitalTreatmentAdviseUpload?: any[];
  Digonosis?: string;
  TreatmentType?: string;
  IsHospitialEmpanpanelled?: boolean;
  HospitalId?: string;
  IsPostHospitalization: boolean;
  HospitalIncomeTaxFile?: { Files: any[] };
  HospitalRegstrationDetailsFile?: { Files: any[] };
  PaidAmount?: number;
}

const RaiseClaim = () => {
  // State for all form sections
  const [patientDetails, setPatientDetails] = useState<Partial<ClaimRequest>>({})
  const [billDetails, setBillDetails] = useState<Partial<ClaimRequest>>({})
  const [preHospDetails, setPreHospDetails] = useState<Partial<ClaimRequest>>({})
  const [postHospDetails, setPostHospDetails] = useState<Partial<ClaimRequest>>({})

  const dispatch = useAppDispatch();
  const claimState = useAppSelector((state) => state.claim);


  const handleSubmit = async () => {
    // Merge all form data into a single payload for API
    const rawPayload = {
      ...patientDetails,
      ...billDetails,
      ...preHospDetails,
      ...postHospDetails,
    };
    // Removed debug log for production
    const payload = {
      // Required fields (always present, correct type)
      Unit: rawPayload.Unit || 'jdj',
      PayTo: rawPayload.PayTo || 'kbbc',
      Reason: rawPayload.Reason || 'db',
      RoomRent: rawPayload.RoomRent || 200,
      Digonosis: rawPayload.Digonosis || 'dnkkd',
      Procedure: rawPayload.Procedure || 22,
      HospitalId: rawPayload.HospitalId || '6767',
      MedicenBill: rawPayload.MedicenBill || 77,
      RequestName: rawPayload.RequestName || 'dnd',
      Consultation: rawPayload.Consultation || 88,
      HospitalName: rawPayload.HospitalName || 'Default Hospital',
      HospitalRegNo: rawPayload.HospitalRegNo || 'jbdnd',
      Investigation: rawPayload.Investigation || 33,
      TreatmentType: rawPayload.TreatmentType || 'djd',
      ClaimPdfUpload: rawPayload.ClaimPdfUpload || 'jdx',
      AdmissionAdviceUpload: rawPayload.AdmissionAdviceUpload || ['dj'],
      DischargeSummaryUpload: rawPayload.DischargeSummaryUpload || ['dn'],
      FinalHospitalBillUpload: rawPayload.FinalHospitalBillUpload || 22,
      InvestigationReportsUpload: rawPayload.InvestigationReportsUpload || ['dn'],

      // Optional/derived fields (as before)
      IsSpecailDisease: rawPayload.IsSpecailDisease || false,
      IsTaxAble: rawPayload.IsTaxAble || true,
      SpecialDiseaseName: rawPayload.SpecialDiseaseName || '',
      ClaimAmount: rawPayload.ClaimAmount || 0,
      EmpId: rawPayload.EmpId || 0,
      FinalHospitalBill: rawPayload.FinalHospitalBill || 0,
      "MedicenBill.BilledAmount": rawPayload.MedicenBill?.map(b => b.BilledAmount) || 0,
      "MedicenBill.ClaimedAmount": rawPayload.MedicenBill?.map(b => b.ClaimedAmount) || 0,
      "MedicenNotFinalBill.Amount": rawPayload.MedicenNotFinalBill?.Amount || 0,
      "MedicenNotFinalBill.Files": rawPayload.MedicenNotFinalBill?.Files || [],
      "MedicenNotFinalBill.AmountCliam": rawPayload.MedicenNotFinalBill?.AmountCliam || 0,
      "Consultation.BilledAmount": rawPayload.Consultation?.map(b => b.BilledAmount) || 0,
      "Consultation.ClaimedAmount": rawPayload.Consultation?.map(b => b.ClaimedAmount) || 0,
      "ConsultationNotFinalBill.BilledAmount": rawPayload.ConsultationNotFinalBill?.BilledAmount || 0,
      "ConsultationNotFinalBill.Files": rawPayload.ConsultationNotFinalBill?.Files || [],
      "ConsultationNotFinalBill.AmountCliam": rawPayload.ConsultationNotFinalBill?.AmountCliam || 0,
      "Investigation.BilledAmount": rawPayload.Investigation?.map(b => b.BilledAmount) || 0,
      "Investigation.ClaimedAmount": rawPayload.Investigation?.map(b => b.ClaimedAmount) || 0,
      "InvestigationNotFinalBill.BilledAmount": rawPayload.InvestigationNotFinalBill?.BilledAmount || 0,
      "InvestigationNotFinalBill.Files": rawPayload.InvestigationNotFinalBill?.Files || [],
      "InvestigationNotFinalBill.AmountCliam": rawPayload.InvestigationNotFinalBill?.AmountCliam || 0,
      "RoomRent.BilledAmount": rawPayload.RoomRent?.map(b => b.BilledAmount) || 0,
      "RoomRent.ClaimedAmount": rawPayload.RoomRent?.map(b => b.ClaimedAmount) || 0,
      "OtherBill.BilledAmount": rawPayload.OtherBill?.BilledAmount || 0,
      "OtherBill.ClaimedAmount": rawPayload.OtherBill?.ClaimedAmount || 0,
      "Procedure.BilledAmount": rawPayload.Procedure?.map(b => b.BilledAmount) || 0,
      "Procedure.ClaimedAmount": rawPayload.Procedure?.map(b => b.ClaimedAmount) || 0,
      "OtherBillNotFinalBill.BilledAmount": rawPayload.OtherBillNotFinalBill?.BilledAmount || 0,
      "OtherBillNotFinalBill.Files": rawPayload.OtherBillNotFinalBill?.Files || [],
      "OtherBillNotFinalBill.ClaimedAmount": rawPayload.OtherBillNotFinalBill?.ClaimedAmount || 0,
      PatientId: rawPayload.PatientId || 0,
      DateOfAdmission: rawPayload.DateOfAdmission || '',
      DateofDischarge: rawPayload.DateofDischarge || '',
      DoctorName: rawPayload.DoctorName || '',
      IsPreHospitalizationExpenses: rawPayload.IsPreHospitalizationExpenses || false,
      "PreHospitalizationExpensesMedicine.BilledAmount": rawPayload.PreHospitalizationExpensesMedicine?.BilledAmount || 0,
      "PreHospitalizationExpensesMedicine.Files": rawPayload.PreHospitalizationExpensesMedicine?.Files || [],
      "PreHospitalizationExpensesMedicine.ClaimedAmount": rawPayload.PreHospitalizationExpensesMedicine?.ClaimedAmount || 0,
      "PreHospitalizationExpensesMedicine.ClaimDate": rawPayload.PreHospitalizationExpensesMedicine?.ClaimDate || '',
      "PreHospitalizationExpensesConsultation.BilledAmount": rawPayload.PreHospitalizationExpensesConsultation?.BilledAmount || 0,
      "PreHospitalizationExpensesConsultation.Files": rawPayload.PreHospitalizationExpensesConsultation?.Files || [],
      "PreHospitalizationExpensesConsultation.ClaimedAmount": rawPayload.PreHospitalizationExpensesConsultation?.ClaimedAmount || 0,
      "PreHospitalizationExpensesConsultation.ClaimDate": rawPayload.PreHospitalizationExpensesConsultation?.ClaimDate || '',
      "PreHospitalizationExpensesInvestigation.BilledAmount": rawPayload.PreHospitalizationExpensesInvestigation?.BilledAmount || 0,
      "PreHospitalizationExpensesInvestigation.Files": rawPayload.PreHospitalizationExpensesInvestigation?.Files || [],
      "PreHospitalizationExpensesInvestigation.ClaimedAmount": rawPayload.PreHospitalizationExpensesInvestigation?.ClaimedAmount || 0,
      "PreHospitalizationExpensesInvestigation.ClaimDate": rawPayload.PreHospitalizationExpensesInvestigation?.ClaimDate || '',
      "PreHospitalizationExpensesOther.BilledAmount": rawPayload.PreHospitalizationExpensesOther?.BilledAmount || 0,
      "PreHospitalizationExpensesOther.Files": rawPayload.PreHospitalizationExpensesOther?.Files || [],
      "PreHospitalizationExpensesOther.ClaimedAmount": rawPayload.PreHospitalizationExpensesOther?.ClaimedAmount || 0,
      "PreHospitalizationExpensesOther.ClaimDate": rawPayload.PreHospitalizationExpensesOther?.ClaimDate || '',
      "PreHospitalizationProcedure.BilledAmount": rawPayload.PreHospitalizationProcedure?.BilledAmount || 0,
      "PreHospitalizationProcedure.Files": rawPayload.PreHospitalizationProcedure?.Files || [],
      "PreHospitalizationProcedure.ClaimedAmount": rawPayload.PreHospitalizationProcedure?.ClaimedAmount || 0,
      "PreHospitalizationProcedure.ClaimDate": rawPayload.PreHospitalizationProcedure?.ClaimDate || '',
      PostHospitalTreatmentAdviseUpload: rawPayload.PostHospitalTreatmentAdviseUpload || [],
      IsHospitialEmpanpanelled: rawPayload.IsHospitialEmpanpanelled || false,
      IsPostHospitalization: rawPayload.IsPostHospitalization || false,
      "HospitalIncomeTaxFile.Files": rawPayload.HospitalIncomeTaxFile?.Files || [],
      "HospitalRegstrationDetailsFile.Files": rawPayload.HospitalRegstrationDetailsFile?.Files || [],
      PaidAmount: rawPayload.PaidAmount || 0,
    };
    dispatch(submitClaim(payload));
  }


  // Helper to ensure claimed amount does not exceed billed amount
  function clampClaimed(billed: number, claimed: number) {
    return Math.min(Number(claimed) || 0, Number(billed) || 0);
  }


  // Pre Hospitalization Billed Amount (sum of billed)
  const preHospBilledAmount = [
    preHospDetails?.PreHospitalizationExpensesMedicine?.BilledAmount || 0,
    preHospDetails?.PreHospitalizationExpensesConsultation?.BilledAmount || 0,
    preHospDetails?.PreHospitalizationExpensesInvestigation?.BilledAmount || 0,
    preHospDetails?.PreHospitalizationProcedure?.BilledAmount || 0,
    preHospDetails?.PreHospitalizationExpensesOther?.BilledAmount || 0,
  ].reduce((sum, val) => sum + Number(val), 0);

  // Pre Hospitalization Claimed Amount (sum of claimed)
  const preHospClaimedAmount = [
    preHospDetails?.PreHospitalizationExpensesMedicine?.ClaimedAmount || 0,
    preHospDetails?.PreHospitalizationExpensesConsultation?.ClaimedAmount || 0,
    preHospDetails?.PreHospitalizationExpensesInvestigation?.ClaimedAmount || 0,
    preHospDetails?.PreHospitalizationProcedure?.ClaimedAmount || 0,
    preHospDetails?.PreHospitalizationExpensesOther?.ClaimedAmount || 0,
  ].reduce((sum, val) => sum + Number(val), 0);
  // ...

  // Hospitalization Billed Amount (sum of billed)
  const hospBilledAmount = [
    ...(billDetails?.MedicenBill?.map(b => b.BilledAmount) || []),
    ...(billDetails?.Consultation?.map(b => b.BilledAmount) || []),
    ...(billDetails?.Investigation?.map(b => b.BilledAmount) || []),
    ...(billDetails?.RoomRent?.map(b => b.BilledAmount) || []),
    ...(billDetails?.Procedure?.map(b => b.BilledAmount) || []),
    billDetails?.OtherBill?.BilledAmount || 0,
  ].reduce((sum, val) => sum + Number(val), 0);

  // Hospitalization Claimed Amount (sum of claimed)
  const hospClaimedAmount = [
    ...(billDetails?.MedicenBill?.map(b => b.ClaimedAmount) || []),
    ...(billDetails?.Consultation?.map(b => b.ClaimedAmount) || []),
    ...(billDetails?.Investigation?.map(b => b.ClaimedAmount) || []),
    ...(billDetails?.RoomRent?.map(b => b.ClaimedAmount) || []),
    ...(billDetails?.Procedure?.map(b => b.ClaimedAmount) || []),
    billDetails?.OtherBill?.ClaimedAmount || 0,
  ].reduce((sum, val) => sum + Number(val), 0);
  // ...

  // Net Total: sum of claimed amount pre and hospitalization (should be only claimed, not billed)
  const netTotal = preHospClaimedAmount + hospClaimedAmount;

  // PaidAmount (if you have an advance/paid field, otherwise 0)
  const paidAmount = postHospDetails?.PaidAmount || 0;

  // Merge summary into postHospDetails
  const postHospDetailsWithSummary = {
    ...postHospDetails,
    PreHospitalizationExpenseAmount: preHospBilledAmount, // use claimed amount for summary
    HospitalizationExpenseAmount: hospBilledAmount, // use claimed amount for summary
    PaidAmount: paidAmount,
    NetTotal: netTotal,
  };
  // ...
  return (
    <div className='bg-gray-100 p-2 min-h-screen'>
      {/* Submission status UI */}
      {claimState.loading && (
        <div className="w-full text-center py-2 text-blue-700 font-semibold">Submitting claim...</div>
      )}
      {claimState.error && (
        <div className="w-full text-center py-2 text-red-600 font-semibold">
          {typeof claimState.error === 'object' ? JSON.stringify(claimState.error) : claimState.error}
        </div>
      )}
      {claimState.success && (
        <div className="w-full text-center py-2 text-green-600 font-semibold">Claim submitted successfully!</div>
      )}
      <div className='mt-4'>
        <PatientDetails patientDetail={patientDetails} patientDetailOnChange={setPatientDetails} />
      </div>
      <div className='mt-4'>
        <BillDetailsForm
          billDetails={billDetails}
          onChange={setBillDetails}
          preHospBilledAmount={[
            preHospDetails?.PreHospitalizationExpensesMedicine?.BilledAmount || 0,
            preHospDetails?.PreHospitalizationExpensesConsultation?.BilledAmount || 0,
            preHospDetails?.PreHospitalizationExpensesInvestigation?.BilledAmount || 0,
            preHospDetails?.PreHospitalizationProcedure?.BilledAmount || 0,
            preHospDetails?.PreHospitalizationExpensesOther?.BilledAmount || 0,
          ].reduce((sum, val) => sum + Number(val), 0)}
        />
      </div>
      <div className='mt-4'>
        <PreHospitalizationForm preHospitalizationForm={preHospDetails} onChange={setPreHospDetails} />
      </div>
      <div className=''>
        <PostHospitalizationAndDeclaration
          postHospitalizationAndDeclaration={postHospDetailsWithSummary}
          onChange={setPostHospDetails}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}

export default RaiseClaim