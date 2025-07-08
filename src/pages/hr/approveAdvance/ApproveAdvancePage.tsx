import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import TableList from '@/components/ui/data-table';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchAdvanceData } from '@/features/medicalClaim/getAdvanceClaimSlice';
import { RootState } from '@/app/store';
import Loader from '@/components/ui/loader';
import { findEmployeeDetails, formatRupees } from '@/lib/helperFunction';
import { fetchClaimDetails } from '@/features/medicalClaim/getClaimDetailsSlice';

const ApproveAdvancePage = () => {
  const dispatch = useAppDispatch();
  const [selectedAdvance, setSelectedAdvance] = useState<any | null>(null);
  const { data, loading } = useAppSelector((state: RootState) => state.getAdvanceClaim);
  const { data: claimDetails, loading: detailsLoading, error: detailsError } = useAppSelector((state: RootState) => state.getClaimDetails);
  const user = useAppSelector((state: RootState) => state.user);
  const { employees } = useAppSelector((state: RootState) => state.employee);

  useEffect(() => {
    if (user?.EmpCode) {
      dispatch(fetchAdvanceData(Number(user.EmpCode)));
    }
  }, [dispatch, user?.EmpCode]);

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
        cell: ({ row }: any) => (
          <Button
            variant="link"
            size="sm"
            className="text-blue-600"
            onClick={(e) => {
              e.stopPropagation();
              const item = row.original;
              dispatch(fetchClaimDetails(item.advanceId));
              setSelectedAdvance(item);
            }}
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
        ),
      },
    ],
    [employees, dispatch]
  );

  return (
    <div className="bg-white text-xs p-8 rounded-2xl font-sans space-y-10">
      <Card className="p-4 border border-blue-200 shadow-sm rounded-xl bg-white">
        <h2 className="text-xl font-extrabold text-blue-800 mb-4 tracking-tight">Advance Request List</h2>
        {loading && <Loader />}
        <TableList data={data} columns={columns} showSearchInput showFilter onRowClick={() => {}} />
      </Card>

      {selectedAdvance && (
        <Card className="p-4 border border-blue-300 shadow-sm rounded-xl bg-white">
          <h2 className="text-lg font-bold text-blue-700 mb-4">Advance Details - ID #{selectedAdvance.advanceId}</h2>
          {detailsLoading && <Loader />}
          {detailsError && <p className="text-red-500">Error: {detailsError}</p>}
          {claimDetails && (
            <div className="space-y-2 text-sm">
              <p>
                <strong>Hospital:</strong> {claimDetails.advanceBasicDetails.hospitalName}
              </p>
              <p>
                <strong>Doctor:</strong> {claimDetails.advanceBasicDetails.doctorName}
              </p>
              <p>
                <strong>Treatment Type:</strong> {claimDetails.advanceBasicDetails.treatmentType}
              </p>
              <p>
                <strong>Diagnosis:</strong> {claimDetails.advanceBasicDetails.digonosis}
              </p>
              <p>
                <strong>Estimated Amount:</strong> ₹{claimDetails.advanceBasicDetails.estimatedAmount}
              </p>
              <p>
                <strong>Requested Date:</strong> {new Date(claimDetails.advanceBasicDetails.requestedDate).toLocaleString()}
              </p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default ApproveAdvancePage;
