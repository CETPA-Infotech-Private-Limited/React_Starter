import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import UploadDialog from '@/components/common/UploadDialog';
import { resetAdvanceTopUpClaimState, submitAdvanceTopUpClaim } from '@/features/user/claim/claimSlice';
import toast from 'react-hot-toast';

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

const RequestAdvanceTopUpForm = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.user);

  const [advanceId, setAdvanceId] = useState('');
  const [reviseEstimatedAmount, setReviseEstimatedAmount] = useState('');
  const [topRequiredAmount, setTopRequiredAmount] = useState('');
  const [payTo, setPayTo] = useState<'self' | 'hospital'>('self');
  const [isEmpanelled, setIsEmpanelled] = useState<'yes' | 'no'>('yes');
  const [hospitalId, setHospitalId] = useState('');
  const [fileComment, setFileComment] = useState('');
  const [estimateFiles, setEstimateFiles] = useState<File[]>([]);
  const { advanceTopSuccess, advanceTopError, advanceTopLoading } = useAppSelector((state: RootState) => state.claim);

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
    formData.append('AdvanceId', advanceId);
    formData.append('EmpId', user.EmpCode?.toString() || '');
    formData.append('ReviseEstimentedAmount', reviseEstimatedAmount);
    formData.append('TopRequiredAmount', topRequiredAmount);
    formData.append('IsHospitialEmpanpanelled', isEmpanelled === 'yes' ? 'true' : 'false');
    formData.append('HospitalId', hospitalId);

    formData.append('PayTo', payTo);
    if (payTo === 'hospital') {
      formData.append('BankName', bankDetails.bankName);
      formData.append('AccountNumber', bankDetails.accountNumber);
      formData.append('IfscCode', bankDetails.ifscCode);
      formData.append('BeneficiaryName', bankDetails.beneficiaryName);
      formData.append('BranchName', bankDetails.branchName);
      formData.append('HospitalGstNumber', bankDetails.gstNumber);
    }

    estimateFiles.forEach((file) => formData.append('ReviseEstimateFile.Files', file));
    formData.append('ReviseEstimateFile.FileComment', fileComment);

    dispatch(submitAdvanceTopUpClaim(formData)); // Replace with actual action
  };
  useEffect(() => {
    if (advanceTopSuccess) {
      toast.success('Top-Up submitted successfully!');
      dispatch(resetAdvanceTopUpClaimState());
      // optionally reset form
    }

    if (advanceTopError) {
      dispatch(resetAdvanceTopUpClaimState());
    }
  }, [advanceTopSuccess, advanceTopError]);

  return (
    <div className="bg-white text-xs p-8 rounded-2xl shadow-xl border border-blue-300 mt-10 font-sans">
      <h2 className="text-2xl font-extrabold mb-6 text-center text-primary tracking-tight drop-shadow font-sans">Advance Top-Up Request Form</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Advance ID" value={advanceId} onChange={(e) => setAdvanceId(e.target.value)} />
        <InputField label="Revised Estimated Amount" value={reviseEstimatedAmount} onChange={(e) => setReviseEstimatedAmount(e.target.value)} />
        <InputField label="Top-up Required Amount" value={topRequiredAmount} onChange={(e) => setTopRequiredAmount(e.target.value)} />

        <div className="flex flex-col gap-1">
          <Label className="text-blue-800 text-sm font-semibold">Upload Revised Estimate</Label>
          <UploadDialog title="Upload Revised Estimate" files={estimateFiles} onFilesChange={setEstimateFiles} />
        </div>

        {/* File comment */}
        <InputField label="File Comment" value={fileComment} onChange={(e) => setFileComment(e.target.value)} placeholder="Add comment for uploaded file" />

        {/* Pay To Section (spans two columns) */}
        <div className="md:col-span-2 mt-6 pt-4 border-t">
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
        </div>

        {payTo === 'hospital' && (
          <>
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
          </>
        )}

        <div className="md:col-span-2 text-right mt-6">
          <Button type="submit" className="..." disabled={advanceTopLoading}>
            {advanceTopLoading ? 'Submitting.....' : 'Submit Top-Up Request'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RequestAdvanceTopUpForm;
