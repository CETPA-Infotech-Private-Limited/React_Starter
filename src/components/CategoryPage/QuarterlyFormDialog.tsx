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
  FileText,
  ShoppingCart,
  IndianRupee,
  Hash,
  CalendarDays,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { QuarterlyFormEntry } from '@/types/types';
import { ReactSelect } from '../ui/ReactSelect';

interface QuarterlyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: QuarterlyFormEntry | null;
  onSave: (entry: QuarterlyFormEntry) => void;
  nextSno: number;
  natureOptions: any[];
  poOptions: any[];
  natureLoading: boolean;
  poLoading: boolean;
  canViewPO: boolean;
  showNature: boolean;      // ✅ NEW — show nature dropdown (all categories)
  showNatureAndPO: boolean; // ✅ existing — show PO (Cat I & II only)
  onFetchPO: (natureId: string) => void;
  filterOption: (option: any, inputValue: string) => boolean;
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
  natureOfContract: '',
  natureOfContractId: '',
  poNumber: '',
  poId: '',
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-3">
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{title}</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

const FieldWrap = ({
  label,
  required,
  icon: Icon,
  span2,
  children,
}: {
  label: string;
  required?: boolean;
  icon?: React.ElementType;
  span2?: boolean;
  children: React.ReactNode;
}) => (
  <div className={`space-y-1.5 ${span2 ? 'md:col-span-2' : ''}`}>
    <Label className="text-xs font-medium text-slate-600 flex items-center gap-1">
      {Icon && <Icon className="w-3 h-3" />}
      {label}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </Label>
    {children}
  </div>
);

export const QuarterlyFormDialog: React.FC<QuarterlyFormDialogProps> = ({
  open,
  onOpenChange,
  entry,
  onSave,
  nextSno,
  natureOptions,
  poOptions,
  natureLoading,
  poLoading,
  canViewPO,
  showNature,
  showNatureAndPO,
  onFetchPO,
  filterOption,
}) => {
  const [formData, setFormData] = useState(INITIAL_ENTRY);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (entry) {
      setFormData({
        nameOfWork:              entry.nameOfWork,
        location:                entry.location,
        estimatedCostLacs:       entry.estimatedCostLacs,
        tenderedCostLacs:        entry.tenderedCostLacs,
        percentageAboveBelowSOR: entry.percentageAboveBelowSOR,
        agmtLOANo:               entry.agmtLOANo,
        agency:                  entry.agency,
        dateOfStart:             entry.dateOfStart,
        timeOfCompletion:        entry.timeOfCompletion,
        physicalProgress:        entry.physicalProgress,
        engineerInCharge:        entry.engineerInCharge,
        remarks:                 entry.remarks,
        natureOfContract:        entry.natureOfContract   || '',
        natureOfContractId:      entry.natureOfContractId || '',
        poNumber:                entry.poNumber           || '',
        poId:                    entry.poId               || '',
      });
    } else {
      setFormData(INITIAL_ENTRY);
    }
    setError(null);
  }, [entry, open]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'estimatedCostLacs' || field === 'tenderedCostLacs') {
        const estimated = field === 'estimatedCostLacs' ? Number(value) : prev.estimatedCostLacs;
        const tendered  = field === 'tenderedCostLacs'  ? Number(value) : prev.tenderedCostLacs;
        updated.percentageAboveBelowSOR = estimated > 0
          ? parseFloat((((tendered - estimated) / estimated) * 100).toFixed(2))
          : 0;
      }
      return updated;
    });
    setError(null);
  };

  const handleNatureChange = (option: any) => {
    setFormData(prev => ({
      ...prev,
      natureOfContract:   option?.searchValue || '',
      natureOfContractId: option?.value       || '',
      poId:     '',
      poNumber: '',
    }));
    if (option?.value && canViewPO) {
      onFetchPO(option.value);
    }
  };

  const handlePOChange = (option: any) => {
    const selectedPO = poOptions.find((p: any) => p.value === option?.value)?.poData || null;
    setFormData(prev => ({
      ...prev,
      poId:     option?.value              || '',
      poNumber: selectedPO?.poNo || option?.label || '',
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.nameOfWork.trim()) {
      setError('Name of work and location is required'); return false;
    }
    // Require nature for ALL categories that show the dropdown
    if (showNature && !formData.natureOfContractId) {
      setError('Nature of contract is required'); return false;
    }
    // Require PO only for Cat I & II when user has PO access
    if (showNatureAndPO && canViewPO && !formData.poId) {
      setError('PO selection is required'); return false;
    }
    if (formData.estimatedCostLacs <= 0) {
      setError('Estimated cost must be greater than 0'); return false;
    }
    if (formData.tenderedCostLacs <= 0) {
      setError('Tendered cost must be greater than 0'); return false;
    }
    if (!formData.agency.trim()) {
      setError('Agency is required'); return false;
    }
    if (!formData.engineerInCharge.trim()) {
      setError('Engineer in Charge is required'); return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSave({ id: entry?.id || '', sno: entry?.sno || nextSno, ...formData });
    onOpenChange(false);
  };

  // ─── Derived visibility ────────────────────────────────────────────────────
  const selectedPOData = poOptions.find((p: any) => p.value === formData.poId)?.poData || null;

  // Nature is selected when the dropdown has a value (or when nature isn't shown)
  const isNatureSelected = showNature ? !!formData.natureOfContractId : true;

  // PO section: only for Cat I & II, only if user canViewPO, only after nature picked
  const showPOSection = showNatureAndPO && canViewPO && isNatureSelected;

  // PO is "satisfied" when:
  //   - Cat III (showNatureAndPO=false) → always satisfied
  //   - Cat I/II but user can't view PO → satisfied
  //   - Cat I/II, user can view PO → need poId
  const isPOSatisfied = !showNatureAndPO ? true : (!canViewPO ? true : !!formData.poId);

  // Show work details after both nature (if required) and PO (if required) are satisfied
  const showWorkDetails = isNatureSelected && isPOSatisfied;

  const sorPct   = formData.percentageAboveBelowSOR;
  const SORIcon  = sorPct > 0 ? TrendingUp : sorPct < 0 ? TrendingDown : Minus;
  const sorColor = sorPct > 0 ? 'text-red-500' : sorPct < 0 ? 'text-emerald-600' : 'text-slate-400';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">

        <DialogHeader className="pb-2 border-b border-slate-100">
          <DialogTitle className="text-base font-semibold text-slate-800">
            {entry ? 'Edit Entry' : 'Add New Entry'}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            {entry
              ? 'Update the details of this quarterly report entry.'
              : `Entry #${nextSno} — fill in the details below.`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-2">

          {/* ── Section 1: Contract ── */}
          {/* Show for ALL categories that have nature (Cat I, II, III) */}
          {showNature && (
            <Section title="Contract">

              {/* Nature of Contract — shown for Cat I, II, III */}
              <FieldWrap label="Nature of Contract" required icon={FileText}>
                <ReactSelect
                  options={natureOptions}
                  value={natureOptions.find((n: any) => n.value === formData.natureOfContractId) || null}
                  onChange={handleNatureChange}
                  placeholder="Select nature of contract"
                  isLoading={natureLoading}
                  isClearable
                  isSearchable
                  filterOption={filterOption}
                  noOptionsMessage={() => 'No options available'}
                  inDialog={true}
                />
              </FieldWrap>

              {/* PO — shown for Cat I & II only, after nature selected */}
              {showPOSection && (
                <FieldWrap label="Purchase Order" required icon={ShoppingCart}>
                  <ReactSelect
                    options={poOptions}
                    value={poOptions.find((p: any) => p.value === formData.poId) || null}
                    onChange={handlePOChange}
                    placeholder="Select PO"
                    isLoading={poLoading}
                    isClearable
                    isSearchable
                    filterOption={filterOption}
                    noOptionsMessage={() => 'No PO available'}
                    inDialog={true}
                  />
                  {selectedPOData && (
                    <div className="flex items-center gap-3 mt-1 text-xs bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                      <span className="flex items-center gap-1 font-semibold text-emerald-600">
                        <IndianRupee className="w-3 h-3" />
                        {formatCurrency(selectedPOData.poOrderValue)}
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Hash className="w-3 h-3" />
                        {selectedPOData.supplierCode}
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <CalendarDays className="w-3 h-3" />
                        {formatDate(selectedPOData.podate)}
                      </span>
                    </div>
                  )}
                </FieldWrap>
              )}
            </Section>
          )}

          {/* ── Section 2: Work Details ── */}
          {showWorkDetails && (
            <>
              <div className="border-t border-slate-100" />
              <Section title="Work Details">

                <FieldWrap label="Name of Work & Location" required span2>
                  <Input
                    value={formData.nameOfWork}
                    onChange={(e) => handleInputChange('nameOfWork', e.target.value)}
                    placeholder="Describe the work and location"
                    className="border-slate-200 text-sm h-9"
                  />
                </FieldWrap>

                <FieldWrap label="Estimated Cost (₹ Lacs)" required>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                    <Input
                      type="number" step="0.01" min="0"
                      value={formData.estimatedCostLacs || ''}
                      onChange={(e) => handleInputChange('estimatedCostLacs', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="border-slate-200 text-sm h-9 pl-6"
                    />
                  </div>
                </FieldWrap>

                <FieldWrap label="Tendered Cost (₹ Lacs)" required>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                    <Input
                      type="number" step="0.01" min="0"
                      value={formData.tenderedCostLacs || ''}
                      onChange={(e) => handleInputChange('tenderedCostLacs', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="border-slate-200 text-sm h-9 pl-6"
                    />
                  </div>
                </FieldWrap>

                <FieldWrap label="% Above / Below SOR">
                  <div className={`
                    flex items-center gap-2 h-9 px-3 rounded-md border text-sm font-mono
                    ${sorPct > 0 ? 'bg-red-50 border-red-200 text-red-600'
                      : sorPct < 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-slate-50 border-slate-200 text-slate-400'}
                  `}>
                    <SORIcon className={`w-3.5 h-3.5 ${sorColor}`} />
                    <span>
                      {formData.estimatedCostLacs > 0 && formData.tenderedCostLacs > 0
                        ? `${sorPct > 0 ? '+' : ''}${sorPct.toFixed(2)}%`
                        : '—'}
                    </span>
                    {formData.estimatedCostLacs > 0 && formData.tenderedCostLacs > 0 && (
                      <span className="text-xs ml-auto opacity-60">
                        {sorPct > 0 ? 'above' : sorPct < 0 ? 'below' : 'at'} SOR
                      </span>
                    )}
                  </div>
                </FieldWrap>

                <FieldWrap label="Agmt. / LOA No.">
                  <Input
                    value={formData.agmtLOANo}
                    onChange={(e) => handleInputChange('agmtLOANo', e.target.value)}
                    placeholder="Agreement or LOA number"
                    className="border-slate-200 text-sm h-9"
                  />
                </FieldWrap>

                <FieldWrap label="Agency" required>
                  <Input
                    value={formData.agency}
                    onChange={(e) => handleInputChange('agency', e.target.value)}
                    placeholder="Name of agency"
                    className="border-slate-200 text-sm h-9"
                  />
                </FieldWrap>
              </Section>

              {/* ── Section 3: Timeline & Progress ── */}
              <div className="border-t border-slate-100" />
              <Section title="Timeline & Progress">

                <FieldWrap label="Date of Start">
                  <Input
                    type="date"
                    value={formData.dateOfStart}
                    onChange={(e) => handleInputChange('dateOfStart', e.target.value)}
                    className="border-slate-200 text-sm h-9"
                  />
                </FieldWrap>

                <FieldWrap label="Time of Completion">
                  <Input
                    type="date"
                    value={formData.timeOfCompletion}
                    onChange={(e) => handleInputChange('timeOfCompletion', e.target.value)}
                    className="border-slate-200 text-sm h-9"
                  />
                </FieldWrap>

                <FieldWrap label="Physical Progress (%)">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number" min="0" max="100"
                        value={formData.physicalProgress || ''}
                        onChange={(e) => handleInputChange('physicalProgress', e.target.value)}
                        placeholder="0 – 100"
                        className="border-slate-200 text-sm h-9 w-28"
                      />
                      <span className="text-sm text-slate-500">%</span>
                    </div>
                    {parseFloat(formData.physicalProgress) > 0 && (
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(parseFloat(formData.physicalProgress), 100)}%` }}
                        />
                      </div>
                    )}
                  </div>
                </FieldWrap>

                <FieldWrap label="Engineer in Charge" required>
                  <Input
                    value={formData.engineerInCharge}
                    onChange={(e) => handleInputChange('engineerInCharge', e.target.value)}
                    placeholder="Name of engineer"
                    className="border-slate-200 text-sm h-9"
                  />
                </FieldWrap>

                <FieldWrap label="Remarks" span2>
                  <Textarea
                    value={formData.remarks}
                    onChange={(e) => handleInputChange('remarks', e.target.value)}
                    placeholder="Additional remarks or notes…"
                    className="border-slate-200 text-sm resize-none"
                    rows={2}
                  />
                </FieldWrap>
              </Section>
            </>
          )}

          {error && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button" variant="outline" size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 text-xs"
            >
              Cancel
            </Button>
            {showWorkDetails && (
              <Button type="submit" size="sm" className="bg-blue-700 hover:bg-blue-800 h-8 text-xs px-4">
                {entry ? 'Update Entry' : 'Add Entry'}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};