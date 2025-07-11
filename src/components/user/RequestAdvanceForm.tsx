import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// import { Button, Input, Label, RadioGroup, RadioGroupItem, Checkbox, Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/';

import UploadDialog from '@/components/common/UploadDialog';
import ShadDatePicker from '@/components/common/ShadDatePicker';
import FamilyMemberSelect from '@/components/common/FamilyMemberSelect';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { hospitalList } from '@/constant/static';
import { getMyClaims, resetAdvanceClaimState, submitAdvanceClaim } from '@/features/user/claim/claimSlice';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';

const formSchema = z
  .object({
    memberId: z.string().min(1, 'Select a family member'),
    doctorName: z.string().min(1, 'Doctor name is required'),
    hospitalEmpanelled: z.enum(['yes', 'no']),
    hospitalId: z.string().optional(),
    hospitalName: z.string().optional(),
    hospitalRegNo: z.string().optional(),
    admissionDate: z.date({ required_error: 'Admission date is required' }),
    treatmentType: z.string().min(1, 'Select treatment type'),
    diagnosis: z.string().min(1, 'Diagnosis is required'),
    reason: z.string().min(1, 'Reason is required'),
    estimateAmount: z.string().min(1, 'Estimate amount is required'),
    advanceAmount: z.string().min(1, 'Advance amount is required'),
    payTo: z.enum(['self', 'hospital']),
    agree: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the declaration' }),
    }),
    bankDetails: z.object({
      bankName: z.string().optional(),
      accountNumber: z.string().optional(),
      ifscCode: z.string().optional(),
      beneficiaryName: z.string().optional(),
      branchName: z.string().optional(),
      gstNumber: z.string().optional(),
    }),
  })
  .superRefine((data, ctx) => {
    if (data.hospitalEmpanelled === 'no') {
      if (!data.hospitalName?.trim()) {
        ctx.addIssue({
          path: ['hospitalName'],
          code: z.ZodIssueCode.custom,
          message: 'Hospital name is required',
        });
      }
      if (!data.hospitalRegNo?.trim()) {
        ctx.addIssue({
          path: ['hospitalRegNo'],
          code: z.ZodIssueCode.custom,
          message: 'Hospital registration number is required',
        });
      }
    }

    if (data.payTo === 'hospital') {
      const requiredFields = ['bankName', 'accountNumber', 'ifscCode', 'beneficiaryName', 'branchName', 'gstNumber'] as const;
      for (const field of requiredFields) {
        if (!data.bankDetails[field]?.trim()) {
          ctx.addIssue({
            path: ['bankDetails', field],
            code: z.ZodIssueCode.custom,
            message: `${field.replace(/([A-Z])/g, ' $1')} is required`,
          });
        }
      }
    }
  });

type FormValues = z.infer<typeof formSchema>;

export default function RequestAdvanceForm({ setShowForm }: { setShowForm: (v: boolean) => void }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.user);
  const { advanceLoading, advanceSuccess, advanceError } = useAppSelector((state: RootState) => state.claim);
  const [admissionFiles, setAdmissionFiles] = useState<File[]>([]);
  const [estimateFiles, setEstimateFiles] = useState<File[]>([]);
  const [admissionFileError, setAdmissionFileError] = useState('');
  const [estimateFileError, setEstimateFileError] = useState('');

  const {
    control,
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      memberId: '',
      doctorName: '',
      hospitalEmpanelled: 'yes',
      hospitalId: '',
      hospitalName: '',
      hospitalRegNo: '',
      admissionDate: undefined,
      treatmentType: '',
      reason: '',
      diagnosis: '',
      estimateAmount: '',
      advanceAmount: '',
      payTo: 'self',
      agree: false,
      bankDetails: {
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        beneficiaryName: '',
        branchName: '',
        gstNumber: '',
      },
    },
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const hospitalEmpanelled = watch('hospitalEmpanelled');
  const payTo = watch('payTo');

  const onSubmit = (data: FormValues) => {
    let hasError = false;

    if (admissionFiles.length === 0) {
      setAdmissionFileError('Admission advice file is required.');
      hasError = true;
    } else {
      setAdmissionFileError('');
    }

    if (estimateFiles.length === 0) {
      setEstimateFileError('Estimate file is required.');
      hasError = true;
    } else {
      setEstimateFileError('');
    }

    if (hasError) return;

    const formData = new FormData();
    formData.append('EmpCode', String(user.EmpCode));
    formData.append('UnitId', String(user.unitId));
    formData.append('PatientId', data.memberId);
    formData.append('RequestName', 'FirstAdvance');
    formData.append('DoctorName', data.doctorName);
    formData.append('Reason', data.reason);
    formData.append('AdvanceAmount', data.advanceAmount);
    formData.append('EstimateAmount', data.estimateAmount);
    formData.append('LikelyDateofAddmison', data.admissionDate.toISOString());
    formData.append('Digonosis', data.diagnosis);
    formData.append('TreatmentType', data.treatmentType);
    formData.append('IsHospitialEmpanpanelled', data.hospitalEmpanelled === 'yes' ? 'true' : 'false');
    formData.append('PayTo', data.payTo === 'self' ? 'Self' : 'Hospital');

    if (hospitalEmpanelled === 'yes') {
      const selected = hospitalList.find((h) => h.id === data.hospitalId);
      formData.append('HospitalId', data.hospitalId || '');
      formData.append('HospitalName', selected?.name || '');
      formData.append('HospitalRegNo', selected?.regNo || 'FWASSA6666sds');
    } else {
      formData.append('HospitalName', data.hospitalName || '');
      formData.append('HospitalRegNo', data.hospitalRegNo || '');
    }

    if (data.payTo === 'hospital') {
      const b = data.bankDetails;
      formData.append('BankName', b.bankName || '');
      formData.append('BeneficiaryAccountNo', b.accountNumber || '');
      formData.append('IFSCCode', b.ifscCode || '');
      formData.append('BeneficiaryName', b.beneficiaryName || '');
      formData.append('BranchName', b.branchName || '');
      formData.append('HospitalGSTNumber', b.gstNumber || '');
    }

    admissionFiles.forEach((file) => formData.append('AdmissionAdviceFile', file));
    estimateFiles.forEach((file) => formData.append('EstimateAmountFile', file));

    dispatch(submitAdvanceClaim(formData));
  };

  useEffect(() => {
    if (advanceSuccess) {
      reset();
      setAdmissionFiles([]);
      setEstimateFiles([]);
      setAdmissionFileError('');
      setEstimateFileError('');
      dispatch(resetAdvanceClaimState());
      setShowForm(false);
      dispatch(getMyClaims(Number(user.EmpCode)));
    }

    if (advanceError) {
      dispatch(resetAdvanceClaimState());
    }
  }, [advanceSuccess, advanceError]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg border text-xs shadow">
      <h2 className="text-lg font-bold text-center text-blue-900 mb-4">Advance Request Form</h2>

      {/* Family Member, Doctor Name, Empanelled */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div>
          <Label>Select Member *</Label>
          <Controller name="memberId" control={control} render={({ field }) => <FamilyMemberSelect value={field.value} onChange={field.onChange} />} />
          {errors.memberId && <p className="text-red-500 text-xs">{errors.memberId.message}</p>}
        </div>

        <div>
          <Label>Doctor Name *</Label>
          <Input {...register('doctorName')} />
          {errors.doctorName && <p className="text-red-500 text-xs">{errors.doctorName.message}</p>}
        </div>

        <div>
          <Label>Is Hospital Empanelled? *</Label>
          <Controller
            name="hospitalEmpanelled"
            control={control}
            render={({ field }) => (
              <RadioGroup value={field.value} onValueChange={field.onChange} className="flex gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="yes" id="empanelled-yes" />
                  <Label htmlFor="empanelled-yes">Yes</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="no" id="empanelled-no" />
                  <Label htmlFor="empanelled-no">No</Label>
                </div>
              </RadioGroup>
            )}
          />
        </div>

        {/* Hospital Fields */}
        {hospitalEmpanelled === 'yes' ? (
          <div>
            <Label>Select Hospital</Label>
            <Controller
              name="hospitalId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="border border-blue-200 rounded-lg">
                    <SelectValue placeholder="Choose hospital" />
                  </SelectTrigger>
                  <SelectContent>
                    {hospitalList.map((h) => (
                      <SelectItem key={h.id} value={h.id}>
                        {h.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        ) : (
          <>
            <div>
              <Label>Hospital Name *</Label>
              <Input {...register('hospitalName')} />
              {errors.hospitalName && <p className="text-red-500 text-xs">{errors.hospitalName.message}</p>}
            </div>
            <div>
              <Label>Hospital Reg. No. *</Label>
              <Input {...register('hospitalRegNo')} />
              {errors.hospitalRegNo && <p className="text-red-500 text-xs">{errors.hospitalRegNo.message}</p>}
            </div>
          </>
        )}

        <div>
          <Label>Admission Date *</Label>
          <Controller name="admissionDate" control={control} render={({ field }) => <ShadDatePicker selected={field.value} onChange={field.onChange} />} />
          {errors.admissionDate && <p className="text-red-500 text-xs">{errors.admissionDate.message}</p>}
        </div>

        <div>
          <Label>Treatment Type *</Label>
          <Controller
            name="treatmentType"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="border border-blue-200 rounded-lg">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="allopathic">Allopathic</SelectItem>
                  <SelectItem value="ayurvedic">Ayurvedic</SelectItem>
                  <SelectItem value="homeopathic">Homeopathic</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.treatmentType && <p className="text-red-500 text-xs">{errors.treatmentType.message}</p>}
        </div>

        <div>
          <Label>Diagnosis *</Label>
          <Input {...register('diagnosis')} />
          {errors.diagnosis && <p className="text-red-500 text-xs">{errors.diagnosis.message}</p>}
        </div>
        <div>
          <Label>Reason *</Label>
          <Input {...register('reason')} />
          {errors.reason && <p className="text-red-500 text-xs">{errors.reason.message}</p>}
        </div>

        <div>
          <Label>Estimate Amount *</Label>
          <Input type="number" {...register('estimateAmount')} />
          {errors.estimateAmount && <p className="text-red-500 text-xs">{errors.estimateAmount.message}</p>}
        </div>

        <div>
          <Label>Upload Estimate File *</Label>
          <UploadDialog
            title="Upload Estimate"
            files={estimateFiles}
            onFilesChange={(files) => {
              setEstimateFiles(files);
              if (files.length > 0) setEstimateFileError('');
            }}
          />
          {estimateFileError && <p className="text-red-500 text-xs">{estimateFileError}</p>}
        </div>

        <div>
          <Label>Advance Amount *</Label>
          <Input type="number" {...register('advanceAmount')} />
          {errors.advanceAmount && <p className="text-red-500 text-xs">{errors.advanceAmount.message}</p>}
        </div>

        <div>
          <Label>Upload Admission Advice *</Label>
          <UploadDialog
            title="Upload Admission Advice"
            files={admissionFiles}
            onFilesChange={(files) => {
              setAdmissionFiles(files);
              if (files.length > 0) setAdmissionFileError('');
            }}
          />
          {admissionFileError && <p className="text-red-500 text-xs">{admissionFileError}</p>}
        </div>
      </div>

      {/* Pay To Section */}
      <div className="pt-6 border-t">
        <Label>Pay To</Label>
        <Controller
          name="payTo"
          control={control}
          render={({ field }) => (
            <RadioGroup value={field.value} onValueChange={field.onChange} className="flex gap-4 mt-2">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="self" id="payto-self" />
                <Label htmlFor="payto-self">Self</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="hospital" id="payto-hospital" />
                <Label htmlFor="payto-hospital">Hospital</Label>
              </div>
            </RadioGroup>
          )}
        />
      </div>
      {payTo === 'hospital' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <Label> Bank *</Label>
            <Input type="text" {...register('bankDetails.bankName')} />
            {errors.bankName && <p className="text-red-500 text-xs">{errors.bankName.message}</p>}
          </div>
          {['bankName', 'accountNumber', 'ifscCode', 'beneficiaryName', 'branchName', 'gstNumber'].map((key) => (
            <Controller
              key={key}
              name={`bankDetails.${key}` as const}
              control={control}
              render={({ field }) => {
                const labelText = key
                  .replace(/([A-Z])/g, ' $1') // insert space before capital
                  .replace(/\b\w/g, (l) => l.toUpperCase()); // capitalize each word

                return (
                  <div>
                    <Label>{labelText} *</Label>
                    <Input {...field} />
                    {errors.bankDetails?.[key] && <p className="text-red-500 text-xs">{errors.bankDetails[key]?.message}</p>}
                  </div>
                );
              }}
            />
          ))}
        </div>
      )}

      <div className="flex items-start gap-2 mt-4">
        <Controller name="agree" control={control} render={({ field }) => <Checkbox id="agree" checked={field.value} onCheckedChange={field.onChange} />} />
        <Label htmlFor="agree" className="text-xs">
          I hereby declare that the information provided is true and correct.
        </Label>
      </div>
      {errors.agree && <p className="text-red-500 text-xs">{errors.agree.message}</p>}

      <div className="text-right mt-6">
        <Button type="submit" disabled={advanceLoading}>
          {advanceLoading ? 'Submitting...' : 'Submit Request'}
        </Button>
      </div>
    </form>
  );
}
