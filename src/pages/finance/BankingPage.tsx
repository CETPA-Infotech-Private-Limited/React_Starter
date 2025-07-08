import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';
import TableList from '@/components/ui/data-table';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchAdvanceData, fetchBankingAdvanceData } from '@/features/medicalClaim/getAdvanceClaimSlice';
import { fetchClaimDetails } from '@/features/medicalClaim/getClaimDetailsSlice';
import { RootState } from '@/app/store';
import Loader from '@/components/ui/loader';
import { findEmployeeDetails, formatRupees } from '@/lib/helperFunction';
import { PatientDetailsCard } from '@/components/hr/advanceApprove/PatientDetailsTable';
import { HospitalizationDetailsCard } from '@/components/hr/advanceApprove/HospitalizationDetailsCard';
import { BeneficiaryDetailsCard } from '@/components/hr/advanceApprove/BeneficiaryDetails';
import AdvanceApprovalForm from '@/components/hr/advanceApprove/AdvanceApprovalForm';
import { submitAdvanceApproval, resetAdvanceApprovalState } from '@/features/medicalClaim/advanceApprovalSlice';
import toast from 'react-hot-toast';
import AdvanceBankingDetailsForm from '@/components/finance/Banking/AdvanceBankingDetailsForm';

const ApproveAdvancePage = () => {
  const dispatch = useAppDispatch();
  const [selectedAdvance, setSelectedAdvance] = useState<any | null>(null);
  const { bankingData, loading } = useAppSelector((state: RootState) => state.getAdvanceClaim);
  const { data: claimDetails, loading: detailsLoading, error: detailsError } = useAppSelector((state: RootState) => state.getClaimDetails);
  const { loading: approvalLoading, success, error } = useAppSelector((state: RootState) => state.advanceApproval);

  const user = useAppSelector((state: RootState) => state.user);
  const { employees } = useAppSelector((state: RootState) => state.employee);

  useEffect(() => {
    if (user?.EmpCode) {
      dispatch(fetchBankingAdvanceData(Number(user.EmpCode)));
    }
  }, [dispatch, user?.EmpCode]);

  useEffect(() => {
    if (success) {
      toast.success('Advance approved successfully!');
      dispatch(resetAdvanceApprovalState());
      dispatch(fetchAdvanceData(Number(user.EmpCode)));
      setSelectedAdvance(null);
    }
    if (error) {
      toast.error(error);
      dispatch(resetAdvanceApprovalState());
    }
  }, [success, error, dispatch]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'sno',
        header: 'Sr. No.',
        enableSorting: false,
        cell: ({ row }: any) => <div className="text-center">{row.index + 1}</div>,
        className: 'text-center',
      },
      {
        accessorKey: 'empId',
        header: 'Employee Name',
        enableSorting: false,
        cell: ({ row }: any) => {
          const result = findEmployeeDetails(employees, String(row.original.empId));
          return <div className="text-center">{result?.employee?.empName || 'Unknown'}</div>;
        },
        className: 'text-center',
      },
      {
        accessorKey: 'patientId',
        header: 'Patient Name',
        enableSorting: false,
        cell: ({ row }: any) => {
          const result = findEmployeeDetails(employees, String(row.original.patientId));
          return <div className="text-center">{result?.employee?.empName || ''}</div>;
        },
        className: 'text-center',
      },
      {
        accessorKey: 'relation',
        header: 'Relation',
        enableSorting: false,
        cell: () => <div className="text-center">Self</div>,
        className: 'text-center',
      },
      {
        accessorKey: 'requestDate',
        header: 'Request Date',
        cell: ({ row }: any) => <div className="text-center">{row.original.requestDate}</div>,
        className: 'text-center',
      },
      {
        accessorKey: 'advanceAmount',
        header: 'Claim Amount',
        enableSorting: false,
        cell: ({ row }: any) => {
          const amount = row.original.advanceAmount;
          return <div className="text-center">{amount ? formatRupees(amount) : '-'}</div>;
        },
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
      dob: 'Not Available',
      gender: 'Not Available',
    };
  };

  const handleSubmitAdvanceRequest = ({ approvedAmount }: { approvedAmount: number }) => {
    if (!selectedAdvance || !user.EmpCode) return;

    dispatch(
      submitAdvanceApproval({
        AdvanceId: Number(selectedAdvance.advanceId),
        SenderId: Number(user.EmpCode),
        RecipientId: 101002,
        ClaimTypeId: 1,
        StatusId: 4,
        ApprovalAmount: approvedAmount,
      })
    );
  };

  const patientDetails = getPatientDetails();

  const handleBankingDetailsSubmit = (data: { sapRefNumber: string; sapRefDate: string; transactionDate: string; utrNo: string }) => {
    console.log('Submitted banking data:', data);

    // You can dispatch to Redux, send to API, etc.
    // Example:
    // dispatch(updateBankingInfo(data));
  };

  return (
    <div className="bg-white text-xs p-8 rounded-2xl font-sans space-y-10">
      <Card className="p-4 border border-blue-200 shadow-sm rounded-xl bg-white">
        <h2 className="text-xl font-extrabold text-blue-800 mb-4 tracking-tight">Advance Request List</h2>
        {loading && <Loader />}
        <TableList
          data={bankingData}
          columns={columns}
          showSearchInput
          showFilter
          onRowClick={() => {}}
          rowClassName={(row) => (selectedAdvance?.advanceId === row.original.advanceId ? 'bg-blue-50 border-l-2 border-blue-600' : '')}
        />
      </Card>
      <AdvanceBankingDetailsForm
        onSubmit={handleBankingDetailsSubmit}
        loading={false}
        initialData={{
          sapRefNumber: 'ABC123456',
          sapRefDate: '2025-07-08',
          transactionDate: '2025-07-07',
          utrNo: 'UTR789456',
        }}
      />

      {selectedAdvance && patientDetails && (
        <>
          {detailsLoading && <Loader />}
          <h2 className="text-xl font-bold text-blue-700 mb-4">Patient Details & Advance Details</h2>
          <PatientDetailsCard {...patientDetails} />

          {claimDetails?.advanceBasicDetails && (
            <HospitalizationDetailsCard
              hospitalName={claimDetails.advanceBasicDetails.hospitalName || '-'}
              regdNo={claimDetails.advanceBasicDetails.hospitalRegNo || '-'}
              admissionDate={claimDetails.advanceBasicDetails.likelyDate || ''}
              treatmentType={claimDetails.advanceBasicDetails.treatmentType || '-'}
              diagnosis={claimDetails.advanceBasicDetails.digonosis || '-'}
              estimatedAmount={claimDetails.advanceBasicDetails.estimatedAmount || 0}
              advanceRequested={claimDetails.advanceBasicDetails.advanceAmount || 0}
              doctorName={claimDetails.advanceBasicDetails.doctorName || '-'}
              payTo={claimDetails.advanceBasicDetails.payTo || '-'}
              estimateFiles={
                Array.isArray(claimDetails.documentLists)
                  ? claimDetails.documentLists.filter((doc) => doc.category === 'EstimateAmount').map((doc) => doc.pathUrl)
                  : []
              }
              admissionAdviceFiles={
                Array.isArray(claimDetails.documentLists)
                  ? claimDetails.documentLists.filter((doc) => doc.category === 'AdmissionAdviceUpload').map((doc) => doc.pathUrl)
                  : []
              }
              incomeProofFiles={[]}
            />
          )}

          {claimDetails?.hospitalAccoundetail && (
            <BeneficiaryDetailsCard
              beneficiaryName={claimDetails.hospitalAccoundetail.beneficiaryName}
              bankName={claimDetails.hospitalAccoundetail.bankName}
              accountNumber={claimDetails.hospitalAccoundetail.accountNumber}
              branchName={claimDetails.hospitalAccoundetail.branchName}
              ifscCode={claimDetails.hospitalAccoundetail.ifscCode}
              hospitalGSTNo={claimDetails.hospitalAccoundetail.hospitalGSTNo}
              utrNo={claimDetails.hospitalAccoundetail.utrNo}
              transactionDate={claimDetails.hospitalAccoundetail.transactionDate}
              sapRefNumber={claimDetails.hospitalAccoundetail.sapRefNumber}
              sapRefDate={claimDetails.hospitalAccoundetail.sapRefDate}
            />
          )}

          <AdvanceApprovalForm estimatedAmount={selectedAdvance.advanceAmount} onSubmit={handleSubmitAdvanceRequest} approvalLoading={approvalLoading} />
        </>
      )}
    </div>
  );
};

export default ApproveAdvancePage;
