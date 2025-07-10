import React, { useEffect, useState } from 'react';
import { submitDirectClaim, getMyClaims, submitAdvanceClaimSettle, resetAdvanceClaimSettleState } from '@/features/user/claim/claimSlice';
import type { RootState } from '@/app/store';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import Loader from '@/components/ui/loader';
import PatientDetails from '@/components/user/advanceClaim/PatientDetails';
import PreHospitalizationForm from '@/components/user/advanceClaim/PreHospitalizationForm';
import BillDetailsForm from '@/components/user/advanceClaim/BillDetails';
import PostHospitalizationAndDeclaration from '@/components/user/advanceClaim/PostHospital';
import toast from 'react-hot-toast';

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
  claimedTotal?: number; // Added properties for files to rawPayload for pre-hospitalization forms
  PreHospitalizationProcedureFiles?: File[];
  PreHospitalizationExpensesOtherFiles?: File[];
  PreHospitalizationExpensesMedicineFiles?: File[];
  PreHospitalizationExpensesInvestigationFiles?: File[];
  PreHospitalizationExpensesConsultationFiles?: File[];
}

type AdvanceClaimSettleProps = {
  onCloseForm: () => void;
  defaultData: any;
};

const AdvanceClaimSettle = ({ onCloseForm, defaultData }: AdvanceClaimSettleProps) => {
  const [patientDetails, setPatientDetails] = useState<Partial<ClaimRequest>>({});
  const [billDetails, setBillDetails] = useState<Partial<ClaimRequest>>({});
  const [preHospDetails, setPreHospDetails] = useState<Partial<ClaimRequest>>({});
  const [postHospDetails, setPostHospDetails] = useState<Partial<ClaimRequest>>({});
  const { advanceSettleSuccess, advanceSettleError, advanceSettleLoading } = useAppSelector((state) => state.claim);

  const user = useAppSelector((state: RootState) => state.user);
  console.log('defaultData,');
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

  const netTotal =
    hospClaimedAmount +
    [
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
    try {
      const rawPayload: Partial<ClaimRequest> = {
        ...patientDetails,
        ...billDetails,
        ...preHospDetails,
        ...postHospDetails,
      };
      const formData = new FormData();
      formData.append('Unit', user.unitId || '');
      formData.append('AdvanceId', defaultData?.selectedAdvanceClaim?.advanceId || '');

      formData.append('PayTo', rawPayload.PayTo || 'Hospital');
      formData.append('patientId', String(defaultData?.selectedAdvanceClaim?.patientId));
      formData.append('Reason', rawPayload.Reason || 'This is A Reason');
      formData.append('RequestName', rawPayload.RequestName || 'Claim Request');
      formData.append('HospitalName', rawPayload.HospitalName || rawPayload.HospitalId || ''); // Added optional chaining and fallback
      formData.append('HospitalRegNo', rawPayload.HospitalRegNo || rawPayload.HospitalId || ''); // Added optional chaining and fallback
      formData.append('TreatmentType', rawPayload.TreatmentType || '');
      formData.append('Digonosis', rawPayload.Digonosis || '');
      formData.append('DoctorName', rawPayload.DoctorName || '');
      formData.append('DateOfAdmission', rawPayload.DateOfAdmission || '');
      formData.append('DateofDischarge', rawPayload.DateofDischarge || '');
      formData.append('IsSpecailDisease', String(rawPayload.IsSpecailDisease ?? false)); // Ensure boolean is stringified
      formData.append('IsTaxAble', String(rawPayload.IsTaxAble ?? true));
      formData.append('IsPreHospitalizationExpenses', String(rawPayload.IsPreHospitalizationExpenses ?? false)); // Pre-hospitalization expenses with optional chaining

      formData.append('PreHospitalizationExpensesMedicine.BilledAmount', String(rawPayload.PreHospitalizationExpensesMedicine?.BilledAmount || 0));
      formData.append('PreHospitalizationExpensesMedicine.ClaimedAmount', String(rawPayload.PreHospitalizationExpensesMedicine?.ClaimedAmount || 0));
      formData.append('PreHospitalizationExpensesMedicine.ClaimDate', rawPayload.PreHospitalizationExpensesMedicine?.ClaimDate || '');

      formData.append('PreHospitalizationExpensesConsultation.BilledAmount', String(rawPayload.PreHospitalizationExpensesConsultation?.BilledAmount || 0));
      formData.append('PreHospitalizationExpensesConsultation.ClaimedAmount', String(rawPayload.PreHospitalizationExpensesConsultation?.ClaimedAmount || 0));
      formData.append('PreHospitalizationExpensesConsultation.ClaimDate', rawPayload.PreHospitalizationExpensesConsultation?.ClaimDate || '');
      formData.append('PreHospitalizationExpensesInvestigation.BilledAmount', String(rawPayload.PreHospitalizationExpensesInvestigation?.BilledAmount || 0));
      formData.append('PreHospitalizationExpensesInvestigation.ClaimedAmount', String(rawPayload.PreHospitalizationExpensesInvestigation?.ClaimedAmount || 0));
      formData.append('PreHospitalizationExpensesInvestigation.ClaimDate', rawPayload.PreHospitalizationExpensesInvestigation?.ClaimDate || '');

      formData.append('PreHospitalizationExpensesOther.BilledAmount', String(rawPayload.PreHospitalizationExpensesOther?.BilledAmount || 0));
      formData.append('PreHospitalizationExpensesOther.ClaimedAmount', String(rawPayload.PreHospitalizationExpensesOther?.ClaimedAmount || 0));
      formData.append('PreHospitalizationExpensesOther.ClaimDate', rawPayload.PreHospitalizationExpensesOther?.ClaimDate || '');

      formData.append('PreHospitalizationProcedure.BilledAmount', String(rawPayload.PreHospitalizationProcedure?.BilledAmount || 0));
      formData.append('PreHospitalizationProcedure.ClaimedAmount', String(rawPayload.PreHospitalizationProcedure?.ClaimedAmount || 0));
      formData.append('PreHospitalizationProcedure.ClaimDate', rawPayload.PreHospitalizationProcedure?.ClaimDate || '');
      rawPayload.PreHospitalizationProcedure?.Files?.forEach((file: File) => formData.append('PreHospitalizationProcedure.Files', file));
      rawPayload.PreHospitalizationExpensesOther?.Files?.forEach((file: File) => formData.append('PreHospitalizationExpensesOther.Files', file));
      rawPayload.PreHospitalizationExpensesMedicine?.Files?.forEach((file: File) => formData.append('PreHospitalizationExpensesMedicine.Files', file));
      rawPayload.PreHospitalizationExpensesInvestigation?.Files?.forEach((file: File) =>
        formData.append('PreHospitalizationExpensesInvestigation.Files', file)
      );
      rawPayload.PreHospitalizationExpensesConsultation?.Files?.forEach((file: File) => formData.append('PreHospitalizationExpensesConsultation.Files', file));

      formData.append('ClaimAmount', String(netTotal));
      formData.append('FinalHospitalBill', String(rawPayload.FinalHospitalBill || 0));
      formData.append('EmpId', String(user.EmpCode || 0));
      formData.append('HospitalId', String(rawPayload.HospitalId || '123'));

      rawPayload.AdmissionAdviceUpload?.forEach((file: File) => formData.append('AdmissionAdviceUpload', file));
      rawPayload.DischargeSummaryUpload?.forEach((file: File) => formData.append('DischargeSummaryUpload', file));
      rawPayload.InvestigationReportsUpload?.forEach((file: File) => formData.append('InvestigationReportsUpload', file));
      rawPayload.FinalHospitalBillUpload?.forEach((file: File) => formData.append('FinalHospitalBillUpload', file));
      rawPayload.PostHospitalTreatmentAdviseUpload?.forEach((file: File) => formData.append('PostHospitalTreatmentAdviseUpload', file));

      const includedMedicen = (rawPayload.MedicenBill || []).filter((b: any) => b.included !== false);
      if (includedMedicen[0]) {
        formData.append('MedicenBill.BilledAmount', String(includedMedicen[0].BilledAmount));
        formData.append('MedicenBill.ClaimedAmount', String(includedMedicen[0].ClaimedAmount));
      }

      const includedConsultation = (rawPayload.Consultation || []).filter((b: any) => b.included !== false);
      if (includedConsultation[0]) {
        formData.append('Consultation.BilledAmount', String(includedConsultation[0].BilledAmount));
        formData.append('Consultation.ClaimedAmount', String(includedConsultation[0].ClaimedAmount));
      }

      const includedInvestigation = (rawPayload.Investigation || []).filter((b: any) => b.included !== false);
      if (includedInvestigation[0]) {
        formData.append('Investigation.BilledAmount', String(includedInvestigation[0].BilledAmount));
        formData.append('Investigation.ClaimedAmount', String(includedInvestigation[0].ClaimedAmount));
      }

      const includedProcedure = (rawPayload.Procedure || []).filter((b: any) => b.included !== false);
      if (includedProcedure[0]) {
        formData.append('Procedure.BilledAmount', String(includedProcedure[0].BilledAmount));
        formData.append('Procedure.ClaimedAmount', String(includedProcedure[0].ClaimedAmount));
      }

      const includedRoomRent = (rawPayload.RoomRent || []).filter((b: any) => b.included !== false);
      if (includedRoomRent[0]) {
        formData.append('RoomRent.BilledAmount', String(includedRoomRent[0].BilledAmount));
        formData.append('RoomRent.ClaimedAmount', String(includedRoomRent[0].ClaimedAmount));
      }

      if (rawPayload.OtherBill && rawPayload.OtherBill.included !== false) {
        formData.append('OtherBill.BilledAmount', String(rawPayload.OtherBill.BilledAmount));
        formData.append('OtherBill.ClaimedAmount', String(rawPayload.OtherBill.ClaimedAmount));
      }

      const notIncludedArr = Array.isArray(rawPayload.NotIncluded) ? rawPayload.NotIncluded : [];
      for (let i = 0; i < 4; i++) {
        const bill = notIncludedArr[i] || {};
        let prefix = '';
        switch (i) {
          case 0:
            prefix = 'MedicenNotFinalBill';
            break;
          case 1:
            prefix = 'ConsultationNotFinalBill';
            break;
          case 2:
            prefix = 'InvestigationNotFinalBill';
            break;
          case 3:
            prefix = 'OtherNotFinalBill';
            break;
        }
        const billedAmount = bill.billedAmount ?? bill.BilledAmount ?? 0;
        const claimedAmount = bill.claimedAmount ?? bill.ClaimedAmount ?? 0;
        if (prefix === 'MedicenNotFinalBill') {
          formData.append(`${prefix}.Amount`, String(billedAmount));
          formData.append(`${prefix}.AmountCliam`, String(claimedAmount));
        } else {
          formData.append(`${prefix}.BilledAmount`, String(billedAmount));
          formData.append(`${prefix}.AmountCliam`, String(claimedAmount));
        }
        (bill.files || []).forEach((file: File, j: number) => {
          formData.append(`${prefix}.Files[${j}]`, file);
        });
      }

      rawPayload.HospitalIncomeTaxFile?.Files?.forEach((file: File, i: number) => formData.append(`HospitalIncomeTaxFile.Files[${i}]`, file));
      rawPayload.HospitalRegstrationDetailsFile?.Files?.forEach((file: File, i: number) => formData.append(`HospitalRegstrationDetailsFile.Files[${i}]`, file));
      if (rawPayload.FinalHospitalBillUpload?.[0]) {
        formData.append('ClaimPdfUpload', rawPayload.FinalHospitalBillUpload[0]);
      }

      await dispatch(submitAdvanceClaimSettle(formData));
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
    }
  };

  useEffect(() => {
    if (advanceSettleSuccess) {
      toast.success('Advance claim settled successfully!');
      dispatch(getMyClaims(Number(user.EmpCode)));
      setPatientDetails({});
      setBillDetails({});
      setPreHospDetails({});
      setPostHospDetails({});

      onCloseForm();
      dispatch(resetAdvanceClaimSettleState());
    }

    if (advanceSettleError) {
      toast.error(advanceSettleError);
      dispatch(resetAdvanceClaimSettleState());
    }
  }, [advanceSettleSuccess, advanceSettleError, dispatch, user.EmpCode, onCloseForm]);

  return (
    <div className=" p-2 min-h-screen">
      <>
        <div className="mt-4">
          <PatientDetails patientDetail={patientDetails} patientDetailOnChange={setPatientDetails} defaultData={defaultData} />
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
            isSubmitting={advanceSettleLoading}
          />
        </div>
      </>
    </div>
  );
};

export default AdvanceClaimSettle;
