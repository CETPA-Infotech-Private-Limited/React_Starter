// components/QuarterlyFormDialog.tsx
"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertCircle,
} from 'lucide-react';
import { QuarterlyFormEntry } from '@/types/types';

interface QuarterlyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: QuarterlyFormEntry | null;
  onSave: (entry: QuarterlyFormEntry) => void;
  nextSno: number;
}

const INITIAL_ENTRY: Omit<QuarterlyFormEntry, 'id' | 'sno'> = {
  nameOfWork: '',
  location: '',
  estimatedCostLacs: 0,
  tenderedCostLacs: 0,
  percentageAboveBelowSOR: 0,
  agmtLOANo: '',
  agency: '',
  dateOfStart: '',
  timeOfCompletion: '',
  physicalProgress: '',
  engineerInCharge: '',
  remarks: '',
};

export const QuarterlyFormDialog: React.FC<QuarterlyFormDialogProps> = ({
  open,
  onOpenChange,
  entry,
  onSave,
  nextSno,
}) => {
  const [formData, setFormData] = useState(INITIAL_ENTRY);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (entry) {
      setFormData({
        nameOfWork: entry.nameOfWork,
        location: entry.location,
        estimatedCostLacs: entry.estimatedCostLacs,
        tenderedCostLacs: entry.tenderedCostLacs,
        percentageAboveBelowSOR: entry.percentageAboveBelowSOR,
        agmtLOANo: entry.agmtLOANo,
        agency: entry.agency,
        dateOfStart: entry.dateOfStart,
        timeOfCompletion: entry.timeOfCompletion,
        physicalProgress: entry.physicalProgress,
        engineerInCharge: entry.engineerInCharge,
        remarks: entry.remarks,
      });
    } else {
      setFormData(INITIAL_ENTRY);
    }
    setError(null);
  }, [entry, open]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);

    // Auto-calculate percentage above/below SOR
    if ((field === 'estimatedCostLacs' || field === 'tenderedCostLacs') && 
        formData.estimatedCostLacs > 0) {
      const estimated = field === 'estimatedCostLacs' ? Number(value) : formData.estimatedCostLacs;
      const tendered = field === 'tenderedCostLacs' ? Number(value) : formData.tenderedCostLacs;
      
      if (estimated > 0) {
        const percentage = ((tendered - estimated) / estimated) * 100;
        setFormData(prev => ({
          ...prev,
          percentageAboveBelowSOR: parseFloat(percentage.toFixed(2))
        }));
      }
    }
  };

  const validateForm = (): boolean => {
    if (!formData.nameOfWork.trim()) {
      setError('Name of work and location is required');
      return false;
    }
    if (formData.estimatedCostLacs <= 0) {
      setError('Estimated cost must be greater than 0');
      return false;
    }
    if (formData.tenderedCostLacs <= 0) {
      setError('Tendered cost must be greater than 0');
      return false;
    }
    if (!formData.agency.trim()) {
      setError('Agency is required');
      return false;
    }
    if (!formData.engineerInCharge.trim()) {
      setError('Engineer in charge is required');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const newEntry: QuarterlyFormEntry = {
      id: entry?.id || '',
      sno: entry?.sno || nextSno,
      ...formData,
    };

    onSave(newEntry);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-blue-800">
            {entry ? 'Edit Entry' : 'Add New Entry'}
          </DialogTitle>
          <DialogDescription>
            {entry 
              ? 'Update the details of the existing entry.' 
              : 'Fill in the details for the new quarterly report entry.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name of Work and Location - Single Field */}
            <div className="space-y-2 md:col-span-2">
              <Label className="text-slate-700">Name of Work & Location *</Label>
              <Input
                value={formData.nameOfWork}
                onChange={(e) => handleInputChange('nameOfWork', e.target.value)}
                placeholder="Enter name of work and location"
                className="border-slate-200"
              />
            </div>

            {/* Estimated Cost */}
            <div className="space-y-2">
              <Label className="text-slate-700">Estimated Cost (₹ Lacs) *</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.estimatedCostLacs || ''}
                onChange={(e) => handleInputChange('estimatedCostLacs', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="border-slate-200"
              />
            </div>

            {/* Tendered Cost */}
            <div className="space-y-2">
              <Label className="text-slate-700">Tendered Cost (₹ Lacs) *</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.tenderedCostLacs || ''}
                onChange={(e) => handleInputChange('tenderedCostLacs', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="border-slate-200"
              />
            </div>

            {/* % Above/Below SOR */}
            <div className="space-y-2">
              <Label className="text-slate-700">% Above/Below SOR</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.percentageAboveBelowSOR || ''}
                onChange={(e) => handleInputChange('percentageAboveBelowSOR', parseFloat(e.target.value) || 0)}
                placeholder="Auto-calculated"
                className="border-slate-200 bg-slate-50"
                readOnly
              />
              {formData.estimatedCostLacs > 0 && formData.tenderedCostLacs > 0 && (
                <p className={`text-xs ${
                  formData.percentageAboveBelowSOR > 0 
                    ? 'text-red-600' 
                    : formData.percentageAboveBelowSOR < 0 
                      ? 'text-emerald-600' 
                      : 'text-slate-600'
                }`}>
                  {formData.percentageAboveBelowSOR > 0 ? '+' : ''}
                  {formData.percentageAboveBelowSOR.toFixed(2)}% 
                  {formData.percentageAboveBelowSOR > 0 ? ' above' : formData.percentageAboveBelowSOR < 0 ? ' below' : ''} SOR
                </p>
              )}
            </div>

            {/* Agmt./LOA No. */}
            <div className="space-y-2">
              <Label className="text-slate-700">Agmt./LOA No.</Label>
              <Input
                value={formData.agmtLOANo}
                onChange={(e) => handleInputChange('agmtLOANo', e.target.value)}
                placeholder="Enter agreement/LOA number"
                className="border-slate-200"
              />
            </div>

            {/* Agency */}
            <div className="space-y-2">
              <Label className="text-slate-700">Agency *</Label>
              <Input
                value={formData.agency}
                onChange={(e) => handleInputChange('agency', e.target.value)}
                placeholder="Enter agency name"
                className="border-slate-200"
              />
            </div>

            {/* Date of Start */}
            <div className="space-y-2">
              <Label className="text-slate-700">Date of Start</Label>
              <Input
                type="date"
                value={formData.dateOfStart}
                onChange={(e) => handleInputChange('dateOfStart', e.target.value)}
                className="border-slate-200"
              />
            </div>

            {/* Time of Completion */}
            <div className="space-y-2">
              <Label className="text-slate-700">Time of Completion</Label>
              <Input
                type="date"
                value={formData.timeOfCompletion}
                onChange={(e) => handleInputChange('timeOfCompletion', e.target.value)}
                className="border-slate-200"
              />
            </div>

            {/* Physical Progress */}
            <div className="space-y-2">
              <Label className="text-slate-700">Physical Progress</Label>
              <Input
                value={formData.physicalProgress}
                onChange={(e) => handleInputChange('physicalProgress', e.target.value)}
                placeholder="e.g., 75%"
                className="border-slate-200"
              />
            </div>

            {/* Engineer in Charge */}
            <div className="space-y-2">
              <Label className="text-slate-700">Engineer in Charge *</Label>
              <Input
                value={formData.engineerInCharge}
                onChange={(e) => handleInputChange('engineerInCharge', e.target.value)}
                placeholder="Enter engineer name"
                className="border-slate-200"
              />
            </div>

            {/* Remarks */}
            <div className="space-y-2 md:col-span-2">
              <Label className="text-slate-700">Remarks</Label>
              <Textarea
                value={formData.remarks}
                onChange={(e) => handleInputChange('remarks', e.target.value)}
                placeholder="Additional remarks or notes..."
                className="border-slate-200"
                rows={3}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-800 hover:bg-blue-900"
            >
              {entry ? 'Update Entry' : 'Add Entry'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};