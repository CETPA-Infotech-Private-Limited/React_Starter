import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { BillItemDisplayRow, DisplayField, DisplayTable, InfoCard, PreHospDisplayRow, SectionHeader, StatusBadge } from './ReviewComponents';
import { Textarea } from '@/components/ui/textarea';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { submitClaimProcessByHr } from '@/features/doctor/doctorSlice';

const HospitalizationBillView = ({ claimDetail }: { claimDetail: any }) => {
  if (!claimDetail) return null;
  const user = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const { advanceBasicDetails, billDetails, preHospitalizationExpenses } = claimDetail;

  const billItems = [
    { id: 1, billType: 'Medicine', billedAmount: billDetails?.medicineBill ?? 0, claimedAmount: billDetails?.medicineClaim ?? 0 },
    { id: 2, billType: 'Consultation', billedAmount: billDetails?.consultationBill ?? 0, claimedAmount: billDetails?.consultationClaim ?? 0 },
    { id: 3, billType: 'Investigation', billedAmount: billDetails?.investigationBill ?? 0, claimedAmount: billDetails?.investigationClaim ?? 0 },
    { id: 4, billType: 'Room Rent', billedAmount: billDetails?.roomRentBill ?? 0, claimedAmount: billDetails?.roomRentClaim ?? 0 },
    { id: 5, billType: 'Other', billedAmount: billDetails?.othersBill ?? 0, claimedAmount: billDetails?.otherClaim ?? 0 },
  ];

  const preHospItems = [
    {
      id: 1,
      billType: 'Medicine',
      billedDate: preHospitalizationExpenses?.medicineBillDate,
      billedAmount: preHospitalizationExpenses?.medicineBillAmount ?? 0,
      claimedAmount: preHospitalizationExpenses?.medicineClaimAmount ?? 0,
      hasFiles: 0,
    },
    {
      id: 2,
      billType: 'Consultation',
      billedDate: preHospitalizationExpenses?.consultationBillDate,
      billedAmount: preHospitalizationExpenses?.consultationBillAmount ?? 0,
      claimedAmount: preHospitalizationExpenses?.consultationClaimAmount ?? 0,
      hasFiles: 0,
    },
    {
      id: 3,
      billType: 'Investigation',
      billedDate: preHospitalizationExpenses?.investigationBillDate,
      billedAmount: preHospitalizationExpenses?.investigationBillAmount ?? 0,
      claimedAmount: preHospitalizationExpenses?.investigationClaimAmount ?? 0,
      hasFiles: 0,
    },
    {
      id: 4,
      billType: 'Other',
      billedDate: preHospitalizationExpenses?.othersBillDate,
      billedAmount: preHospitalizationExpenses?.otherBillAmount ?? 0,
      claimedAmount: preHospitalizationExpenses?.otherClaimAmount ?? 0,
      hasFiles: 0,
    },
  ];

  const totalBilled = billItems.reduce((sum, item) => sum + item.billedAmount, 0);
  const totalClaimed = billItems.reduce((sum, item) => sum + item.claimedAmount, 0);
  const preHospTotal = preHospItems.reduce((sum, item) => sum + item.claimedAmount, 0);

  const billHeaders = ['S.No.', 'Bill Type', 'Billed Amount', 'Claimed Amount', 'Status', 'Clarification'];
  const preHospHeaders = ['S.No.', 'Bill Type', 'Billed Date', 'Billed Amount', 'Claimed Amount', 'Documents'];

  console.log(claimDetail, 'this is claim detail object');

  const formData = new FormData();

  const handleSendToDoctor = async () => {
    formData.append('AdvanceId', String(claimDetail.advanceBasicDetails.claimId));
    formData.append('SenderId', String(user.EmpCode));
    formData.append('RecipientId', String(102199));
    formData.append('ClaimTypeId', String(claimDetail.advanceBasicDetails.claimTypeId));
    formData.append('StatusId', String(5));

    dispatch(submitClaimProcessByHr(formData));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Hospitalization Claim Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <InfoCard title="Patient Info">
          <DisplayField label="Patient Name" value={advanceBasicDetails?.patientName ?? '-'} />
          <DisplayField label="Date of Admission" value={advanceBasicDetails?.dateOfAdmission ?? '-'} />
          <DisplayField label="Date of Discharge" value={advanceBasicDetails?.dateofDischarge ?? '-'} />
          <DisplayField label="Doctor Name" value={advanceBasicDetails?.doctorName ?? '-'} />
        </InfoCard>

        <InfoCard title="Hospital Info">
          <DisplayField label="Hospital Name" value={advanceBasicDetails?.hospitalName ?? '-'} />
          <DisplayField label="Hospital Reg. No." value={advanceBasicDetails?.hospitalRegNo ?? '-'} />
          <DisplayField label="Treatment Type" value={advanceBasicDetails?.treatmentType ?? '-'} />
          <DisplayField label="Pay To" value={advanceBasicDetails?.payTo ?? '-'} />
        </InfoCard>
      </div>

      <SectionHeader title="Bill Details" subtitle="Includes hospitalization bills" />
      <DisplayTable headers={billHeaders}>
        {billItems.map((item, index) => (
          <BillItemDisplayRow
            key={item.id}
            serialNo={index + 1}
            billType={item.billType}
            billedAmount={item.billedAmount}
            claimedAmount={item.claimedAmount}
            included={item.claimedAmount > 0}
            clarification=""
          />
        ))}
      </DisplayTable>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4 text-sm">
        <div className="text-center">
          <p className="text-gray-500">Sub Total</p>
          <p className="text-lg font-bold">₹{totalBilled.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500">Claimed</p>
          <p className="text-lg font-bold text-blue-600">₹{totalClaimed.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500">Approved</p>
          <p className="text-lg font-bold text-green-600">₹{advanceBasicDetails?.directCliamApprovedAmount ?? 0}</p>
        </div>
      </div>

      <SectionHeader title="Pre-Hospitalization" subtitle="30 days before admission" />
      <DisplayTable headers={preHospHeaders}>
        {preHospItems.map((item, index) => (
          <PreHospDisplayRow
            key={item.id}
            serialNo={index + 1}
            billType={item.billType}
            billedDate={item.billedDate || '-'}
            billedAmount={item.billedAmount}
            claimedAmount={item.claimedAmount}
            hasFiles={item.hasFiles}
          />
        ))}
      </DisplayTable>

      <div className="text-right mt-2">
        <span className="font-semibold text-sm">Total Pre-Hospital: </span>
        <span className="text-lg font-bold">₹{preHospTotal.toFixed(2)}</span>
      </div>

      <div className="mt-6">
        <Textarea placeholder="Add clarification..." />

        <Button className="mt-2">Seek Clarification</Button>
        <div>
          <Button className="mt-2 pl-6 pr-6" onClick={handleSendToDoctor}>
            Send to Doctor
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HospitalizationBillView;
