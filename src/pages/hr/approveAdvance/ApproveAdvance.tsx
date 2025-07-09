import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EyeIcon, EyeOff } from 'lucide-react';
import { BeneficiaryDetailsCard } from '@/components/hr/approveadvance/BeneficiaryDetails';
import { HospitalizationDetailsCard } from '@/components/hr/approveadvance/HospitalizationDetailsCard';
import { PatientDetailsCard } from '@/components/hr/approveadvance/PatientDetailsTable';
import ClaimSettlementList from '@/components/hr/reviewClaim/ClaimSettlementList';
import { DisplayField, InfoCard, StatusBadge } from '@/components/hr/reviewClaim/ReviewComponents';

const ApproveAdvance = () => {
  const [selectedAdvance, setSelectedAdvance] = useState<any | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    estimatedAmount: '',
    approvedAmount: '',
    declarationChecked: false,
  });

  // Auto scroll to details when toggled on
  useEffect(() => {
    if (showDetails && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showDetails]);

  const handleViewToggle = (rowData: any) => {
    const isSame = selectedAdvance?.id === rowData.id;
    if (isSame) {
      const shouldShow = !showDetails;
      setShowDetails(shouldShow);
      if (!shouldShow) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      setSelectedAdvance(rowData);
      setShowDetails(true);
      setFormData({
        estimatedAmount: rowData.hospitalizationDetails.estimatedAmount.toString(),
        approvedAmount: '',
        declarationChecked: false,
      });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
        accessorKey: 'requestedAmount',
        header: 'Advance Requested (₹)',
        cell: ({ getValue }: any) => `₹ ${getValue().toLocaleString()}`,
      },
      {
        accessorKey: 'action',
        header: 'Action',
        cell: ({ row }: any) => {
          const rowData = row.original;
          const isSelected = selectedAdvance?.id === rowData.id;

          return (
            <Button
              size="sm"
              onClick={() => handleViewToggle(rowData)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 flex items-center gap-1 rounded-full px-3 py-1.5 text-xs"
            >
              {isSelected && showDetails ? <EyeOff className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
              {isSelected && showDetails ? 'Hide' : 'View'}
            </Button>
          );
        },
      },
    ],
    [selectedAdvance, showDetails]
  );

  const advanceList = [
    {
      id: 1,
      employeeName: 'Anil Sharma',
      patientName: 'Anil Singh',
      relation: 'Self',
      requestedDate: '2025-06-20',
      requestedAmount: 20000,
      status: 'Pending',
      advanceNumber: 'ADV-2025-001',
      patientDetails: {
        name: 'Anil Singh',
        relation: 'Self',
        dob: 'Jan 01, 1980',
        gender: 'Male',
        employeeId: 'EMP001234',
      },
      hospitalizationDetails: {
        hospitalName: 'Apollo Hospitals',
        admissionDate: '2025-07-05',
        treatmentType: 'Allopathic',
        diagnosis: 'Gallbladder Surgery',
        estimatedAmount: 25000,
        payTo: 'Self',
        regdNo: 'HOS123456',
        doctorName: 'Dr. Anjali Mathur',
        advanceRequested: 20000,
        estimateFiles: [],
        admissionAdviceFiles: [],
        incomeProofFiles: [],
      },
      beneficiaryDetails: {
        beneficiaryName: 'Apollo Hospitals Enterprise Ltd.',
        bankName: 'HDFC Bank',
        accountNo: '50200012345678',
        sapRefNo: 'SAP-HOS-98765',
        transactionDate: '2025-06-25',
        gstNo: '29ABCDE1234F1Z5',
        ifscCode: 'HDFC0001234',
        utrNo: 'UTR9876543210',
      },
    },
    {
      id: 2,
      employeeName: 'Priya Patel',
      patientName: 'Rohit Patel',
      relation: 'Son',
      requestedDate: '2025-06-15',
      requestedAmount: 15000,
      status: 'Pending',
      advanceNumber: 'ADV-2025-002',
      patientDetails: {
        name: 'Rohit Patel',
        relation: 'Son',
        dob: 'Mar 15, 2010',
        gender: 'Male',
        employeeId: 'EMP001235',
      },
      hospitalizationDetails: {
        hospitalName: 'Fortis Hospital',
        admissionDate: '2025-07-10',
        treatmentType: 'Allopathic',
        diagnosis: 'Appendix Surgery',
        estimatedAmount: 18000,
        payTo: 'Hospital',
        regdNo: 'HOS789012',
        doctorName: 'Dr. Rajesh Kumar',
        advanceRequested: 15000,
        estimateFiles: [],
        admissionAdviceFiles: [],
        incomeProofFiles: [],
      },
      beneficiaryDetails: {
        beneficiaryName: 'Fortis Healthcare Limited',
        bankName: 'ICICI Bank',
        accountNo: '12345678901234',
        sapRefNo: 'SAP-FOR-54321',
        transactionDate: '2025-06-20',
        gstNo: '29ABCDE5678F1Z5',
        ifscCode: 'ICIC0001234',
        utrNo: 'UTR5432109876',
      },
    },
  ];

  const handleApprove = () => {
    if (selectedAdvance && formData.approvedAmount && formData.declarationChecked) {
      console.log('Approving advance:', {
        advanceId: selectedAdvance.id,
        approvedAmount: formData.approvedAmount,
        declaredBy: 'Current User',
      });
      // Add your approval logic here
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <ClaimSettlementList columns={columns} claimList={advanceList} />

      {selectedAdvance && showDetails && (
        <div ref={detailsRef} className="space-y-6 transition-all duration-300 bg-white border border-blue-200 rounded-2xl shadow-lg p-6">
          <div className="p-6 bg-white">
            {/* Header Section */}
            <div className="mb-8 border-b border-gray-200 pb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Advance Request Details</h1>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      Advance #: <span className="font-medium text-gray-900">{selectedAdvance.advanceNumber}</span>
                    </span>
                    <StatusBadge status={selectedAdvance.status} type="pending" />
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Information */}
            <div className="mb-8">
              <PatientDetailsCard {...selectedAdvance.patientDetails} />
            </div>

            {/* Hospitalization Details */}
            <div className="mb-8">
              <HospitalizationDetailsCard {...selectedAdvance.hospitalizationDetails} />
            </div>

            {/* Beneficiary Details */}
            <div className="mb-8">
              <BeneficiaryDetailsCard {...selectedAdvance.beneficiaryDetails} />
            </div>

            {/* Approval Form */}
            <div className="mb-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Approval Form</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="estimated-amount" className="text-sm font-medium text-gray-700 mb-1 block">
                      Estimated Amount
                    </Label>
                    <Input
                      id="estimated-amount"
                      type="number"
                      value={formData.estimatedAmount}
                      className="w-full max-w-[280px] min-w-[160px] h-9 bg-gray-100"
                      readOnly
                    />
                  </div>
                  <div>
                    <Label htmlFor="approved-amount" className="text-sm font-medium text-gray-700 mb-1 block">
                      Approved Amount
                    </Label>
                    <Input
                      id="approved-amount"
                      type="number"
                      value={formData.approvedAmount}
                      onChange={(e) => handleInputChange('approvedAmount', e.target.value)}
                      className="w-full max-w-sm min-w-[160px] h-9"
                      placeholder="Enter approved amount"
                    />
                  </div>
                </div>

                <div className="mt-4 flex gap-2 items-start bg-blue-50 p-4 border border-blue-200 rounded-lg">
                  <Checkbox
                    id="declaration"
                    checked={formData.declarationChecked}
                    onCheckedChange={(checked) => handleInputChange('declarationChecked', checked)}
                  />
                  <Label htmlFor="declaration" className="text-sm text-gray-700 leading-relaxed">
                    I hereby declare that the information given in this form is correct and complete to the best of my knowledge.
                  </Label>
                </div>
              </div>
            </div>

            {/* Action Section */}
            <div className="mb-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex justify-end">
                  <Button
                    onClick={handleApprove}
                    disabled={!formData.declarationChecked || !formData.approvedAmount}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium h-9 disabled:bg-gray-400"
                  >
                    Approve Request
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApproveAdvance;
