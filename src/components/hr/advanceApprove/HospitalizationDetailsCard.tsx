import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Label } from '@/components/ui/label';

type FileDialogProps = {
  label: string;
  files: string[];
};

const FileDialog = ({ label, files }: FileDialogProps) => {
  const fileCount = files?.length || 0;

  if (fileCount === 0) return <span className="text-gray-400 text-sm">No file</span>;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className=" h-4">
          <Eye className="w-4 h-4" />
          <span>View ({fileCount})</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 mt-4 text-sm">
          {files.map((url, index) => (
            <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline">
              File {index + 1}
            </a>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

type HospitalizationDetailsProps = {
  hospitalName: string;
  admissionDate: string;
  treatmentType: string;
  diagnosis: string;
  estimatedAmount: number;
  payTo: string;
  regdNo: string;
  doctorName: string;
  advanceRequested: number;
  estimateFiles: string[];
  admissionAdviceFiles: string[];
  incomeProofFiles: string[];
};

export function HospitalizationDetailsCard({
  hospitalName,
  admissionDate,
  treatmentType,
  diagnosis,
  estimatedAmount,
  payTo,
  regdNo,
  doctorName,
  advanceRequested,
  estimateFiles,
  admissionAdviceFiles,
  incomeProofFiles,
}: HospitalizationDetailsProps) {
  return (
    <Card className="border border-blue-200 shadow-xl rounded-2xl font-sans text-sm px-4 py-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-blue-800 tracking-tight">Hospitalization Details</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        <ReadOnlyField label="Hospital Name" value={hospitalName} />
        <ReadOnlyField label="Hospital Regd. No." value={regdNo} />
        <ReadOnlyField label="Doctor's Name" value={doctorName} />
        <ReadOnlyField label="Likely Date of Admission" value={formatDate(admissionDate)} />
        <ReadOnlyField label="Treatment Type" value={treatmentType} />
        <ReadOnlyField label="Diagnosis" value={diagnosis} />
        <ReadOnlyField
          label="Estimated Amount"
          value={`₹ ${estimatedAmount.toLocaleString()}`}
          trailing={<FileDialog label="Estimate Files" files={estimateFiles} />}
        />
        <ReadOnlyField label="Pay To" value={payTo} />
        <ReadOnlyField label="Advance Requested" value={`₹ ${advanceRequested.toLocaleString()}`} />
        <ReadOnlyField label="Admission Advice" trailing={<FileDialog label="Admission Advice" files={admissionAdviceFiles} />} />
        {/* <ReadOnlyField label="ITR/Income Proof" trailing={<FileDialog label="Income Proof" files={incomeProofFiles} />} /> */}
      </CardContent>
    </Card>
  );
}

function ReadOnlyField({ label, value, trailing }: { label: string; value?: string; trailing?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-blue-800 text-sm font-semibold">{label}</Label>
      <div className="border border-blue-100 rounded-md px-3 py-2 bg-blue-50 flex items-center justify-between">
        <span className="text-gray-800">{value || '-'}</span>
        {trailing && <div className="ml-2">{trailing}</div>}
      </div>
    </div>
  );
}

function formatDate(dateStr: string) {
  if (!dateStr || dateStr.startsWith('0001')) return '-';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
