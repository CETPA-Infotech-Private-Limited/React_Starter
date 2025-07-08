import React from 'react';
import { Button } from '@/components/ui/button';
import {
  BillItemDisplayRow,
  DisplayField,
  DisplayTable,
  InfoCard,
  PreHospDisplayRow,
  SectionHeader,
  StatusBadge
} from './ReviewComponents';
import { Textarea } from '@/components/ui/textarea';

const HospitalizationBillView = ({ claimDetail }: { claimDetail: any }) => {
  if (!claimDetail) return null;

  const { advanceBasicDetails, billDetails, preHospitalizationExpenses } = claimDetail;

  const billItems = [
    { id: 1, billType: 'Medicine', billedAmount: billDetails?.medicineBill ?? 0, claimedAmount: billDetails?.medicineBill ?? 0 },
    { id: 2, billType: 'Consultation', billedAmount: billDetails?.consultationBill ?? 0, claimedAmount: billDetails?.consultationBill ?? 0 },
    { id: 3, billType: 'Investigation', billedAmount: billDetails?.investigationBill ?? 0, claimedAmount: billDetails?.investigationBill ?? 0 },
    { id: 4, billType: 'Room Rent', billedAmount: billDetails?.roomRentBill ?? 0, claimedAmount: billDetails?.roomRentBill ?? 0 },
    { id: 5, billType: 'Other', billedAmount: billDetails?.othersBill ?? 0, claimedAmount: billDetails?.othersBill ?? 0 },
  ];

  const preHospItems = [
    { id: 1, billType: 'Medicine', billedDate: preHospitalizationExpenses?.medicineBillDate, billedAmount: preHospitalizationExpenses?.medicineAmount ?? 0, claimedAmount: preHospitalizationExpenses?.medicineAmount ?? 0, hasFiles: 0 },
    { id: 2, billType: 'Consultation', billedDate: preHospitalizationExpenses?.consultationBillDate, billedAmount: preHospitalizationExpenses?.consultationAmount ?? 0, claimedAmount: preHospitalizationExpenses?.consultationAmount ?? 0, hasFiles: 0 },
    { id: 3, billType: 'Investigation', billedDate: preHospitalizationExpenses?.investigationBillDate, billedAmount: preHospitalizationExpenses?.investigationAmount ?? 0, claimedAmount: preHospitalizationExpenses?.investigationAmount ?? 0, hasFiles: 0 },
    { id: 4, billType: 'Other', billedDate: preHospitalizationExpenses?.othersBillDate, billedAmount: preHospitalizationExpenses?.othersAmount ?? 0, claimedAmount: preHospitalizationExpenses?.othersAmount ?? 0, hasFiles: 0 },
  ];

  const totalBilled = billItems.reduce((sum, item) => sum + item.billedAmount, 0);
  const totalClaimed = billItems.reduce((sum, item) => sum + item.claimedAmount, 0);
  const preHospTotal = preHospItems.reduce((sum, item) => sum + item.claimedAmount, 0);

  const billHeaders = ['S.No.', 'Bill Type', 'Billed Amount', 'Claimed Amount', 'Status', 'Clarification'];
  const preHospHeaders = ['S.No.', 'Bill Type', 'Billed Date', 'Billed Amount', 'Claimed Amount', 'Documents'];

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
      </div>
    </div>
  );
};

export default HospitalizationBillView;
