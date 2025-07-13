'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import ClaimSettlementList from '@/components/hr/reviewClaim/ClaimSettlementList';
import { Button } from '@/components/ui/button';
import { EyeIcon, FileSearch, EyeOff } from 'lucide-react';
import HospitalizationBillView from '@/components/hr/reviewClaim/HospitalizationBillView';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { getClaimDataHr, getClaimHr } from '@/features/hr/getClaimRequestSlice';
import { findEmployeeDetails } from '@/lib/helperFunction';
import Loader from '@/components/ui/loader';

const ReviewClaim = () => {
  const dispatch = useAppDispatch();

  const claimHrData = useAppSelector((state: RootState) => state.getClaimHr.data);
  const {claimDetail, loading} = useAppSelector((state: RootState) => state.getClaimHr);
  const { employees } = useAppSelector((state: RootState) => state.employee);
  const user = useAppSelector((state: RootState) => state.user);

  const [selectedClaim, setSelectedClaim] = useState<any | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchClaims = async () => {
      if (user?.EmpCode) {
        setIsSubmitting(true);
        await dispatch(getClaimHr({ recipientId: user.EmpCode, pageId: 1 }));
        setIsSubmitting(false);
      }
    };

    fetchClaims();
  }, [user?.EmpCode]);

  useEffect(() => {
    if (showDetails && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showDetails]);

  const handleViewToggle = async (rowData: any) => {
    setIsSubmitting(true)
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

    if (rowData.advanceId) {
     
      await dispatch(getClaimDataHr({ advanceid: rowData.advanceId }));
      setIsSubmitting(false);
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
        advanceId:value.advanceId,
        claimId: value.claimId,
      }))
    : [];

  return (
    
        <>
          <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-6 mb-6">
            <div className="flex items-center gap-2 mb-5">
              <FileSearch className="text-blue-600 w-6 h-6" />
              <h1 className="text-2xl font-bold text-blue-800 tracking-tight">Review Claim Requests</h1>
            </div>

            <ClaimSettlementList columns={columns} claimList={claimList} />
          </div>
          {loading && <Loader/>}
          
          {selectedClaim && showDetails && (
            <div
              ref={detailsRef}
              className="space-y-6 transition-all duration-300 bg-white border border-blue-200 rounded-2xl shadow-lg p-6"
            >
              <HospitalizationBillView claimDetail={claimDetail} />
              {/* <ViewClaimDetails claim={selectedClaim} /> */}
            </div>
          )}
        </>
  )
};

export default ReviewClaim;
