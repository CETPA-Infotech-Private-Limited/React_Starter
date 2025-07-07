    import { useEffect, useMemo, useRef, useState } from 'react';
    import { Checkbox } from '@/components/ui/checkbox';
    import { Card } from '@/components/ui/card';
    import RaiseClaim from './RaiseClaim';
    import HospitalizationBillView from '@/components/hr/reviewclaim/HospitalizationBillView';
    import ViewClaimDetails from '@/components/hr/reviewclaim/ViewClaimDetails';
    import ClaimSettlementList from '@/components/hr/reviewclaim/ClaimSettlementList';
    import { FileSearch } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import axiosInstance from '@/services/axiosInstance';
    import { getMyClaims } from '@/features/user/claim/claimSlice';
    import { useAppDispatch, useAppSelector } from '@/app/hooks';

    import { request } from 'http';
import { RootState } from '@/app/store';

    const AdvanceRequestTable = () => {
    const [selectedClaim, setSelectedClaim] = useState<any | null>(null);
    const [showDetails, setShowDetails] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const user = useAppSelector((state) => state.user.EmpCode);
    const userdata = useAppSelector((state:RootState) => state.user);
    console.log(userdata,'user data')
    
    const formRef = useRef<HTMLDivElement>(null);
    const handleCheckboxChange = (checked: boolean) => {
        setShowForm(checked);
    };

    const dispatch = useAppDispatch();
    
    const claimdata = useAppSelector((state) => state.claim.data);
    useEffect(() => {
        if (user) {
            dispatch(getMyClaims(user));
        }
    }, [dispatch, user]);
    
    console.log(claimdata, 'claim data in AdvanceRequestTable');
    // Auto scroll to form when it opens
    useEffect(() => {
        if (showForm && formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [showForm]);
    const detailsRef = useRef<HTMLDivElement>(null);

    // Auto scroll to details when toggled on
    useEffect(() => {
        if (showDetails && detailsRef.current) {
        detailsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [showDetails]);

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
            cell: ({ row }: any) => {
            const rowData = row.original;
            const isSelected = selectedClaim?.id === rowData.id;

            return (
                <Button
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 flex items-center gap-1 rounded-full px-3 py-1.5 text-xs"
                >
                Settle
                </Button>
            );
            },
        },
        ],
        [selectedClaim, showDetails]
    );

  const claimList = Array.isArray(claimdata)
  ? claimdata.map((value: any) => ({
      id: value.claimId,
      employeeName: userdata.name || '',   // ✅ Use actual data, not hardcoded
      patientName: userdata.name || '',
      relation: value.relation || 'Self',
    requestedDate: value.requestedDate
  ? new Date(value.requestedDate).toLocaleDateString()
  : new Date().toLocaleDateString(),
      claimAmount: value.claimAmount || value.cliamAmount || 0, // ✅ handle typo
    }))
  : [];

        console.log(claimList, 'claimList in AdvanceRequestTable');

    return (
        <div className="p-6 bg-gradient-to-br from-white via-blue-50 to-white min-h-screen font-sans">
        {/* Header & Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-6 mb-6">
            <div className="flex items-center gap-2 mb-5">
            <h1 className="text-2xl font-bold text-blue-800 tracking-tight">Approved Advance List</h1>
            </div>

            <ClaimSettlementList columns={columns} claimList={claimList} />
        </div>

        {/* Conditional Claim Detail Section */}
        {/* {selectedClaim && showDetails && (
            <div ref={detailsRef} className="space-y-6 transition-all duration-300 bg-white border border-blue-200 rounded-2xl shadow-lg p-6">
            <HospitalizationBillView />
            <ViewClaimDetails claim={selectedClaim} />
            </div>
        )} */}

        {/* Checkbox Section */}
        <Card className="p-4 flex items-center gap-3 border border-blue-200 shadow-sm bg-white rounded-xl">
            <Checkbox id="new-request" onCheckedChange={handleCheckboxChange} />
            <label htmlFor="new-request" className="text-lg font-medium text-blue-800 drop-shadow">
            Direct Claim Request
            </label>
        </Card>

        {/* Conditional Form */}
        {showForm && <RaiseClaim />}
        </div>
    );  
    };

    export default AdvanceRequestTable;
