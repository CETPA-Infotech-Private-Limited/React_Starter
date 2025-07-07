import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Upload, Eye, Users, User, MessageSquare } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BeneficiaryDetailsCard } from '@/components/hr/approveadvance/BeneficiaryDetails';
import { HospitalizationDetailsCard } from '@/components/hr/approveadvance/HospitalizationDetailsCard';
import { PatientDetailsCard } from '@/components/hr/approveadvance/PatientDetailsTable';

const ApproveAdvance = () => {
  const [formData, setFormData] = useState({
    selectMember: 'e.g. Anil Sharma (Self)',
    doctorName: 'Dr. Mathur',
    isHospitalEmpanelled: 'yes',
    selectHospital: '',
    admissionDate: '',
    treatmentType: '',
    diagnosis: 'e.g., Appendicitis',
    estimateAmount: '00.00',
    advanceRequired: '00.00',
    estimatedAmountApproval: '10000',
    approvedAmount: '10000',
    declarationChecked: false
  });

  // State for Dialog open/close
  const [open, setOpen] = useState(false);
  // Example file links and count
  const fileLinks: string[] = []; // Replace with actual file URLs if available
  const hasFiles = fileLinks.length;

const beneficiaryDetailsData = {
  beneficiaryName: "Apollo Hospitals Enterprise Ltd.",
  bankName: "HDFC Bank",
  accountNo: "50200012345678",
  sapRefNo: "SAP-HOS-98765",
  transactionDate: "2025-06-25",
  gstNo: "29ABCDE1234F1Z5",
  ifscCode: "HDFC0001234",
  utrNo: "UTR9876543210",
};
const patientDetails = {
  name: "Anil Singh",
  relation: "Self",
  dob: "Jan 01, 1980",
  gender: "Male",
};

const hospitalizationDetailsData = {
  hospitalName: "Apollo Hospitals",
  admissionDate: "2025-07-05",
  treatmentType: "Allopathic",
  diagnosis: "Gallbladder Surgery",
  estimatedAmount: 25000,
  payTo: "Self",
  regdNo: "HOS123456",
  doctorName: "Dr. Anjali Mathur",
  advanceRequested: 20000,
  estimateFiles: [
    "https://example.com/files/estimate1.pdf",
    "https://example.com/files/estimate2.pdf",
  ],
  admissionAdviceFiles: [],
  incomeProofFiles: ["https://example.com/files/income-proof.pdf"],
};

// Dummy advance list data
const [selectedAdvance, setSelectedAdvance] = useState<any | null>(null);
const advanceList = [
  {
    id: 1,
    employeeName: "Anil Sharma",
    patientName: "Anil Singh",
    relation: "Self",
    requestedDate: "2025-06-20",
    requestedAmount: 20000,
    patientDetails: patientDetails,
    hospitalizationDetails: hospitalizationDetailsData,
    beneficiaryDetails: beneficiaryDetailsData,
  },
  // Add more objects as needed
];

const handleInputChange = (field, value) => {
  setFormData(prev => ({
    ...prev,
    [field]: value
  }));
};



  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">


       <Card className="border border-gray-300">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          {/* Total Notification */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex flex-col space-y-1">
              <div className="text-sm font-medium text-gray-600">Total Notification</div>
              <div className="text-lg font-bold text-gray-900">30</div>
            </div>
          </div>

          {/* Advance Pay */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white">
              <User className="w-5 h-5" />
            </div>
            <div className="flex flex-col space-y-1">
              <div className="text-sm font-medium text-gray-600">Advance Pay</div>
              <div className="text-lg font-bold text-gray-900">20</div>
            </div>
          </div>

          {/* Other */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="flex flex-col space-y-1">
              <div className="text-sm font-medium text-gray-600">Other</div>
              <div className="text-lg font-bold text-gray-900">10</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

       

        {/* Advance List */}
         
    <Card>
        <CardHeader>
          <CardTitle className="text-primary">Advance List</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-primary text-white">
              <TableRow>
                <TableHead className="text-white">Sr No</TableHead>
                <TableHead className="text-white">Employee Name</TableHead>
                <TableHead className="text-white">Patient Name</TableHead>
                <TableHead className="text-white">Relation</TableHead>
                <TableHead className="text-white">Requested Date</TableHead>
                <TableHead className="text-white">Advance Requested (₹)</TableHead>
                <TableHead className="text-white">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {advanceList.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.employeeName}</TableCell>
                  <TableCell>{item.patientName}</TableCell>
                  <TableCell>{item.relation}</TableCell>
                  <TableCell>{item.requestedDate}</TableCell>
                  <TableCell>₹ {item.requestedAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-blue-600"
onClick={() => {
  if (selectedAdvance?.id === item.id) {
    // If already selected, toggle it off
    setSelectedAdvance(null);
    setFormData(prev => ({
      ...prev,
      estimatedAmountApproval: "",
      approvedAmount: "",
      declarationChecked: false,
    }));
  } else {
    // Else, show new selection
    setSelectedAdvance(item);
    setFormData((prev) => ({
      ...prev,
      estimatedAmountApproval: item.hospitalizationDetails.estimatedAmount.toString(),
      approvedAmount: "",
      declarationChecked: false,
    }));
  }
}}

                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Conditional Details Section */}
      {selectedAdvance && (
        <div className="space-y-6">
          {/* Patient Details */}
          <PatientDetailsCard {...selectedAdvance.patientDetails} />

          {/* Hospitalization Info */}
          <HospitalizationDetailsCard {...selectedAdvance.hospitalizationDetails} />

          {/* Beneficiary Info */}
          <BeneficiaryDetailsCard {...selectedAdvance.beneficiaryDetails} />

          {/* Approval Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Approval Form</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="estimatedAmountApproval" className="text-sm font-medium">
                    Estimated Amount
                  </Label>
                  <Input
                    id="estimatedAmountApproval"
                    value={formData.estimatedAmountApproval}
                    onChange={(e) => handleInputChange("estimatedAmountApproval", e.target.value)}
                    className="w-1/2 bg-gray-100"
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="approvedAmount" className="text-sm font-medium">
                    Approved Amount
                  </Label>
                  <Input
                    id="approvedAmount"
                    value={formData.approvedAmount}
                    onChange={(e) => handleInputChange("approvedAmount", e.target.value)}
                    className="w-1/2"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="declaration"
                    checked={formData.declarationChecked}
                    onCheckedChange={(checked) => handleInputChange("declarationChecked", checked)}
                  />
                  <Label htmlFor="declaration" className="text-sm">
                    I the undersigned hereby declare that the information given in this form is correct and complete to the best of my knowledge and belief.
                  </Label>
                </div>

                <div className="flex justify-end">
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
                    disabled={!formData.declarationChecked}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      </div>
    </div>
  );
};

export default ApproveAdvance;