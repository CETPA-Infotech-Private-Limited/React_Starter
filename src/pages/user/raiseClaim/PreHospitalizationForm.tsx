import React, { useState } from 'react';
import { UploadCloud, Trash2, Plus } from 'lucide-react'; // Added Plus icon back for addNewBill
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Define the UploadedItem interface outside of the component for better reusability
interface UploadedItem {
  category: string;
  comment: string;
  files: File[];
}

// Define the Bill interface
interface Bill {
  id: number;
  type: string;
  billDate: string;
  billedAmount: string;
  claimedAmount: string;
  isDefault: boolean;
}

// UploadDialog component - now accepts files and onFilesChange props for parent state sync
const UploadDialog = ({ title, files, onFilesChange }: { title: string; files: File[]; onFilesChange: (files: File[]) => void }) => {
  const [comment, setComment] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length > 0) {
      const newFiles = [...files, ...selectedFiles];
      onFilesChange(newFiles);
      setComment('');
      setSelectedFiles([]);
    }
  };

  const handleRemove = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-full text-xs flex items-center justify-between bg-gradient-to-r from-blue-200 to-blue-300 border border-blue-500 text-blue-900 font-semibold shadow-md hover:scale-105 transition-transform duration-300 ease-in-out px-3 py-1.5 rounded-md font-sans">
          <UploadCloud className="mr-1 h-4 w-4" />
          Upload {title}
          {files.length > 0 && (
            <span className="ml-auto bg-blue-500 text-white text-xxs px-1.5 py-0.5 rounded-full font-bold transition-all duration-300 ease-in-out font-sans">
              {files.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px] text-black text-xs bg-gradient-to-br from-white via-blue-50 to-white shadow-xl border border-blue-300 rounded-2xl p-6 animate-fade-in font-sans">
        <form onSubmit={handleAdd}>
          <DialogHeader className="relative">
            <DialogTitle className="text-xl text-blue-800 font-extrabold tracking-tight mb-1 drop-shadow text-center font-sans">
              Upload {title} Documents
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-600 italic mb-4 text-center font-sans">
              Upload relevant documents with optional comments.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="file-upload" className="text-blue-800 font-semibold text-sm font-sans">
                Choose Files
              </Label>
              <Input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileChange}
                className="border border-blue-400 shadow-sm focus:ring-1 focus:ring-blue-500 cursor-pointer rounded-lg py-1.5 px-2 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 font-sans"
              />
              {selectedFiles.length > 0 && <p className="text-xs text-gray-500 mt-1">{selectedFiles.length} file(s) selected.</p>}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="comment" className="text-blue-800 font-semibold text-sm font-sans">
                Comment
              </Label>
              <Textarea
                id="comment"
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment about your upload..."
                className="border border-blue-300 focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-1.5 shadow-sm placeholder:text-gray-400 text-xs font-sans"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm font-bold py-2 shadow-md transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed font-sans"
              disabled={selectedFiles.length === 0}
            >
              Add to List
            </Button>

            {files.length > 0 && (
              <div className="overflow-x-auto mt-4 rounded-lg border border-blue-200 shadow-sm bg-white">
                <table className="w-full text-xxs text-center font-sans">
                  <thead className="bg-gradient-to-r from-blue-400 to-blue-300 text-white font-bold rounded-t-lg">
                    <tr>
                      <th className="px-2 py-2 rounded-tl-lg">S.NO</th>
                      <th className="px-2 py-2">File Name</th>
                      <th className="px-2 py-2 rounded-tr-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file, index) => (
                      <tr key={index} className="odd:bg-white even:bg-blue-50 border-b border-blue-100 last:border-b-0">
                        <td className="px-2 py-1.5 font-semibold text-blue-900">{index + 1}</td>
                        <td className="px-2 py-1.5 font-medium text-blue-800">{file.name}</td>
                        <td className="px-2 py-1.5">
                          <button
                            type="button"
                            onClick={() => handleRemove(index)}
                            className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                            aria-label={`Remove upload ${index + 1}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <DialogFooter className="mt-6">
            <Button
              type="button"
              onClick={closeDialog}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full text-sm font-bold py-2.5 shadow-md transition-all duration-300 ease-in-out font-sans"
            >
              Confirm Uploads & Close
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface PreHospitalizationFormProps {
  preHospitalizationForm: {
    IsPreHospitalizationExpenses?: boolean;
    PreHospitalizationExpensesMedicine?: { BilledAmount: number; ClaimedAmount: number; ClaimDate: string };
    PreHospitalizationExpensesConsultation?: { BilledAmount: number; ClaimedAmount: number; ClaimDate: string };
    PreHospitalizationExpensesInvestigation?: { BilledAmount: number; ClaimedAmount: number; ClaimDate: string };
    PreHospitalizationExpensesOther?: { BilledAmount: number; ClaimedAmount: number; ClaimDate: string };
    PreHospitalizationProcedure?: { BilledAmount: number; ClaimedAmount: number; ClaimDate: string };
    // Add PascalCase file upload arrays for each bill type
    PreHospitalizationExpensesMedicineFiles?: string[];
    PreHospitalizationExpensesConsultationFiles?: string[];
    PreHospitalizationExpensesInvestigationFiles?: string[];
    PreHospitalizationProcedureFiles?: string[];
    PreHospitalizationExpensesOtherFiles?: string[];
    [key: string]: any;
  };
  onChange: (value: any) => void;
}

const PreHospitalizationForm = ({ preHospitalizationForm, onChange }: PreHospitalizationFormProps) => {
  const [isFormVisible, setIsFormVisible] = useState<boolean>(!!preHospitalizationForm.IsPreHospitalizationExpenses);
  const [bills, setBills] = useState<Bill[]>([
    {
      id: 1,
      type: 'Medicine',
      billDate: preHospitalizationForm?.PreHospitalizationExpensesMedicine?.ClaimDate || '',
      billedAmount: preHospitalizationForm?.PreHospitalizationExpensesMedicine?.BilledAmount?.toString() || '0',
      claimedAmount: preHospitalizationForm?.PreHospitalizationExpensesMedicine?.ClaimedAmount?.toString() || '0',
      isDefault: true,
    },
    {
      id: 2,
      type: 'Consultation',
      billDate: preHospitalizationForm?.PreHospitalizationExpensesConsultation?.ClaimDate || '',
      billedAmount: preHospitalizationForm?.PreHospitalizationExpensesConsultation?.BilledAmount?.toString() || '0',
      claimedAmount: preHospitalizationForm?.PreHospitalizationExpensesConsultation?.ClaimedAmount?.toString() || '0',
      isDefault: true,
    },
    {
      id: 3,
      type: 'Investigation',
      billDate: preHospitalizationForm?.PreHospitalizationExpensesInvestigation?.ClaimDate || '',
      billedAmount: preHospitalizationForm?.PreHospitalizationExpensesInvestigation?.BilledAmount?.toString() || '0',
      claimedAmount: preHospitalizationForm?.PreHospitalizationExpensesInvestigation?.ClaimedAmount?.toString() || '0',
      isDefault: true,
    },
    {
      id: 4,
      type: 'Procedure',
      billDate: preHospitalizationForm?.PreHospitalizationProcedure?.ClaimDate || '',
      billedAmount: preHospitalizationForm?.PreHospitalizationProcedure?.BilledAmount?.toString() || '0',
      claimedAmount: preHospitalizationForm?.PreHospitalizationProcedure?.ClaimedAmount?.toString() || '0',
      isDefault: true,
    },
    {
      id: 5,
      type: 'Other',
      billDate: preHospitalizationForm?.PreHospitalizationExpensesOther?.ClaimDate || '',
      billedAmount: preHospitalizationForm?.PreHospitalizationExpensesOther?.BilledAmount?.toString() || '0',
      claimedAmount: preHospitalizationForm?.PreHospitalizationExpensesOther?.ClaimedAmount?.toString() || '0',
      isDefault: true,
    },
  ]);
  // File uploads state for each bill type (PascalCase keys)
  const ensureFileArray = (arr: any): File[] => (Array.isArray(arr) && arr.length > 0 && arr[0] instanceof File ? arr : []);
  const [uploads, setUploads] = useState<{
    [key: string]: File[];
  }>({
    PreHospitalizationExpensesMedicineFiles: ensureFileArray(preHospitalizationForm.PreHospitalizationExpensesMedicineFiles),
    PreHospitalizationExpensesConsultationFiles: ensureFileArray(preHospitalizationForm.PreHospitalizationExpensesConsultationFiles),
    PreHospitalizationExpensesInvestigationFiles: ensureFileArray(preHospitalizationForm.PreHospitalizationExpensesInvestigationFiles),
    PreHospitalizationProcedureFiles: ensureFileArray(preHospitalizationForm.PreHospitalizationProcedureFiles),
    PreHospitalizationExpensesOtherFiles: ensureFileArray(preHospitalizationForm.PreHospitalizationExpensesOtherFiles),
  });

  const [errors, setErrors] = useState<{ [id: number]: string }>({});
  const updateBill = (id: number, field: keyof Bill, value: string) => {
    let errorMsg = '';
    const updatedBills = bills.map((bill) => {
      if (bill.id === id) {
        let newBill = { ...bill, [field]: value };
        // Validation: ClaimedAmount should not exceed BilledAmount
        if (field === 'claimedAmount') {
          const billed = parseFloat(newBill.billedAmount || '0');
          const claimed = parseFloat(value || '0');
          if (claimed > billed) {
            errorMsg = 'Claimed amount cannot exceed billed amount.';
            newBill.claimedAmount = newBill.billedAmount; // Auto-correct
          }
        }
        return newBill;
      }
      return bill;
    });
    setBills(updatedBills);
    setErrors((prev) => ({ ...prev, [id]: errorMsg }));
    // Map local state to API structure and call onChange (PascalCase keys, including file arrays)
    const apiPreHospDetails = {
      IsPreHospitalizationExpenses: isFormVisible,
      PreHospitalizationExpensesMedicine: {
        BilledAmount: Number(updatedBills[0].billedAmount),
        ClaimedAmount: Number(updatedBills[0].claimedAmount),
        ClaimDate: updatedBills[0].billDate,
      },
      PreHospitalizationExpensesConsultation: {
        BilledAmount: Number(updatedBills[1].billedAmount),
        ClaimedAmount: Number(updatedBills[1].claimedAmount),
        ClaimDate: updatedBills[1].billDate,
      },
      PreHospitalizationExpensesInvestigation: {
        BilledAmount: Number(updatedBills[2].billedAmount),
        ClaimedAmount: Number(updatedBills[2].claimedAmount),
        ClaimDate: updatedBills[2].billDate,
      },
      PreHospitalizationProcedure: {
        BilledAmount: Number(updatedBills[3].billedAmount),
        ClaimedAmount: Number(updatedBills[3].claimedAmount),
        ClaimDate: updatedBills[3].billDate,
      },
      PreHospitalizationExpensesOther: {
        BilledAmount: Number(updatedBills[4].billedAmount),
        ClaimedAmount: Number(updatedBills[4].claimedAmount),
        ClaimDate: updatedBills[4].billDate,
      },
      PreHospitalizationExpensesMedicineFiles: uploads.PreHospitalizationExpensesMedicineFiles,
      PreHospitalizationExpensesConsultationFiles: uploads.PreHospitalizationExpensesConsultationFiles,
      PreHospitalizationExpensesInvestigationFiles: uploads.PreHospitalizationExpensesInvestigationFiles,
      PreHospitalizationProcedureFiles: uploads.PreHospitalizationProcedureFiles,
      PreHospitalizationExpensesOtherFiles: uploads.PreHospitalizationExpensesOtherFiles,
    };
    onChange(apiPreHospDetails);
  };

  // Handler for file uploads for each bill type (PascalCase)
  const handleUploadChange = (billTypeKey: string, files: File[]) => {
    const newUploads = { ...uploads, [billTypeKey]: files };
    setUploads(newUploads);
    // Update parent with new uploads as well
    onChange({ ...preHospitalizationForm, [billTypeKey]: files });
  };

  const calculateSubTotal = (): number => {
    // Added return type
    return bills.reduce((sum, bill) => sum + parseFloat(bill.billedAmount || '0'), 0);
  };

  return (
    <div className=" pb-4 font-sans text-gray-800 flex justify-center items-start ">
      {/* Added padding and background to outer div */}
      <div className="bg-white w-full rounded-2xl shadow-xl p-6 border border-blue-200">
        <div className="flex items-center w-full space-x-3 mb-6">
          <Checkbox
            checked={isFormVisible}
            onCheckedChange={(checked) => {
              setIsFormVisible(checked === true);
              onChange({ ...preHospitalizationForm, IsPreHospitalizationExpenses: checked === true });
            }}
            className="h-5 w-5 flex-shrink-0 border-blue-400 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
          />
          <span className="text-lg font-bold text-primary drop-shadow">Pre Hospitalization Expenses</span>
        </div>

        {/* Form Table - Only shows when checkbox is checked */}
        {isFormVisible && (
          <div className="space-y-6">
            <div className="overflow-x-auto rounded-lg border border-blue-200 shadow-sm">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="px-4 py-3 text-left text-sm font-semibold rounded-tl-lg">S.No.</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Bill Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Bill Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Billed Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Claimed Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Upload</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold rounded-tr-lg"></th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map((bill, index) => (
                    <tr
                      key={bill.id}
                      className="group hover:bg-blue-50 odd:bg-white even:bg-blue-50 border-b border-blue-100 last:border-b-0 transition-colors duration-200"
                    >
                      <td className="px-4 py-3 text-sm text-blue-900 font-medium">{bill.isDefault ? index + 1 : ''}</td>
                      <td className="px-4 py-3 text-sm">
                        {bill.isDefault ? (
                          <span className="text-gray-700">{bill.type}</span>
                        ) : (
                          <Input
                            value={bill.type}
                            onChange={(e) => updateBill(bill.id, 'type', e.target.value)}
                            placeholder="Enter bill type"
                            className="h-8 text-sm border-blue-200 focus:ring-blue-400 focus:border-blue-400"
                          />
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Input
                          type="date"
                          value={bill.billDate}
                          onChange={(e) => updateBill(bill.id, 'billDate', e.target.value)}
                          className="h-8 text-sm bg-blue-50 border-blue-200 focus:ring-blue-400 focus:border-blue-400"
                          placeholder="dd-mm-yyyy"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Input
                          type="number"
                          value={bill.billedAmount}
                          onChange={(e) => updateBill(bill.id, 'billedAmount', e.target.value)}
                          className="h-8 w-28 text-sm border-blue-200 focus:ring-blue-400 focus:border-blue-400"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Input
                          type="number"
                          value={bill.claimedAmount}
                          onChange={(e) => updateBill(bill.id, 'claimedAmount', e.target.value)}
                          className="h-8 w-28 text-sm border-blue-200 focus:ring-blue-400 focus:border-blue-400"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {/* UploadDialog for each bill type, passing uploads and handler for PascalCase file array */}
                        {bill.type === 'Medicine' && (
                          <UploadDialog
                            title="Medicine"
                            files={uploads.PreHospitalizationExpensesMedicineFiles}
                            onFilesChange={(files) => handleUploadChange('PreHospitalizationExpensesMedicineFiles', files)}
                          />
                        )}
                        {bill.type === 'Consultation' && (
                          <UploadDialog
                            title="Consultation"
                            files={uploads.PreHospitalizationExpensesConsultationFiles}
                            onFilesChange={(files) => handleUploadChange('PreHospitalizationExpensesConsultationFiles', files)}
                          />
                        )}
                        {bill.type === 'Investigation' && (
                          <UploadDialog
                            title="Investigation"
                            files={uploads.PreHospitalizationExpensesInvestigationFiles}
                            onFilesChange={(files) => handleUploadChange('PreHospitalizationExpensesInvestigationFiles', files)}
                          />
                        )}
                        {bill.type === 'Procedure' && (
                          <UploadDialog
                            title="Procedure"
                            files={uploads.PreHospitalizationProcedureFiles}
                            onFilesChange={(files) => handleUploadChange('PreHospitalizationProcedureFiles', files)}
                          />
                        )}
                        {bill.type === 'Other' && (
                          <UploadDialog
                            title="Other"
                            files={uploads.PreHospitalizationExpensesOtherFiles}
                            onFilesChange={(files) => handleUploadChange('PreHospitalizationExpensesOtherFiles', files)}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Sub Total Row */}
            <div className="flex justify-end">
              <div className="bg-blue-100 px-6 py-3 rounded-xl border border-blue-200 shadow-md">
                <span className="font-semibold text-blue-800 text-base">Sub Total: </span>
                <span className="font-extrabold text-blue-900 text-lg">₹{calculateSubTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreHospitalizationForm;
