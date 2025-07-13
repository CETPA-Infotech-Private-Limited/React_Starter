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
import { submitAdvanceApproval, resetAdvanceApprovalState } from '@/features/medicalClaim/advanceApprovalSlice';
import toast from 'react-hot-toast';
import { ReadOnlyField } from '@/components/common/ReadOnlyField';

const ApproveAdvancePage = () => {
  const dispatch = useAppDispatch();
  const [selectedAdvance, setSelectedAdvance] = useState<any | null>(null);
  const [referenceDate, setReferenceDate] = useState('');
  const [sapRefNumber, setSapRefNumber] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [comment, setComment] = useState('');

  const { bankingData, loading } = useAppSelector((state: RootState) => state.getAdvanceClaim);
  const { data: claimDetails, loading: detailsLoading } = useAppSelector((state: RootState) => state.getClaimDetails);
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
        accessorKey: 'approvedAmount',
        header: 'Approved Amount',
        enableSorting: false,
        cell: ({ row }: any) => {
          const amount = row.original.approvedAmount;
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

  const patientDetails = getPatientDetails();

  const handleBankingDetailsSubmit = () => {
    if (!referenceDate || !sapRefNumber || !amountPaid) {
      toast.error('Please fill all required fields.');
      return;
    }

    dispatch(
      submitAdvanceApproval({
        AdvanceId: Number(selectedAdvance.advanceId),
        SenderId: Number(user.EmpCode),
        ClaimTypeId: Number(claimDetails.advanceBasicDetails.claimTypeId),
        ReferenceDate: referenceDate,
        SapRefNumber: sapRefNumber,
        AmountPaid: parseFloat(amountPaid),
        Comment: comment || '',
        // StatusId:2
      })
    );
    console.log(selectedAdvance,'thisis advace')
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
          rowClassName={(row) => (selectedAdvance?.claimId === row.original.claimId ? 'bg-blue-50 border-l-2 border-blue-600' : '')}
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

          <Card className="p-4 border border-blue-200 shadow-sm rounded-xl bg-white">
            <h2 className="text-xl font-bold text-blue-700 mb-4">Verify And Approved</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ReadOnlyField label="Advance Request Amount" value={formatRupees(selectedAdvance?.advanceAmount)} />
              <ReadOnlyField label="Final Approve Amount" value={formatRupees(selectedAdvance?.approvedAmount)} />

              <div>
                <label className="text-sm font-medium text-gray-700">Reference Date</label>
                <input
                  type="datetime-local"
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  value={referenceDate}
                  onChange={(e) => setReferenceDate(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">SAP Reference Number</label>
                <input
                  type="text"
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  value={sapRefNumber}
                  onChange={(e) => setSapRefNumber(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Amount Paid</label>
                <input
                  type="number"
                  step="0.01"
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Comment</label>
                <textarea
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="mt-4" onClick={handleBankingDetailsSubmit}>
                Verify & Approve
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default ApproveAdvancePage;
