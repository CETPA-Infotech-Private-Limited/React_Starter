'use client';

import { useEffect, useMemo, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import RaiseClaim from './RaiseClaim';
import ClaimSettlementList from '@/components/hr/reviewclaim/ClaimSettlementList';
import { Button } from '@/components/ui/button';
import { getMyClaims } from '@/features/user/claim/claimSlice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';

const AdvanceRequestTable = () => {
  const [selectedClaim, setSelectedClaim] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);

  const user = useAppSelector((state) => state.user.EmpCode);
  const userdata = useAppSelector((state: RootState) => state.user);
  const claimdata = useAppSelector((state) => state.claim.data);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      dispatch(getMyClaims(user));
    }
  }, [dispatch, user]);

  const handleCheckboxChange = (checked: boolean) => {
    setShowForm(checked);
  };

  const columns = useMemo(() => [
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
      cell: ({ getValue }: any) => {
        const value = getValue();
        return `₹ ${typeof value === 'number' ? value.toLocaleString() : value}`;
      },
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }: any) => (
        <Button
          size="sm"
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white"
        >
          Settle
        </Button>
      ),
    },
  ], []);

  const claimList = Array.isArray(claimdata)
    ? claimdata
        .slice()
        .sort((a, b) => new Date(b.requestedDate).getTime() - new Date(a.requestedDate).getTime())
        .map((value: any) => ({
          id: value.claimId,
          employeeName: userdata.name || '',
          patientName: userdata.name || '',
          relation: value.relation || 'Self',
          requestedDate: value.requestedDate
            ? new Date(value.requestedDate).toLocaleString()
            : new Date().toLocaleString(),
          claimAmount: value.claimAmount || value.cliamAmount || 0,
        }))
    : [];

  return (
    <div className="p-6 bg-gradient-to-br from-white via-blue-50 to-white min-h-screen font-sans">
      {/* Claim Table Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-6 mb-6">
        <h1 className="text-2xl font-bold text-blue-800 mb-4">Approved Advance List</h1>
        <ClaimSettlementList columns={columns} claimList={claimList} />
      </div>

      {/* Checkbox to open RaiseClaim form */}
      <Card className="p-4 flex items-center gap-3 border border-blue-200 shadow-sm bg-white rounded-xl">
        <Checkbox id="new-request" onCheckedChange={handleCheckboxChange} checked={showForm} />
        <label htmlFor="new-request" className="text-lg font-medium text-blue-800">
          Direct Claim Request
        </label>
      </Card>

      {/* Conditional RaiseClaim Form */}
      {showForm && (
        <div className="mt-6">
          <RaiseClaim onCloseForm={() => setShowForm(false)} />
        </div>
      )}
    </div>
  );
};

export default AdvanceRequestTable;
