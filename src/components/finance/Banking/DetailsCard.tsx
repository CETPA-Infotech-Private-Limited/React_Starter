import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye } from 'lucide-react';

const DetailsCard = () => {
  const patientDetails = {
    patientName: 'Mayavati Devi',
    relation: 'Mother',
    dob: '09/11/1995',
    gender: 'Female',
  };

  const [formData, setFormData] = useState({
    advanceRequestDate: '09/12/2023',
    approvedRequestAmount: '80,000.00',
    status: 'Pending Approval',
    approvalDate: '15-10-23',
    hospitalName: 'Apollo',
    hospitalRegNo: '25375',
    doctorName: 'Dr. Mathur',
    likelyAdmissionDate: '30/12/2023',
    estimateAmount: '1,00,000.00',
    advancedRequested: '80,000.00',
    approvedAmount: '70,000.00',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const FileViewDialog = ({
    trigger,
    title,
    fileName,
  }: {
    trigger: React.ReactNode;
    title: string;
    fileName: string;
  }) => (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="p-6 bg-gray-50 rounded-lg text-center text-gray-500">
          <Eye className="mx-auto mb-2 h-12 w-12" />
          <p className="text-lg font-medium">File: {fileName}</p>
          <p className="text-sm mt-2">File preview would be displayed here</p>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <Card className="mt-6 p-4 border border-blue-200 shadow-sm rounded-xl bg-white w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-extrabold text-blue-800">Patient Information</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Patient Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm text-blue-600">Patient Name</Label>
            <p className="text-sm font-medium">{patientDetails.patientName}</p>
          </div>
          <div>
            <Label className="text-sm text-blue-600">Relation</Label>
            <p className="text-sm font-medium">{patientDetails.relation}</p>
          </div>
          <div>
            <Label className="text-sm text-blue-600">D.O.B</Label>
            <p className="text-sm font-medium">{patientDetails.dob}</p>
          </div>
          <div>
            <Label className="text-sm text-blue-600">Gender</Label>
            <p className="text-sm font-medium">{patientDetails.gender}</p>
          </div>
        </div>

        {/* Medical Advance Request Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="advanceRequestDate" className="text-sm text-blue-600">
              Advance Request Date
            </Label>
            <Input
              id="advanceRequestDate"
              value={formData.advanceRequestDate}
              onChange={(e) => handleInputChange('advanceRequestDate', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="approvedRequestAmount" className="text-sm text-blue-600">
              Approved Requested Amount (INR)
            </Label>
            <Input
              id="approvedRequestAmount"
              value={formData.approvedRequestAmount}
              onChange={(e) => handleInputChange('approvedRequestAmount', e.target.value)}
            />
          </div>
          <div>
            <Label className="text-sm text-blue-600">Status</Label>
            <Badge className="bg-orange-100 text-orange-800 mt-1">{formData.status}</Badge>
          </div>
          <div>
            <Label htmlFor="approvalDate" className="text-sm text-blue-600">
              Approval Date
            </Label>
            <Input
              id="approvalDate"
              value={formData.approvalDate}
              onChange={(e) => handleInputChange('approvalDate', e.target.value)}
            />
          </div>
        </div>

        {/* Hospital Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="hospitalName" className="text-sm text-blue-600">
              Hospital Name
            </Label>
            <Input
              id="hospitalName"
              value={formData.hospitalName}
              onChange={(e) => handleInputChange('hospitalName', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="hospitalRegNo" className="text-sm text-blue-600">
              Hospital Reg. No.
            </Label>
            <Input
              id="hospitalRegNo"
              value={formData.hospitalRegNo}
              onChange={(e) => handleInputChange('hospitalRegNo', e.target.value)}
            />
          </div>
        </div>

        {/* Doctor and Diagnosis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="doctorName" className="text-sm text-blue-600">
              Doctor Name
            </Label>
            <Input
              id="doctorName"
              value={formData.doctorName}
              onChange={(e) => handleInputChange('doctorName', e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <Label className="text-sm text-blue-600 mb-1">Diagnosis</Label>
            <FileViewDialog
              trigger={
                <Button variant="outline" size="sm" className="h-8 w-fit">
                  <Eye className="h-4 w-4 mr-2" />
                  View file
                </Button>
              }
              title="Diagnosis Document"
              fileName="diagnosis_report.pdf"
            />
          </div>
        </div>

        {/* Admission Advice */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="likelyAdmissionDate" className="text-sm text-blue-600">
              Likely Date of Admission
            </Label>
            <Input
              id="likelyAdmissionDate"
              value={formData.likelyAdmissionDate}
              onChange={(e) => handleInputChange('likelyAdmissionDate', e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <Label className="text-sm text-blue-600 mb-1">Admission Advice</Label>
            <FileViewDialog
              trigger={
                <Button variant="outline" size="sm" className="h-8 w-fit">
                  <Eye className="h-4 w-4 mr-2" />
                  View file
                </Button>
              }
              title="Admission Advice Document"
              fileName="admission_advice.pdf"
            />
          </div>
        </div>

        {/* Other Files */}
        <div>
          <Label className="text-sm text-blue-600 mb-1">Other</Label>
          <FileViewDialog
            trigger={
              <Button variant="outline" size="sm" className="h-8 w-fit">
                <Eye className="h-4 w-4 mr-2" />
                View File
              </Button>
            }
            title="Other Documents"
            fileName="other_documents.pdf"
          />
        </div>

        {/* Estimate and Amounts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="estimateAmount" className="text-sm text-blue-600">
              Estimate Amount
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="estimateAmount"
                value={formData.estimateAmount}
                onChange={(e) => handleInputChange('estimateAmount', e.target.value)}
              />
              <FileViewDialog
                trigger={
                  <Button variant="outline" size="sm" className="h-8">
                    <Eye className="h-4 w-4 mr-2" />
                    View File
                  </Button>
                }
                title="Estimate Document"
                fileName="treatment_estimate.pdf"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="advancedRequested" className="text-sm text-blue-600">
              Advanced Requested
            </Label>
            <Input
              id="advancedRequested"
              value={formData.advancedRequested}
              onChange={(e) => handleInputChange('advancedRequested', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="approvedAmount" className="text-sm text-blue-600">
              Approved Amount
            </Label>
            <Input
              id="approvedAmount"
              value={formData.approvedAmount}
              onChange={(e) => handleInputChange('approvedAmount', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailsCard;
