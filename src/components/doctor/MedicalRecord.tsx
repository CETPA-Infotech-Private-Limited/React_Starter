import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MedicalRecordProps {
  totalLimit: number;
  usedLimit: number;
  balanceLimit: number;
  hospitalName: string;
  hospitalRegNo: string;
  dateOfAdmission: string;
  doctorName: string;
  admissionAdvice: string;
  admissionAdviceComment: string;
  dischargeDate?: string;
  typeOfTreatment: string;
  dischargeSummary: string;
  dischargeSummaryComment: string;
  investigationReports: string;
  investigationReportsComment: string;
  diagnosis: string;
  diagnosisComment: string;
  estimatedAmount: number;
  finalHospitalBill: number;
  itrIncomeProof: string;
}

const MedicalRecord: React.FC<MedicalRecordProps> = ({
  totalLimit,
  usedLimit,
  balanceLimit,
  hospitalName,
  hospitalRegNo,
  dateOfAdmission,
  doctorName,
  admissionAdvice,
  admissionAdviceComment,
  dischargeDate,
  typeOfTreatment,
  dischargeSummary,
  dischargeSummaryComment,
  investigationReports,
  investigationReportsComment,
  diagnosis,
  diagnosisComment,
  estimatedAmount,
  finalHospitalBill,
  itrIncomeProof,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Card className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header Section with Limits */}
      <div className="flex flex-wrap justify-between text-sm gap-4">
        <div>
          <span className="font-medium text-muted-foreground">Total Limit:</span>
          <span className="ml-2 text-blue-600 font-semibold">{formatCurrency(totalLimit)}</span>
        </div>
        <div>
          <span className="font-medium text-muted-foreground">Used Limit:</span>
          <span className="ml-2 text-red-600 font-semibold">{formatCurrency(usedLimit)}</span>
        </div>
        <div>
          <span className="font-medium text-muted-foreground">Balance Limit:</span>
          <span className="ml-2 text-green-600 font-semibold">{formatCurrency(balanceLimit)}</span>
        </div>
      </div>

      {/* Form Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <Label>Hospital Name</Label>
            <Input value={hospitalName} readOnly />
          </div>

          <div>
            <Label>Date of Admission</Label>
            <Input value={dateOfAdmission} readOnly />
          </div>

          <div>
            <Label>Admission Advice</Label>
            <div className="flex items-center space-x-2">
              <Input value={admissionAdvice} readOnly className="text-blue-600" />
              <Button variant="link" size="sm">View File</Button>
            </div>
          </div>

          <div>
            <Label>Date of Discharge</Label>
            <Input value={dischargeDate || ''} readOnly />
          </div>

          <div>
            <Label>Discharge Summary</Label>
            <div className="flex items-center space-x-2">
              <Input value={dischargeSummary} readOnly className="text-blue-600" />
              <Button variant="link" size="sm">View File</Button>
            </div>
          </div>

          <div>
            <Label>Investigation Reports</Label>
            <div className="flex items-center space-x-2">
              <Input value={investigationReports} readOnly className="text-blue-600" />
              <Button variant="link" size="sm">View File</Button>
            </div>
          </div>

          <div>
            <Label>Diagnosis</Label>
            <Input value={diagnosis} readOnly className="text-blue-600" />
          </div>

          <div>
            <Label>Estimated Amount</Label>
            <div className="flex items-center space-x-2">
              <Input value={estimatedAmount.toString()} readOnly />
              <Button variant="link" size="sm">Estimate File</Button>
            </div>
          </div>

          <div>
            <Label>ITR / Income Proof</Label>
            <div className="flex items-center space-x-2">
              <Input value={itrIncomeProof} readOnly className="text-blue-600" />
              <Button variant="link" size="sm">View File</Button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <Label>Hospital Regd. No.</Label>
            <Input value={hospitalRegNo} readOnly />
          </div>

          <div>
            <Label>Doctor's Name</Label>
            <Input value={doctorName} readOnly />
          </div>

          <div>
            <Label>Admission Advice Comment</Label>
            <Textarea value={admissionAdviceComment} readOnly />
          </div>

          <div>
            <Label>Type of Treatment</Label>
            <Input value={typeOfTreatment} readOnly />
          </div>

          <div>
            <Label>Discharge Summary Comment</Label>
            <Textarea value={dischargeSummaryComment} readOnly />
          </div>

          <div>
            <Label>Investigation Reports Comment</Label>
            <Textarea value={investigationReportsComment} readOnly />
          </div>

          <div>
            <Label>Diagnosis Comment</Label>
            <Textarea value={diagnosisComment} readOnly />
          </div>

          <div>
            <Label>Final Hospital Bill</Label>
            <div className="flex items-center space-x-2">
              <Input value={finalHospitalBill.toString()} readOnly />
              <Button variant="link" size="sm">Final File</Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MedicalRecord;
