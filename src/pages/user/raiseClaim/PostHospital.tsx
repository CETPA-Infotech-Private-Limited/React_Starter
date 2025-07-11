import React, { useState } from 'react';
import { UploadCloud, Trash2, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

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
        <DialogHeader className="relative">
          <DialogTitle className="text-xl text-blue-800 font-extrabold tracking-tight mb-1 drop-shadow text-center font-sans">{title}</DialogTitle>
          <DialogDescription className="text-xs text-gray-600 italic mb-4 text-center font-sans">Upload relevant documents.</DialogDescription>
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
          </div>
          {files.length > 0 && (
            <div className="overflow-x-auto mt-4 rounded-lg border border-blue-200 shadow-sm bg-white">
              <table className="w-full text-xxs text-center font-sans">
                <thead className="bg-gradient-to-r from-blue-400 to-blue-300 text-white font-bold rounded-t-lg">
                  <tr>
                    <th className="px-2 py-2 rounded-tl-lg">S.NO</th>
                    <th className="px-2 py-2">File Name</th>
                    <th className="px-2 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file, index) => (
                    <tr key={index} className="odd:bg-white even:bg-blue-50 border-b border-blue-100 last:border-b-0">
                      <td className="px-2 py-1.5 font-semibold text-blue-900">{index + 1}</td>
                      <td className="px-2 py-1.5 text-gray-700 max-w-[150px] truncate">{file.name}</td>
                      <td className="px-2 py-1.5">
                        <button
                          type="button"
                          onClick={() => handleRemove(index)}
                          className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                          aria-label={`Remove file ${index + 1}`}
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
    [key: string]: any;
  };
  onChange: (value: any) => void;
  onSubmit: () => void;
}

const PostHospitalizationForm = ({ postHospitalizationAndDeclaration, onChange, onSubmit, isSubmitting }: PostHospitalizationFormProps) => {
  const { IsPostHospitalization, IsSpecailDisease, SpecialDiseaseName, IsTaxAble, DeclarationChecked } = postHospitalizationAndDeclaration;

  // File upload states
  const [postHospitalTreatmentAdviseFiles, setPostHospitalTreatmentAdviseFiles] = useState<File[]>(
    postHospitalizationAndDeclaration.PostHospitalTreatmentAdviseUpload || []
  );
  const [regdCertificateFiles, setRegdCertificateFiles] = useState<File[]>(
    (postHospitalizationAndDeclaration.HospitalRegstrationDetailsFile && postHospitalizationAndDeclaration.HospitalRegstrationDetailsFile.Files) || []
  );
  const [incomeTaxExemptionFiles, setIncomeTaxExemptionFiles] = useState<File[]>(
    (postHospitalizationAndDeclaration.HospitalIncomeTaxFile && postHospitalizationAndDeclaration.HospitalIncomeTaxFile.Files) || []
  );

  // Propagate file changes up to parent
  React.useEffect(() => {
    onChange({
      ...postHospitalizationAndDeclaration,
      PostHospitalTreatmentAdviseUpload: postHospitalTreatmentAdviseFiles,
      HospitalRegstrationDetailsFile: { Files: regdCertificateFiles },
      HospitalIncomeTaxFile: { Files: incomeTaxExemptionFiles },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postHospitalTreatmentAdviseFiles, regdCertificateFiles, incomeTaxExemptionFiles]);

  const preHospAmount = postHospitalizationAndDeclaration.PreHospitalizationExpenseAmount || 0;
  const hospAmount = postHospitalizationAndDeclaration.HospitalizationExpenseAmount || 0;
  const totalBill = preHospAmount + hospAmount;
  const netTotal = postHospitalizationAndDeclaration.NetTotal || 0;

  return (
    <div className="rounded-xl border border-blue-300 shadow-2xl mx-auto p-6 bg-white">
      <div className="space-y-6">
        {/* Post Hospitalization Applicable Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Label className=" text-xl font-extrabold text-primary min-w-[200px]">Post Hospitalization Applicable</Label>
              <RadioGroup
                value={IsPostHospitalization ? 'yes' : 'no'}
                onValueChange={(val) => onChange({ ...postHospitalizationAndDeclaration, IsPostHospitalization: val === 'yes' })}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="post-hosp-yes" />
                  <Label htmlFor="post-hosp-yes" className="text-sm">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="post-hosp-no" />
                  <Label htmlFor="post-hosp-no" className="text-sm">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {IsPostHospitalization && (
              <div className="flex items-center space-x-3">
                <Label className="text-md text-primary font-medium ">Upload Post Hospitalization Treatment Advice</Label>
                <UploadDialog title="Upload File" files={postHospitalTreatmentAdviseFiles} onFilesChange={setPostHospitalTreatmentAdviseFiles} />
              </div>
            )}
          </div>
        </div>

        {/* Declaration Section */}
        <div className="space-y-6 border-t pt-6">
          <h2 className="text-lg font-semibold text-primary">Declaration</h2>

          {/* Special Disease Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Label className="text-base font-medium text-primary min-w-[200px]">Special Disease</Label>
              <RadioGroup
                value={IsSpecailDisease ? 'yes' : 'no'}
                onValueChange={(val) => onChange({ ...postHospitalizationAndDeclaration, IsSpecailDisease: val === 'yes' })}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="special-disease-yes" />
                  <Label htmlFor="special-disease-yes" className="text-sm">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="special-disease-no" />
                  <Label htmlFor="special-disease-no" className="text-sm">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {IsSpecailDisease && (
              <div className="flex items-center space-x-3">
                <Label htmlFor="special-disease-name" className="text-sm font-medium text-primary">
                  Special Disease Name
                </Label>
                <Input
                  id="special-disease-name"
                  value={SpecialDiseaseName || ''}
                  onChange={(e) => onChange({ ...postHospitalizationAndDeclaration, SpecialDiseaseName: e.target.value })}
                  placeholder="Enter disease name"
                  className="w-64"
                />
              </div>
            )}
          </div>

          {/* Taxable Row */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Label className="text-base font-medium text-primary min-w-[200px]">Taxable</Label>
              <RadioGroup
                value={IsTaxAble ? 'yes' : 'no'}
                onValueChange={(val) => onChange({ ...postHospitalizationAndDeclaration, IsTaxAble: val === 'yes' })}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="taxable-yes" />
                  <Label htmlFor="taxable-yes" className="text-sm">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="taxable-no" />
                  <Label htmlFor="taxable-no" className="text-sm">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {!IsTaxAble && (
              <div className="grid grid-cols-2 gap-6 mt-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <Label className="text-md font-medium w-full text-primary">Upload Regd. Certificate</Label>
                  <UploadDialog title="Upload File" files={regdCertificateFiles} onFilesChange={setRegdCertificateFiles} />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <Label className="text-md w-full font-medium text-primary">Hospital Income Tax Exemption Letter</Label>
                  <UploadDialog title="Upload File" files={incomeTaxExemptionFiles} onFilesChange={setIncomeTaxExemptionFiles} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Summary Section */}
        <div className="space-y-4 border-t pt-6">
          <h2 className="text-lg font-semibold text-primary">Summary</h2>

          <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-primary">Pre Hospitalization Expense Amount</span>
              <span className="text-sm font-medium">{preHospAmount}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-primary">Hospitalization Expense Amount</span>
              <span className="text-sm font-medium">{hospAmount}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-primary">Total Bill</span>
              <span className="text-sm font-medium">{totalBill}</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-semibold text-primary">Net Total (Balance Claim)</span>
              <span className="text-sm font-semibold">{netTotal}</span>
            </div>
          </div>
        </div>

        {/* Declaration Checkbox */}
        <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <Checkbox
            checked={!!DeclarationChecked}
            onCheckedChange={(checked) => onChange({ ...postHospitalizationAndDeclaration, DeclarationChecked: checked === true })}
            id="final-declaration"
            className="mt-0.5"
          />
          <Label htmlFor="final-declaration" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
            I the undersigned hereby declare that the information given in this form is correct and complete to the best of my knowledge and belief.
          </Label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button onClick={onSubmit} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2" disabled={!DeclarationChecked}>
            Submit Claim
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostHospitalizationForm;
