// components/QuarterlyReport.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Loader2,
  Send,
  CheckCircle2,
  Clock,
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
} from 'lucide-react';

import { QuarterlyFormTable } from './QuaterlyFormTable';

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

const QuarterlyReport: React.FC = () => {
  const dispatch = useAppDispatch();
  
  const { 
    natureList, 
    loading: natureLoading, 
    error: natureError 
  } = useAppSelector((state) => state.nature);
  
  const {
    poList,
    loading: poLoading,
    error: poError
  } = useAppSelector((state) => state.poDetails);

  const user = useAppSelector((state: RootState) => state.user);

  const [activeTab, setActiveTab] = useState<Category>('I');
  const [formData, setFormData] = useState<FormData>({
    quarter: getCurrentQuarter(),
    year: new Date().getFullYear().toString(),
    category: 'I',
    contractNature: '',
    poId: '',
  });

  const [tableEntries, setTableEntries] = useState<QuarterlyFormEntry[]>([]);
  const [showNewEntry, setShowNewEntry] = useState(false);
  
  const [loading, setLoading] = useState({
    submitting: false,
  });

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

  const yearOptions = years.map(year => ({
    label: year.label,
    value: year.value,
  }));

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
    searchValue: `${po.poNo || ''} ${po.supplierCode || ''} ${po.poOrderValue || ''}`,
    poData: po,
  })) || [];

  const handleQuarterChange = (option: any) => {
    setFormData(prev => ({ ...prev, quarter: option?.value || getCurrentQuarter() }));
  };

  const handleYearChange = (option: any) => {
    setFormData(prev => ({ ...prev, year: option?.value || new Date().getFullYear().toString() }));
  };

  const handleContractNatureChange = (option: any) => {
    const value = option?.value || '';
    setFormData(prev => ({ ...prev, contractNature: value, poId: '' }));
    setTableEntries([]);
    
    if (value && activeTab !== 'III') {
      fetchPOList();
    }
  };

  const handlePOChange = (option: any) => {
    setFormData(prev => ({ ...prev, poId: option?.value || '' }));
    setTableEntries([]);
  };

  const handleTabChange = (value: string) => {
    const category = value as Category;
    setActiveTab(category);
    setFormData(prev => ({ ...prev, category, contractNature: '', poId: '' }));
    dispatch(clearNatureList());
    dispatch(clearPOList());
    setTableEntries([]);
    fetchContractNatures(category);
  };

  const handleAddEntry = (entry: QuarterlyFormEntry) => {
    const newEntry = {
      ...entry,
      id: `entry_${Date.now()}`,
      sno: tableEntries.length + 1,
      status: 'draft' as WorkflowStatus,
    };
    setTableEntries(prev => [...prev, newEntry]);
    setSuccessMessage('Entry added successfully!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleUpdateEntry = (updatedEntry: QuarterlyFormEntry) => {
    setTableEntries(prev => 
      prev.map(entry => entry.id === updatedEntry.id ? updatedEntry : entry)
    );
    setSuccessMessage('Entry updated successfully!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleDeleteEntry = (entryId: string) => {
    setTableEntries(prev => {
      const filtered = prev.filter(entry => entry.id !== entryId);
      return filtered.map((entry, index) => ({ ...entry, sno: index + 1 }));
    });
  };

  const handleSubmitAllToCVO = async () => {
    if (tableEntries.length === 0) {
      setError('Please add at least one entry before submitting');
      return;
    }

    setLoading(prev => ({ ...prev, submitting: true }));
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setTableEntries(prev =>
        prev.map(entry => ({
          ...entry,
          status: 'submitted' as WorkflowStatus,
          submittedAt: new Date().toISOString()
        }))
      );
      setSuccessMessage('All entries submitted to CVO for approval successfully!');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      setError('Failed to submit entries');
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  const canShowForm = () => {
    if (!formData.contractNature) return false;
    if (activeTab === 'III') return true;
    return !!formData.poId;
  };

  const getSelectedPOData = () => {
    const selectedOption = poOptions.find((p: any) => p.value === formData.poId);
    return selectedOption?.poData || null;
  };

  const filterOption = (option: any, inputValue: string) => {
    const searchValue = option.data?.searchValue || '';
    return searchValue.toLowerCase().includes(inputValue.toLowerCase());
  };

  useEffect(() => {
    if (natureError) setError(natureError);
  }, [natureError]);

  useEffect(() => {
    if (poError) setError(poError);
  }, [poError]);

  useEffect(() => {
    fetchContractNatures('I');
  }, [fetchContractNatures]);

  const selectedPO = getSelectedPOData();

  return (
    <div className="w-full mx-auto space-y-6 p-4 md:p-8">
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="pt-6">
          {/* Header Row - Category Tabs (Left) | Quarter & Year (Right) */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1">
              <TabsList className="grid w-full grid-cols-3">
                {(['I', 'II', 'III'] as Category[]).map((category) => {
                  const info = categoryInfo[category];
                  const Icon = info.icon;
                  return (
                    <TabsTrigger 
                      key={category}
                      value={category}
                      className="data-[state=active]:bg-blue-800 data-[state=active]:text-white py-2"
                    >
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
                  <Calendar className="w-3.5 h-3.5 inline mr-1" />
                  Quarter
                </Label>
                <div className="w-[180px]">
                  <ReactSelect
                    options={quarterOptions}
                    value={quarterOptions.find(q => q.value === formData.quarter) || null}
                    onChange={handleQuarterChange}
                    placeholder="Quarter"
                    isClearable={false}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium text-slate-700">Year</Label>
                <div className="w-[120px]">
                  <ReactSelect
                    options={yearOptions}
                    value={yearOptions.find(y => y.value === formData.year) || null}
                    onChange={handleYearChange}
                    placeholder="Year"
                    isClearable={false}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tab Contents */}
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            {(['I', 'II', 'III'] as Category[]).map((category) => (
              <TabsContent key={category} value={category} className="space-y-4 mt-0">
                {/* Nature of Contract & PO Inline */}
                <div className="flex items-start gap-3 flex-wrap bg-slate-50 rounded-lg p-4">
                  {/* Nature of Contract */}
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium text-slate-700 whitespace-nowrap min-w-[140px] mt-2">
                      <FileText className="w-3.5 h-3.5 inline mr-1" />
                      Nature of Contract
                    </Label>
                    <div className="w-[280px]">
                      <ReactSelect
                        options={natureOptions}
                        value={natureOptions.find((n: any) => n.value === formData.contractNature) || null}
                        onChange={handleContractNatureChange}
                        placeholder="Select nature"
                        isLoading={natureLoading}
                        isClearable
                        isSearchable
                        filterOption={filterOption}
                        noOptionsMessage={() => "No options available"}
                      />
                    </div>
                  </div>

                  {/* PO Selection - Only for Category I & II */}
                  {formData.contractNature && categoryInfo[category].requiresPO && (
                    <div className="flex items-center gap-2 animate-in fade-in duration-200">
                      <Label className="text-sm font-medium text-slate-700 whitespace-nowrap min-w-[40px] mt-2">
                        <ShoppingCart className="w-3.5 h-3.5 inline mr-1" />
                        PO
                      </Label>
                      <div className="w-[220px]">
                        <ReactSelect
                          options={poOptions}
                          value={poOptions.find((p: any) => p.value === formData.poId) || null}
                          onChange={handlePOChange}
                          placeholder="Select PO"
                          isLoading={poLoading}
                          isClearable
                          isSearchable
                          filterOption={filterOption}
                          noOptionsMessage={() => "No PO available"}
                        />
                      </div>

                      {/* PO Details - Shown next to PO on the right side */}
                      {selectedPO && (
                        <div className="flex items-center gap-4 ml-2 text-sm animate-in fade-in duration-200">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-slate-500">Value:</span>
                            <span className="font-medium text-emerald-600 flex items-center gap-0.5">
                              <IndianRupee className="w-3 h-3" />
                              {formatCurrency(selectedPO.poOrderValue)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-slate-500">Supplier Code:</span>
                            <span className="text-slate-600 text-xs">
                              {selectedPO.supplierCode}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-slate-500">PO Date:</span>
                            <span className="text-slate-600 text-xs">
                              {formatDate(selectedPO.podate)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Category III Note */}
                  {formData.contractNature && !categoryInfo[category].requiresPO && (
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded flex items-center gap-1 animate-in fade-in duration-200 mt-2">
                      <Info className="w-3 h-3" />
                      No PO required
                    </span>
                  )}
                </div>

                {/* Messages */}
                {error && (
                  <div className="p-2.5 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <p className="text-red-700">{error}</p>
                    <Button variant="ghost" size="sm" onClick={() => setError(null)} className="ml-auto h-7 text-xs">Dismiss</Button>
                  </div>
                )}
                
                {successMessage && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-md flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <p className="text-emerald-700">{successMessage}</p>
                  </div>
                )}

                {/* Data Table */}
                {canShowForm() && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <QuarterlyFormTable
                      entries={tableEntries}
                      onAddEntry={handleAddEntry}
                      onUpdateEntry={handleUpdateEntry}
                      onDeleteEntry={handleDeleteEntry}
                      showNewEntry={showNewEntry}
                      setShowNewEntry={setShowNewEntry}
                    />

                    {tableEntries.length > 0 && (
                      <div className="flex justify-end">
                        <Button
                          onClick={handleSubmitAllToCVO}
                          className="bg-blue-800 hover:bg-blue-900 h-9 text-sm"
                          disabled={loading.submitting || tableEntries.every(e => e.status === 'submitted')}
                        >
                          {loading.submitting ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                              Submitting...
                            </>
                          ) : tableEntries.every(e => e.status === 'submitted') ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                              Submitted
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5 mr-1.5" />
                              Submit to CVO
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuarterlyReport;