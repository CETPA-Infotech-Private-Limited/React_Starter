import React from 'react';
import { BillItemDisplayRow, DisplayField, DisplayTable, InfoCard, PreHospDisplayRow, SectionHeader } from '@/components/doctor/doctorreview/ReviewComponents';

const HospitalizationBillDetails = ({
  claimDetail,
  billComments,
  preHospComments,
  setBillComments,
  setPreHospComments,
}: {
  claimDetail: any;
  billComments: Record<number, string>;
  preHospComments: Record<number, string>;
  setBillComments: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  setPreHospComments: React.Dispatch<React.SetStateAction<Record<number, string>>>;
}) => {
  if (!claimDetail) return null;

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

  const billHeaders = ['S.No.', 'Bill Type', 'Billed Amount', 'Claimed Amount', 'Status', 'Clarification', 'Comment'];
  const preHospHeaders = ['S.No.', 'Bill Type', 'Billed Date', 'Billed Amount', 'Claimed Amount', 'Documents', 'Comment'];

  return (
    <div className="bg-white ">
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
      {/* <DisplayTable headers={billHeaders}>
        {Array.isArray(billItems) &&
          billItems?.map((item, index) =>
            item ? (
              <BillItemDisplayRow
                key={item.id ?? index}
                serialNo={index + 1}
                billType={item.billType}
                billedAmount={item.billedAmount}
                claimedAmount={item.claimedAmount}
                included={item.claimedAmount > 0}
                clarification=""
                comment={billComments[item.id] || ''}
                onCommentChange={(e) =>
                  setBillComments((prev) => ({
                    ...prev,
                    [item.id]: e.target.value,
                  }))
                }
              />
            ) : null
          )}
      </DisplayTable> */}

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
            comment={preHospComments[item.id] || ''}
            onCommentChange={(e) => setPreHospComments((prev) => ({ ...prev, [item.id]: e.target.value }))}
          />
        ))}
      </DisplayTable>

      <div className="text-right mt-2">
        <span className="font-semibold text-sm">Total Pre-Hospital: </span>
        <span className="text-lg font-bold">₹{preHospTotal.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default HospitalizationBillDetails;
