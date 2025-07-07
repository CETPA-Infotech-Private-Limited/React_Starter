import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

type FileDialogProps = {
  label: string;
  files: string[];
  badgeColor?: string;
};

const FileDialog = ({ label, files, badgeColor = "bg-green-100 text-green-800" }: FileDialogProps) => {
  const fileCount = files?.length || 0;

  return (
    <div className="flex items-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
          >
            <Eye className="w-4 h-4" />
            {fileCount} file{fileCount !== 1 && "s"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{label}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 mt-4">
            {fileCount > 0 ? (
              files.map((url, index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:underline text-sm"
                >
                  File {index + 1}
                </a>
              ))
            ) : (
              <p className="text-sm text-gray-500">No files available.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <span className={`${badgeColor} px-2 py-1 rounded text-xs ml-2`}>{fileCount}</span>
    </div>
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
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Hospitalization Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Hospital Name:</span>
              <span className="text-blue-600">{hospitalName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Likely Date of Admission:</span>
              <span>{admissionDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Type of Treatment:</span>
              <span className="text-blue-600">{treatmentType}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Diagnosis:</span>
              <span className="text-blue-600">{diagnosis}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Estimated Amount:</span>
              <div className="flex items-center">
                <span>₹ {estimatedAmount.toLocaleString()}</span>
                <FileDialog label="Estimate Files" files={estimateFiles} />
              </div>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Pay To:</span>
              <span className="text-blue-600">{payTo}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Hospital Regd. No.:</span>
              <span>{regdNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Doctor's Name:</span>
              <span>{doctorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Admission Advice:</span>
              <FileDialog label="Admission Advice" files={admissionAdviceFiles} />
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Advance Requested Amount:</span>
              <span>₹ {advanceRequested.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">ITR/Income Proof:</span>
              <FileDialog
                label="Income Proof"
                files={incomeProofFiles}
                badgeColor="bg-blue-100 text-blue-800"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
