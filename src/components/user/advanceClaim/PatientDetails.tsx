import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import InputField from '@/components/common/InputField';
import { hospitalList } from '@/constant/static';
import FamilyMemberSelect from '@/components/common/FamilyMemberSelect';
import ShadDatePicker from '@/components/common/ShadDatePicker';
import UploadDialog from '@/components/common/UploadDialog';
import { ReadOnlyField } from '@/components/common/ReadOnlyField';
import { formatRupees } from '@/lib/helperFunction';

const PatientDetails = ({ patientDetailOnChange, defaultData }) => {
  const advance = defaultData?.advanceBasicDetails || {};
  const patientId = defaultData?.selectedAdvanceClaim?.patientId?.toString() || '';

  const initialState = {
    MemberId: patientId,
    AdvanceAmount: advance.advanceAmount ?? 0,
    ApprovedAmount: advance.advanceClaimApprovedAmount ?? 0,
    HospitalId: '',
    HospitalName: advance.hospitalName ?? '',
    HospitalRegNo: advance.hospitalRegNo ?? '',
    IsHospitialEmpanpanelled: false,
    DoctorName: advance.doctorName ?? '',
    DateOfAdmission: advance.dateOfAdmission !== '01/01/0001' ? advance.dateOfAdmission : '',
    DateofDischarge: advance.dateofDischarge !== '01/01/0001' ? advance.dateofDischarge : '',
    TreatmentType: advance.treatmentType ?? '',
    Digonosis: advance.digonosis ?? '',
    FinalHospitalBill: advance.finalHospitalBill ?? '',
    AdmissionAdviceUpload: [],
    DischargeSummaryUpload: [],
    FinalHospitalBillUpload: [],
    InvestigationReportsUpload: [],
  };

  const [patientDetail, setPatientDetail] = useState(initialState);

  const [admissionAdviceFiles, setAdmissionAdviceFiles] = useState<File[]>([]);
  const [dischargeSummaryFiles, setDischargeSummaryFiles] = useState<File[]>([]);
  const [finalHospitalBillFiles, setFinalHospitalBillFiles] = useState<File[]>([]);
  const [investigationReportsFiles, setInvestigationReportsFiles] = useState<File[]>([]);

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

  const handleChange = (updatedFields) => {
    const updated = { ...patientDetail, ...updatedFields };
    setPatientDetail(updated);
    patientDetailOnChange(updated);
  };

  // Utility to disable if data exists
  const isDisabled = (field) => {
    const val = advance?.[field];
    return val !== undefined && val !== null && val !== '' && val !== '01/01/0001';
  };

  return (
    <div className="w-full bg-white text-black text-xs p-6 rounded-2xl shadow-xl border border-blue-300 animate-fade-in-up font-sans">
      <h2 className="text-xl font-extrabold mb-6 text-center text-primary drop-shadow tracking-tight font-sans">Patient and Other Details</h2>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
          {/* Select Member */}
          <div className="flex flex-col gap-1.5 w-full">
            <Label className="text-blue-800 text-sm font-semibold">Select Member</Label>
            <FamilyMemberSelect value={patientDetail.MemberId} disabled onOpenChange={() => {}} />
          </div>

          <InputField label="Advance Request Amount" value={formatRupees(patientDetail.AdvanceAmount)} disabled onChange={() => {}} />

          <InputField label="Final Approve Amount" value={formatRupees(patientDetail.ApprovedAmount)} disabled onChange={() => {}} />

          {/* Is Hospital Empanelled */}
          <div className="flex flex-col gap-1.5 w-full">
            <Label className="text-blue-800 text-sm font-semibold">Is Hospital Empanelled?</Label>
            <RadioGroup
              value={patientDetail.IsHospitialEmpanpanelled ? 'yes' : 'no'}
              onValueChange={(val) => {
                const isEmpanelled = val === 'yes';
                handleChange({
                  IsHospitialEmpanpanelled: isEmpanelled,
                  ...(isEmpanelled ? { HospitalName: '', HospitalRegNo: '' } : { HospitalId: '' }),
                });
              }}
              className="flex gap-6 mt-1"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="yes" id="empanelled-yes" disabled={isDisabled('isHospitialEmpanpanelled')} />
                <Label htmlFor="empanelled-yes" className="text-xs text-gray-700">
                  Yes
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="no" id="empanelled-no" disabled={isDisabled('isHospitialEmpanpanelled')} />
                <Label htmlFor="empanelled-no" className="text-xs text-gray-700">
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Hospital Info */}
          {patientDetail.IsHospitialEmpanpanelled ? (
            <div className="flex flex-col gap-1.5 w-full">
              <Label className="text-blue-800 text-sm font-semibold">Select Hospital</Label>
              <Select value={patientDetail.HospitalId} onValueChange={(val) => handleChange({ HospitalId: val })} disabled={isDisabled('hospitalId')}>
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
                value={patientDetail.HospitalName}
                onChange={(e) => handleChange({ HospitalName: e.target.value })}
                placeholder="e.g., Apollo"
                disabled={isDisabled('hospitalName')}
              />
              <InputField
                label="Hospital Regd. No."
                value={patientDetail.HospitalRegNo}
                onChange={(e) => handleChange({ HospitalRegNo: e.target.value })}
                placeholder="L85110TN1979PLC006944"
                disabled={isDisabled('hospitalRegNo')}
              />
            </>
          )}

          {/* Doctor Name */}
          <InputField
            label="Doctor's Name"
            value={patientDetail.DoctorName}
            onChange={(e) => handleChange({ DoctorName: e.target.value })}
            placeholder="Dr. Mathur"
            disabled={isDisabled('doctorName')}
          />

          {/* Admission Date */}
          <div className="flex flex-col gap-1.5 w-full">
            <Label className="text-blue-800 text-sm font-semibold">Admission Date</Label>
            <ShadDatePicker
              selected={patientDetail.DateOfAdmission ? new Date(patientDetail.DateOfAdmission) : null}
              onChange={(date) => handleChange({ DateOfAdmission: date?.toISOString().split('T')[0] || '' })}
              placeholder="Select admission date"
              dateFormat="dd/MM/yyyy"
              disabled={isDisabled('dateOfAdmission')}
            />
          </div>

          {/* Treatment Type */}
          <div className="flex flex-col gap-1.5 w-full">
            <Label className="text-blue-800 text-sm font-semibold">Treatment Type</Label>
            <Select value={patientDetail.TreatmentType} onValueChange={(val) => handleChange({ TreatmentType: val })} disabled={isDisabled('treatmentType')}>
              <SelectTrigger className="border border-blue-200 rounded-lg px-3 py-2 shadow-sm text-xs font-sans">
                <SelectValue placeholder="Allopathic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="allopathic">Allopathic</SelectItem>
                <SelectItem value="ayurvedic">Ayurvedic</SelectItem>
                <SelectItem value="homeopathic">Homeopathic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Diagnosis */}
          <InputField
            label="Diagnosis"
            value={patientDetail.Digonosis}
            onChange={(e) => handleChange({ Digonosis: e.target.value })}
            placeholder="e.g., Appendicitis, Fracture"
            disabled={isDisabled('digonosis')}
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
              onChange={(date) => handleChange({ DateofDischarge: date?.toISOString().split('T')[0] || '' })}
              placeholder="Select discharge date"
              dateFormat="dd/MM/yyyy"
              disabled={isDisabled('dateofDischarge')}
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
                value={patientDetail.FinalHospitalBill}
                onChange={(e) => handleChange({ FinalHospitalBill: e.target.value })}
                className="border border-blue-200 rounded-lg px-3 py-2 flex-1 focus:ring-1 focus:ring-blue-400 shadow-sm text-xs"
                disabled={isDisabled('finalHospitalBill')}
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
