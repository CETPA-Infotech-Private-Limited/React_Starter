import { useEffect, useMemo, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { getMyClaims } from '@/features/user/claim/claimSlice';
import RequestAdvanceForm from '@/components/user/RequestAdvanceForm';
import RequestAdvanceTable from '@/components/user/RequestAdvanceTable';
import RequestAdvanceTopUpForm from '@/components/user/RequestAdvanceTopUpForm';
import { Button } from '@/components/ui/button';
import { findEmployeeDetails, formatRupees } from '@/lib/helperFunction';
import Loader from '@/components/ui/loader';

const AdvanceClaimPage = () => {
  const dispatch = useAppDispatch();
  const formRef = useRef<HTMLDivElement | null>(null);
  const { employees } = useAppSelector((state: RootState) => state.employee);
  const user = useAppSelector((state: RootState) => state.user);
  const { data: claimList, loading } = useAppSelector((state: RootState) => state.claim);

  const [activeForm, setActiveForm] = useState<'new' | 'topup' | null>(null);
  const [selectedClaim, setSelectedClaim] = useState<any | null>(null);

  useEffect(() => {
    if (user?.EmpCode) {
      dispatch(getMyClaims(Number(user.EmpCode)));
    }
  }, [dispatch, user?.EmpCode]);

  const advanceClaims = useMemo(() => {
    return (claimList || []).filter((claim) => claim.claimTypeName === 'Advance');
  }, [claimList]);

  const handleScrollToForm = () => {
    setTimeout(() => {
      if (!formRef.current) return;
      let scrollParent: HTMLElement | null = formRef.current.parentElement;
      while (scrollParent && scrollParent !== document.body) {
        const style = getComputedStyle(scrollParent);
        const canScroll = style.overflowY === 'auto' || style.overflowY === 'scroll';
        if (canScroll && scrollParent.scrollHeight > scrollParent.clientHeight) {
          break;
        }
        scrollParent = scrollParent.parentElement;
      }

      if (scrollParent) {
        const formOffsetTop = formRef.current.offsetTop;
        scrollParent.scrollTo({ top: formOffsetTop - 130, behavior: 'smooth' });
      }
    }, 100);
  };

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
        accessorKey: 'claimTypeName',
        header: 'Relation',
        enableSorting: false,
        cell: ({ row }: any) => <div className="text-center">{row.original.claimTypeName}</div>,
        className: 'text-center',
      },
      {
        accessorKey: 'advanceAmount',
        header: 'Advance Amount',
        enableSorting: false,
        cell: ({ row }: any) => {
          const amount = row.original.advanceAmount;
          return <div className="text-center">{amount ? formatRupees(amount) : '-'}</div>;
        },
        className: 'text-center',
      },
      {
        accessorKey: 'requestDate',
        header: 'Request Date',
        cell: ({ row }: any) => <div className="text-center">{row.original.requestDate}</div>,
        className: 'text-center',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        enableSorting: true,
        cell: ({ row }: any) => <div className="text-center">{row.original.status}</div>,
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
        accessorKey: 'approvedDate',
        header: 'Approved Date',
        enableSorting: false,
        cell: ({ row }: any) => <div className="text-center">{row.original.approvedDate || '-'}</div>,
        className: 'text-center',
      },
      {
        accessorKey: 'action',
        header: 'Action',
        enableSorting: false,
        cell: ({ row }: any) => (
          <div className="flex justify-center gap-2">
            <Button
              size="sm"
              variant={row.original.statusId === 2 ? 'default' : 'ghost'}
              disabled={row.original.statusId !== 2}
              onClick={() => {
                setSelectedClaim(row.original);
                setActiveForm('topup');
                handleScrollToForm();
              }}
            >
              Top Up
            </Button>
          </div>
        ),
        className: 'text-center',
      },
    ],
    [employees]
  );

  return (
    <div className="p-6 space-y-6 font-sans">
      {loading && <Loader />}

      <Card className="p-4 border border-blue-200 shadow-sm rounded-xl bg-white">
        <h2 className="text-xl font-extrabold text-blue-800 mb-4 tracking-tight">Advance Claim List</h2>
        <RequestAdvanceTable
          columns={columns}
          data={advanceClaims}
          onAddClick={() => {
            setActiveForm('new');
            setSelectedClaim(null);
            handleScrollToForm();
          }}
        />
      </Card>

      {activeForm === 'new' && (
        <div ref={formRef}>
          <RequestAdvanceForm setShowForm={() => setActiveForm(null)} />
        </div>
      )}

      {activeForm === 'topup' && selectedClaim && (
        <div ref={formRef}>
          <RequestAdvanceTopUpForm
            claim={selectedClaim}
            onClose={() => {
              setActiveForm(null);
              setSelectedClaim(null);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AdvanceClaimPage;
