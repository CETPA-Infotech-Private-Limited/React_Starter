import React, { useState } from 'react';
import { UploadCloud, Trash2 } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface UploadDialogProps {
  title: string;
  files: File[];
  onFilesChange: (files: File[]) => void;
}

const UploadDialog: React.FC<UploadDialogProps> = ({ title, files, onFilesChange }) => {
  const [open, setOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesChange(Array.from(e.target.files));
    }
  };

  const handleRemove = (index: number) => {
    const updated = [...files];
    updated.splice(index, 1);
    onFilesChange(updated);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="w-full text-xs flex items-center justify-between bg-gradient-to-r from-blue-200 to-blue-300 border border-blue-500 text-blue-900 font-semibold shadow-md hover:scale-105 transition-transform duration-300 px-3 py-1.5 rounded-md"
        >
          <UploadCloud className="mr-1 h-4 w-4" />
          {title}
          {files.length > 0 && <span className="ml-auto bg-blue-500 text-white text-xxs px-1.5 py-0.5 rounded-full font-bold">{files.length}</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl p-6 rounded-2xl shadow-xl bg-white border border-blue-300">
        <DialogHeader>
          <DialogTitle className="text-blue-800 text-xl font-bold text-center">{title}</DialogTitle>
          <DialogDescription className="text-center text-xs text-gray-600 mb-4">Upload supporting documents here.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-2">
          <Label className="text-blue-800 text-sm font-semibold">Select files</Label>
          <Input
            type="file"
            multiple
            onChange={handleFileChange}
            className="file:bg-blue-50 file:text-blue-700 file:font-medium file:px-2 file:py-1 file:rounded-full file:border-0 border border-blue-300 text-xs"
          />
        </div>

        {files.length > 0 && (
          <div className="mt-4 border border-blue-100 rounded-md bg-white max-h-40 overflow-auto">
            <table className="text-xxs w-full text-left">
              <thead className="bg-blue-100 font-semibold text-blue-800">
                <tr>
                  <th className="px-2 py-1">#</th>
                  <th className="px-2 py-1">File Name</th>
                  <th className="px-2 py-1">Action</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file, idx) => (
                  <tr key={idx} className="odd:bg-white even:bg-blue-50">
                    <td className="px-2 py-1">{idx + 1}</td>
                    <td className="px-2 py-1 truncate">{file.name}</td>
                    <td className="px-2 py-1">
                      <button onClick={() => handleRemove(idx)} className="text-blue-600 hover:text-red-600">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button
            onClick={() => setOpen(false)}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full py-2 text-sm font-semibold"
          >
            Confirm & Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
