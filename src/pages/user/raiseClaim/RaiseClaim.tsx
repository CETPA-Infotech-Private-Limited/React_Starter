import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitClaim, resetClaimState } from '@/features/user/claim/claimSlice';
import type { RootState, AppDispatch } from '@/app/store';
import PatientDetails from './PatientDetails';
import BillDetailsForm from './BillDetails';
import PreHospitalizationForm from './PreHospitalizationForm';
import PostHospitalizationAndDeclaration from './PostHospital';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { stat } from 'fs';
import { CloudFog } from 'lucide-react';


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
// const HiddenPdfComponent = ({ onPdfReady }: { onPdfReady: (pdfBlob: Blob) => void }) => {
//   const contentRef = useRef();

//   useEffect(() => {
//     // Timeout allows the content to render before PDF generation
//     setTimeout(() => {
//       if (typeof toPdf === 'function') toPdf();
//     }, 500);
//   }, []);
//    let toPdf: (() => void) | null = null;
  // State for all form sections
  const [patientDetails, setPatientDetails] = useState<Partial<ClaimRequest>>({});
  const [billDetails, setBillDetails] = useState<Partial<ClaimRequest>>({});
  const [preHospDetails, setPreHospDetails] = useState<Partial<ClaimRequest>>({});
  const [postHospDetails, setPostHospDetails] = useState<Partial<ClaimRequest>>({});

  const user = useAppSelector((state: RootState) => state.user);
  console.log('user in RaiseClaim.tsx', user.EmpCode);

  const dispatch = useAppDispatch();
  const claimState = useAppSelector((state) => state.claim);

  const handleSubmit = async () => {
  const rawPayload = {
    ...patientDetails,
    ...billDetails,
    ...preHospDetails,
    ...postHospDetails,
  };
  console.log("rawPayload.TreatmentType",rawPayload.TreatmentType)

  const formData = new FormData();

  // String fields
  formData.append('Unit', user.unitId);
  formData.append('PayTo', rawPayload.PayTo || 'Doctor');
  formData.append('Reason', rawPayload.Reason || 'This is A Reason');
  formData.append('RequestName', rawPayload.RequestName || 'Claim Request');
  formData.append('HospitalName', rawPayload.HospitalName || '');
  formData.append('HospitalRegNo', rawPayload.HospitalRegNo || '');
  formData.append('TreatmentType', 'Hello');
  formData.append('Digonosis', rawPayload.Digonosis || '');
  formData.append('DoctorName', rawPayload.DoctorName || '');
  formData.append('DateOfAdmission', rawPayload.DateOfAdmission || '');
  formData.append('DateofDischarge', rawPayload.DateofDischarge || '');

  // Boolean fields
  formData.append('IsSpecailDisease', 'true');
  formData.append('IsTaxAble', String(rawPayload.IsTaxAble ?? true));
  formData.append('IsPreHospitalizationExpenses', String(rawPayload.IsPreHospitalizationExpenses ?? false));

  // Numbers
  formData.append('ClaimAmount', String(rawPayload.ClaimAmount || 100.0));
  formData.append('FinalHospitalBill', String(rawPayload.FinalHospitalBill || 0));
  formData.append('EmpId', String(user.EmpCode || 0));
  formData.append('PaidAmount', String(rawPayload.PaidAmount || 0));

  formData.append('HospitalId', String(rawPayload.HospitalId || '123')); // fallback non-empty string
formData.append('HospitalName', String(rawPayload.HospitalName || 'City Hospital'));
formData.append('HospitalRegNo', String(rawPayload.HospitalRegNo || 'REG-00001'));



  // File uploads (use repeated fields)
  rawPayload.AdmissionAdviceUpload?.forEach((file: File) =>
    formData.append('AdmissionAdviceUpload', file)
  );
  rawPayload.DischargeSummaryUpload?.forEach((file: File) =>
    formData.append('DischargeSummaryUpload', file)
  );
  rawPayload.InvestigationReportsUpload?.forEach((file: File) =>
    formData.append('InvestigationReportsUpload', file)
  );
  rawPayload.FinalHospitalBillUpload?.forEach((file: File) =>
    formData.append('FinalHospitalBillUpload', file)
  );
  rawPayload.PostHospitalTreatmentAdviseUpload?.forEach((file: File) =>
    formData.append('PostHospitalTreatmentAdviseUpload', file)
  );

  // Flattened billing fields
  const medicen = rawPayload.MedicenBill?.[0];
  if (medicen) {
    formData.append('MedicenBill.BilledAmount', String(medicen.BilledAmount));
    formData.append('MedicenBill.ClaimedAmount', String(medicen.ClaimedAmount));
  }

  const consultation = rawPayload.Consultation?.[0];
  if (consultation) {
    formData.append('Consultation.BilledAmount', String(consultation.BilledAmount));
  }

  const investigation = rawPayload.Investigation?.[0];
  if (investigation) {
    formData.append('Investigation.BilledAmount', String(investigation.BilledAmount));
  }

  const procedure = rawPayload.Procedure?.[0];
  if (procedure) {
    formData.append('Procedure.BilledAmount', String(procedure.BilledAmount));
    formData.append('Procedure.ClaimedAmount', String(procedure.ClaimedAmount));
  }

  const roomRent = rawPayload.RoomRent?.[0];
  if (roomRent) {
    formData.append('RoomRent.BilledAmount', String(roomRent.BilledAmount));
  }

  if (rawPayload.OtherBill) {
    formData.append('OtherBill.BilledAmount', String(rawPayload.OtherBill.BilledAmount));
    formData.append('OtherBill.ClaimedAmount', String(rawPayload.OtherBill.ClaimedAmount));
  }

  // Additional nested file arrays
  rawPayload.MedicenNotFinalBill?.Files?.forEach((file: File, i: number) =>
    formData.append(`MedicenNotFinalBill.Files[${i}]`, file)
  );
  rawPayload.HospitalIncomeTaxFile?.Files?.forEach((file: File, i: number) =>
    formData.append(`HospitalIncomeTaxFile.Files[${i}]`, file)
  );
  rawPayload.HospitalRegstrationDetailsFile?.Files?.forEach((file: File, i: number) =>
    formData.append(`HospitalRegstrationDetailsFile.Files[${i}]`, file)
  );

  // Final file if needed
  if (rawPayload.FinalHospitalBillUpload?.[0]) {
    formData.append('ClaimPdfUpload', rawPayload.FinalHospitalBillUpload[0]);
  }

  console.log('Final FormData Payload:', formData);
  dispatch(submitClaim(formData));
};

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
    ...(billDetails?.MedicenBill?.map((b) => b.BilledAmount) || []),
    ...(billDetails?.Consultation?.map((b) => b.BilledAmount) || []),
    ...(billDetails?.Investigation?.map((b) => b.BilledAmount) || []),
    ...(billDetails?.RoomRent?.map((b) => b.BilledAmount) || []),
    ...(billDetails?.Procedure?.map((b) => b.BilledAmount) || []),
    billDetails?.OtherBill?.BilledAmount || 0,
  ].reduce((sum, val) => sum + Number(val), 0);

  // Hospitalization Claimed Amount (sum of claimed)
  const hospClaimedAmount = [
    ...(billDetails?.MedicenBill?.map((b) => b.ClaimedAmount) || []),
    ...(billDetails?.Consultation?.map((b) => b.ClaimedAmount) || []),
    ...(billDetails?.Investigation?.map((b) => b.ClaimedAmount) || []),
    ...(billDetails?.RoomRent?.map((b) => b.ClaimedAmount) || []),
    ...(billDetails?.Procedure?.map((b) => b.ClaimedAmount) || []),
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
    <div  className="bg-gray-100 p-2 min-h-screen">
      {/* Submission status UI
      {claimState.loading && <div className="w-full text-center py-2 text-blue-700 font-semibold">Submitting claim...</div>}
      {claimState.error && (
        <div className="w-full text-center py-2 text-red-600 font-semibold">
          {typeof claimState.error === 'object' ? JSON.stringify(claimState.error) : claimState.error}
        </div>
      )}
      {claimState.success && <div className="w-full text-center py-2 text-green-600 font-semibold">Claim submitted successfully!</div>} */}
      <div className="mt-4">
        <PatientDetails patientDetail={patientDetails} patientDetailOnChange={setPatientDetails} />
      </div>
      <div className="mt-4">
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
      <div className="mt-4">
        <PreHospitalizationForm preHospitalizationForm={preHospDetails} onChange={setPreHospDetails} />
      </div>
      <div className="">
        <PostHospitalizationAndDeclaration
          postHospitalizationAndDeclaration={postHospDetailsWithSummary}
          onChange={setPostHospDetails}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default RaiseClaim;
