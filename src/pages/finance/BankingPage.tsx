import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Eye } from 'lucide-react';
import TableList from '@/components/ui/data-table';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchAdvanceData } from '@/features/medicalClaim/getAdvanceClaimSlice';
import { RootState } from '@/app/store';
import { findEmployeeDetails, formatRupees } from '@/lib/helperFunction';
import Loader from '@/components/ui/loader';
import { fetchClaimDetails } from '@/features/medicalClaim/getClaimDetailsSlice';
import DetailsCard from '@/components/finance/Banking/DetailsCard';
import BankingDetails from '@/components/finance/Banking/BankingDetails';
import FinancialDetails from '@/components/finance/Banking/FinancialDeatails';

const BankingPage = () => {
  const dispatch = useAppDispatch();
  const [selectedAdvance, setSelectedAdvance] = useState<any | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const { data, loading } = useAppSelector((state: RootState) => state.getAdvanceClaim);
  const { data: claimDetails } = useAppSelector((state: RootState) => state.getClaimDetails);
  const { employees } = useAppSelector((state: RootState) => state.employee);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'sno',
        header: 'Sr. No.',
        enableSorting: false,
        cell: ({ row }: any) => <div className="text-center">{row.index + 1}</div>,
      },
      {
        accessorKey: 'empId',
        header: 'Employee Name',
        enableSorting: false,
        cell: ({ row }: any) => {
          const result = findEmployeeDetails(employees, String(row.original.empId));
          return <div className="text-center">{result?.employee?.empName || 'Unknown'}</div>;
        },
      },
      {
        accessorKey: 'patientId',
        header: 'Patient Name',
        enableSorting: false,
        cell: ({ row }: any) => {
          const result = findEmployeeDetails(employees, String(row.original.patientId));
          return <div className="text-center">{result?.employee?.empName || ''}</div>;
        },
      },
      {
        accessorKey: 'relation',
        header: 'Relation',
        enableSorting: false,
        cell: () => <div className="text-center">Self</div>,
      },
      {
        accessorKey: 'requestDate',
        header: 'Request Date',
        cell: ({ row }: any) => <div className="text-center">{row.original.requestDate}</div>,
      },
      {
        accessorKey: 'advanceAmount',
        header: 'Claim Amount',
        enableSorting: false,
        cell: ({ row }: any) => {
          const amount = row.original.advanceAmount;
          return <div className="text-center">{amount ? formatRupees(amount) : '-'}</div>;
        },
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

  const handleSubmit = () => {
    if (!isConfirmed) return;
    console.log('Submit confirmed. Proceed with action.');
  };

  return (
  <div className="space-y-6 pb-10">
    <Card className="p-4 border border-blue-200 shadow-sm rounded-xl bg-white w-full">

      <h2 className="text-xl font-extrabold text-blue-800 mb-4 tracking-tight">
        Advance Request List
      </h2>
      {loading && <Loader />}
      <TableList data={data} columns={columns} showSearchInput showFilter onRowClick={() => {}} />
    </Card>

    <DetailsCard />
    <FinancialDetails />
    <BankingDetails />

    {/* Consent & Submit - no card */}
    <div className="w-full px-4 md:px-10 lg:px-20 xl:px-32 flex flex-col gap-1 mt-4">
      <div className="flex items-center gap-2">
        <Checkbox
          id="confirmation-checkbox"
          checked={isConfirmed}
          onCheckedChange={(checked) => setIsConfirmed(!!checked)}
        />
        <Label htmlFor="confirmation-checkbox" className="text-sm text-gray-700">
          I confirm the above details are correct and complete.
        </Label>
      </div>

      <div className="flex justify-end mt-2">
        <Button
          className="bg-blue-600 text-white hover:bg-blue-700"
          disabled={!isConfirmed}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </div>
  </div>
);
};

export default BankingPage;