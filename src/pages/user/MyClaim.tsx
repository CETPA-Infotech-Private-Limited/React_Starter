import React, { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { Card } from '@/components/ui/card';
import Loader from '@/components/ui/loader';
import MyClaimTable from '@/components/user/familyMagement/MyClaimTable';
import { findEmployeeDetails, formatRupees } from '@/lib/helperFunction';
import { getMyClaims } from '@/features/user/claim/claimSlice';

const MyClaim = () => {
  const dispatch = useAppDispatch();
  const { employees } = useAppSelector((state: RootState) => state.employee);
  const user = useAppSelector((state: RootState) => state.user);
  const { data: claimList = [], loading } = useAppSelector((state: RootState) => state.claim);

  useEffect(() => {
    if (user?.EmpCode) {
      dispatch(getMyClaims(Number(user.EmpCode)));
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
        accessorKey: 'patientId',
        header: 'Patient Name',
        cell: ({ row }: any) => {
          const result = findEmployeeDetails(employees, String(row.original.patientId));
          return <div className="text-center">{result?.employee?.empName || ''}</div>;
        },
        className: 'text-center',
      },
      {
        accessorKey: 'claimTypeName',
        header: 'Claim Type',
        className: 'text-center',
      },
      {
        accessorKey: 'advanceAmount',
        header: 'Advance Amount',
        cell: ({ row }: any) => {
          const amount = row.original.advanceAmount;
          return <div className="text-center">{amount ? formatRupees(amount) : '-'}</div>;
        },
        className: 'text-center',
      },
      {
        accessorKey: 'claimAmount',
        header: 'Claim Amount',
        cell: ({ row }: any) => {
          const amount = row.original.claimAmount;
          return <div className="text-center">{amount ? formatRupees(amount) : '-'}</div>;
        },
        className: 'text-center',
      },
      {
        accessorKey: 'requestDate',
        header: 'Request Date',
        cell: ({ row }: any) => <div className="text-center">{row.original.requestDate || '-'}</div>,
        className: 'text-center',
      },
      {
        accessorKey: 'approvedAmount',
        header: 'Approved Amount',
        cell: ({ row }: any) => {
          const amount = row.original.approvedAmount;
          return <div className="text-center">{amount ? formatRupees(amount) : '-'}</div>;
        },
        className: 'text-center',
      },
      {
        accessorKey: 'approvedDate',
        header: 'Approved Date',
        cell: ({ row }: any) => <div className="text-center">{row.original.approvedDate || '-'}</div>,
        className: 'text-center',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        className: 'text-center',
      },
    ],
    [employees]
  );

  return (
    <div className="p-6 space-y-6 font-sans">
      {loading && <Loader />}
      <Card className="p-4 border border-blue-200 shadow-sm rounded-xl bg-white">
        <h2 className="text-xl font-extrabold text-blue-800 mb-4 tracking-tight">My Claim List</h2>
        <MyClaimTable columns={columns} data={claimList || []} />
      </Card>
    </div>
  );
};

export default MyClaim;
