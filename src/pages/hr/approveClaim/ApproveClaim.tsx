import React from 'react';
import ClaimSettlementList from '@/components/hr/reviewClaim/ClaimSettlementList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMemo, useState, useRef, useEffect } from 'react';
import { EyeIcon, EyeOff } from 'lucide-react';
import {
  BillItemDisplayRow,
  DisplayField,
  DisplayTable,
  InfoCard,
  PreHospDisplayRow,
  SectionHeader,
  StatusBadge,
} from '@/components/hr/reviewClaim/ReviewComponents';
import { fromTheme } from 'tailwind-merge';

const ApproveClaim = () => {
  const [selectedClaim, setSelectedClaim] = useState<any | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);

  const [postHospitalizationApplicable, setPostHospitalizationApplicable] = useState<string>('');
  const [totalClaimRequested, setTotalClaimRequested] = useState<string>('10000');
  const [approvedAmount, setApprovedAmount] = useState<string>('10000');
  const [sendTo, setSendTo] = useState<string>('');

  // Auto scroll to details when toggled on
  useEffect(() => {
    if (showDetails && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showDetails]);

  const handleViewToggle = (rowData: any) => {
    const isSame = selectedClaim?.id === rowData.id;
    if (isSame) {
      const shouldShow = !showDetails;
      setShowDetails(shouldShow);
      if (!shouldShow) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
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
        cell: ({ getValue }: any) => `₹ ${getValue().toLocaleString()}`,
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
  const billItems = [
    {
      id: 1,
      billType: 'Medicine',
      billedAmount: 15750.0,
      claimedAmount: 15750.0,
      included: true,
      clarification: 'Prescription medicines as per doctor advice',
    },
    { id: 2, billType: 'Consultation', billedAmount: 3500.0, claimedAmount: 3500.0, included: true, clarification: '' },
    { id: 3, billType: 'Investigation', billedAmount: 8900.0, claimedAmount: 8900.0, included: true, clarification: 'Lab tests and imaging' },
    { id: 4, billType: 'Room Rent', billedAmount: 25200.0, claimedAmount: 22000.0, included: true, clarification: 'Room limit exceeded by ₹3,200' },
    { id: 5, billType: 'Procedure', billedAmount: 45600.0, claimedAmount: 45600.0, included: true, clarification: '' },
    { id: 6, billType: 'Other', billedAmount: 2850.0, claimedAmount: 2850.0, included: false, clarification: 'Non-medical expenses' },
  ];

  const preHospItems = [
    { id: 1, billType: 'Medicine', billedDate: '2024-12-15', billedAmount: 1250.0, claimedAmount: 1250.0, hasFiles: 2 },
    { id: 2, billType: 'Consultation', billedDate: '2024-12-16', billedAmount: 800.0, claimedAmount: 800.0, hasFiles: 1 },
    { id: 3, billType: 'Investigation', billedDate: '2024-12-18', billedAmount: 3200.0, claimedAmount: 3200.0, hasFiles: 3 },
    { id: 4, billType: 'Procedure', billedDate: '', billedAmount: 0, claimedAmount: 0, hasFiles: 0 },
    { id: 5, billType: 'Other', billedDate: '', billedAmount: 0, claimedAmount: 0, hasFiles: 0 },
  ];

  const formData = {
    claimNumber: 'CLM-2024-000156',
    patientName: 'John Doe',
    employeeId: 'EMP001234',
    hospitalName: 'City General Hospital',
    dateOfAdmission: '2024-12-20',
    dateOfDischarge: '2024-12-25',
    specialDisease: 'No',
    specialDiseaseName: '',
    taxable: 'No',
    taxableByHR: 'Yes',
    postHospitalization: 'Yes',
    totalClaimRequested: 98600.0,
    approvedAmount: 95400.0,
    status: 'Approved',
    clarificationNote: 'All documents verified and claim processed as per company policy.',
  };

  const totalBilled = billItems.reduce((sum, item) => sum + item.billedAmount, 0);
  const totalClaimed = billItems.reduce((sum, item) => sum + (item.included ? item.claimedAmount : 0), 0);
  const preHospTotal = preHospItems.reduce((sum, item) => sum + item.claimedAmount, 0);

  const billHeaders = ['S.No.', 'Bill Type', 'Billed Amount', 'Claimed Amount', 'Status', 'Clarification'];
  const preHospHeaders = ['S.No.', 'Bill Type', 'Billed Date', 'Billed Amount', 'Claimed Amount', 'Documents'];

  const handleConfirm = () => {
    // Handle confirmation logic here
    console.log('Confirming with:', {
      postHospitalizationApplicable,
      totalClaimRequested,
      approvedAmount,
    });
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <ClaimSettlementList columns={columns} claimList={claimList} />
      {selectedClaim && showDetails && (
        <div ref={detailsRef} className="space-y-6 transition-all duration-300 bg-white border border-blue-200 rounded-2xl shadow-lg p-6">
          <div className=" p-6 bg-white">
            <div className="mb-8 border-b border-gray-200 pb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Hospitalization Claim Details</h1>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      Claim #: <span className="font-medium text-gray-900">{formData.claimNumber}</span>
                    </span>
                    <StatusBadge status={formData.status} type="success" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <InfoCard title="Patient Information">
                <div className="grid grid-cols-2 gap-3">
                  <DisplayField label="Patient Name" value={formData.patientName} />
                  <DisplayField label="Employee ID" value={formData.employeeId} />
                  <DisplayField label="Date of Admission" value={formData.dateOfAdmission} />
                  <DisplayField label="Date of Discharge" value={formData.dateOfDischarge} />
                </div>
              </InfoCard>

              <InfoCard title="Hospital Information">
                <div className="grid grid-cols-2 gap-3">
                  <DisplayField label="Hospital Name" value={formData.hospitalName} />
                  <DisplayField label="Total Days" value="5 days" />
                  <DisplayField label="Treatment Type" value="In-Patient" />
                  <DisplayField label="Room Type" value="Private AC" />
                </div>
              </InfoCard>
            </div>

            <div className="mb-8">
              <SectionHeader title="Hospitalization Bill Details (Advance Payment)" subtitle={''} />

              <DisplayTable headers={billHeaders} className="mb-4">
                {billItems.map((item, index) => (
                  <BillItemDisplayRow
                    key={item.id}
                    serialNo={index + 1}
                    billType={item.billType}
                    billedAmount={item.billedAmount}
                    claimedAmount={item.claimedAmount}
                    included={item.included}
                    clarification={item.clarification}
                  />
                ))}
              </DisplayTable>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-gray-600">Sub Total:</div>
                    <div className="text-lg font-semibold text-gray-900">₹{totalBilled.toFixed(2)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600">Amount Included in Main Bill:</div>
                    <div className="text-lg font-semibold text-blue-600">₹{totalClaimed.toFixed(2)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600">Amount not Included in Main Bill:</div>
                    <div className="text-lg font-semibold text-orange-600">₹{formData.approvedAmount.toFixed(2)}</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap  items-center w-full mt-4 gap-4">
                <div className="flex-1 max-w-[600px]"></div>
              </div>
            </div>

            {/* Pre Hospitalization Expenses Section */}
            <div className="mb-8">
              <SectionHeader title="Pre Hospitalization Expenses" subtitle="Expenses incurred 30 days before hospitalization" />

              <DisplayTable headers={preHospHeaders} className="mb-4">
                {preHospItems.map((item, index) => (
                  <PreHospDisplayRow
                    key={item.id}
                    serialNo={index + 1}
                    billType={item.billType}
                    billedDate={item.billedDate}
                    billedAmount={item.billedAmount}
                    claimedAmount={item.claimedAmount}
                    hasFiles={item.hasFiles}
                  />
                ))}
              </DisplayTable>

              <div className="text-right bg-gray-50 p-3 rounded">
                <span className="text-sm font-medium text-gray-700">Pre-Hospitalization Total: </span>
                <span className="text-lg font-semibold text-gray-900">₹{preHospTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <InfoCard title="Declaration By Employee">
                <div className="grid grid-cols-2 gap-3">
                  <DisplayField
                    label="Special Disease"
                    value={formData.specialDisease}
                    valueClassName={formData.specialDisease === 'Yes' ? 'text-orange-600 font-medium' : ''}
                  />
                  {formData.specialDisease === 'Yes' && <DisplayField label="Disease Name" value={formData.specialDiseaseName} />}
                  <DisplayField
                    label="Post Hospitalization Applicable"
                    value={formData.postHospitalization}
                    valueClassName={formData.postHospitalization === 'Yes' ? 'text-blue-600 font-medium' : ''}
                  />
                  <DisplayField
                    label="Taxable"
                    value={formData.taxable}
                    valueClassName={formData.taxable === 'Yes' ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}
                  />
                  <DisplayField
                    label="Taxable By HR"
                    value={formData.taxableByHR}
                    valueClassName={formData.taxableByHR === 'Yes' ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}
                  />
                </div>
              </InfoCard>
              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Claim Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Total Requested</div>
                    <div className="text-xl font-bold text-gray-900">₹{formData.totalClaimRequested.toFixed(2)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Pre-Hospital</div>
                    <div className="text-xl font-bold text-blue-600">₹{preHospTotal.toFixed(2)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Main Hospital</div>
                    <div className="text-xl font-bold text-blue-600">₹{totalClaimed.toFixed(2)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Final Approved</div>
                    <div className="text-xl font-bold text-green-600">₹{formData.approvedAmount.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Post Hospitalization Applicable Section */}
            <div className="mb-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-4">
                  <Label htmlFor="post-hospitalization" className="text-sm font-medium text-gray-700">
                    Post Hospitalization Applicable
                  </Label>
                  <RadioGroup value={postHospitalizationApplicable} onValueChange={setPostHospitalizationApplicable} className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes" />
                      <Label htmlFor="yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no" />
                      <Label htmlFor="no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            {/* Approval Form Section */}
            <div className="mb-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Approval Form</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="total-claim-requested" className="text-sm font-medium text-gray-700 mb-1 block">
                      Total Claim Requested
                    </Label>
                    <Input
                      id="total-claim-requested"
                      type="number"
                      value={totalClaimRequested}
                      onChange={(e) => setTotalClaimRequested(e.target.value)}
                      className="w-full max-w-[280px] min-w-[160px] h-9"
                      placeholder="Enter total claim requested"
                    />
                  </div>
                  <div>
                    <Label htmlFor="approved-amount" className="text-sm font-medium text-gray-700 mb-1 block">
                      Approved Amount
                    </Label>
                    <Input
                      id="approved-amount"
                      type="number"
                      value={approvedAmount}
                      onChange={(e) => setApprovedAmount(e.target.value)}
                      className="w-full max-w-sm min-w-[160px] h-9"
                      placeholder="Enter approved amount"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Section */}
            <div className="mb-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Action</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="send-to" className="text-sm font-medium text-gray-700 mb-1 block">
                      Send To
                    </Label>
                    <Select value={sendTo} onValueChange={setSendTo}>
                      <SelectTrigger className="w-full max-w-sm min-w-[160px] h-9">
                        <SelectValue placeholder="Bill Passing" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="bill-passing">Bill Passing</SelectItem>
                        <SelectItem value="accounts">Accounts</SelectItem>
                        <SelectItem value="hr">HR Department</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleConfirm} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium h-9">
                      Confirm
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApproveClaim;
