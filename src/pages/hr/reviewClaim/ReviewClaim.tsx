'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import ClaimSettlementList from '@/components/hr/reviewclaim/ClaimSettlementList';
import ViewClaimDetails from '@/components/hr/reviewclaim/ViewClaimDetails';
import { Button } from '@/components/ui/button';
import { EyeIcon, FileSearch, EyeOff } from 'lucide-react';
import HospitalizationBillView from '@/components/hr/reviewclaim/HospitalizationBillView';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { getClaimDataHr, getClaimHr } from '@/features/hr/getClaimRequestSlice';
import { findEmployeeDetails } from '@/lib/helperFunction';

  const ReviewClaim = () => {
    const dispatch = useAppDispatch()
      
       const claimHrData = useAppSelector((state:RootState)=>state.getClaimHr.data)
       
       const { employees } = useAppSelector((state: RootState) => state.employee);
  const [selectedClaim, setSelectedClaim] = useState<any | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);

  const user = useAppSelector((state:RootState)=>state.user)
  console.log(user, "this is userDetails")

useEffect(() => {
  if (user?.EmpCode) {
    dispatch(getClaimHr({ recipientId: user.EmpCode, pageId: 1 }));
  }
}, [user?.EmpCode]); 
  // Auto scroll to details when toggled on
  useEffect(() => {
    if (showDetails && detailsRef.current){
      detailsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showDetails]);

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
      dispatch(getClaimDataHr({advanceid: rowData.claimId}));
     
    }
  };

 const claimDetail = useAppSelector((state: RootState) => state.getClaimHr.claimDetail);

  console.log(claimDetail,'this is claimdetail')
    
  const columns = useMemo(
    () => [
      {
        accessorKey: 'srNo',
        header: 'Sr. No',
        cell: ({ row }: any) => row.index + 1,
      },
      {
        accessorKey: 'employeeName',
        header: 'Employee Name',
      },
      {
        accessorKey: 'patientName',
        header: 'Patient Name',
      },
      {
        accessorKey: 'relation',
        header: 'Relation',
      },
      {
        accessorKey: 'requestedDate',
        header: 'Requested Date',
      },
      {
        accessorKey: 'claimAmount',
        header: 'Claim Amount (₹)',
        cell: ({ getValue }: any) => `₹ ${getValue().toLocaleString()}`,
      },
      {
        accessorKey: 'action',
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
    [selectedClaim, showDetails]
  );

  const empData = findEmployeeDetails(employees, user.EmpCode)
  console.log(empData,"this is emp data")

  const claimList = Array.isArray(claimHrData)
  ? claimHrData.map((value, index) => ({
      id: value.claimId,
      employeeName: empData.employee.empName,
      patientName: empData.employee.empName,
      relation: 'Self', // if not available
      requestedDate: new Date(value.requestDate).toLocaleDateString(),
      claimAmount: value.cliamAmount,
      claimId:value.claimId
    }))
  : [];

  //   {
  //     id: 'CLM002',
  //     employeeName: 'Alice Smith',
  //     patientName: 'Bob Smith',
  //     relation: 'Son',
  //     requestedDate: '2025-06-25',
  //     claimAmount: 1200,
  //   },
  //   {
  //     id: 'CLM003',
  //     employeeName: 'Raj Patel',
  //     patientName: 'Rina Patel',
  //     relation: 'Daughter',
  //     requestedDate: '2025-06-15',
  //     claimAmount: 800,
  //   },
  // ];

  return (
    <div className="p-6 bg-gradient-to-br from-white via-blue-50 to-white min-h-screen font-sans">
      {/* Header & Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <FileSearch className="text-blue-600 w-6 h-6" />
          <h1 className="text-2xl font-bold text-blue-800 tracking-tight">Review Claim Requests</h1>
        </div>

        <ClaimSettlementList columns={columns} claimList={claimList} />
      </div>

      {/* Conditional Claim Detail Section */}
      {selectedClaim && showDetails && (
        <div ref={detailsRef} className="space-y-6 transition-all duration-300 bg-white border border-blue-200 rounded-2xl shadow-lg p-6">
          <HospitalizationBillView claimDetail={claimDetail} />
          <ViewClaimDetails claim={selectedClaim} />
        </div>
      )}
    </div>
  );
};

export default ReviewClaim;
