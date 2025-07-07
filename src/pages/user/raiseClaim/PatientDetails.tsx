'use client';

import React, { useState } from 'react';
import { UploadCloud, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { hospitalList } from '@/constant/static';
import FamilyMemberSelect from '@/components/common/FamilyMemberSelect';

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
        <Button className="w-full text-xs flex items-center justify-between bg-gradient-to-r from-blue-200 to-blue-300 border border-blue-500 text-blue-900 font-semibold shadow-md hover:scale-105 transition-transform duration-300 ease-in-out px-3 py-1.5 rounded-md font-sans">
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

const PatientDetails = ({ patientDetail, patientDetailOnChange }) => {
  const [admissionAdviceFiles, setAdmissionAdviceFiles] = useState<File[]>(patientDetail.AdmissionAdviceUpload || []);
  const [dischargeSummaryFiles, setDischargeSummaryFiles] = useState<File[]>(patientDetail.DischargeSummaryUpload || []);
  const [finalHospitalBillFiles, setFinalHospitalBillFiles] = useState<File[]>(patientDetail.FinalHospitalBillUpload || []);
  const [investigationReportsFiles, setInvestigationReportsFiles] = useState<File[]>(patientDetail.InvestigationReportsUpload || []);

  // Propagate file changes up to parent
  React.useEffect(() => {
    patientDetailOnChange({
      ...patientDetail,
      AdmissionAdviceUpload: admissionAdviceFiles,
      DischargeSummaryUpload: dischargeSummaryFiles,
      FinalHospitalBillUpload: finalHospitalBillFiles,
      InvestigationReportsUpload: investigationReportsFiles,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admissionAdviceFiles, dischargeSummaryFiles, finalHospitalBillFiles, investigationReportsFiles]);

  return (
    <div className="w-full bg-white text-black text-xs p-6 rounded-2xl shadow-xl border border-blue-300 animate-fade-in-up font-sans">
      <h2 className="text-xl font-extrabold mb-6 text-center text-primary drop-shadow tracking-tight font-sans">Patient and Other Details</h2>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-3">
            <Label htmlFor="member-select" className="sm:w-32 font-semibold text-blue-800 flex-shrink-0 text-sm font-sans">
              Select Member
            </Label>
            <FamilyMemberSelect onOpenChange={() => patientDetailOnChange({ ...patientDetail, member: 'selected' })}/>
          </div>

          {/* Hospital Empanelled radio button and conditional fields */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-3 w-full">
            <Label className="sm:w-32 font-semibold text-blue-800 flex-shrink-0 text-sm font-sans">Is Hospital Empanelled?</Label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1 text-xs font-sans">
                <input
                  type="radio"
                  name="is-empanelled"
                  value="yes"
                  checked={patientDetail.IsHospitialEmpanpanelled === true}
                  onChange={() => patientDetailOnChange({ ...patientDetail, IsHospitialEmpanpanelled: true, HospitalName: '', HospitalRegNo: '' })}
                  className="accent-blue-600"
                />
                Yes
              </label>
              <label className="flex items-center gap-1 text-xs font-sans">
                <input
                  type="radio"
                  name="is-empanelled"
                  value="no"
                  checked={patientDetail.IsHospitialEmpanpanelled === false}
                  onChange={() => patientDetailOnChange({ ...patientDetail, IsHospitialEmpanpanelled: false, HospitalId: '' })}
                  className="accent-blue-600"
                />
                No
              </label>
            </div>
          </div>

          {/* If empanelled, show select. If not, show hospital name and regd. no. */}
          {patientDetail.IsHospitialEmpanpanelled === true && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-3 w-full">
              <Label htmlFor="empanelled-hospital" className="sm:w-32 font-semibold text-blue-800 flex-shrink-0 text-sm font-sans">
                Select Hospital
              </Label>
              <Select
                onValueChange={(value) => patientDetailOnChange({ ...patientDetail, HospitalId: value, HospitalRegNo: '' })}
                value={patientDetail.HospitalId || ''}
              >
                <SelectTrigger
                  id="empanelled-hospital"
                  className="border border-blue-200 rounded-lg px-3 py-2 w-full shadow-sm focus:ring-1 focus:ring-blue-400 text-xs font-sans"
                >
                  <SelectValue placeholder="Choose hospital" />
                </SelectTrigger>

                <SelectContent>
                  {hospitalList.map((hospital) => (
                    <SelectItem key={hospital.id} value={hospital.id}>
                      {hospital.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {patientDetail.IsHospitialEmpanpanelled === false && (
            <>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-3">
                <Label htmlFor="hospital-name" className="sm:w-32 font-semibold text-blue-800 flex-shrink-0 text-sm font-sans">
                  Hospital Name
                </Label>
                <Input
                  id="hospital-name"
                  type="text"
                  onChange={(e) => patientDetailOnChange({ ...patientDetail, HospitalName: e.target.value, HospitalId: '' })}
                  placeholder="eg: Apollo"
                  className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 flex-1 text-gray-700 focus:ring-1 focus:ring-blue focus:placeholder-transparent text-xs font-sans"
                  value={patientDetail.HospitalName || ''}
                />
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-3">
                <Label htmlFor="hospital-regd-no" className="sm:w-32 font-semibold text-blue-800 flex-shrink-0 text-sm font-sans">
                  Hospital Regd. No.
                </Label>
                <Input
                  id="hospital-regd-no"
                  type="text"
                  onChange={(e) => patientDetailOnChange({ ...patientDetail, HospitalRegNo: e.target.value })}
                  placeholder="L85110TN1979PLC006944"
                  className="border border-blue-200 rounded-lg px-3 py-2 flex-1 focus:ring-1 focus:placeholder-transparent focus:ring-blue-400 shadow-sm text-xs font-sans"
                  value={patientDetail.HospitalRegNo || ''}
                />
              </div>
            </>
          )}

          {/* Hospital Regd. No. is now conditionally rendered above */}

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-3">
            <Label htmlFor="doctor-name" className="sm:w-32 font-semibold text-blue-800 flex-shrink-0 text-sm font-sans">
              Doctor's Name
            </Label>
            <Input
              id="doctor-name"
              onChange={(e) => patientDetailOnChange({ ...patientDetail, DoctorName: e.target.value })}
              type="text"
              placeholder="Dr. Mathur"
              className="border border-blue-200 rounded-lg px-3 py-2 flex-1 focus:ring-1 focus:placeholder-transparent focus:ring-blue-400 shadow-sm text-xs font-sans"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-3">
            <Label htmlFor="admission-date" className="sm:w-32 font-semibold text-blue-800 flex-shrink-0 text-sm font-sans">
              Actual Date of Admission
            </Label>
            <Input
              id="admission-date"
              type="date"
              onChange={(e) => patientDetailOnChange({ ...patientDetail, DateOfAdmission: e.target.value })}
              className="border border-blue-200 rounded-lg px-3 focus:placeholder-transparent py-2 flex-1 focus:ring-1 focus:ring-blue-400 shadow-sm text-xs font-sans"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-3">
            <Label htmlFor="treatment-type" className="sm:w-32 font-semibold text-blue-800 flex-shrink-0 focus:placeholder-transparent text-sm font-sans">
              Treatment Type
            </Label>
            <Select onValueChange={(value) => patientDetailOnChange({ ...patientDetail, TreatmentType: value })} value={patientDetail.TreatmentType || ''}>
              <SelectTrigger
                id="treatment-type"
                className="border border-blue-200 rounded-lg px-3 py-2 flex-1 shadow-sm focus:ring-1 focus:ring-blue-400 text-xs font-sans"
              >
                <SelectValue placeholder="Allopathic" />
              </SelectTrigger>
              <SelectContent className="rounded-lg shadow-md border border-blue-200 bg-white text-xs font-sans">
                <SelectItem value="allopathic">Allopathic</SelectItem>
                <SelectItem value="ayurvedic">Ayurvedic</SelectItem>
                <SelectItem value="homeopathic">Homeopathic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-3">
            <Label htmlFor="diagnosis" className="sm:w-32 font-semibold text-blue-800 flex-shrink-0 text-sm font-sans">
              Diagnosis
            </Label>
            <Input
              id="diagnosis"
              type="text"
              placeholder="e.g., Appendicitis, Fever, Fracture"
              value={patientDetail.Digonosis || ''}
              onChange={(e) => patientDetailOnChange({ ...patientDetail, Digonosis: e.target.value })}
              className="border border-blue-200 rounded-lg px-3 py-2 flex-1 focus:ring-1 focus:placeholder-transparent focus:ring-blue-400 shadow-sm text-xs font-sans"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-3">
            <Label className="sm:w-32 font-semibold text-blue-800 flex-shrink-0 text-sm font-sans">Admission Advice</Label>
            <UploadDialog title="Upload Advice" files={admissionAdviceFiles} onFilesChange={setAdmissionAdviceFiles} />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-3">
            <Label htmlFor="discharge-date" className="sm:w-32 font-semibold text-blue-800 flex-shrink-0 text-sm font-sans">
              Date of Discharge
            </Label>
            <Input
              id="discharge-date"
              type="date"
              onChange={(e) => patientDetailOnChange({ ...patientDetail, DateofDischarge: e.target.value })}
              value={patientDetail.DateofDischarge || ''}
              className="border border-blue-200 rounded-lg focus:placeholder-transparent px-3 py-2 flex-1 focus:ring-1 focus:ring-blue-400 shadow-sm text-xs font-sans"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-3">
            <Label className="sm:w-32 font-semibold text-blue-800 flex-shrink-0 text-sm font-sans">Discharge Summary</Label>
            <UploadDialog title="Upload Summary" files={dischargeSummaryFiles} onFilesChange={setDischargeSummaryFiles} />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-3">
            <Label htmlFor="final-bill" className="sm:w-32 font-semibold text-blue-800 flex-shrink-0 text-sm font-sans">
              Final Hospital Bill
            </Label>
            <Input
              id="final-bill"
              type="number"
              placeholder="0.00"
              onChange={(e) => patientDetailOnChange({ ...patientDetail, FinalHospitalBill: e.target.value })}
              className="border border-blue-200 rounded-lg px-3 py-2 flex-1 focus:ring-1 focus:placeholder-transparent focus:ring-blue-400 shadow-sm text-xs font-sans"
            />
            <UploadDialog title="Upload file" files={finalHospitalBillFiles} onFilesChange={setFinalHospitalBillFiles} />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-3">
            <Label className="sm:w-32 font-semibold text-blue-800 flex-shrink-0 text-sm font-sans">Investigation Reports</Label>
            <UploadDialog title="Upload Reports" files={investigationReportsFiles} onFilesChange={setInvestigationReportsFiles} />
          </div>
        </div>
        <p className="text-xxs text-blue-700 mt-4 italic bg-blue-50 p-3 rounded-lg border border-blue-200 shadow-sm font-sans">
          <span className="font-bold">* Note:</span> For parents, the maximum advance limit is 80% of the Hospital's Estimate Amount.
        </p>
      </form>
    </div>
  );
};

export default PatientDetails;
