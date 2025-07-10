'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
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
import { EyeIcon, EyeOff, Loader } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { getClaimDataHr, getClaimHr } from '@/features/hr/getClaimRequestSlice';
import { RootState } from '@/app/store';
import ClaimSettlementList from '../hr/reviewClaim/ClaimSettlementList';
import { findEmployeeDetails } from '@/lib/helperFunction';

const HospitalizationBillView = () => {
  const [isSpecialDisease, setIsSpecialDisease] = useState<'yes' | 'no'>('yes');
  const [specialDiseaseName, setSpecialDiseaseName] = useState('Diabetes');
  const [totalRequested, setTotalRequested] = useState('');
  const [approvedAmount, setApprovedAmount] = useState('');
  const [sendTo, setSendTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<any | null>(null);
  const [showDetails, setShowDetails] = useState(false);
 const detailsRef = useRef<HTMLDivElement>(null);
   const { employees } = useAppSelector((state: RootState) => state.employee);
    const claimHrData = useAppSelector((state: RootState) => state.getClaimHr.data);


const user = useAppSelector((state:RootState)=>state.user)


const claimDetailAfterReview = useAppSelector((state:RootState)=>state.claim)
console.log(claimDetailAfterReview, 'this is claimdetails after review')



console.log(user, 'this is user')
  const dispatch=useAppDispatch()

  useEffect(() => {
      if (user?.EmpCode) {
        dispatch(getClaimHr({ recipientId: user.EmpCode, pageId: 2 }));
      }
    }, [user?.EmpCode]);
  
    useEffect(() => {
      if (showDetails && detailsRef.current) {
        detailsRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, [showDetails]);

  // useEffect(()=>{
  //   dispatch(getClaimHr({recipientId: user.EmpCode,pageId: 2}))
  // },[])

const handleViewToggle = (rowData: any) => {
    const isSame = selectedClaim?.id === rowData.id;
    if (isSame) {
      const shouldShow = !showDetails;
      setShowDetails(shouldShow);
      if (!shouldShow) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      setSelectedClaim(rowData);
      setShowDetails(true);
    }

    if (rowData.claimId) {
      dispatch(getClaimDataHr({ advanceid: rowData.claimId }));
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'srNo',
        header: 'Sr. No',
        cell: ({ row }: any) => row.index + 1,
      },
      {
        accessorKey: 'empId',
        header: 'Employee Name',
        cell: ({ row }: any) => {
          const result = findEmployeeDetails(employees, String(row.original.empId));
          return <div className="text-center">{result?.employee?.empName || 'Unknown'}</div>;
        },
        className: 'text-center',
      },
      {
        accessorKey: 'patientId',
        header: 'Patient Name',
        cell: ({ row }: any) => {
          const result = findEmployeeDetails(employees, String(row.original.patientId));
          return <div className="text-center">{result?.employee?.empName || ''}</div>;
        },
        className: 'text-center',
      },
      {
        accessorKey: 'relation',
        header: 'Relation',
        cell: () => <div className="text-center">Self</div>,
        className: 'text-center',
      },
      {
        accessorKey: 'requestedDate',
        header: 'Requested Date',
        cell: ({ row }: any) => {
          const dateStr = row.original.requestedDate;
          const date = dateStr ? new Date(dateStr).toLocaleDateString() : '-';
          return <div className="text-center">{date}</div>;
        },
        className: 'text-center',
      },
      {
        accessorKey: 'claimAmount',
        header: 'Claim Amount (₹)',
        cell: ({ getValue }: any) => `₹ ${getValue().toLocaleString()}`,
        className: 'text-center',
      },
      {
        id: 'action',
        header: 'Action',
        cell: ({ row }: any) => {
          const rowData = row.original;
          const isSelected = selectedClaim?.id === rowData.id;

          return (
            <Button
              size="sm"
              onClick={() => handleViewToggle(rowData)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 flex items-center gap-1 rounded-full px-3 py-1.5 text-xs"
            >
              {isSelected && showDetails ? <EyeOff className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
              {isSelected && showDetails ? 'Hide' : 'View'}
            </Button>
          );
        },
      },
    ],
    [employees, selectedClaim, showDetails]
  );

  const claimList = Array.isArray(claimHrData)
    ? claimHrData.map((value) => ({
        id: value.claimId,
        empId: value.empId,
        patientId: value.patientId,
        relation: 'Self',
        requestedDate: value.requestDate,
        claimAmount: value.cliamAmount,
        claimId: value.claimId,
      }))
    : [];

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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('AdvanceId', 'ADV123456');
      formData.append('ApprovedAmount', approvedAmount);
      formData.append('RequestedAmount', totalRequested);
      formData.append('SendTo', sendTo);
      formData.append('SpecialDisease', isSpecialDisease);
      formData.append('SpecialDiseaseName', specialDiseaseName);

      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API

      // Clear form
      setApprovedAmount('');
      setTotalRequested('');
      setSendTo('');
      setSpecialDiseaseName('');
      setIsSpecialDisease('no');
    } catch (err) {
      console.error('Error submitting:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <ClaimSettlementList columns={columns} claimList={claimList} />
    {selectedClaim && showDetails && (
        
      
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

      <SectionHeader title="Pre-Hospitalization" subtitle="30 days before admission" className='text-primary' />
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

      <div className="text-right mt-8 mb-4">
        <span className="font-semibold text-lg text-primary drop-shadow p-4 ">Total Pre-Hospital: </span>
        <span className="text-lg font-bold">₹{preHospTotal.toFixed(2)}</span>
      </div>

      {/* Declaration Section */}
      <Card className='p-8 mt-6'>
        <h2 className='text-lg font-medium text-primary drop-shadow mb-4'>Declaration by Employee</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Label className=" font-medium text-gray-900">Special Disease</Label>
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
          {isSpecialDisease === 'yes' && (
            <div className="flex items-center space-x-3 pl-10">
              <Label htmlFor="special-disease-name" className="text-sm font-medium text-gray-900">
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
      </Card>

      {/* Approval Form */}
      <Card className='mt-8'>
        <div className='p-4'>
          <h2 className='text-lg text-primary drop-shadow pb-4'>Approval Form</h2>
          <div className='flex'>
            <div className='flex w-1/2 items-center'>
              <Label className='p-4 pl-8 text-gray-900 w-1/2'>Total Claim Requested</Label>
              <Input className='w-1/2' value={totalRequested} onChange={(e) => setTotalRequested(e.target.value)} />
            </div>
            <div className='flex w-1/2 items-center'>
              <Label className='p-4 pl-8 text-gray-900 w-1/2'>Approved Amount</Label>
              <Input className='w-1/2' value={approvedAmount} onChange={(e) => setApprovedAmount(e.target.value)} />
            </div>
          </div>
        </div>
      </Card>

      {/* Action */}
      <Card className='mt-8'>
        <div className='p-4'>
          <h2 className='text-lg text-primary drop-shadow pb-4'>Action</h2>
          <div className='flex w-1/2 items-center'>
            <Label className='p-4 pl-8 text-gray-900 w-1/6'>Send To</Label>
            <Input className='w-1/2' value={sendTo} onChange={(e) => setSendTo(e.target.value)} />
          </div>
          <div className='flex justify-end pt-4'>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Confirm'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
    )}
    </>
  );
};

export default HospitalizationBillView;
