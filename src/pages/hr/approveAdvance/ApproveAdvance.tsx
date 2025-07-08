'use client';

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { BeneficiaryDetailsCard } from '@/components/hr/approveadvance/BeneficiaryDetails';
import { HospitalizationDetailsCard } from '@/components/hr/approveadvance/HospitalizationDetailsCard';
import { PatientDetailsCard } from '@/components/hr/approveadvance/PatientDetailsTable';
import TableList from '@/components/ui/data-table';

const InputField = ({
  label,
  value,
  onChange,
  placeholder = '',
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  readOnly?: boolean;
}) => (
  <div className="flex flex-col gap-1">
    <Label className="text-blue-800 text-sm font-semibold">{label}</Label>
    <Input
      className={`border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 ${readOnly ? 'bg-gray-100' : ''}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
    />
  </div>
);

const ApproveAdvance = () => {
  const [selectedAdvance, setSelectedAdvance] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    estimatedAmount: '',
    approvedAmount: '',
    declarationChecked: false,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const advanceList = [
    {
      id: 1,
      employeeName: 'Anil Sharma',
      patientName: 'Anil Singh',
      relation: 'Self',
      requestedDate: '2025-06-20',
      requestedAmount: 20000,
      patientDetails: {
        name: 'Anil Singh',
        relation: 'Self',
        dob: 'Jan 01, 1980',
        gender: 'Male',
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
  ];

  const columns = [
    {
      accessorKey: 'id',
      header: 'Sr No',
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
      cell: ({ row }: any) => `₹ ${row.original.requestedAmount.toLocaleString()}`,
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
            const isSame = selectedAdvance?.id === item.id;
            if (isSame) {
              setSelectedAdvance(null);
              setFormData({ estimatedAmount: '', approvedAmount: '', declarationChecked: false });
            } else {
              setSelectedAdvance(item);
              setFormData({
                estimatedAmount: item.hospitalizationDetails.estimatedAmount.toString(),
                approvedAmount: '',
                declarationChecked: false,
              });
            }
          }}
        >
          <Eye className="w-4 h-4 mr-1" />
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="bg-white text-xs p-8 rounded-2xl  font-sans space-y-10">
      <Card className="p-4 border border-blue-200 shadow-sm rounded-xl bg-white">
        <h2 className="text-xl font-extrabold text-blue-800 mb-4 tracking-tight">Advance Request List</h2>
        <TableList
          data={advanceList}
          columns={columns}
          showSearchInput
          showFilter
          onRowClick={(row) => {
            const isSame = selectedAdvance?.id === row.id;
            if (isSame) {
              setSelectedAdvance(null);
            } else {
              setSelectedAdvance(row);
              setFormData({
                estimatedAmount: row.hospitalizationDetails.estimatedAmount.toString(),
                approvedAmount: '',
                declarationChecked: false,
              });
            }
          }}
        />
      </Card>

      {selectedAdvance && (
        <div className="space-y-6">
          <PatientDetailsCard {...selectedAdvance.patientDetails} />
          <HospitalizationDetailsCard {...selectedAdvance.hospitalizationDetails} />
          <BeneficiaryDetailsCard {...selectedAdvance.beneficiaryDetails} />

          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Approval Form</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Estimated Amount" value={formData.estimatedAmount} onChange={() => {}} readOnly />
                <InputField label="Approved Amount" value={formData.approvedAmount} onChange={(e) => handleInputChange('approvedAmount', e.target.value)} />

                <div className="md:col-span-2 mt-4 flex gap-2 items-start bg-blue-50 p-4 border border-blue-200 rounded-lg">
                  <Checkbox
                    id="declaration"
                    checked={formData.declarationChecked}
                    onCheckedChange={(checked) => handleInputChange('declarationChecked', checked)}
                  />
                  <Label htmlFor="declaration" className="text-sm text-gray-700 leading-relaxed">
                    I hereby declare that the information given in this form is correct and complete to the best of my knowledge.
                  </Label>
                </div>

                <div className="md:col-span-2 text-right">
                  <Button
                    className="bg-indigo-600 text-white"
                    disabled={!formData.declarationChecked || !formData.approvedAmount}
                    onClick={() => {
                      // Handle approval logic
                    }}
                  >
                    Approve Request
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ApproveAdvance;
