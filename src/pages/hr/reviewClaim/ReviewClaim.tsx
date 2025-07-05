import React, { useMemo, useState, useRef, useEffect } from 'react';
import ClaimSettlementList from '@/components/hr/reviewclaim/ClaimSettlementList';
import ViewClaimDetails from '@/components/hr/reviewclaim/ViewClaimDetails';
import { Button } from '@/components/ui/button';
import { EyeIcon, FileSearch, EyeOff } from 'lucide-react';
import HospitalizationBillView from '@/components/hr/reviewclaim/HospitalizationBillView';

const ReviewClaim = () => {
  const [selectedClaim, setSelectedClaim] = useState<any | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);

  // Scroll to details when shown
  useEffect(() => {
    if (showDetails && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showDetails]);

  const handleViewToggle = (rowData: any) => {
    const isSameRow = selectedClaim?.id === rowData.id;

    if (isSameRow) {
      // Toggle visibility
      const newVisibility = !showDetails;
      setShowDetails(newVisibility);

      // Scroll to top when hiding
      if (!newVisibility) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      // Select new claim and show details
      setSelectedClaim(rowData);
      setShowDetails(true);
    }
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
      },
      {
        accessorKey: 'action',
        header: 'Action',
        cell: ({ row }: any) => {
          const rowData = row.original;
          const isSelected = selectedClaim?.id === rowData.id;

          return (
            <Button size="sm" onClick={() => handleViewToggle(rowData)} className="flex items-center gap-1 bg-primary text-white hover:bg-primary/90">
              {isSelected && showDetails ? <EyeOff className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
              {isSelected && showDetails ? 'Hide' : 'View'}
            </Button>
          );
        },
      },
    ],
    [selectedClaim, showDetails]
  );

  const claimList = [
    {
      id: 'CLM002',
      employeeName: 'Alice Smith',
      patientName: 'Bob Smith',
      relation: 'Son',
      requestedDate: '2025-06-25',
      claimAmount: 1200,
    },
    {
      id: 'CLM003',
      employeeName: 'Raj Patel',
      patientName: 'Rina Patel',
      relation: 'Daughter',
      requestedDate: '2025-06-15',
      claimAmount: 800,
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FileSearch className="text-primary w-6 h-6" />
          <h1 className="text-2xl font-semibold text-primary">Review Claim Requests</h1>
        </div>
        <ClaimSettlementList columns={columns} claimList={claimList} />
      </div>

      {selectedClaim && showDetails && (
        <div ref={detailsRef} className="transition-all duration-300">
          <HospitalizationBillView />
          <ViewClaimDetails claim={selectedClaim} />
        </div>
      )}
    </div>
  );
};

export default ReviewClaim;
