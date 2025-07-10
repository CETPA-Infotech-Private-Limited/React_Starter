import React, { useState, useEffect } from 'react';
import { UploadCloud, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import { Checkbox } from '@radix-ui/react-checkbox';

interface UploadedItem {
  category: string;
  comment: string;
  files: File[];
}

interface BillItem {
  id: number;
  type: string;
  billedAmount: string;
  claimedAmount: string;
  included: boolean;
  isDefault: boolean;
  files: File[]; // This is correctly defined here
}

interface UploadDialogProps {
  title: string;
  onUploadComplete: (uploadedItems: UploadedItem[]) => void;
  initialUploads?: UploadedItem[];
  onClose: () => void;
  onTotalFilesChange: (count: number) => void;
}

// UploadDialog for each bill row, using File[]
const UploadDialog = ({ files, onFilesChange }: { files: File[]; onFilesChange: (files: File[]) => void }) => {
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
          Upload
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
            <DialogTitle className="text-xl text-blue-800 font-extrabold tracking-tight mb-1 drop-shadow text-center font-sans">Upload Documents</DialogTitle>
            <DialogDescription className="text-xs text-gray-600 italic mb-4 text-center font-sans">
              Upload relevant documents with optional comments.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Input
              id="file-upload"
              type="file"
              multiple
              onChange={handleFileChange}
              className="border border-blue-400 shadow-sm focus:ring-1 focus:ring-blue-500 cursor-pointer rounded-lg py-1.5 px-2 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 font-sans"
            />
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm font-bold py-2 shadow-md transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed font-sans"
              disabled={selectedFiles.length === 0}
            >
              Add to List
            </Button>
            {files.length > 0 && (
              <div className="overflow-x-auto mt-4 rounded-lg border border-blue-200 shadow-sm bg-white">
                <ul>
                  {files.map((file, idx) => (
                    <li key={idx} className="flex items-center justify-between py-1 px-2 border-b last:border-b-0">
                      <span>{file.name}</span>
                      <Button type="button" size="sm" variant="ghost" onClick={() => handleRemove(idx)}>
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
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

interface BillDetailsProps {
  billDetails: any; // Replace 'any' with the actual type if available
  onChange: (billDetails: any) => void; // Replace 'any' with the actual type if available
  preHospBilledAmount?: number;
}

const HospitalizationBillForm = ({ billDetails, onChange, preHospBilledAmount = 0 }: BillDetailsProps) => {
  const initialBills: BillItem[] = [
    {
      id: 1,
      type: 'Medicine',
      billedAmount: billDetails?.MedicenBill?.[0]?.BilledAmount?.toString() || '0',
      claimedAmount: billDetails?.MedicenBill?.[0]?.ClaimedAmount?.toString() || '0',
      included: true,
      isDefault: true,
      files: [],
    },
    {
      id: 2,
      type: 'Consultation',
      billedAmount: billDetails?.Consultation?.[0]?.BilledAmount?.toString() || '0',
      claimedAmount: billDetails?.Consultation?.[0]?.ClaimedAmount?.toString() || '0',
      included: true,
      isDefault: true,
      files: [],
    },
    {
      id: 3,
      type: 'Investigation',
      billedAmount: billDetails?.Investigation?.[0]?.BilledAmount?.toString() || '0',
      claimedAmount: billDetails?.Investigation?.[0]?.ClaimedAmount?.toString() || '0',
      included: true,
      isDefault: true,
      files: [],
    },
    {
      id: 4,
      type: 'Room Rent',
      billedAmount: billDetails?.RoomRent?.[0]?.BilledAmount?.toString() || '0',
      claimedAmount: billDetails?.RoomRent?.[0]?.ClaimedAmount?.toString() || '0',
      included: true,
      isDefault: true,
      files: [],
    },
    {
      id: 5,
      type: 'Procedure',
      billedAmount: billDetails?.Procedure?.[0]?.BilledAmount?.toString() || '0',
      claimedAmount: billDetails?.Procedure?.[0]?.ClaimedAmount?.toString() || '0',
      included: true,
      isDefault: true,
      files: [],
    },
    {
      id: 6,
      type: 'Other',
      billedAmount: billDetails?.OtherBill?.BilledAmount?.toString() || '0',
      claimedAmount: billDetails?.OtherBill?.ClaimedAmount?.toString() || '0',
      included: true,
      isDefault: true,
      files: [],
    },
  ];

  const [bills, setBills] = useState<BillItem[]>(initialBills);
  const [errors, setErrors] = useState<{ [id: number]: string }>({});

  const billedTotal = bills.reduce((sum, bill) => sum + Number(bill.billedAmount || '0'), 0);
  const claimedTotal = bills.reduce((sum, bill) => sum + parseFloat(bill.claimedAmount || '0'), 0);

  // Filter bills not included in the final bill for the payload
  const notIncludedBills = bills.filter((bill) => !bill.included);

  const isBillFilled = (bill: BillItem) => {
    return (
      bill.type.trim() !== '' && bill.billedAmount.trim() !== '' && bill.billedAmount !== '0' && bill.claimedAmount.trim() !== '' && bill.claimedAmount !== '0'
    );
  };

  const addNewBill = (afterIndex: number) => {
    const nextCustomBill = bills.slice(afterIndex + 1).find((b) => !b.isDefault);
    if (nextCustomBill && !isBillFilled(nextCustomBill)) {
      return;
    }
    if (!bills[afterIndex].isDefault && !isBillFilled(bills[afterIndex])) {
      return;
    }
    const newBill: BillItem = {
      id: Date.now(),
      type: bills[afterIndex].type,
      billedAmount: '0',
      claimedAmount: '0',
      included: false,
      isDefault: false,
      files: [],
    };
    const newBills = [...bills];
    newBills.splice(afterIndex + 1, 0, newBill);
    setBills(newBills);
    // Call onChange immediately to update parent with new bill structure
    updateParentBillDetails(newBills);
  };

  const deleteBill = (id: number) => {
    const updatedBills = bills.filter((bill) => bill.id !== id);
    setBills(updatedBills);
    updateParentBillDetails(updatedBills);
  };

  const updateBill = (id: number, field: string, value: string | boolean | File[]) => {
    let errorMsg = '';
    const updatedBills = bills.map((bill) => {
      if (bill.id === id) {
        let newBill = { ...bill, [field]: value };
        if (field === 'claimedAmount') {
          const billed = parseFloat(newBill.billedAmount || '0');
          const claimed = parseFloat((value as string) || '0');
          if (claimed > billed) {
            errorMsg = 'Claimed amount cannot exceed billed amount.';
            newBill.claimedAmount = newBill.billedAmount;
          }
        }
        return newBill;
      }
      return bill;
    });
    setBills(updatedBills);
    setErrors((prev) => ({ ...prev, [id]: errorMsg }));
    // Call the function to update parent bill details
    updateParentBillDetails(updatedBills);
  };

  // New function to consolidate the logic for mapping and calling onChange
  const updateParentBillDetails = (currentBills: BillItem[]) => {
    const apiBillDetails = {
      MedicenBill: [{ BilledAmount: Number(currentBills[0].billedAmount), ClaimedAmount: Number(currentBills[0].claimedAmount) }],
      Consultation: [{ BilledAmount: Number(currentBills[1].billedAmount), ClaimedAmount: Number(currentBills[1].claimedAmount) }],
      Investigation: [{ BilledAmount: Number(currentBills[2].billedAmount), ClaimedAmount: Number(currentBills[2].claimedAmount) }],
      RoomRent: [{ BilledAmount: Number(currentBills[3].billedAmount), ClaimedAmount: Number(currentBills[3].claimedAmount) }],
      Procedure: [{ BilledAmount: Number(currentBills[4].billedAmount), ClaimedAmount: Number(currentBills[4].claimedAmount) }],
      OtherBill: {
        BilledAmount: Number(currentBills[5].billedAmount),
        ClaimedAmount: Number(currentBills[5].claimedAmount),
      },
      // Map custom bills and their files if not included
      NotIncluded: currentBills
        .filter((bill) => !bill.included)
        .map((bill) => ({
          id: bill.id,
          type: bill.type,
          billedAmount: Number(bill.billedAmount),
          claimedAmount: Number(bill.claimedAmount),
          files: bill.files, // Include files for not-included bills
        })),
      claimedTotal: currentBills.reduce((sum, bill) => sum + parseFloat(bill.claimedAmount || '0'), 0),
    };
    onChange(apiBillDetails);
  };

  // Effect to call updateParentBillDetails whenever 'bills' state changes
  useEffect(() => {
    updateParentBillDetails(bills);
  }, [bills]); // Depend on 'bills' state

  return (
    <div className=" flex justify-center items-center font-sans">
      <div className="bg-white w-full border border-blue-300 rounded-xl shadow-2xl">
        <div className="p-6">
          <h2 className="text-xl font-bold text-center text-primary drop-shadow mb-6">Hospitalization Bill Details</h2>

          <div className="overflow-x-auto border border-blue-200 rounded-md">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="border border-blue-500 px-4 py-3 text-left text-sm font-medium w-16 rounded-tl-md">S.No.</th>
                  <th className="border border-blue-500 px-4 py-3 text-left text-sm font-medium">Bill Type</th>
                  <th className="border border-blue-500 px-4 py-3 text-left text-sm font-medium">Billed Amount</th>
                  <th className="border border-blue-500 px-4 py-3 text-left text-sm font-medium">Claimed Amount</th>
                  <th className="border border-blue-500 px-4 py-3 text-left text-sm font-medium w-40">Included in Final Bill</th>
                  <th className="border border-blue-500 px-4 py-3 text-left text-sm font-medium w-32">Upload Document</th>
                  <th className="border border-blue-500 px-4 py-3 text-left text-sm font-medium w-24 rounded-tr-md">Action</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill, index) => (
                  <tr key={bill.id} className="even:bg-blue-50 odd:bg-white border-b border-blue-100 last:border-b-0">
                    <td className="border border-blue-200 px-4 py-3 text-sm text-gray-800">{bill.isDefault ? index + 1 : ''}</td>
                    <td className="border border-blue-200 px-4 py-3 text-sm text-gray-800">
                      {bill.isDefault ? (
                        <span>{bill.type}</span>
                      ) : (
                        <Input
                          value={bill.type}
                          onChange={(e) => updateBill(bill.id, 'type', e.target.value)}
                          placeholder="Enter bill type"
                          className="h-8 border-blue-300 focus:ring-blue-400"
                        />
                      )}
                    </td>
                    <td className="border border-blue-200 px-4 py-3 text-sm">
                      <Input
                        type="number"
                        value={bill.billedAmount}
                        onChange={(e) => updateBill(bill.id, 'billedAmount', e.target.value)}
                        className="h-8 w-24 border-blue-300 focus:ring-blue-400"
                      />
                    </td>
                    <td className="border border-blue-200 px-4 py-3 text-sm">
                      <Input
                        type="number"
                        value={bill.claimedAmount}
                        onChange={(e) => updateBill(bill.id, 'claimedAmount', e.target.value)}
                        className="h-8 w-24 border-blue-300 focus:ring-blue-400"
                      />
                      {errors[bill.id] && <p className="text-red-500 text-xs mt-1">{errors[bill.id]}</p>}
                    </td>
                    <td className="border border-blue-200 px-4 py-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={bill.included}
                          onCheckedChange={(checked: boolean) => updateBill(bill.id, 'included', checked)}
                          className="border-blue-400 data-[state=checked]:bg-primary data-[state=checked]:text-white"
                        />
                        <span className="text-sm text-gray-700">{bill.included ? 'Included' : 'Not Included'}</span>
                      </div>
                    </td>
                    <td className="border border-blue-200 px-4 py-3 text-sm">
                      {bill.isDefault && (bill.type === 'Room Rent' || bill.type === 'Procedure') ? (
                        <span className="italic text-gray-400">Not Applicable</span>
                      ) : !bill.included ? (
                        <UploadDialog
                          files={bill.files}
                          onFilesChange={(files) => updateBill(bill.id, 'files', files)} // Directly update 'files'
                        />
                      ) : (
                        <span className="italic text-gray-400">Not Applicable</span>
                      )}
                    </td>
                    <td className="border border-blue-200 px-4 py-3 text-sm">
                      {bill.isDefault && (bill.type === 'Room Rent' || bill.type === 'Procedure') ? null : bill.isDefault ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addNewBill(index)}
                          className="h-8 px-3 py-1.5 flex items-center justify-center border-blue-400 text-blue-700 hover:bg-blue-100"
                          title="Add New Bill"
                          disabled={(() => {
                            const nextCustomBill = bills.slice(index + 1).find((b) => !b.isDefault);
                            if (nextCustomBill && !isBillFilled(nextCustomBill)) return true;
                            const lastCustomBill = bills.filter((b) => !b.isDefault).slice(-1)[0];
                            if (lastCustomBill && !isBillFilled(lastCustomBill)) return true;
                            return false;
                          })()}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Bill
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteBill(bill.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 border-gray-300"
                          title="Delete Bill"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Section */}
          <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center text-sm font-semibold text-gray-800 bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm">
            <div className="flex flex-col md:flex-row md:space-x-8 space-y-2 md:space-y-0 w-full md:w-auto">
              <span>
                <strong className="text-blue-800">Pre Hospitalization Expense (Billed):</strong> {preHospBilledAmount.toFixed(2)}
              </span>
              <span>
                <strong className="text-blue-800">Hospitalization Expense (Billed):</strong> {billedTotal.toFixed(2)}
              </span>
              <span>
                <strong className="text-blue-800">Total Bill (Billed):</strong> {(preHospBilledAmount + billedTotal).toFixed(2)}
              </span>
              <span>
                <strong className="text-blue-800">Net Total (Claimed):</strong> {claimedTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalizationBillForm;
