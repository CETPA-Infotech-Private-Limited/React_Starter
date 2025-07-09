import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import InputField from '@/components/common/InputField';

import { hospitalList } from '@/constant/static';
import FamilyMemberSelect from '@/components/common/FamilyMemberSelect';
import ShadDatePicker from '@/components/common/ShadDatePicker';
import UploadDialog from '@/components/common/UploadDialog';

const PatientDetails = ({ patientDetail, patientDetailOnChange }) => {
  const [admissionAdviceFiles, setAdmissionAdviceFiles] = useState<File[]>(patientDetail.AdmissionAdviceUpload || []);
  const [dischargeSummaryFiles, setDischargeSummaryFiles] = useState<File[]>(patientDetail.DischargeSummaryUpload || []);
  const [finalHospitalBillFiles, setFinalHospitalBillFiles] = useState<File[]>(patientDetail.FinalHospitalBillUpload || []);
  const [investigationReportsFiles, setInvestigationReportsFiles] = useState<File[]>(patientDetail.InvestigationReportsUpload || []);

  useEffect(() => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
          {/* Select Member */}
          <div className="flex flex-col gap-1.5 w-full">
            <Label className="text-blue-800 text-sm font-semibold">Select Member</Label>
            <FamilyMemberSelect onOpenChange={() => patientDetailOnChange({ ...patientDetail, member: 'selected' })} />
          </div>

          {/* Hospital Empanelled */}
          <div className="flex flex-col gap-1.5 w-full">
            <Label className="text-blue-800 text-sm font-semibold">Is Hospital Empanelled?</Label>
            <RadioGroup
              value={patientDetail.IsHospitialEmpanpanelled === true ? 'yes' : 'no'}
              onValueChange={(val) => {
                const isEmpanelled = val === 'yes';
                patientDetailOnChange({
                  ...patientDetail,
                  IsHospitialEmpanpanelled: isEmpanelled,
                  ...(isEmpanelled ? { HospitalName: '', HospitalRegNo: '' } : { HospitalId: '' }),
                });
              }}
              className="flex gap-6 mt-1"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="yes" id="empanelled-yes" />
                <Label htmlFor="empanelled-yes" className="text-xs text-gray-700">
                  Yes
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="no" id="empanelled-no" />
                <Label htmlFor="empanelled-no" className="text-xs text-gray-700">
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Hospital Name / Reg No. / Select */}
          {patientDetail.IsHospitialEmpanpanelled === true ? (
            <div className="flex flex-col gap-1.5 w-full">
              <Label className="text-blue-800 text-sm font-semibold">Select Hospital</Label>
              <Select
                onValueChange={(value) => patientDetailOnChange({ ...patientDetail, HospitalId: value, HospitalRegNo: '' })}
                value={patientDetail.HospitalId || ''}
              >
                <SelectTrigger className="border border-blue-200 rounded-lg px-3 py-2 shadow-sm text-xs font-sans">
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
          ) : (
            <>
              <InputField
                label="Hospital Name"
                value={patientDetail.HospitalName || ''}
                onChange={(e) => patientDetailOnChange({ ...patientDetail, HospitalName: e.target.value, HospitalId: '' })}
                placeholder="e.g., Apollo"
              />
              <InputField
                label="Hospital Regd. No."
                value={patientDetail.HospitalRegNo || ''}
                onChange={(e) => patientDetailOnChange({ ...patientDetail, HospitalRegNo: e.target.value })}
                placeholder="L85110TN1979PLC006944"
              />
            </>
          )}

          {/* Doctor Name */}
          <InputField
            label="Doctor's Name"
            value={patientDetail.DoctorName || ''}
            onChange={(e) => patientDetailOnChange({ ...patientDetail, DoctorName: e.target.value })}
            placeholder="Dr. Mathur"
          />

          {/* Admission Date */}
          <div className="flex flex-col gap-1.5 w-full">
            <Label className="text-blue-800 text-sm font-semibold">Admission Date</Label>
            <ShadDatePicker
              selected={patientDetail.DateOfAdmission ? new Date(patientDetail.DateOfAdmission) : null}
              onChange={(date) => patientDetailOnChange({ ...patientDetail, DateOfAdmission: date?.toISOString().split('T')[0] })}
              placeholder="Select admission date"
              dateFormat="dd/MM/yyyy"
            />
          </div>

          {/* Treatment Type */}
          <div className="flex flex-col gap-1.5 w-full">
            <Label className="text-blue-800 text-sm font-semibold">Treatment Type</Label>
            <Select value={patientDetail.TreatmentType || ''} onValueChange={(val) => patientDetailOnChange({ ...patientDetail, TreatmentType: val })}>
              <SelectTrigger className="border border-blue-200 rounded-lg px-3 py-2 shadow-sm text-xs font-sans">
                <SelectValue placeholder="Allopathic" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border border-blue-200 bg-white text-xs">
                <SelectItem value="allopathic">Allopathic</SelectItem>
                <SelectItem value="ayurvedic">Ayurvedic</SelectItem>
                <SelectItem value="homeopathic">Homeopathic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Diagnosis */}
          <InputField
            label="Diagnosis"
            value={patientDetail.Digonosis || ''}
            onChange={(e) => patientDetailOnChange({ ...patientDetail, Digonosis: e.target.value })}
            placeholder="e.g., Appendicitis, Fracture"
          />

          {/* Admission Advice Upload */}
          <div className="flex flex-col gap-1.5 w-full">
            <Label className="text-blue-800 text-sm font-semibold">Admission Advice</Label>
            <UploadDialog title="Upload Advice" files={admissionAdviceFiles} onFilesChange={setAdmissionAdviceFiles} />
          </div>

          {/* Discharge Date */}
          <div className="flex flex-col gap-1.5 w-full">
            <Label className="text-blue-800 text-sm font-semibold">Date of Discharge</Label>
            <ShadDatePicker
              selected={patientDetail.DateofDischarge ? new Date(patientDetail.DateofDischarge) : null}
              onChange={(date) => patientDetailOnChange({ ...patientDetail, DateofDischarge: date?.toISOString().split('T')[0] })}
              placeholder="Select discharge date"
              dateFormat="dd/MM/yyyy"
            />
          </div>

          {/* Discharge Summary Upload */}
          <div className="flex flex-col gap-1.5 w-full">
            <Label className="text-blue-800 text-sm font-semibold">Discharge Summary</Label>
            <UploadDialog title="Upload Summary" files={dischargeSummaryFiles} onFilesChange={setDischargeSummaryFiles} />
          </div>

          {/* Final Hospital Bill + Upload */}
          <div className="flex flex-col gap-1.5 w-full">
            <Label className="text-blue-800 text-sm font-semibold">Final Hospital Bill</Label>
            <div className="flex gap-2 items-center">
              <Input
                id="final-bill"
                type="number"
                placeholder="0.00"
                value={patientDetail.FinalHospitalBill || ''}
                onChange={(e) => patientDetailOnChange({ ...patientDetail, FinalHospitalBill: e.target.value })}
                className="border border-blue-200 rounded-lg px-3 py-2 flex-1 focus:ring-1 focus:ring-blue-400 shadow-sm text-xs"
              />
              <UploadDialog title="Upload Bill" files={finalHospitalBillFiles} onFilesChange={setFinalHospitalBillFiles} />
            </div>
          </div>

          {/* Investigation Reports */}
          <div className="flex flex-col gap-1.5 w-full">
            <Label className="text-blue-800 text-sm font-semibold">Investigation Reports</Label>
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
