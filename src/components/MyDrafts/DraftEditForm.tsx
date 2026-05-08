// components/DraftEditForm.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Loader2,
  Send,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Shield,
  ClipboardCheck,
  BookOpen,
  FileText,
  IndianRupee,
  ShoppingCart,
  Info,
  Hash,
  CalendarDays,
  Save,
  ArrowLeft,
} from 'lucide-react';
import { QuarterlyFormTable } from '../CategoryPage/QuaterlyFormTable';
import { 
  Category, 
  Quarter, 
  FormData, 
  QuarterlyFormEntry,
  WorkflowStatus,
} from '@/types/types';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { clearNatureList, getNatureList } from '@/features/GetCategoriesNature/NatureSlice';
import { categoryInfo } from '@/lib/utils';
import { RootState } from '@/app/store';
import { clearPOList, getPODetails } from '@/features/GetPO/POslice';
import { ReactSelect } from '../ui/ReactSelect';
import { 
  submitReport, 
  saveReportDraft,
  resetSubmitState,
  selectDraftBatchId 
} from '@/features/SubmitReport/SubmitReportSlice';
import { getMyDrafts } from '@/features/Drafts/MyDraftsSlice';

interface DraftEditFormProps {
  batch: any;
  onBack: () => void;
}

const getCurrentQuarter = (): Quarter => {
  const month = new Date().getMonth();
  if (month < 3) return 'Q1';
  if (month < 6) return 'Q2';
  if (month < 9) return 'Q3';
  return 'Q4';
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const DraftEditForm: React.FC<DraftEditFormProps> = ({ batch, onBack }) => {
  const dispatch = useAppDispatch();
  
  const { natureList, loading: natureLoading, error: natureError } = useAppSelector((state) => state.nature);
  const { poList, loading: poLoading } = useAppSelector((state) => state.poDetails);
  const { loading: submitLoading } = useAppSelector((state) => state.submitReport);
  const draftBatchId = useAppSelector(selectDraftBatchId);
  const user = useAppSelector((state: RootState) => state.user);

  // Get category from first report
  const firstReport = batch?.reports?.[0];
  const categoryType = firstReport?.categoryType || '1';
  const categoryMap: Record<string, Category> = { '1': 'I', '2': 'II', '3': 'III' };
  const initialCategory = categoryMap[categoryType] || 'I';

  const [activeTab, setActiveTab] = useState<Category>(initialCategory);
  const [formData, setFormData] = useState<FormData>({
    quarter: getCurrentQuarter(),
    year: new Date().getFullYear().toString(),
    category: initialCategory,
    contractNature: categoryType,
    poId: firstReport?.poNo || '',
  });

  const [tableEntries, setTableEntries] = useState<QuarterlyFormEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const years = Array.from({ length: 5 }, (_, i) => ({
    label: (new Date().getFullYear() + i).toString(),
    value: (new Date().getFullYear() + i).toString()
  }));

  const quarterOptions = [
    { label: 'Q1 (Jan - Mar)', value: 'Q1' },
    { label: 'Q2 (Apr - Jun)', value: 'Q2' },
    { label: 'Q3 (Jul - Sep)', value: 'Q3' },
    { label: 'Q4 (Oct - Dec)', value: 'Q4' },
  ];

  const yearOptions = years.map(year => ({ label: year.label, value: year.value }));

  const getCategoryId = (category: Category): string => {
    const categoryMap = { 'I': '1', 'II': '2', 'III': '3' };
    return categoryMap[category];
  };

  const fetchContractNatures = useCallback((category: Category) => {
    const categoryId = getCategoryId(category);
    dispatch(getNatureList(categoryId));
  }, [dispatch]);

  const fetchPOList = useCallback(() => {
    if (activeTab === 'III') return;
    const Unit = user?.Unit || 0;
    const Dept = user?.Department;
    dispatch(getPODetails({ Unit, Dept }));
  }, [dispatch, activeTab, user]);

  // Load draft data into form
  useEffect(() => {
    if (batch?.reports) {
      const entries: QuarterlyFormEntry[] = batch.reports.map((report: any, index: number) => ({
        id: `draft_${report.reportId}`,
        sno: index + 1,
        nameOfWork: report.nameOfWorkAndLocation || '',
        location: '',
        estimatedCostLacs: report.estimatedCostLacs || 0,
        tenderedCostLacs: report.tenderedCostLacs || 0,
        percentageAboveBelowSOR: report.percentAboveBelowSOR || 0,
        agmtLOANo: report.agreementNo || '',
        agency: report.agency || '',
        dateOfStart: report.dateOfStart ? report.dateOfStart.split('T')[0] : '',
        timeOfCompletion: report.timeOfCompletions?.[0]?.completionDate 
          ? report.timeOfCompletions[0].completionDate.split('T')[0] 
          : '',
        physicalProgress: report.physicalProgress?.toString() || '0',
        engineerInCharge: report.engineerInChargeDetails || '',
        remarks: report.remarks || '',
        status: 'draft' as WorkflowStatus,
      }));
      setTableEntries(entries);
    }
  }, [batch]);

  useEffect(() => {
    fetchContractNatures(initialCategory);
    if (initialCategory !== 'III') {
      fetchPOList();
    }
  }, [fetchContractNatures, fetchPOList, initialCategory]);

  const natureOptions = natureList?.[0]?.subCategories?.map((nature: any) => ({
    label: (
      <div className="flex items-center justify-between gap-2 w-full">
        <span>{nature.natureOfContract}</span>
        {nature.thresholdValue && (
          <span className="text-slate-500 text-xs flex items-center gap-1">
            <IndianRupee className="w-3 h-3" />
            {new Intl.NumberFormat('en-IN').format(nature.thresholdValue)}
          </span>
        )}
      </div>
    ),
    value: nature.id?.toString(),
    searchValue: nature.natureOfContract,
  })) || [];

  const poOptions = poList?.map((po: any) => ({
    label: po.poNo || `PO-${po.pktblSapDump || ''}`,
    value: po.poNo?.toString() || po.pktblSapDump?.toString(),
    searchValue: `${po.poNo || ''} ${po.supplierCode || ''}`,
    poData: po,
  })) || [];

  const handleAddEntry = (entry: QuarterlyFormEntry) => {
    const newEntry = { ...entry, id: `entry_${Date.now()}`, sno: tableEntries.length + 1, status: 'draft' as WorkflowStatus };
    setTableEntries(prev => [...prev, newEntry]);
  };

  const handleUpdateEntry = (updatedEntry: QuarterlyFormEntry) => {
    setTableEntries(prev => prev.map(entry => entry.id === updatedEntry.id ? updatedEntry : entry));
  };

  const handleDeleteEntry = (entryId: string) => {
    setTableEntries(prev => {
      const filtered = prev.filter(entry => entry.id !== entryId);
      return filtered.map((entry, index) => ({ ...entry, sno: index + 1 }));
    });
  };

  const handleUpdateDraft = async () => {
    if (tableEntries.length === 0) return;
    
    try {
      const resultAction = await dispatch(saveReportDraft({
        formData,
        tableEntries,
        user,
        comment: 'Draft updated',
        batchId: batch.submissionBatchId
      }));
      
      if (saveReportDraft.fulfilled.match(resultAction)) {
        setSuccessMessage('Draft updated successfully!');
        // Refresh drafts list
        dispatch(getMyDrafts({
          empCode: user?.EmpCode?.toString() || '',
          unitId: user?.unitId || '',
          department: user?.Department || '',
        }));
        setTimeout(() => onBack(), 1500);
      }
    } catch (error) {
      setError('Failed to update draft');
    }
  };

  const handleSubmitDraft = async () => {
    if (tableEntries.length === 0) return;
    
    try {
      const resultAction = await dispatch(submitReport({
        formData,
        tableEntries,
        user,
        comment: 'Submitted from draft'
      }));
      
      if (submitReport.fulfilled.match(resultAction)) {
        setSuccessMessage('Draft submitted to CVO successfully!');
        setTimeout(() => onBack(), 1500);
      }
    } catch (error) {
      setError('Failed to submit draft');
    }
  };

  const selectedPO = poOptions.find((p: any) => p.value === formData.poId)?.poData || null;

  return (
    <div className="w-full mx-auto space-y-6 p-4 md:p-8">
      {/* Back Button */}
      <Button variant="outline" onClick={onBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Drafts
      </Button>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="pt-6">
          {/* Category Tabs | Quarter & Year */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Category)} className="flex-1">
              <TabsList className="grid w-full grid-cols-3">
                {(['I', 'II', 'III'] as Category[]).map((category) => {
                  const info = categoryInfo[category];
                  const Icon = info.icon;
                  return (
                    <TabsTrigger key={category} value={category} className="data-[state=active]:bg-blue-800 data-[state=active]:text-white py-2">
                      <div className="flex items-center gap-1.5">
                        <Icon className="w-4 h-4" />
                        <span className="font-medium text-sm">Category {category}</span>
                      </div>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium text-slate-700 whitespace-nowrap">
                  <Calendar className="w-3.5 h-3.5 inline mr-1" />Quarter
                </Label>
                <div className="w-[180px]">
                  <ReactSelect options={quarterOptions} value={quarterOptions.find(q => q.value === formData.quarter) || null} onChange={(opt) => setFormData(prev => ({ ...prev, quarter: opt?.value }))} placeholder="Quarter" isClearable={false} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium text-slate-700">Year</Label>
                <div className="w-[120px]">
                  <ReactSelect options={yearOptions} value={yearOptions.find(y => y.value === formData.year) || null} onChange={(opt) => setFormData(prev => ({ ...prev, year: opt?.value }))} placeholder="Year" isClearable={false} />
                </div>
              </div>
            </div>
          </div>

          {/* Nature of Contract & PO Inline */}
          <div className="flex items-start gap-3 flex-wrap bg-slate-50 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium text-slate-700 whitespace-nowrap min-w-[140px] mt-2">
                <FileText className="w-3.5 h-3.5 inline mr-1" />Nature of Contract
              </Label>
              <div className="w-[280px]">
                <ReactSelect options={natureOptions} value={natureOptions.find((n: any) => n.value === formData.contractNature) || null} onChange={(opt) => setFormData(prev => ({ ...prev, contractNature: opt?.value || '' }))} placeholder="Select nature" isLoading={natureLoading} isClearable isSearchable />
              </div>
            </div>

            {formData.contractNature && categoryInfo[activeTab].requiresPO && (
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium text-slate-700 whitespace-nowrap min-w-[40px] mt-2">
                  <ShoppingCart className="w-3.5 h-3.5 inline mr-1" />PO
                </Label>
                <div className="w-[220px]">
                  <ReactSelect options={poOptions} value={poOptions.find((p: any) => p.value === formData.poId) || null} onChange={(opt) => setFormData(prev => ({ ...prev, poId: opt?.value || '' }))} placeholder="Select PO" isLoading={poLoading} isClearable isSearchable />
                </div>
                {selectedPO && (
                  <div className="flex items-center gap-4 ml-2 text-sm">
                    <span className="font-medium text-emerald-600 flex items-center gap-0.5"><IndianRupee className="w-3 h-3" />{formatCurrency(selectedPO.poOrderValue)}</span>
                    <span className="text-slate-600 text-xs">{selectedPO.supplierCode?.split('-')[1] || selectedPO.supplierCode}</span>
                    <span className="text-slate-600 text-xs">{formatDate(selectedPO.podate)}</span>
                  </div>
                )}
              </div>
            )}

            {formData.contractNature && !categoryInfo[activeTab].requiresPO && (
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded flex items-center gap-1 mt-2">
                <Info className="w-3 h-3" />No PO required
              </span>
            )}
          </div>

          {/* Messages */}
          {error && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-sm mb-4">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          )}
          {successMessage && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-md flex items-center gap-2 text-sm mb-4">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <p className="text-emerald-700">{successMessage}</p>
            </div>
          )}

          {/* Data Table */}
          <QuarterlyFormTable
            entries={tableEntries}
            onAddEntry={handleAddEntry}
            onUpdateEntry={handleUpdateEntry}
            onDeleteEntry={handleDeleteEntry}
            showNewEntry={false}
            setShowNewEntry={() => {}}
          />

          {/* Action Buttons */}
          {tableEntries.length > 0 && (
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={handleUpdateDraft} variant="outline" className="h-9 text-sm border-blue-200 text-blue-800 hover:bg-blue-50" disabled={submitLoading}>
                {submitLoading ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
                Update Draft
              </Button>
              <Button onClick={handleSubmitDraft} className="bg-blue-800 hover:bg-blue-900 h-9 text-sm" disabled={submitLoading}>
                {submitLoading ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Submitting...</> : <><Send className="w-3.5 h-3.5 mr-1.5" />Submit to CVO</>}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DraftEditForm;