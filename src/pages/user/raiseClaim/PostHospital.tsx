import React, { useEffect, useState } from 'react';
import { UploadCloud, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

interface UploadDialogProps {
  title: string;
  files: File[];
  onFilesChange: (files: File[]) => void;
}

const UploadDialog: React.FC<UploadDialogProps> = ({ title, files, onFilesChange }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArr = Array.from(e.target.files);
      onFilesChange(fileArr);
    } else {
      onFilesChange([]);
    }
  };

  const handleRemove = (index: number) => {
    const newFiles = files.slice(0, index).concat(files.slice(index + 1));
    onFilesChange(newFiles);
  };

  const closeDialog = () => setIsDialogOpen(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-1/3 text-xs flex items-center justify-between bg-gradient-to-r from-blue-200 to-blue-300 border border-blue-500 text-blue-900 font-semibold shadow-md hover:scale-105 transition-transform duration-300 ease-in-out px-3 py-1.5 rounded-md font-sans">
          <UploadCloud className="mr-1 h-4 w-4" />
          {title}
          {files.length > 0 && (
            <span className="ml-auto bg-blue-500 text-white text-xxs px-1.5 py-0.5 rounded-full font-bold transition-all duration-300 ease-in-out font-sans">
              {files.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px] text-black text-xs bg-gradient-to-br from-white via-blue-50 to-white shadow-xl border border-blue-300 rounded-2xl p-6 animate-fade-in font-sans">
        <DialogHeader>
          <DialogTitle className="text-xl text-blue-800 font-extrabold text-center">{title}</DialogTitle>
          <DialogDescription className="text-xs text-gray-600 italic text-center">Upload relevant documents.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="file-upload" className="text-blue-800 font-semibold text-sm">
              Choose Files
            </Label>
            <Input
              id="file-upload"
              type="file"
              multiple
              onChange={handleFileChange}
              className="border border-blue-400 focus:ring-1 focus:ring-blue-500 rounded-lg py-1.5 px-2"
            />
          </div>
          {files.length > 0 && (
            <div className="overflow-x-auto mt-4 border border-blue-200 rounded-lg bg-white">
              <table className="w-full text-xxs text-center">
                <thead className="bg-gradient-to-r from-blue-400 to-blue-300 text-white font-bold">
                  <tr>
                    <th className="px-2 py-2">S.NO</th>
                    <th className="px-2 py-2">File Name</th>
                    <th className="px-2 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file, index) => (
                    <tr key={index} className="odd:bg-white even:bg-blue-50">
                      <td className="px-2 py-1.5 font-semibold text-blue-900">{index + 1}</td>
                      <td className="px-2 py-1.5 text-gray-700 truncate max-w-[150px]">{file.name}</td>
                      <td className="px-2 py-1.5">
                        <button type="button" onClick={() => handleRemove(index)} className="text-blue-500 hover:text-blue-700">
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
          <Button onClick={closeDialog} className="w-full bg-blue-700 text-white rounded-full py-2.5">
            Confirm Uploads & Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface PostHospitalizationFormProps {
  postHospitalizationAndDeclaration: {
    IsPostHospitalization?: boolean;
    IsSpecailDisease?: boolean;
    SpecialDiseaseName?: string;
    IsTaxAble?: boolean;
    HospitalRegstrationDetailsFile?: { Files: File[] };
    HospitalIncomeTaxFile?: { Files: File[] };
    DeclarationChecked?: boolean;
    PreHospitalizationExpenseAmount?: number;
    HospitalizationExpenseAmount?: number;
    NotIncludedBilledAmount?: number;
    NetTotal?: number;
    PostHospitalTreatmentAdviseUpload?: File[];
    [key: string]: any;
  };
  onChange: (value: any) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

const PostHospitalizationForm: React.FC<PostHospitalizationFormProps> = ({
  postHospitalizationAndDeclaration,
  onChange,
  onSubmit,
}) => {
  const {
    IsPostHospitalization,
    IsSpecailDisease,
    SpecialDiseaseName,
    IsTaxAble,
    DeclarationChecked,
    PreHospitalizationExpenseAmount = 0,
    HospitalizationExpenseAmount = 0,
    NotIncludedBilledAmount = 0,
    NetTotal = 0,
  } = postHospitalizationAndDeclaration;

  const [postHospitalTreatmentAdviseFiles, setPostHospitalTreatmentAdviseFiles] = useState<File[]>(
    postHospitalizationAndDeclaration.PostHospitalTreatmentAdviseUpload || []
  );
  const [regdCertificateFiles, setRegdCertificateFiles] = useState<File[]>(
    postHospitalizationAndDeclaration.HospitalRegstrationDetailsFile?.Files || []
  );
  const [incomeTaxExemptionFiles, setIncomeTaxExemptionFiles] = useState<File[]>(
    postHospitalizationAndDeclaration.HospitalIncomeTaxFile?.Files || []
  );

  useEffect(() => {
    onChange({
      ...postHospitalizationAndDeclaration,
      PostHospitalTreatmentAdviseUpload: postHospitalTreatmentAdviseFiles,
      HospitalRegstrationDetailsFile: { Files: regdCertificateFiles },
      HospitalIncomeTaxFile: { Files: incomeTaxExemptionFiles },
    });
  }, [postHospitalTreatmentAdviseFiles, regdCertificateFiles, incomeTaxExemptionFiles]);

  const totalBill = PreHospitalizationExpenseAmount + HospitalizationExpenseAmount;

  return (
    <div className="rounded-xl border border-blue-300 shadow-2xl mx-auto p-6 bg-white space-y-6">
      {/* Post Hospitalization Toggle */}
      <div className="flex items-center justify-between">
        <Label className="text-xl font-extrabold text-primary">Post Hospitalization Applicable</Label>
        <RadioGroup
          value={IsPostHospitalization ? 'yes' : 'no'}
          onValueChange={(val) => onChange({ ...postHospitalizationAndDeclaration, IsPostHospitalization: val === 'yes' })}
          className="flex space-x-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="post-hosp-yes" />
            <Label htmlFor="post-hosp-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="post-hosp-no" />
            <Label htmlFor="post-hosp-no">No</Label>
          </div>
        </RadioGroup>
        {IsPostHospitalization && (
          <UploadDialog title="Upload File" files={postHospitalTreatmentAdviseFiles} onFilesChange={setPostHospitalTreatmentAdviseFiles} />
        )}
      </div>

      {/* Declaration Fields */}
      <div className="space-y-4 border-t pt-6">
        {/* Special Disease */}
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">Special Disease</Label>
          <RadioGroup
            value={IsSpecailDisease ? 'yes' : 'no'}
            onValueChange={(val) => onChange({ ...postHospitalizationAndDeclaration, IsSpecailDisease: val === 'yes' })}
            className="flex space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="special-disease-yes" />
              <Label htmlFor="special-disease-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="special-disease-no" />
              <Label htmlFor="special-disease-no">No</Label>
            </div>
          </RadioGroup>
          {IsSpecailDisease && (
            <Input
              placeholder="Disease Name"
              value={SpecialDiseaseName || ''}
              onChange={(e) => onChange({ ...postHospitalizationAndDeclaration, SpecialDiseaseName: e.target.value })}
              className="w-64"
            />
          )}
        </div>

        {/* Taxable */}
        <div className="flex items-center space-x-4">
          <Label className="text-base font-medium">Taxable</Label>
          <RadioGroup
            value={IsTaxAble ? 'yes' : 'no'}
            onValueChange={(val) => onChange({ ...postHospitalizationAndDeclaration, IsTaxAble: val === 'yes' })}
            className="flex space-x-6"
          >
            <RadioGroupItem value="yes" id="taxable-yes" />
            <Label htmlFor="taxable-yes">Yes</Label>
            <RadioGroupItem value="no" id="taxable-no" />
            <Label htmlFor="taxable-no">No</Label>
          </RadioGroup>
        </div>

        {!IsTaxAble && (
          <div className="grid grid-cols-2 gap-6 mt-4">
            <UploadDialog title="Regd. Certificate" files={regdCertificateFiles} onFilesChange={setRegdCertificateFiles} />
            <UploadDialog title="IT Exemption Letter" files={incomeTaxExemptionFiles} onFilesChange={setIncomeTaxExemptionFiles} />
          </div>
        )}
      </div>

      {/* Summary Section */}
      <div className="space-y-4 border-t pt-6">
        <h2 className="text-lg font-semibold text-primary">Summary</h2>
        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between">
            <span>Pre Hospitalization Expense</span>
            <span>{PreHospitalizationExpenseAmount}</span>
          </div>
          <div className="flex justify-between">
            <span>Hospitalization Expense</span>
            <span>{HospitalizationExpenseAmount}</span>
          </div>
          <div className="flex justify-between">
            <span>Not Included Expense</span>
            <span>{NotIncludedBilledAmount}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total Bill</span>
            <span>{totalBill}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Net Total (Balance Claim)</span>
            <span>{NetTotal}</span>
          </div>
        </div>
      </div>

      {/* Declaration Checkbox & Submit */}
      <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <Checkbox
          checked={!!DeclarationChecked}
          onCheckedChange={(checked) => onChange({ ...postHospitalizationAndDeclaration, DeclarationChecked: checked === true })}
          id="final-declaration"
        />
        <Label htmlFor="final-declaration" className="text-sm text-gray-700">
          I hereby declare that the information given is correct and complete to the best of my knowledge.
        </Label>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={onSubmit} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2" disabled={!DeclarationChecked}>
          Submit Claim
        </Button>
      </div>
    </div>
  );
};

export default PostHospitalizationForm;
