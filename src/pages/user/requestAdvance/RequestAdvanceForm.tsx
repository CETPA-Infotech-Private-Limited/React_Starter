'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import UploadDialog from '@/components/common/UploadDialog';
import ShadDatePicker from '@/components/common/ShadDatePicker';
import { useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';

const RequestAdvanceForm = () => {
  const [isEmpanelled, setIsEmpanelled] = useState<'yes' | 'no'>('yes');
  const [admissionDate, setAdmissionDate] = useState<Date | null>(null);
  const [admissionFiles, setAdmissionFiles] = useState<File[]>([]);
  const [estimateFiles, setEstimateFiles] = useState<File[]>([]);
  const user = useAppSelector((state: RootState) => state.user);
  console.log('user', user);

  return (
    <div className="bg-white text-xs p-8 rounded-2xl shadow-xl border border-blue-300  mt-10 font-sans animate-fade-in-up">
      <h2 className="text-2xl font-extrabold mb-6 text-center text-primary tracking-tight drop-shadow font-sans">Advance Request Form</h2>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Select Member */}
          <div className="flex flex-col gap-1">
            <Label className="text-blue-800 text-sm font-semibold">Select Member</Label>
            <Input placeholder="e.g. Anil Sharma (Self)" className="border border-blue-200 rounded-lg" />
          </div>

          {/* Doctor / Hospital Name */}
          <div className="flex flex-col gap-1">
            <Label className="text-blue-800 text-sm font-semibold">{isEmpanelled === 'yes' ? "Doctor's Name" : 'Hospital Name'}</Label>
            <Input placeholder={isEmpanelled === 'yes' ? 'Dr. Mathur' : 'Apollo Hospital'} className="border border-blue-200 rounded-lg" />
          </div>

          {/* Empanelled Radio */}
          <div className="flex flex-col gap-1">
            <Label className="text-blue-800 text-sm font-semibold">Is Hospital Empanelled?</Label>

            <RadioGroup value={isEmpanelled} onValueChange={(val) => setIsEmpanelled(val as 'yes' | 'no')} className="flex gap-4 mt-4">
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

          {/* Hospital Details */}
          {isEmpanelled === 'yes' ? (
            <div className="flex flex-col gap-1">
              <Label className="text-blue-800 text-sm font-semibold">Select Hospital</Label>
              <Select>
                <SelectTrigger className="w-full border border-blue-200 rounded-lg">
                  <SelectValue placeholder="Choose hospital" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aiims">AIIMS</SelectItem>
                  <SelectItem value="fortis">Fortis</SelectItem>
                  <SelectItem value="max">Max Healthcare</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <Label className="text-blue-800 text-sm font-semibold">Hospital Regd. No.</Label>
              <Input placeholder="L85110TN1979PLC006944" className="border border-blue-200 rounded-lg" />
            </div>
          )}

          {/* Admission Date */}
          <div className="flex flex-col gap-1">
            <Label className="text-blue-800 text-sm font-semibold">Admission Date</Label>
            <ShadDatePicker selected={admissionDate} onChange={(date) => setAdmissionDate(date)} placeholder="Admission Date" dateFormat="dd/MM/yyyy" />
          </div>

          {/* Treatment Type */}
          <div className="flex flex-col gap-1">
            <Label className="text-blue-800 text-sm font-semibold">Treatment Type</Label>
            <Select>
              <SelectTrigger className="w-full border border-blue-200 rounded-lg">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="allopathic">Allopathic</SelectItem>
                <SelectItem value="ayurvedic">Ayurvedic</SelectItem>
                <SelectItem value="homeopathic">Homeopathic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Diagnosis */}
          <div className="flex flex-col gap-1">
            <Label className="text-blue-800 text-sm font-semibold">Diagnosis</Label>
            <Input placeholder="e.g., Appendicitis" className="border border-blue-200 rounded-lg" />
          </div>

          {/* Admission Advice Upload */}
          <div className="flex flex-col gap-1">
            <Label className="text-blue-800 text-sm font-semibold">Admission Advice</Label>
            <UploadDialog title="Upload Admission Advice" files={admissionFiles} onFilesChange={setAdmissionFiles} />
          </div>

          {/* Estimate Amount */}
          <div className="flex flex-col gap-1">
            <Label className="text-blue-800 text-sm font-semibold">Estimate Amount</Label>
            <Input placeholder="₹ 00.00" className="border border-blue-200 rounded-lg" />
          </div>

          {/* Estimate Upload */}
          <div className="flex flex-col gap-1">
            <Label className="text-blue-800 text-sm font-semibold">Upload Estimate</Label>
            <UploadDialog title="Upload Estimate" files={estimateFiles} onFilesChange={setEstimateFiles} />
          </div>

          {/* Advance Required */}
          <div className="flex flex-col gap-1">
            <Label className="text-blue-800 text-sm font-semibold">Advance Required</Label>
            <Input placeholder="₹ 00.00" className="border border-blue-200 rounded-lg" />
          </div>
        </div>

        {/* Pay To */}
        <div className="mt-8 pt-4 border-t">
          <h3 className="font-bold text-sm mb-4 text-blue-800">Pay To</h3>
          <RadioGroup defaultValue="self" className="flex gap-6">
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

        {/* Declaration */}
        <div className="mt-6 flex items-start gap-2 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <Checkbox id="declaration" />
          <Label htmlFor="declaration" className="text-xs leading-relaxed text-gray-800">
            I hereby declare that the information given in this form is correct and complete to the best of my knowledge.
          </Label>
        </div>

        {/* Submit */}
        <div className="mt-6 text-right">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold text-sm shadow-sm">
            Submit Request
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RequestAdvanceForm;
