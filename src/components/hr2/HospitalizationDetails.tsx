'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { BillItemDisplayRow, DisplayField, DisplayTable, InfoCard, SectionHeader } from './DisplayTable';
import { Input } from '../ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '../ui/card';
import { Eye, EyeOff } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { getClaimDataHr, getClaimHr } from '@/features/hr/getClaimRequestSlice';
import { RootState } from '@/app/store';
import ClaimSettlementList from '../hr/reviewClaim/ClaimSettlementList';
import { findEmployeeDetails } from '@/lib/helperFunction';
import { submitClaimProcessByHr } from '@/features/doctor/doctorSlice'; // Assuming this is the correct action
import Loader from '../ui/loader';

const HospitalizationBillView = () => {
  const { claimDetail, loading } = useAppSelector((state: RootState) => state.getClaimHr);
  const [isSpecialDisease, setIsSpecialDisease] = useState<'yes' | 'no'>('no');
  const [specialDiseaseName, setSpecialDiseaseName] = useState('');
  const [totalRequested, setTotalRequested] = useState('');
  const [approvedAmount, setApprovedAmount] = useState('');

  const [submitLoading, setSubmitLoading] = useState(false);

  // Separate states for approval amounts for clarity and correct calculation
  const [hospitalBillApprovals, setHospitalBillApprovals] = useState<{ [key: string]: string }>({});
  const [notIncludedBillApprovals, setNotIncludedBillApprovals] = useState<{ [key: string]: string }>({});
  const [preHospApprovals, setPreHospApprovals] = useState<{ [key: string]: string }>({});
  const [billPassingComment, setBillPassingComment] = useState(''); // New state for bill passing comment

  const [billPassing, setBillPassing] = useState({
    ClaimId: claimDetail?.claimId,
    TopUpId: claimDetail?.topUpId,
    ReferenceDate: new Date().toISOString(),
    SapRefNumber: '',
    AmountPaid: 0,
    Comment: '',
  });

  const [selectedClaim, setSelectedClaim] = useState<any | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);

  const { employees } = useAppSelector((state: RootState) => state.employee);
  const claimHrData = useAppSelector((state: RootState) => state.getClaimHr.data);
  const user = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user?.EmpCode) {
      dispatch(getClaimHr({ recipientId: user.EmpCode, pageId: 2 }));
    }
  }, [user?.EmpCode, dispatch]);

  useEffect(() => {
    if (showDetails && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showDetails]);

  // Populate form fields when a new claim detail is loaded
  useEffect(() => {
    if (claimDetail) {
      setTotalRequested(claimDetail.advanceBasicDetails?.cliamAmount?.toString() || '');
      // Initialize approvedAmount with directCliamApprovedAmount if available, otherwise keep it editable
      setApprovedAmount(claimDetail.advanceBasicDetails?.directCliamApprovedAmount?.toString() || '');
      setIsSpecialDisease(claimDetail.advanceBasicDetails?.isSpecailDisease ? 'yes' : 'no');
      setSpecialDiseaseName(claimDetail.advanceBasicDetails?.specailDiseaseName || '');
      setBillPassingComment(claimDetail?.billPasingDetails?.comment || '');

      // Initialize approval inputs from claimDetail if they exist
      const hospApprovals: { [key: string]: string } = {};
      if (claimDetail.hospitalizationBillApprovelDetails) {
        hospApprovals.Medicine = claimDetail.hospitalizationBillApprovelDetails.medicineAmount?.toString() || '';
        hospApprovals.Consultation = claimDetail.hospitalizationBillApprovelDetails.consultationAmount?.toString() || '';
        hospApprovals.Investigation = claimDetail.hospitalizationBillApprovelDetails.investigationAmount?.toString() || '';
        hospApprovals.RoomRent = claimDetail.hospitalizationBillApprovelDetails.roomRentAmount?.toString() || '';
        hospApprovals.Procedure = claimDetail.hospitalizationBillApprovelDetails.procedureAmount?.toString() || '';
        hospApprovals.Other = claimDetail.hospitalizationBillApprovelDetails.otherAmount?.toString() || '';
      }
      setHospitalBillApprovals(hospApprovals);

      const notIncludedApprovals: { [key: string]: string } = {};
      if (claimDetail.hospitalizationBillApprovelDetails) {
        notIncludedApprovals.Medicine = claimDetail.hospitalizationBillApprovelDetails.medicineNotInAmount?.toString() || '';
        notIncludedApprovals.Consultation = claimDetail.hospitalizationBillApprovelDetails.consultationNotInAmount?.toString() || '';
        notIncludedApprovals.Investigation = claimDetail.hospitalizationBillApprovelDetails.investigationNotInAmount?.toString() || '';
        notIncludedApprovals.Other = claimDetail.hospitalizationBillApprovelDetails.otherNotInAmount?.toString() || '';
      }
      setNotIncludedBillApprovals(notIncludedApprovals);


      const preHospAppr: { [key: string]: string } = {};
      if (claimDetail.preHospitalizationExpenses) {
        preHospAppr.Medicine = claimDetail.preHospitalizationExpenses.medicineClaimAmount?.toString() || ''; // Assuming claimAmount is the approved amount here initially
        preHospAppr.Consultation = claimDetail.preHospitalizationExpenses.consultationClaimAmount?.toString() || '';
        preHospAppr.Investigation = claimDetail.preHospitalizationExpenses.investigationClaimAmount?.toString() || '';
        preHospAppr.Procedure = claimDetail.preHospitalizationExpenses.procedureClaimAmount?.toString() || '';
        preHospAppr.Other = claimDetail.preHospitalizationExpenses.otherClaimAmount?.toString() || '';
      }
      setPreHospApprovals(preHospAppr);

    }
  }, [claimDetail]);

  const handleViewToggle = useCallback((rowData: any) => {
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
      if (rowData.claimId) {
        dispatch(getClaimDataHr({ advanceid: rowData.advanceId }));
      }
    }
  }, [selectedClaim, showDetails, dispatch]);

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
          return <div className="text-center">{result?.employee?.empName || row.original.patientName || 'N/A'}</div>;
        },
        className: 'text-center',
      },
      {
        accessorKey: 'relation',
        header: 'Relation',
        cell: ({ row }: any) => {
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
              variant='link'
              onClick={() => handleViewToggle(rowData)}
              className="text-blue-600"
            >
              {isSelected ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
              {isSelected ? 'Hide' : 'View'}
            </Button>
          );
        },
      },
    ],
    [employees, selectedClaim, handleViewToggle]
  );

  const claimList = useMemo(() => {
    return Array.isArray(claimHrData)
      ? claimHrData.map((value) => ({
          id: value.claimId,
          empId: value.empId,
          patientId: value.patientId,
          relation: value.relation || 'Self',
          requestedDate: value.requestDate,
          claimAmount: value.cliamAmount,
          advanceId: value.advanceId,
          claimId: value.claimId,
        }))
      : [];
  }, [claimHrData]);

  // Derive display data from `claimDetail`
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
    const details = claimDetail?.billDetails || {};
    return [
      { id: 1, billType: 'Medicine', billedAmount: details.medicineBill || 0, claimedAmount: details.medicineClaim || 0 },
      { id: 2, billType: 'Consultation', billedAmount: details.consultationBill || 0, claimedAmount: details.consultationClaim || 0 },
      { id: 3, billType: 'Investigation', billedAmount: details.investigationBill || 0, claimedAmount: details.investigationClaim || 0 },
      { id: 4, billType: 'Procedure', billedAmount: details.procedureBill || 0, claimedAmount: details.procedureClaim || 0 },
      { id: 5, billType: 'Room Rent', billedAmount: details.roomRentBill || 0, claimedAmount: details.roomRentClaim || 0 },
      { id: 6, billType: 'Other', billedAmount: details.othersBill || 0, claimedAmount: details.otherClaim || 0 },
    ];
  }, [claimDetail]);

  // Assuming notIncludedBillItems should come from different fields or logic if it's "not included"
  // For now, I'm creating a dummy structure, you need to populate this based on your actual data structure
  const notIncludedbillItems = useMemo(() => {
    const details = claimDetail?.billDetails || {}; // Assuming these might come from different fields in billDetails if they are truly "not included"
    // Example: if your backend has specific 'not included' fields like medicineNotInBill, etc.
    return [
      { id: 1, billType: 'Medicine', billedAmount: details.medicineNotInBill || 0, claimedAmount: details.medicineNotInClaim || 0 }, // Placeholder for different data source
      { id: 2, billType: 'Consultation', billedAmount: details.consultationNotInBill || 0, claimedAmount: details.consultationNotInClaim || 0 },
      { id: 3, billType: 'Investigation', billedAmount: details.investigationNotInBill || 0, claimedAmount: details.investigationNotInClaim || 0 },
      { id: 4, billType: 'Procedure', billedAmount: details.procedureNotInBill || 0, claimedAmount: details.procedureNotInClaim || 0 },
      { id: 5, billType: 'Room Rent', billedAmount: details.roomRentNotInBill || 0, claimedAmount: details.roomRentNotInClaim || 0 },
      { id: 6, billType: 'Other', billedAmount: details.othersNotInBill || 0, claimedAmount: details.otherNotInClaim || 0 },
    ];
  }, [claimDetail]);

  const preHospItems = useMemo(() => {
    const expenses = claimDetail?.preHospitalizationExpenses || {};
    return [
      {
        id: 1,
        billType: 'Medicine',
        billedDate: expenses.medicineBillDate || 'N/A',
        billedAmount: expenses.medicineBillAmount || 0,
        claimedAmount: expenses.medicineClaimAmount || 0,
        hasFiles: claimDetail?.documentLists?.pathUrl ? 1 : 0, // This logic seems specific to one document, might need adjustment
      },
      {
        id: 2,
        billType: 'Consultation',
        billedDate: expenses.consultationBillDate || 'N/A',
        billedAmount: expenses.consultationBillAmount || 0,
        claimedAmount: expenses.consultationClaimAmount || 0,
        hasFiles: expenses.consultationHasFiles ? 1 : 0,
      },
      {
        id: 3,
        billType: 'Investigation',
        billedDate: expenses.investigationBillDate || 'N/A',
        billedAmount: expenses.investigationBillAmount || 0,
        claimedAmount: expenses.investigationClaimAmount || 0,
        hasFiles: expenses.investigationHasFiles ? 1 : 0,
      },
      {
        id: 4,
        billType: 'Procedure',
        billedDate: expenses.procedureBillDate || 'N/A',
        billedAmount: expenses.procedureBillAmount || 0,
        claimedAmount: expenses.procedureClaimAmount || 0,
        hasFiles: expenses.procedureHasFiles ? 1 : 0,
      },
      {
        id: 5,
        billType: 'Other',
        billedDate: expenses.othersBillDate || 'N/A',
        billedAmount: expenses.otherBillAmount || 0,
        claimedAmount: expenses.otherClaimAmount || 0,
        hasFiles: expenses.otherHasFiles ? 1 : 0,
      },
    ];
  }, [claimDetail]);

  // Calculate totals
  const totalBilledHospital = billItems.reduce((sum, item) => sum + item.billedAmount, 0);
  const totalClaimedHospital = billItems.reduce((sum, item) => sum + item.claimedAmount, 0);

  const totalBilledNotIncluded = notIncludedbillItems.reduce((sum, item) => sum + item.billedAmount, 0);
  const totalClaimedNotIncluded = notIncludedbillItems.reduce((sum, item) => sum + item.claimedAmount, 0);

  const totalBilledPreHosp = preHospItems.reduce((sum, item) => sum + item.billedAmount, 0);
  const totalClaimedPreHosp = preHospItems.reduce((sum, item) => sum + item.claimedAmount, 0);

  const finalTotalBilled = totalBilledHospital + totalBilledNotIncluded + totalBilledPreHosp;
  const finalTotalClaimed = totalClaimedHospital + totalClaimedNotIncluded + totalClaimedPreHosp;

  // Calculate final approved amount based on individual approval inputs
  const finalTotalApproved = useMemo(() => {
    const sumHospital = Object.values(hospitalBillApprovals).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    const sumNotIncluded = Object.values(notIncludedBillApprovals).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    const sumPreHosp = Object.values(preHospApprovals).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    return sumHospital + sumNotIncluded + sumPreHosp;
  }, [hospitalBillApprovals, notIncludedBillApprovals, preHospApprovals]);

  const billHeaders = ['S.No.', 'Bill Type', 'Billed Amount', 'Claimed Amount', 'Status', 'Clarification', 'Approval Details'];
  const preHospHeaders = ['S.No.', 'Bill Type', 'Billed Date', 'Billed Amount', 'Claimed Amount', 'Documents', 'Approval Details'];

  const handleSubmit = async () => {
    try {
      setSubmitLoading(true);

      // Construct HospitalizationBillApprovelDetails
      const hospitalizationBillApprovelDetails = {
        MedicineAmount: parseFloat(hospitalBillApprovals.Medicine || '0'),
        MedicineNotInAmount: parseFloat(notIncludedBillApprovals.Medicine || '0'),
        ConsultationAmount: parseFloat(hospitalBillApprovals.Consultation || '0'),
        ConsultationNotInAmount: parseFloat(notIncludedBillApprovals.Consultation || '0'),
        InvestigationAmount: parseFloat(hospitalBillApprovals.Investigation || '0'),
        InvestigationNotInAmount: parseFloat(notIncludedBillApprovals.Investigation || '0'),
        RoomRentAmount: parseFloat(hospitalBillApprovals.RoomRent || '0'),
        ProcedureAmount: parseFloat(hospitalBillApprovals.Procedure || '0'),
        OtherAmount: parseFloat(hospitalBillApprovals.Other || '0'),
        OtherNotInAmount: parseFloat(notIncludedBillApprovals.Other || '0'),
      };

      // Construct PreHospitalizationExpenses (for approval, assuming the claimAmount in preHospApprovals is the approved one)
      const preHospitalizationExpensesApproval = {
        MedicineAmount: parseFloat(preHospApprovals.Medicine || '0'),
        ConsultationAmount: parseFloat(preHospApprovals.Consultation || '0'),
        InvestigationAmount: parseFloat(preHospApprovals.Investigation || '0'),
        RoomRentAmount: parseFloat(preHospApprovals.RoomRent || '0'), // This field might not be applicable for pre-hosp, confirm with API
        ProcedureAmount: parseFloat(preHospApprovals.Procedure || '0'),
        OtherAmount: parseFloat(preHospApprovals.Other || '0'),
      };

      const payload = {
        AdvanceId: claimDetail?.advanceBasicDetails?.advanceId,
        SenderId: user.EmpCode,
        RecipientId: 101002, // This seems to be a hardcoded HR ID, confirm if dynamic
        ClaimTypeId: claimDetail?.advanceBasicDetails?.claimTypeId,
        StatusId: 4, // Approved status
        ClaimId: claimDetail?.claimId,
        TopUpId: claimDetail?.topUpId,
        ReferenceDate: billPassing.ReferenceDate,
        SapRefNumber: billPassing.SapRefNumber, // This needs a UI input or derived
        AmountPaid: parseFloat(approvedAmount), // The overall approved amount
        Comment: billPassingComment,

        HospitalizationBillApprovelDetails: hospitalizationBillApprovelDetails,
        PreHospitalizationExpenses: preHospitalizationExpensesApproval, // Send as a nested object

        BillPassingDetails: {
          ClaimId: billPassing.ClaimId,
          TopUpId: billPassing.TopUpId,
          ReferenceDate: billPassing.ReferenceDate,
          SapRefNumber: billPassing.SapRefNumber,
          AmountPaid: parseFloat(approvedAmount), // Should match the overall approved amount
          Comment: billPassingComment,
        },
      };

      await dispatch(submitClaimProcessByHr(payload));

      // Reset form fields after successful submission
      setApprovedAmount('');
      setTotalRequested('');
      setSpecialDiseaseName('');
      setIsSpecialDisease('no');
      setSelectedClaim(null);
      setShowDetails(false);
      setHospitalBillApprovals({});
      setNotIncludedBillApprovals({});
      setPreHospApprovals({});
      setBillPassingComment('');

      // Refetch the list of claims to update the table
      if (user?.EmpCode) {
        dispatch(getClaimHr({ recipientId: user.EmpCode, pageId: 2 }));
      }
    } catch (err) {
      console.error('Error submitting:', err);
      // Implement user-friendly error feedback here
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <>
      <div className='m-4'>
        <ClaimSettlementList columns={columns} claimList={claimList} />
      </div>
      {loading && <Loader />}

      {showDetails && claimDetail && ( // Only render details if showDetails is true and claimDetail is loaded
        <div ref={detailsRef} className='m-4'>
          <h1 className="text-2xl font-bold text-primary drop_shadow mb-4">Hospitalization Claim Details</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-primary drop_shadow">
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
                key={`hosp-${item.billType}`}
                serialNo={index + 1}
                billType={item.billType}
                billedAmount={item.billedAmount}
                claimedAmount={item.claimedAmount}
                included={item.claimedAmount > 0}
                clarification="" // if any
                approvalDetails={hospitalBillApprovals[item.billType] || ''}
                onApprovalChange={(val) =>
                  setHospitalBillApprovals((prev) => ({
                    ...prev,
                    [item.billType]: val,
                  }))
                }
              />
            ))}
          </DisplayTable>

          <SectionHeader title="Not Included Bill Details" subtitle="Not included in hospitalization bills" className="mt-8" />
          <DisplayTable headers={billHeaders}>
            {notIncludedbillItems.map((item, index) => (
              <BillItemDisplayRow
                key={`not-inc-${item.billType}`}
                serialNo={index + 1}
                billType={item.billType}
                billedAmount={item.billedAmount}
                claimedAmount={item.claimedAmount}
                included={item.claimedAmount > 0}
                clarification="" // if any
                approvalDetails={notIncludedBillApprovals[item.billType] || ''}
                onApprovalChange={(val) =>
                  setNotIncludedBillApprovals((prev) => ({
                    ...prev,
                    [item.billType]: val,
                  }))
                }
              />
            ))}
          </DisplayTable>

          <SectionHeader title="Pre-Hospitalization" subtitle="30 days before admission" className="text-primary" />
          <DisplayTable headers={preHospHeaders}> {/* Use preHospHeaders for pre-hospitalization */}
            {preHospItems.map((item, index) => (
              <BillItemDisplayRow
                key={`pre-hosp-${item.billType}`}
                serialNo={index + 1}
                billType={item.billType}
                billedAmount={item.billedAmount}
                claimedAmount={item.claimedAmount}
                included={item.claimedAmount > 0}
                clarification="" // if any
                approvalDetails={preHospApprovals[item.billType] || ''}
                onApprovalChange={(val) =>
                  setPreHospApprovals((prev) => ({
                    ...prev,
                    [item.billType]: val,
                  }))
                }
              />
            ))}
          </DisplayTable>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4 text-sm">
            <div className="text-center">
              <p className="text-gray-500">Total Billed (All)</p>
              <p className="text-lg font-bold">₹{finalTotalBilled.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500">Total Claimed (All)</p>
              <p className="text-lg font-bold text-blue-600">₹{finalTotalClaimed.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500">Total Approved</p>
              <p className="text-lg font-bold text-green-600">₹{finalTotalApproved.toFixed(2)}</p>
            </div>
          </div>

          {/* Declaration Section */}
          <Card className="p-8 mt-6">
            <h2 className="text-lg font-medium text-primary drop_shadow mb-4">Declaration by Employee</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Label className=" font-medium text-gray-900">Special Disease</Label>
                <RadioGroup value={isSpecialDisease} onValueChange={(value: 'yes' | 'no') => setIsSpecialDisease(value)} disabled className="flex space-x-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="special-disease-yes" />
                    <Label htmlFor="special-disease-yes" className="text-sm">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="special-disease-no" />
                    <Label htmlFor="special-disease-no" className="text-sm">
                      No
                    </Label>
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
                    disabled // Assuming this is also for display from claimDetail
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Approval Form */}
          <Card className="mt-8">
            <div className="p-4">
              <h2 className="text-lg text-primary drop_shadow pb-4">Approval Form</h2>

              <div className="flex flex-col md:flex-row md:gap-6 gap-4">
                <div className="flex flex-col md:flex-row items-center w-full md:w-1/2 gap-2">
                  <Label className="md:w-1/2 text-gray-900">Total Claim Requested</Label>
                  <Input
                    className="w-full"
                    disabled
                    value={totalRequested} // Use the state variable populated from claimDetail
                    type="number"
                  />
                </div>

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

              <div className="flex flex-col md:flex-row md:gap-6 gap-4 mt-4">
                <div className="flex flex-col md:flex-row items-center w-full gap-2">
                  <Label className="md:w-1/4 text-gray-900">SAP Reference Number</Label>
                  <Input
                    className="w-full"
                    value={billPassing.SapRefNumber}
                    onChange={(e) => setBillPassing({ ...billPassing, SapRefNumber: e.target.value })}
                    placeholder="Enter SAP Reference Number"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:gap-6 gap-4 mt-4">
                <div className="flex flex-col md:flex-row items-start w-full gap-2">
                  <Label className="md:w-1/4 text-gray-900">Comment</Label>
                  <Input
                    className="w-full"
                    value={billPassingComment}
                    onChange={(e) => setBillPassingComment(e.target.value)}
                    placeholder="Add a comment"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSubmit} disabled={submitLoading || loading}>
                  {submitLoading ? <Loader /> : 'Confirm'}
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