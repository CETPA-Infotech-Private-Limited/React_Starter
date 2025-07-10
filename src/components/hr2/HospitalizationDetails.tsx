import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  BillItemDisplayRow,
  DisplayField,
  DisplayTable,
  InfoCard,
  PreHospDisplayRow,
  SectionHeader
} from '../hr/reviewclaim/ReviewComponents';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '../ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '../ui/card';
import InputField from '../common/InputField';


const HospitalizationBillView = () => {
    const [isSpecialDisease, setIsSpecialDisease] = useState<'yes' | 'no'>('yes');
  const [specialDiseaseName, setSpecialDiseaseName] = useState('Diabetes');
  const advanceBasicDetails = {
    patientName: 'John Doe',
    dateOfAdmission: '2025-06-01',
    dateofDischarge: '2025-06-05',
    doctorName: 'Dr. Smith',
    hospitalName: 'City Care Hospital',
    hospitalRegNo: 'REG123456',
    treatmentType: 'Surgery',
    payTo: 'City Care Hospital Pvt Ltd',
    directCliamApprovedAmount: 36500
  };

  const billDetails = {
    medicineBill: 5000,
    medicineClaim: 4800,
    consultationBill: 2000,
    consultationClaim: 2000,
    investigationBill: 7000,
    investigationClaim: 6500,
    roomRentBill: 12000,
    roomRentClaim: 12000,
    othersBill: 3000,
    otherClaim: 2700
  };

  const preHospitalizationExpenses = {
    medicineBillDate: '2025-05-28',
    medicineBillAmount: 1500,
    medicineClaimAmount: 1500,
    consultationBillDate: '2025-05-26',
    consultationBillAmount: 1000,
    consultationClaimAmount: 900,
    investigationBillDate: '2025-05-24',
    investigationBillAmount: 2200,
    investigationClaimAmount: 2000,
    othersBillDate: '2025-05-23',
    otherBillAmount: 800,
    otherClaimAmount: 700
  };

  const billItems = [
    { id: 1, billType: 'Medicine', billedAmount: billDetails.medicineBill, claimedAmount: billDetails.medicineClaim },
    { id: 2, billType: 'Consultation', billedAmount: billDetails.consultationBill, claimedAmount: billDetails.consultationClaim },
    { id: 3, billType: 'Investigation', billedAmount: billDetails.investigationBill, claimedAmount: billDetails.investigationClaim },
    { id: 4, billType: 'Room Rent', billedAmount: billDetails.roomRentBill, claimedAmount: billDetails.roomRentClaim },
    { id: 5, billType: 'Other', billedAmount: billDetails.othersBill, claimedAmount: billDetails.otherClaim },
  ];

  const preHospItems = [
    { id: 1, billType: 'Medicine', billedDate: preHospitalizationExpenses.medicineBillDate, billedAmount: preHospitalizationExpenses.medicineBillAmount, claimedAmount: preHospitalizationExpenses.medicineClaimAmount, hasFiles: 0 },
    { id: 2, billType: 'Consultation', billedDate: preHospitalizationExpenses.consultationBillDate, billedAmount: preHospitalizationExpenses.consultationBillAmount, claimedAmount: preHospitalizationExpenses.consultationClaimAmount, hasFiles: 0 },
    { id: 3, billType: 'Investigation', billedDate: preHospitalizationExpenses.investigationBillDate, billedAmount: preHospitalizationExpenses.investigationBillAmount, claimedAmount: preHospitalizationExpenses.investigationClaimAmount, hasFiles: 0 },
    { id: 4, billType: 'Other', billedDate: preHospitalizationExpenses.othersBillDate, billedAmount: preHospitalizationExpenses.otherBillAmount, claimedAmount: preHospitalizationExpenses.otherClaimAmount, hasFiles: 0 },
  ];

  const totalBilled = billItems.reduce((sum, item) => sum + item.billedAmount, 0);
  const totalClaimed = billItems.reduce((sum, item) => sum + item.claimedAmount, 0);
  const preHospTotal = preHospItems.reduce((sum, item) => sum + item.claimedAmount, 0);

  const billHeaders = ['S.No.', 'Bill Type', 'Billed Amount', 'Claimed Amount', 'Status', 'Clarification'];
  const preHospHeaders = ['S.No.', 'Bill Type', 'Billed Date', 'Billed Amount', 'Claimed Amount', 'Documents'];

  const formData = new FormData();

  const handleSendToDoctor = async () => {
    formData.append('AdvanceId', 'ADV123456');
    console.log('Sending to doctor...', formData);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-primary drop-shadow mb-4">Hospitalization Claim Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-primary drop-shadow">
        <InfoCard title="Patient Info">
          <DisplayField label="Patient Name" value={advanceBasicDetails.patientName} />
          <DisplayField label="Date of Admission" value={advanceBasicDetails.dateOfAdmission} />
          <DisplayField label="Date of Discharge" value={advanceBasicDetails.dateofDischarge} />
          <DisplayField label="Doctor Name" value={advanceBasicDetails.doctorName} />
        </InfoCard>

        <InfoCard title="Hospital Info">
          <DisplayField label="Hospital Name" value={advanceBasicDetails.hospitalName} />
          <DisplayField label="Hospital Reg. No." value={advanceBasicDetails.hospitalRegNo} />
          <DisplayField label="Treatment Type" value={advanceBasicDetails.treatmentType} />
          <DisplayField label="Pay To" value={advanceBasicDetails.payTo} />
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
          <p className="text-lg font-bold text-green-600">₹{advanceBasicDetails.directCliamApprovedAmount.toFixed(2)}</p>
        </div>
      </div>

      <SectionHeader title="Pre-Hospitalization" subtitle="30 days before admission" />
      <DisplayTable headers={preHospHeaders}>
        {preHospItems.map((item, index) => (
          <PreHospDisplayRow
            key={item.id}
            serialNo={index + 1}
            billType={item.billType}
            billedDate={item.billedDate}
            billedAmount={item.billedAmount}
            claimedAmount={item.claimedAmount}
            hasFiles={item.hasFiles}
          />
        ))}
      </DisplayTable>

      <div className="text-right mt-8">
        <span className="font-semibold text-sm">Total Pre-Hospital: </span>
        <span className="text-lg font-bold">₹{preHospTotal.toFixed(2)}</span>
      </div>
        <Card className='p-8 '>
            <div className='flex justify-start items-start pr-4 pb-4 text-lg font-medium text-primary drop-shadow '>
                <h1>Declaration bye Emplyoee</h1>
            </div>
        <div className="flex items-center justify-between">
  <div className="flex items-center justify-between">
      {/* Radio Group */}
      <div className="flex items-center space-x-4">
        <Label className=" font-medium text-primary ">Special Disease</Label>
        <RadioGroup
          value={isSpecialDisease}
          onValueChange={(val: 'yes' | 'no') => setIsSpecialDisease(val)}
          className="flex space-x-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="special-disease-yes" />
            <Label htmlFor="special-disease-yes" className="text-sm">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="special-disease-no" />
            <Label htmlFor="special-disease-no" className="text-sm">No</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Conditionally Rendered Input */}
      {isSpecialDisease === 'yes' && (
        <div className="flex items-center space-x-3 pl-10">
          <Label htmlFor="special-disease-name" className="text-sm font-medium text-primary">
            Special Disease Name
          </Label>
          <Input
            id="special-disease-name"
            value={specialDiseaseName}
            onChange={(e) => setSpecialDiseaseName(e.target.value)}
            placeholder="Enter disease name"
            className="w-64"
          />
        </div>
      )}
    </div>

  
</div>
</Card>

<div>
    <Card className='mt-8'>
        <div className='p-4'>
        <div className='flex justify-start pb-4 pl-8 pt-4 text-primary drop-shadow text-lg'>
            <h1>Approval Form</h1>
        </div>
        <div className='flex'>
            <div className='flex justify-start w-1/2 items-center'>
                
                <Label className='p-4 pl-8 text-primary drop-shadow w-1/2'>Total Claim Requested</Label>
                <Input className='w-1/2'></Input>
            </div>
            <div className='flex'>
                <Label className='p-4 pl-8 text-primary drop-shadow w-full'>Approved Amount</Label>
                <Input className='w-full'></Input>
            </div>
            </div>
            </div>
    </Card>
</div>
<div>
    <Card className='mt-8'>
        <div className='p-4'>
        <div className='flex justify-start pb-4 pl-8 pt-4 text-primary drop-shadow text-lg'>
            <h1>Action</h1>
            <hr/>
        </div>
        
            <div className='flex justify-start w-1/2 items-center'>
                
                <Label className='p-4 pl-8 text-primary drop-shadow w-1/6'>Send to</Label>
                <Input className='w-1/2'></Input>
            </div>
            
            <div className='flex justify-end '>
                <Button>Confirm</Button>
            </div>
            </div>
    </Card>
</div>
    </div>
  );
};

export default HospitalizationBillView;
