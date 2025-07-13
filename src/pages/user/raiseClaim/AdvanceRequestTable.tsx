import { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import RaiseClaim from './RaiseClaim';
import ClaimSettlementList from '@/components/hr/reviewclaim/ClaimSettlementList';
import { Button } from '@/components/ui/button';
import { getMyClaims } from '@/features/user/claim/claimSlice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { format } from 'date-fns';
import { findEmployeeDetails } from '@/lib/helperFunction';

const DirectRequestTable = () => {
  const [selectedClaim, setSelectedClaim] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef<HTMLDivElement | null>(null);

  const user = useAppSelector((state) => state.user.EmpCode);
  const userdata = useAppSelector((state: RootState) => state.user);
  
  const claimdata = useAppSelector((state) => state.claim.data);
   const { employees } = useAppSelector((state: RootState) => state.employee);

  const dispatch = useAppDispatch();

  const employee = findEmployeeDetails(employees, user)
  console.log(employee, 'this is employee data')

  useEffect(() => {
    if (user) {
      dispatch(getMyClaims(user));
    }
  }, [dispatch, user]);

  const handleCheckboxChange = (checked: boolean) => {
    setShowForm(checked);
  };
  const handleButtonClick = () => {
    setShowForm(true);
  };
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
          <Button size="sm" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            Settle
          </Button>
        ),
      },
    ],
    []
  );
  const filterClaimdata = useMemo(() => {
    return claimdata?.filter((claim) => claim.claimTypeName === 'Direct Claim');
  }, [claimdata]);

  console.log(filterClaimdata, 'filter data');

  const claimList = Array.isArray(filterClaimdata)
    ? filterClaimdata
        .slice()
        .sort((a, b) => new Date(b.requestedDate).getTime() - new Date(a.requestedDate).getTime())
        .map((value: any) => ({
          id: value.claimId,
          employeeName: employee.employee.empName || '',
          patientName: employee.employee.empName|| '',
          relation: value.relation || 'Self',
          requestedDate: value.requestedDate ? new Date(value.requestedDate).toLocaleString() : new Date().toLocaleString(),
          claimAmount: value.claimAmount || value.cliamAmount || 0,
        }))
    : [];

  return (
    <div className="p-6 bg-gradient-to-br from-white via-blue-50 to-white min-h-screen font-sans">
      {/* Claim Table Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-6 mb-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold text-blue-800 mb-4">Direct Claim List</h1>
          <Button
            onClick={() => {
              setShowForm(true);
              handleScrollToForm();
            }}
          >
            + New Direct Claim Request
          </Button>
        </div>
        <ClaimSettlementList columns={columns} claimList={claimList} />
      </div>

      {showForm && (
        <div className="mt-6" ref={formRef}>
          <RaiseClaim onCloseForm={() => setShowForm(false)} />
        </div>
      )}
    </div>
  );
};

export default DirectRequestTable;
