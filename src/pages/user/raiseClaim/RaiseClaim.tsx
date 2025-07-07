'use client';
import React, { useState } from 'react';
import { submitDirectClaim, getMyClaims } from '@/features/user/claim/claimSlice';
import type { RootState } from '@/app/store';
import PatientDetails from './PatientDetails';
import BillDetailsForm from './BillDetails';
import PreHospitalizationForm from './PreHospitalizationForm';
import PostHospitalizationAndDeclaration from './PostHospital';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import Loader from '@/components/ui/loader'; // ✅ Imported loader

interface ClaimRequest {
  IsSpecailDisease: boolean;
  IsTaxAble: boolean;
  SpecialDiseaseName?: string;
  ClaimAmount?: number;
  ClaimPdfUpload?: string;
  AdmissionAdviceUpload?: any[];
  DischargeSummaryUpload?: any[];
  InvestigationReportsUpload?: any[];
  EmpId?: number;
  Unit?: string;
  FinalHospitalBill?: number;
  FinalHospitalBillUpload?: any[];
  MedicenBill?: { BilledAmount: number; ClaimedAmount: number }[];
  MedicenNotFinalBill?: { Amount: number; Files: any[]; AmountCliam: number };
  Consultation?: { BilledAmount: number; ClaimedAmount: number }[];
  ConsultationNotFinalBill?: { BilledAmount: number; Files: any[]; AmountCliam: number };
  Investigation?: { BilledAmount: number; ClaimedAmount: number }[];
  InvestigationNotFinalBill?: { BilledAmount: number; Files: any[]; AmountCliam: number };
  RoomRent?: { BilledAmount: number; ClaimedAmount: number }[];
  OtherBill?: { BilledAmount: number; ClaimedAmount: number };
  Procedure?: { BilledAmount: number; ClaimedAmount: number }[];
  OtherBillNotFinalBill?: { BilledAmount: number; Files: any[]; ClaimedAmount: number };
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
  PreHospitalizationExpensesMedicine?: { BilledAmount: number; Files: any[]; ClaimedAmount: number; ClaimDate: string };
  PreHospitalizationExpensesConsultation?: { BilledAmount: number; Files: any[]; ClaimedAmount: number; ClaimDate: string };
  PreHospitalizationExpensesInvestigation?: { BilledAmount: number; Files: any[]; ClaimedAmount: number; ClaimDate: string };
  PreHospitalizationExpensesOther?: { BilledAmount: number; Files: any[]; ClaimedAmount: number; ClaimDate: string };
  PreHospitalizationProcedure?: { BilledAmount: number; Files: any[]; ClaimedAmount: number; ClaimDate: string };
  PostHospitalTreatmentAdviseUpload?: any[];
  Digonosis?: string;
  TreatmentType?: string;
  IsHospitialEmpanpanelled?: boolean;
  HospitalId?: string;
  IsPostHospitalization: boolean;
  HospitalIncomeTaxFile?: { Files: any[] };
  HospitalRegstrationDetailsFile?: { Files: any[] };
  PaidAmount?: number;
  NotIncluded?: { BilledAmount: number; ClaimedAmount: number; files?: File[] }[];
  claimedTotal?: number;
}

type RaiseClaimProps = {
  onCloseForm: () => void;
};

const RaiseClaim = ({ onCloseForm }: RaiseClaimProps) => {
  const [patientDetails, setPatientDetails] = useState<Partial<ClaimRequest>>({});
  const [billDetails, setBillDetails] = useState<Partial<ClaimRequest>>({});
  const [preHospDetails, setPreHospDetails] = useState<Partial<ClaimRequest>>({});
  const [postHospDetails, setPostHospDetails] = useState<Partial<ClaimRequest>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();

  const preHospBilledAmount = [
    preHospDetails?.PreHospitalizationExpensesMedicine?.BilledAmount || 0,
    preHospDetails?.PreHospitalizationExpensesConsultation?.BilledAmount || 0,
    preHospDetails?.PreHospitalizationExpensesInvestigation?.BilledAmount || 0,
    preHospDetails?.PreHospitalizationProcedure?.BilledAmount || 0,
    preHospDetails?.PreHospitalizationExpensesOther?.BilledAmount || 0,
  ].reduce((sum, val) => sum + Number(val), 0);

  const hospBilledAmount = [
    ...(billDetails?.MedicenBill?.map((b) => b.BilledAmount) || []),
    ...(billDetails?.Consultation?.map((b) => b.BilledAmount) || []),
    ...(billDetails?.Investigation?.map((b) => b.BilledAmount) || []),
    ...(billDetails?.RoomRent?.map((b) => b.BilledAmount) || []),
    ...(billDetails?.Procedure?.map((b) => b.BilledAmount) || []),
    billDetails?.OtherBill?.BilledAmount || 0,
  ].reduce((sum, val) => sum + Number(val), 0);

  const hospClaimedAmount = [
    ...(billDetails?.MedicenBill?.map((b) => b.ClaimedAmount) || []),
    ...(billDetails?.Consultation?.map((b) => b.ClaimedAmount) || []),
    ...(billDetails?.Investigation?.map((b) => b.ClaimedAmount) || []),
    ...(billDetails?.RoomRent?.map((b) => b.ClaimedAmount) || []),
    ...(billDetails?.Procedure?.map((b) => b.ClaimedAmount) || []),
    billDetails?.OtherBill?.ClaimedAmount || 0,
  ].reduce((sum, val) => sum + Number(val), 0);

  const netTotal = hospClaimedAmount + [
    preHospDetails?.PreHospitalizationExpensesMedicine?.ClaimedAmount || 0,
    preHospDetails?.PreHospitalizationExpensesConsultation?.ClaimedAmount || 0,
    preHospDetails?.PreHospitalizationExpensesInvestigation?.ClaimedAmount || 0,
    preHospDetails?.PreHospitalizationProcedure?.ClaimedAmount || 0,
    preHospDetails?.PreHospitalizationExpensesOther?.ClaimedAmount || 0,
  ].reduce((sum, val) => sum + Number(val), 0);

  const postHospDetailsWithSummary = {
    ...postHospDetails,
    PreHospitalizationExpenseAmount: preHospBilledAmount,
    HospitalizationExpenseAmount: hospBilledAmount,
    PaidAmount: postHospDetails?.PaidAmount || 0,
    NetTotal: netTotal,
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // your full formData logic here (no change made to that)
      const rawPayload = {
        ...patientDetails,
        ...billDetails,
        ...preHospDetails,
        ...postHospDetails,
      };

      const formData = new FormData();
      // ... your formData.append() code here as before ...

      await dispatch(submitDirectClaim(formData));
      await dispatch(getMyClaims(user.EmpCode));

      setPatientDetails({});
      setBillDetails({});
      setPreHospDetails({});
      setPostHospDetails({});
      onCloseForm();
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-100 p-2 min-h-screen">
      {isSubmitting ? (
        <div className="flex items-center justify-center h-full py-10">
          <Loader />
        </div>
      ) : (
        <>
          <div className="mt-4">
            <PatientDetails patientDetail={patientDetails} patientDetailOnChange={setPatientDetails} />
          </div>
          <div className="mt-4">
            <BillDetailsForm billDetails={billDetails} onChange={setBillDetails} preHospBilledAmount={preHospBilledAmount} />
          </div>
          <div className="mt-4">
            <PreHospitalizationForm preHospitalizationForm={preHospDetails} onChange={setPreHospDetails} />
          </div>
          <div>
            <PostHospitalizationAndDeclaration
              postHospitalizationAndDeclaration={postHospDetailsWithSummary}
              onChange={setPostHospDetails}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default RaiseClaim;
