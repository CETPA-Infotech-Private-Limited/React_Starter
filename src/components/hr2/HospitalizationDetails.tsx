'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  BillItemDisplayRow,
  DisplayField,
  DisplayTable,
  InfoCard,
  PreHospDisplayRow,
  SectionHeader,
} from '../hr/reviewclaim/ReviewComponents';
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
import { submitAdvanceApproval } from '@/features/medicalClaim/advanceApprovalSlice';

const HospitalizationBillView = () => {
  // State for the declaration and approval form
  const [isSpecialDisease, setIsSpecialDisease] = useState<'yes' | 'no'>('no');
  const [specialDiseaseName, setSpecialDiseaseName] = useState('');
  const [totalRequested, setTotalRequested] = useState('');
  const [approvedAmount, setApprovedAmount] = useState('');
  const [sendTo, setSendTo] = useState('');
  const [loading, setLoading] = useState(false); // For the submit button

  // State for managing claim list and details view
  const [selectedClaim, setSelectedClaim] = useState<any | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);

  // Redux state
  const { employees } = useAppSelector((state: RootState) => state.employee);
  const claimHrData = useAppSelector((state: RootState) => state.getClaimHr.data);
  console.log(claimHrData, ' this is claimhrdata');
  const claimDetail = useAppSelector((state: RootState) => state.getClaimHr.claimDetail); // This now holds the patient and bill details

  console.log(claimDetail, 'theseare claim detail');
  const claimDetailLoading = useAppSelector((state: RootState) => state.getClaimHr.loadingClaimData);
  const user = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();

  // Fetch initial list of claims for the HR
  useEffect(() => {
    if (user?.EmpCode) {
      dispatch(getClaimHr({ recipientId: user.EmpCode, pageId: 2 }));
    }
  }, [user?.EmpCode, dispatch]);

  // Scroll to details section when details are shown
  useEffect(() => {
    if (showDetails && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showDetails]);

  // Populate form fields when a new claim detail is loaded (from `claimDetail`)
  useEffect(() => {
    if (claimDetail) {
      // Assuming 'cliamAmount' is indeed the property name from your backend for requested amount
      // Now accessing it via advanceBasicDetails if that's where it resides
      setTotalRequested(claimDetail.advanceBasicDetails?.cliamAmount?.toString() || '');
      // If `claimDetail` also contains a default or previously approved amount, set `approvedAmount` here
      // For now, it remains an input for the HR to fill.
    }
  }, [claimDetail]);

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
          // Assuming `patientName` might be directly available in `rowData.original` if `patientId` doesn't map to an employee
          return <div className="text-center">{result?.employee?.empName || row.original.patientName || 'N/A'}</div>;
        },
        className: 'text-center',
      },
      {
        accessorKey: 'relation',
        header: 'Relation',
        cell: ({ row }: any) => {
          // This should ideally come from claim data
          return <div className="text-center">{row.original.relation || 'Self'}</div>;
        },
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
        cell: ({ getValue }: any) => `₹ ${getValue()?.toLocaleString() || '0.00'}`,
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
        relation: value.relation || 'Self',
        requestedDate: value.requestDate,
        claimAmount: value.cliamAmount, // Keeping 'cliamAmount' as per your provided code
        claimId: value.claimId,
      }))
    : [];

  // Derive display data from `claimDetail` and its nested `advanceBasicDetails`
  const patientName = claimDetail?.advanceBasicDetails?.patientName || 'N/A';
  const dateOfAdmission = claimDetail?.advanceBasicDetails?.dateOfAdmission
    ? new Date(claimDetail.advanceBasicDetails.dateOfAdmission).toLocaleDateString()
    : 'N/A';
  const dateofDischarge = claimDetail?.advanceBasicDetails?.dateofDischarge
    ? new Date(claimDetail.advanceBasicDetails.dateofDischarge).toLocaleDateString()
    : 'N/A';
  const doctorName = claimDetail?.advanceBasicDetails?.doctorName || 'N/A';
  const hospitalName = claimDetail?.advanceBasicDetails?.hospitalName || 'N/A';
  const hospitalRegNo = claimDetail?.advanceBasicDetails?.hospitalRegNo || 'N/A';
  const treatmentType = claimDetail?.advanceBasicDetails?.treatmentType || 'N/A';
  const payTo = claimDetail?.advanceBasicDetails?.payTo || 'N/A';
  const directClaimApprovedAmount = claimDetail?.advanceBasicDetails?.directCliamApprovedAmount || 0;

  const billItems = useMemo(() => {
    // Access bill details from `claimDetail.billDetails`
    const details = claimDetail?.billDetails || {};
    return [
      { id: 1, billType: 'Medicine', billedAmount: details.medicineBill || 0, claimedAmount: details.medicineClaim || 0 },
      { id: 2, billType: 'Consultation', billedAmount: details.consultationBill || 0, claimedAmount: details.consultationClaim || 0 },
      { id: 3, billType: 'Investigation', billedAmount: details.investigationBill || 0, claimedAmount: details.investigationClaim || 0 },
      { id: 4, billType: 'Room Rent', billedAmount: details.roomRentBill || 0, claimedAmount: details.roomRentClaim || 0 },
      { id: 5, billType: 'Other', billedAmount: details.othersBill || 0, claimedAmount: details.otherClaim || 0 },
    ];
  }, [claimDetail]);

  const preHospItems = useMemo(() => {
    // Access pre-hospitalization expenses from `claimDetail.preHospitalizationExpenses`
    const expenses = claimDetail?.preHospitalizationExpenses || {};
    return [
      { id: 1, billType: 'Medicine', billedDate: expenses.medicineBillDate || 'N/A', billedAmount: expenses.medicineBillAmount || 0, claimedAmount: expenses.medicineClaimAmount || 0, hasFiles: claimDetail?.documentLists?.pathUrl ? 1 : 0 },
      { id: 2, billType: 'Consultation', billedDate: expenses.consultationBillDate || 'N/A', billedAmount: expenses.consultationBillAmount || 0, claimedAmount: expenses.consultationClaimAmount || 0, hasFiles: expenses.consultationHasFiles ? 1 : 0 },
      { id: 3, billType: 'Investigation', billedDate: expenses.investigationBillDate || 'N/A', billedAmount: expenses.investigationBillAmount || 0, claimedAmount: expenses.investigationClaimAmount || 0, hasFiles: expenses.investigationHasFiles ? 1 : 0 },
      { id: 4, billType: 'Other', billedDate: expenses.othersBillDate || 'N/A', billedAmount: expenses.otherBillAmount || 0, claimedAmount: expenses.otherClaimAmount || 0, hasFiles: expenses.otherHasFiles ? 1 : 0 },
    ];
  }, [claimDetail]);

  const totalBilled = billItems.reduce((sum, item) => sum + item.billedAmount, 0);
  const totalClaimed = billItems.reduce((sum, item) => sum + item.claimedAmount, 0);
  const preHospTotal = preHospItems.reduce((sum, item) => sum + item.claimedAmount, 0);

  const billHeaders = ['S.No.', 'Bill Type', 'Billed Amount', 'Claimed Amount', 'Status', 'Clarification'];
  const preHospHeaders = ['S.No.', 'Bill Type', 'Billed Date', 'Billed Amount', 'Claimed Amount', 'Documents'];

console.log(approvedAmount,'this is approved')

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        AdvanceId: claimDetail.advanceBasicDetails.advanceId,
        ApprovalAmount: String(approvedAmount),
        RecipientId: '101002',
        SenderId: user.EmpCode,
        ClaimTypeId: claimDetail.advanceBasicDetails.claimTypeId,
        StatusId: 4,
      };

      

      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      // console.log('Submitting data:', formData);

     
       await dispatch(submitAdvanceApproval(payload))

      

      // Reset form fields after successful submission
      setApprovedAmount('');
      setTotalRequested('');
      setSendTo('');
      setSpecialDiseaseName('');
      setIsSpecialDisease('no');
      setSelectedClaim(null);
      setShowDetails(false);

      // Refetch the list of claims to update the table
      if (user?.EmpCode) {
        dispatch(getClaimHr({ recipientId: user.EmpCode, pageId: 2 }));
      }
    } catch (err) {
      console.error('Error submitting:', err);
      // Implement user-friendly error feedback here
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ClaimSettlementList columns={columns} claimList={claimList} />

      {/* Conditional rendering for claim details */}
      {selectedClaim && showDetails && (
        <div ref={detailsRef} className="p-6 bg-white rounded-lg shadow mt-6">
          {claimDetailLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader className="w-8 h-8 animate-spin text-blue-500" />
              <span className="ml-2 text-lg text-blue-500">Loading Claim Details...</span>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-primary drop-shadow mb-4">Hospitalization Claim Details</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-primary drop-shadow">
                <InfoCard title="Patient Info">
                  <DisplayField label="Patient Name" value={patientName} />
                  <DisplayField label="Date of Admission" value={dateOfAdmission} />
                  <DisplayField label="Date of Discharge" value={dateofDischarge} />
                  <DisplayField label="Doctor Name" value={doctorName} />
                </InfoCard>

                <InfoCard title="Hospital Info">
                  <DisplayField label="Hospital Name" value={hospitalName} />
                  <DisplayField label="Hospital Reg. No." value={hospitalRegNo} />
                  <DisplayField label="Treatment Type" value={treatmentType} />
                  <DisplayField label="Pay To" value={payTo} />
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
                    clarification="" // Placeholder, should come from data if available
                  />
                ))}
              </DisplayTable>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4 text-sm">
                <div className="text-center">
                  <p className="text-gray-500">Sub Total Billed</p>
                  <p className="text-lg font-bold">₹{totalBilled.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">Sub Total Claimed</p>
                  <p className="text-lg font-bold text-blue-600">₹{totalClaimed.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">Total Approved (Hospitalization)</p>
                  <p className="text-lg font-bold text-green-600">₹{directClaimApprovedAmount.toFixed(2)}</p>
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
                    hasFiles={!!item.hasFiles} // Convert number (0 or 1) to boolean
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
                    value={claimDetail?.advanceBasicDetails?.isSpecailDisease ? 'yes' : 'no'}
                       disabled
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
              <Card className="mt-8">
  <div className="p-4">
    <h2 className="text-lg text-primary drop-shadow pb-4">Approval Form</h2>

    {/* Responsive Flex Layout */}
    <div className="flex flex-col md:flex-row md:gap-6 gap-4">
      {/* Total Claim Requested */}
      <div className="flex flex-col md:flex-row items-center w-full md:w-1/2 gap-2">
        <Label className="md:w-1/2 text-gray-900">Total Claim Requested</Label>
        <Input
          className="w-full"
          disabled
          value={claimDetail?.advanceBasicDetails?.claimAmount}
          onChange={(e) => setTotalRequested(e.target.value)}
          type="number"
        />
      </div>

      {/* Approved Amount */}
      <div className="flex flex-col md:flex-row items-center w-full md:w-1/2 gap-2">
        <Label className="md:w-1/2 text-gray-900">Approved Amount</Label>
        <Input
          className="w-full"
          value={approvedAmount}
          onChange={(e) => setApprovedAmount(e.target.value)}
          type="number"
        />
      </div>
    </div>

    {/* Submit Button */}
    <div className="flex justify-end pt-4">
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Confirm'}
      </Button>
    </div>
  </div>
</Card>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default HospitalizationBillView;