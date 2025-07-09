import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import UploadDialog from '@/components/common/UploadDialog';
import ShadDatePicker from '@/components/common/ShadDatePicker';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState, AppDispatch } from '@/app/store';

import FamilyMemberSelect from '@/components/common/FamilyMemberSelect';
import { hospitalList } from '@/constant/static';
import { getMyClaims, resetAdvanceClaimState, submitAdvanceClaim } from '@/features/user/claim/claimSlice';

const InputField = ({
  label,
  value,
  onChange,
  placeholder = '',
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) => (
  <div className="flex flex-col gap-1">
    <Label className="text-blue-800 text-sm font-semibold">{label}</Label>
    <Input className="border border-blue-200 rounded-lg" value={value} onChange={onChange} placeholder={placeholder} />
  </div>
);

const RequestAdvanceForm = ({ setShowForm }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.user);
  const { advanceLoading, advanceSuccess, advanceError } = useAppSelector((state: RootState) => state.claim);
  const [selectedMemberId, setSelectedMemberId] = useState<string | undefined>();
  const [doctorName, setDoctorName] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalRegNo, setHospitalRegNo] = useState('');
  const [selectedHospitalId, setSelectedHospitalId] = useState('');
  const [treatmentType, setTreatmentType] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [estimateAmount, setEstimateAmount] = useState('');
  const [advanceAmount, setAdvanceAmount] = useState('');
  const [admissionDate, setAdmissionDate] = useState<Date | null>(null);
  const [isEmpanelled, setIsEmpanelled] = useState<'yes' | 'no'>('yes');
  const [payTo, setPayTo] = useState<'self' | 'hospital'>('self');
  const [admissionFiles, setAdmissionFiles] = useState<File[]>([]);
  const [estimateFiles, setEstimateFiles] = useState<File[]>([]);
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    beneficiaryName: '',
    branchName: '',
    gstNumber: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('EmpCode', parseInt(user.EmpCode));
    formData.append('UnitId', user.unitId.toString());
    formData.append('PatientId', Number(selectedMemberId || user.EmpCode));
    formData.append('RequestName', 'FirstAdvance');
    formData.append('AdvanceAmount', parseInt(advanceAmount || '0').toString());
    formData.append('EstimateAmount', parseInt(estimateAmount || '0').toString());
    formData.append('Reason', 'NA');
    formData.append('DoctorName', doctorName);

    if (payTo === 'self') {
      formData.append('PayTo', 'Self');
    } else {
      formData.append('PayTo', 'Hospital');
      formData.append('BankName', bankDetails.bankName);
      formData.append('BeneficiaryAccountNo', bankDetails.accountNumber);
      formData.append('IFSCCode', bankDetails.ifscCode);
      formData.append('BeneficiaryName', bankDetails.beneficiaryName);
      formData.append('BranchName', bankDetails.branchName);
      formData.append('HospitalGSTNumber', bankDetails.gstNumber);
    }

    if (admissionDate) {
      formData.append('LikelyDateofAddmison', admissionDate.toISOString());
    }

    formData.append('Digonosis', diagnosis);
    formData.append('TreatmentType', treatmentType);
    formData.append('IsHospitialEmpanpanelled', isEmpanelled === 'yes' ? 'true' : 'false');

    if (isEmpanelled === 'yes') {
      const selected = hospitalList.find((h) => h.id === selectedHospitalId);
      formData.append('HospitalId', selectedHospitalId);
      formData.append('HospitalName', selected?.name ?? '');
      formData.append('HospitalRegNo', hospitalRegNo || 'sample-reg-no');
    } else {
      formData.append('HospitalName', hospitalName);
      formData.append('HospitalRegNo', hospitalRegNo || '');
    }

    admissionFiles.forEach((file) => formData.append('AdmissionAdviceFile', file));
    estimateFiles.forEach((file) => formData.append('EstimateAmountFile', file));
    dispatch(submitAdvanceClaim(formData));
  };

  useEffect(() => {
    if (advanceSuccess) {
      // Reset form state after successful submission
      setSelectedMemberId(undefined);
      setDoctorName('');
      setHospitalName('');
      setHospitalRegNo('');
      setSelectedHospitalId('');
      setTreatmentType('');
      setDiagnosis('');
      setEstimateAmount('');
      setAdvanceAmount('');
      setAdmissionDate(null);
      setIsEmpanelled('yes');
      setPayTo('self');
      setAdmissionFiles([]);
      setEstimateFiles([]);
      setBankDetails({
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        beneficiaryName: '',
        branchName: '',
        gstNumber: '',
      });

      dispatch(resetAdvanceClaimState());
      setShowForm(false);
      if (user?.EmpCode) {
        dispatch(getMyClaims(Number(user.EmpCode)));
      }
    }

    if (advanceError) {
      dispatch(resetAdvanceClaimState());
    }
  }, [advanceSuccess, advanceError, dispatch]);

  return (
    <div className="bg-white text-xs p-8 rounded-2xl shadow-xl border border-blue-300 mt-10 font-sans">
      <h2 className="text-2xl font-extrabold mb-6 text-center text-primary tracking-tight drop-shadow font-sans">Advance Request Form</h2>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex flex-col gap-1">
            <Label className="text-blue-800 text-sm font-semibold">Select Member</Label>
            <FamilyMemberSelect value={selectedMemberId} onChange={setSelectedMemberId} />
          </div>
          <InputField label="Doctor's Name" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} />
          <div className="flex flex-col gap-1">
            <Label className="text-blue-800 text-sm font-semibold">Is Hospital Empanelled?</Label>
            <RadioGroup value={isEmpanelled} onValueChange={(val) => setIsEmpanelled(val as 'yes' | 'no')} className="flex gap-4 mt-2">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="yes" id="empanelled-yes" />
                <Label htmlFor="empanelled-yes">Yes</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="no" id="empanelled-no" />
                <Label htmlFor="empanelled-no">No</Label>
              </div>
            </RadioGroup>
          </div>
          {isEmpanelled === 'yes' ? (
            <div className="flex flex-col gap-1">
              <Label className="text-blue-800 text-sm font-semibold">Select Hospital</Label>
              <Select value={selectedHospitalId} onValueChange={setSelectedHospitalId}>
                <SelectTrigger className="w-full border border-blue-200 rounded-lg">
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
              <InputField label="Hospital Name" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} />
              <InputField label="Hospital Regd. No." value={hospitalRegNo} onChange={(e) => setHospitalRegNo(e.target.value)} />
            </>
          )}

          <div className="flex flex-col gap-1">
            <Label className="text-blue-800 text-sm font-semibold">Admission Date</Label>
            <ShadDatePicker selected={admissionDate} onChange={setAdmissionDate} placeholder="Admission Date" dateFormat="dd/MM/yyyy" />
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-blue-800 text-sm font-semibold">Treatment Type</Label>
            <Select value={treatmentType} onValueChange={setTreatmentType}>
              <SelectTrigger className="w-full border border-blue-200 rounded-lg">
                <SelectValue placeholder="Select treatment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="allopathic">Allopathic</SelectItem>
                <SelectItem value="ayurvedic">Ayurvedic</SelectItem>
                <SelectItem value="homeopathic">Homeopathic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <InputField label="Diagnosis" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />

          <div className="flex flex-col gap-1">
            <Label className="text-blue-800 text-sm font-semibold">Admission Advice</Label>
            <UploadDialog title="Upload Admission Advice" files={admissionFiles} onFilesChange={setAdmissionFiles} />
          </div>

          <InputField label="Estimate Amount" value={estimateAmount} onChange={(e) => setEstimateAmount(e.target.value)} />

          <div className="flex flex-col gap-1">
            <Label className="text-blue-800 text-sm font-semibold">Upload Estimate</Label>
            <UploadDialog title="Upload Estimate" files={estimateFiles} onFilesChange={setEstimateFiles} />
          </div>

          <InputField label="Advance Required" value={advanceAmount} onChange={(e) => setAdvanceAmount(e.target.value)} />
        </div>

        <div className="mt-8 pt-4 border-t">
          <h3 className="font-bold text-sm mb-4 text-blue-800">Pay To</h3>
          <RadioGroup value={payTo} onValueChange={(val) => setPayTo(val as 'self' | 'hospital')} className="flex gap-6">
            <div className="flex items-center gap-1">
              <RadioGroupItem value="self" id="payto-self" />
              <Label htmlFor="payto-self">{user.name} (Self)</Label>
            </div>
            <div className="flex items-center gap-1">
              <RadioGroupItem value="hospital" id="payto-hospital" />
              <Label htmlFor="payto-hospital">Hospital</Label>
            </div>
          </RadioGroup>

          {payTo === 'hospital' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <InputField label="Bank Name" value={bankDetails.bankName} onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })} />
              <InputField
                label="Account Number"
                value={bankDetails.accountNumber}
                onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
              />
              <InputField label="IFSC Code" value={bankDetails.ifscCode} onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })} />
              <InputField
                label="Beneficiary Name"
                value={bankDetails.beneficiaryName}
                onChange={(e) => setBankDetails({ ...bankDetails, beneficiaryName: e.target.value })}
              />
              <InputField label="Branch Name" value={bankDetails.branchName} onChange={(e) => setBankDetails({ ...bankDetails, branchName: e.target.value })} />
              <InputField
                label="Hospital GST Number"
                value={bankDetails.gstNumber}
                onChange={(e) => setBankDetails({ ...bankDetails, gstNumber: e.target.value })}
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex items-start gap-2 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <Checkbox id="declaration" />
          <Label htmlFor="declaration" className="text-xs leading-relaxed text-gray-800">
            I hereby declare that the information given in this form is correct and complete to the best of my knowledge.
          </Label>
        </div>

        <div className="mt-6 text-right">
          <Button type="submit" className="..." disabled={advanceLoading}>
            {advanceLoading ? 'Submitting...' : 'Submit Request'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RequestAdvanceForm;
