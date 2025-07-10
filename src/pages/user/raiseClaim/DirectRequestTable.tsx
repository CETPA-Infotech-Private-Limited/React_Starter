import { useEffect, useMemo, useRef, useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import RaiseClaim from './RaiseClaim';
import AdvanceClaimSettle from './AdvanceClaimSettle';
import TableList from '@/components/ui/data-table';
import Loader from '@/components/ui/loader';
import { CheckCircle, XCircle } from 'lucide-react';
import { getMyClaims } from '@/features/user/claim/claimSlice';
import { fetchClaimDetails } from '@/features/medicalClaim/getClaimDetailsSlice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { findEmployeeDetails, formatRupees } from '@/lib/helperFunction';

const DirectRequestTable = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedAdvanceClaim, setSelectedAdvanceClaim] = useState<any | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();

  const employees = useAppSelector((state: RootState) => state.employee.employees);
  const user = useAppSelector((state) => state.user);
  const { data: claimData, loading } = useAppSelector((state: RootState) => state.claim);
  const { data: claimDetails, loading: detailsLoading } = useAppSelector((state: RootState) => state.getClaimDetails);

  useEffect(() => {
    if (user.EmpCode) {
      dispatch(getMyClaims(Number(user.EmpCode)));
    }
  }, [dispatch, user.EmpCode]);

  const handleScrollToForm = () => {
    setTimeout(() => {
      if (!formRef.current) return;

      let scrollParent: HTMLElement | null = formRef.current.parentElement;
      while (scrollParent && scrollParent !== document.body) {
        const style = getComputedStyle(scrollParent);
        const canScroll = style.overflowY === 'auto' || style.overflowY === 'scroll';
        if (canScroll && scrollParent.scrollHeight > scrollParent.clientHeight) break;
        scrollParent = scrollParent.parentElement;
      }

      if (scrollParent) {
        scrollParent.scrollTo({
          top: formRef.current.offsetTop - 130,
          behavior: 'smooth',
        });
      }
    }, 100);
  };

  const filteredClaims = useMemo(() => claimData?.filter((claim) => claim.claimTypeName === 'Advance' && claim.statusId === 2) || [], [claimData]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'sno',
        header: 'Sr. No.',
        enableSorting: false,
        cell: ({ row }: any) => <div className="text-center">{row.index + 1}</div>,
      },
      {
        accessorKey: 'requestDate',
        header: 'Request Date',
        cell: ({ row }: any) => <div className="text-center">{row.original.requestDate ? format(new Date(row.original.requestDate), 'dd-MM-yyyy') : '-'}</div>,
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
        accessorKey: 'claimTypeName',
        header: 'Relation',
        enableSorting: false,
        cell: () => <div className="text-center">Self</div>,
      },
      {
        accessorKey: 'advanceAmount',
        header: 'Advance Requested (₹)',
        enableSorting: false,
        cell: ({ row }: any) => <div className="text-center">{row.original.advanceAmount ? formatRupees(row.original.advanceAmount) : '-'}</div>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        enableSorting: true,
        cell: ({ row }: any) => <div className="text-center">{row.original.status}</div>,
      },
      {
        accessorKey: 'approvedDate',
        header: 'Approved Date',
        enableSorting: false,
        cell: ({ row }: any) => (
          <div className="text-center">{row.original.approvedDate ? format(new Date(row.original.approvedDate), 'dd-MM-yyyy') : '-'}</div>
        ),
      },
      {
        accessorKey: 'approvedAmount',
        header: 'Approved Amount (₹)',
        enableSorting: false,
        cell: ({ row }: any) => <div className="text-center">{row.original.approvedAmount ? formatRupees(row.original.approvedAmount) : '-'}</div>,
      },
      {
        accessorKey: 'action',
        header: 'Action',
        enableSorting: false,
        cell: ({ row }: any) => {
          const isSelected = selectedAdvanceClaim?.claimId === row.original.claimId;

          return (
            <div className="flex justify-center gap-2">
              <Button
                size="sm"
                variant={row.original.statusId === 2 ? 'default' : 'ghost'}
                disabled={row.original.statusId !== 2}
                onClick={() => {
                  if (isSelected) {
                    setSelectedAdvanceClaim(null);
                    setShowForm(false);
                  } else {
                    dispatch(fetchClaimDetails(row.original.advanceId));
                    setSelectedAdvanceClaim(row.original);
                    setShowForm(true);
                    handleScrollToForm();
                  }
                }}
                className="flex items-center gap-2"
              >
                {isSelected ? (
                  <>
                    <XCircle size={16} />
                    Cancel
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Settle Now
                  </>
                )}
              </Button>
            </div>
          );
        },
      },
    ],
    [employees, selectedAdvanceClaim, dispatch]
  );

  return (
    <div className="p-6 bg-gradient-to-br from-white via-blue-50 to-white min-h-screen font-sans">
      <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-blue-800">Approved Advance Request List</h1>
        </div>

        {(detailsLoading || loading) && <Loader />}

        <TableList
          data={filteredClaims}
          columns={columns}
          showSearchInput
          showFilter
          rightElements={
            <Button
              onClick={() => {
                setShowForm((prev) => !prev);
                setSelectedAdvanceClaim(null);
                handleScrollToForm();
              }}
              variant={showForm ? 'secondary' : 'default'}
            >
              {showForm ? 'Cancel' : '+ New Direct Claim Request'}
            </Button>
          }
        />
      </div>

      {showForm && (
        <div className="mt-6" ref={formRef}>
          {selectedAdvanceClaim ? (
            <AdvanceClaimSettle
              onCloseForm={() => {
                setShowForm(false);
                setSelectedAdvanceClaim(null);
              }}
              defaultData={{ ...claimDetails, selectedAdvanceClaim }}
            />
          ) : (
            <RaiseClaim onCloseForm={() => setShowForm(false)} defaultData={null} />
          )}
        </div>
      )}
    </div>
  );
};

export default DirectRequestTable;
