import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

const RequestAdvanceForm = () => {
  const [isEmpanelled, setIsEmpanelled] = useState<'yes' | 'no'>('yes');

  // Layout helper classes
  const rowClass = 'grid grid-cols-2 gap-x-8 gap-y-5';
  const pairClass = 'flex items-center';
  const labelClass = 'w-44 text-right mr-4 font-medium text-sm';
  const inputClass = 'w-full max-w-[300px]';

  return (
    <div className="p-10 bg-white rounded-lg shadow-md mx-auto mt-6">
      <h2 className="text-2xl font-semibold text-center mb-8 text-primary border-b pb-4">
        NEW ADVANCE REQUEST FORM
      </h2>

      <div className="space-y-6">
        {/* Row 1 */}
        <div className={rowClass}>
          <div className={pairClass}>
            <Label className={labelClass}>Select Member</Label>
            <Input placeholder="Select Member" className={inputClass} />
          </div>
          {isEmpanelled === 'no' ? (
            <div className={pairClass}>
              <Label className={labelClass}>Hospital Name</Label>
              <Input placeholder="Apollo" className={inputClass} />
            </div>
          ) : (
            <div className={pairClass}>
              <Label className={labelClass}>Doctor's Name</Label>
              <Input placeholder="Dr. Mathur" className={inputClass} />
            </div>
          )}
        </div>

        {/* Row 2 */}
        <div className={rowClass}>
          <div className={pairClass}>
            <Label className={labelClass}>Hospital Empanelled</Label>
            <RadioGroup
              value={isEmpanelled}
              onValueChange={(val) => setIsEmpanelled(val as 'yes' | 'no')}
              className="flex gap-6"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem id="yes" value="yes" />
                <Label htmlFor="yes">Yes</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="no" value="no" />
                <Label htmlFor="no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {isEmpanelled === 'yes' ? (
            <div className={pairClass}>
              <Label className={labelClass}>Select Hospital</Label>
              <Select>
                <SelectTrigger className={inputClass}>
                  <SelectValue placeholder="Select Hospital" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aiims">AIIMS</SelectItem>
                  <SelectItem value="lnjp">LNJP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className={pairClass}>
              <Label className={labelClass}>Hospital Regd. No.</Label>
              <Input placeholder="L85110TN1979PLC006944" className={inputClass} />
            </div>
          )}
        </div>

        {/* Row 3 */}
        <div className={rowClass}>
          <div className={pairClass}>
            <Label className={labelClass}>Likely Date of Admission</Label>
            <Input type="date" className={inputClass} />
          </div>
          <div className={pairClass}>
            <Label className={labelClass}>Treatment Type</Label>
            <Select>
              <SelectTrigger className={inputClass}>
                <SelectValue placeholder="Select Treatment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="allopathic">Allopathic</SelectItem>
                <SelectItem value="ayurveda">Ayurveda</SelectItem>
                <SelectItem value="homopathic">Homopathic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Row 4 */}
        <div className={rowClass}>
          <div className={pairClass}>
            <Label className={labelClass}>Diagnosis</Label>
            <Input placeholder="Diagnosis" className={inputClass} />
          </div>
          <div className={pairClass}>
            <Label className={labelClass}>Admission Advice</Label>
            <Button variant="outline" className={inputClass}>
              Upload File
            </Button>
          </div>
        </div>

        {/* Row 5 */}
        <div className={rowClass}>
          <div className={pairClass}>
            <Label className={labelClass}>Estimate Amount</Label>
            <Input placeholder="₹ 00.00" className={inputClass} />
          </div>
          <div className={pairClass}>
            <Label className={labelClass}>Upload Estimate</Label>
            <Button variant="outline" className={inputClass}>
              Upload File
            </Button>
          </div>
        </div>

        {/* Row 6 */}
        <div className={rowClass}>
          <div className={pairClass}>
            <Label className={labelClass}>Advance Required*</Label>
            <Input placeholder="₹ 00.00" className={inputClass} />
          </div>
        </div>
      </div>

      {/* Pay To Section */}
      <div className="mt-8 border rounded-md p-4">
        <div className={pairClass}>
          <Label className={labelClass}>Pay To</Label>
          <RadioGroup defaultValue="self" className="flex gap-6 flex-1">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="self" id="payto-self" />
              <Label htmlFor="payto-self">Anil (Self)</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="hospital" id="payto-hospital" />
              <Label htmlFor="payto-hospital">Hospital</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      {/* Declaration */}
      <div className="mt-6 flex items-start gap-2">
        <Checkbox id="declaration" />
        <Label htmlFor="declaration" className="text-sm leading-relaxed">
          I the undersigned hereby declare that the information given in this form is correct and complete to the best of my knowledge and belief.
        </Label>
      </div>

      {/* Submit */}
      <div className="mt-6 text-right">
        <Button type="submit">Submit</Button>
      </div>
    </div>
  );
};

export default RequestAdvanceForm;
