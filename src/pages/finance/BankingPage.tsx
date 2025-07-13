import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import TableList from '@/components/ui/data-table';
import Loader from '@/components/ui/loader';
import toast from 'react-hot-toast';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { fetchBankingAdvanceData, fetchAdvanceData } from '@/features/medicalClaim/getAdvanceClaimSlice';
import { fetchClaimDetails } from '@/features/medicalClaim/getClaimDetailsSlice';
import { submitAdvanceApprovalByFinance, resetFinanceStatus } from '@/features/medicalClaim/advanceApprovalSlice';
import { findEmployeeDetails } from '@/lib/helperFunction';
import { PatientDetailsCard } from '@/components/hr/reviewAdvanceRequest/PatientDetailsTable';
import { HospitalizationDetailsCard } from '@/components/hr/reviewAdvanceRequest/HospitalizationDetailsCard';
import AdvanceBankingDetailsForm from '@/components/finance/Banking/AdvanceBankingDetailsForm';
import { format } from 'date-fns';

const BankingPage = () => {
  const dispatch = useAppDispatch();
  const [selectedAdvance, setSelectedAdvance] = useState<any | null>(null);

  const { EmpCode } = useAppSelector((state: RootState) => state.user);
  const { bankingData, loading: tableLoading } = useAppSelector((state) => state.getAdvanceClaim);
  const { employees } = useAppSelector((state) => state.employee);
  const { data: claimDetails, loading: detailsLoading } = useAppSelector((state) => state.getClaimDetails);
  const { finance } = useAppSelector((state) => state.advanceApproval);

  useEffect(() => {
    if (EmpCode) {
      dispatch(fetchBankingAdvanceData(Number(EmpCode)));
    }
  }, [dispatch, EmpCode]);

  useEffect(() => {
    if (finance.success) {
      toast.success('Advance approved successfully!');
      dispatch(resetFinanceStatus());
      dispatch(fetchBankingAdvanceData(Number(EmpCode)));
      setSelectedAdvance(null);
    }

    if (finance.error) {
      toast.error(finance.error);
      dispatch(resetFinanceStatus());
    }
  }, [finance.success, finance.error, dispatch, EmpCode]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'sno',
        header: 'Sr. No.',
        cell: ({ row }: any) => <div className="text-center">{row.index + 1}</div>,
        className: 'text-center',
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
        accessorKey: 'claimType',
        header: 'Claim Type',
        cell: ({ row }: any) => <div className="text-center"> {row.original.claimType}</div>,
        className: 'text-center',
      },

      // {
      //   accessorKey: 'patientId',
      //   header: 'Patient Name',
      //   cell: ({ row }: any) => {
      //     const result = findEmployeeDetails(employees, String(row.original.patientId));
      //     return <div className="text-center">{result?.employee?.empName || ''}</div>;
      //   },
      //   className: 'text-center',
      // },
      {
        accessorKey: 'approvedDate',
        header: 'Approved Date',
        cell: ({ row }: any) => (
          <div className="text-center">{row.original.approvedDate ? format(new Date(row.original.approvedDate), 'do MMM yyyy') : '-'}</div>
        ),
        className: 'text-center',
      },
      {
        accessorKey: 'advanceAmount',
        header: 'Advance Amount',
        cell: ({ row }: any) => <div className="text-center">₹ {row.original.advanceAmount}</div>,
        className: 'text-center',
      },
      {
        accessorKey: 'approvedAmount',
        header: 'Approved Amount',
        cell: ({ row }: any) => <div className="text-center">₹ {row.original.approvedAmount}</div>,
        className: 'text-center',
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }: any) => {
          const item = row.original;
          const isSelected = selectedAdvance?.advanceId === item.advanceId;
          return (
            <Button
              variant="link"
              size="sm"
              className="text-blue-600"
              onClick={(e) => {
                e.stopPropagation();
                if (isSelected) {
                  setSelectedAdvance(null);
                } else {
                  dispatch(fetchClaimDetails(item.advanceId));
                  setSelectedAdvance(item);
                }
              }}
            >
              {isSelected ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
              {isSelected ? 'Hide' : 'View'}
            </Button>
          );
        },
      },
    ],
    [employees, dispatch, selectedAdvance]
  );

  const getPatientDetails = () => {
    if (!selectedAdvance) return null;
    const result = findEmployeeDetails(employees, String(selectedAdvance.patientId));
    return {
      name: result?.employee?.empName || 'Unknown',
      relation: 'Self',
      dob: 'N/A',
      gender: 'N/A',
    };
  };

  const handleBankingSubmit = (data: { SapRefNumber: string; ReferenceDate: string; AmountPaid: number; Comment?: string }) => {
    if (!selectedAdvance || !EmpCode || !claimDetails?.advanceBasicDetails) return;

    dispatch(
      submitAdvanceApprovalByFinance({
        AdvanceId: selectedAdvance.advanceId,
        SenderId: Number(EmpCode),
        ClaimTypeId: claimDetails.advanceBasicDetails.claimTypeId || 1,
        ReferenceDate: data.ReferenceDate,
        SapRefNumber: data.SapRefNumber,
        AmountPaid: data.AmountPaid,
        Comment: data.Comment || '',
        StatusId: 2,
      })
    );
  };

  const patientDetails = getPatientDetails();

  return (
    <div className="bg-white text-xs p-8 rounded-2xl font-sans space-y-10">
      <Card className="p-4 border border-blue-200 shadow-sm rounded-xl bg-white">
        <h2 className="text-xl font-extrabold text-blue-800 mb-4 tracking-tight">Advance Request List</h2>
        {tableLoading && <Loader />}
        <TableList
          data={bankingData}
          columns={columns}
          showSearchInput
          showFilter
          rowClassName={(row) => (selectedAdvance?.advanceId === row.original.advanceId ? 'bg-blue-50 border-l-2 border-blue-600' : '')}
        />
      </Card>

      {selectedAdvance && patientDetails && (
        <>
          {detailsLoading && <Loader />}
          <h2 className="text-xl font-bold text-blue-700 mb-4">Patient Details & Advance Details</h2>
          <PatientDetailsCard {...patientDetails} />

          {claimDetails?.advanceBasicDetails && (
            <HospitalizationDetailsCard
              hospitalName={claimDetails.advanceBasicDetails.hospitalName || '-'}
              regdNo={claimDetails.advanceBasicDetails.hospitalRegNo || '-'}
              admissionDate={claimDetails.advanceBasicDetails.likelyDate ? format(new Date(claimDetails.advanceBasicDetails.likelyDate), 'do MMM yyyy') : '-'}
              treatmentType={claimDetails.advanceBasicDetails.treatmentType || '-'}
              diagnosis={claimDetails.advanceBasicDetails.digonosis || '-'}
              estimatedAmount={claimDetails.advanceBasicDetails.estimatedAmount || 0}
              advanceRequested={claimDetails.advanceBasicDetails.advanceAmount || 0}
              doctorName={claimDetails.advanceBasicDetails.doctorName || '-'}
              payTo={claimDetails.advanceBasicDetails.payTo || '-'}
              estimateFiles={claimDetails.documentLists?.filter((doc) => doc.category === 'EstimateAmount')?.map((doc) => doc.pathUrl) || []}
              admissionAdviceFiles={claimDetails.documentLists?.filter((doc) => doc.category === 'AdmissionAdviceUpload')?.map((doc) => doc.pathUrl) || []}
              incomeProofFiles={[]}
            />
          )}

          <AdvanceBankingDetailsForm
            initialData={{
              sapRefNumber: '',
              referenceDate: new Date(),
              amountPaid: '',
              comment: '',
            }}
            loading={finance.loading}
            onSubmit={handleBankingSubmit}
          />
        </>
      )}
    </div>
  );
};

export default BankingPage;
