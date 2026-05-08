// components/QuarterlyReport.tsx
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Loader2, Send, CheckCircle2, AlertCircle, Calendar,
  FileText, IndianRupee, Save, FileEdit, Lock, AlertTriangle,
} from 'lucide-react';
import { QuarterlyFormTable } from './QuaterlyFormTable';
import MyDrafts from '../MyDrafts/MyDrafts';
import {
  Category, Quarter, FormData, QuarterlyFormEntry, WorkflowStatus,
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
  selectDraftBatchId,
} from '@/features/SubmitReport/SubmitReportSlice';
import { getCadreAllotments } from '@/features/CadreApi/CadreSlice';

const getCurrentQuarter = (): Quarter => {
  const month = new Date().getMonth();
  if (month < 3) return 'Q1';
  if (month < 6) return 'Q2';
  if (month < 9) return 'Q3';
  return 'Q4';
};

const INITIAL_FORM_DATA: FormData = {
  quarter: getCurrentQuarter(),
  year: new Date().getFullYear().toString(),
  category: 'I',
  contractNature: '',
  poId: '',
};

const QuarterlyReport: React.FC = () => {
  const dispatch = useAppDispatch();

  const { natureList, loading: natureLoading, error: natureError } = useAppSelector((state) => state.nature);
  const { data: poList, loading: poLoading, error: poError } = useAppSelector((state) => state.poDetails);
  const { data: cadreData } = useAppSelector((state) => state.cadreAllotment);
  const { loading: submitLoading, error: submitError } = useAppSelector((state) => state.submitReport);
  const draftBatchId = useAppSelector(selectDraftBatchId);
  const user = useAppSelector((state: RootState) => state.user);

  const [activeMainTab, setActiveMainTab] = useState<string>('create');
  const [activeTab, setActiveTab] = useState<Category>('I');
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [tableEntries, setTableEntries] = useState<QuarterlyFormEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [cadreLoading, setCadreLoading] = useState(true);

  const quarterOptions = [
    { label: 'Q1 (Jan - Mar)', value: 'Q1' },
    { label: 'Q2 (Apr - Jun)', value: 'Q2' },
    { label: 'Q3 (Jul - Sep)', value: 'Q3' },
    { label: 'Q4 (Oct - Dec)', value: 'Q4' },
  ];

  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const y = (new Date().getFullYear() + i).toString();
    return { label: y, value: y };
  });

  const getCategoryId = (category: Category): string =>
    ({ I: '1', II: '2', III: '3' }[category]);

  const fetchContractNatures = useCallback((category: Category) => {
    dispatch(getNatureList(getCategoryId(category)));
  }, [dispatch]);

  // ── Role & permission logic ──────────────────────────────────────────────

  const userCadreData = useMemo(() => {
    if (!user?.EmpCode || !cadreData?.length) return [];
    return cadreData.filter(
      item => item.employeeCode === parseInt(user.EmpCode?.toString() || '0')
    );
  }, [cadreData, user]);

  const isCorporateOfficeUser = useMemo(() => {
    const unitId = user?.unitId || user?.Unit;
    return unitId == 396 || unitId === '396';
  }, [user]);

  const isGMOrGGM = useMemo(() => {
    const designation = user?.Designation?.toUpperCase() || '';
    return designation === 'GM' || designation === 'GGM';
  }, [user]);

  const isCGM = useMemo(
    () => userCadreData.some(item => item.roleAssigned === 'CGM'),
    [userCadreData]
  );

  const hasAccessPermission = useMemo(() => {
    if (cadreLoading) return true;
    if (isCorporateOfficeUser) return isGMOrGGM;
    return isCGM;
  }, [isCorporateOfficeUser, isGMOrGGM, isCGM, cadreLoading]);

  const canViewPO = useMemo(() => {
    if (activeTab === 'III') return false;
    if (!hasAccessPermission) return false;
    if (isCorporateOfficeUser) return isGMOrGGM;
    return isCGM;
  }, [isCorporateOfficeUser, isGMOrGGM, isCGM, activeTab, hasAccessPermission]);

  const assignedUnitNames = useMemo(
    () => [...new Set(userCadreData.map(item => item.assignedUnit))],
    [userCadreData]
  );

  // ── PO helpers ───────────────────────────────────────────────────────────

  const fetchPOList = useCallback(() => {
    if (activeTab === 'III' || !canViewPO) return;
    if (isCorporateOfficeUser && isGMOrGGM) {
      dispatch(getPODetails({
        Unit: user?.Unit?.toString() || 'Corporate Office',
        Dept: user?.Department || '',
      }));
    } else if (!isCorporateOfficeUser && isCGM) {
      dispatch(getPODetails({}));
    }
  }, [dispatch, activeTab, canViewPO, isCorporateOfficeUser, isGMOrGGM, isCGM, user]);

  const getFilteredPOList = useCallback(() => {
    if (!poList?.length) return [];
    if (isCorporateOfficeUser && isGMOrGGM) return poList;
    if (!isCorporateOfficeUser && isCGM && assignedUnitNames.length > 0) {
      return poList.filter((po: any) =>
        assignedUnitNames.some(
          unitName => po.unit?.toLowerCase() === unitName?.toLowerCase()
        )
      );
    }
    return poList;
  }, [poList, isCorporateOfficeUser, isGMOrGGM, isCGM, assignedUnitNames]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleQuarterChange = (option: any) =>
    setFormData(prev => ({ ...prev, quarter: option?.value || getCurrentQuarter() }));

  const handleYearChange = (option: any) =>
    setFormData(prev => ({ ...prev, year: option?.value || new Date().getFullYear().toString() }));

  const handleTabChange = (value: string) => {
    const category = value as Category;
    setActiveTab(category);
    setFormData(prev => ({ ...prev, category, contractNature: '', poId: '' }));
    dispatch(clearNatureList());
    dispatch(clearPOList());
    setTableEntries([]);
    fetchContractNatures(category);
  };

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setTableEntries([]);
    setError(null);
    setSuccessMessage(null);
    setActiveTab('I');
    dispatch(clearNatureList());
    dispatch(clearPOList());
    dispatch(resetSubmitState());
    fetchContractNatures('I');
  }, [dispatch, fetchContractNatures]);

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
    if (!hasAccessPermission) { setError('You do not have permission to submit reports'); return; }
    if (tableEntries.length === 0) { setError('Please add at least one entry before submitting'); return; }
    if (!formData.quarter || !formData.year) { setError('Please select quarter and year'); return; }
    setError(null);
    try {
      const resultAction = await dispatch(submitReport({ formData, tableEntries, user, comment: '' }));
      if (submitReport.fulfilled.match(resultAction)) {
        setSuccessMessage('Report submitted to CVO for approval successfully!');
        setTimeout(() => resetForm(), 2000);
      }
    } catch { setError('Failed to submit report'); }
  };

  const handleSaveDraft = async () => {
    if (!hasAccessPermission) { setError('You do not have permission to save drafts'); return; }
    if (tableEntries.length === 0) { setError('Please add at least one entry before saving'); return; }
    setError(null);
    try {
      const resultAction = await dispatch(saveReportDraft({
        formData, tableEntries, user,
        comment: 'Draft saved',
        batchId: draftBatchId || 0,
      }));
      if (saveReportDraft.fulfilled.match(resultAction)) {
        setSuccessMessage('Draft saved successfully!');
        setTimeout(() => resetForm(), 2000);
      }
    } catch { setError('Failed to save draft'); }
  };

  const canShowForm = () => hasAccessPermission;

  // ── Derived options ──────────────────────────────────────────────────────

  const displayPOList = useMemo(() => getFilteredPOList(), [getFilteredPOList]);

  const poOptions = displayPOList?.map((po: any) => ({
    label: po.poNo || `PO-${po.pktblSapDump || ''}`,
    value: po.poNo?.toString() || po.pktblSapDump?.toString(),
    searchValue: `${po.poNo || ''} ${po.supplierCode || ''} ${po.poOrderValue || ''}`,
    poData: po,
  })) || [];

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

  const filterOption = (option: any, inputValue: string) => {
    const searchValue = option.data?.searchValue || '';
    return searchValue.toLowerCase().includes(inputValue.toLowerCase());
  };

  // ── Effects ──────────────────────────────────────────────────────────────

  useEffect(() => {
    setCadreLoading(true);
    if (user?.unitId && user?.Designation) {
      dispatch(getCadreAllotments({ unitId: user.unitId, role: user.Designation }))
        .finally(() => setCadreLoading(false));
    } else {
      setCadreLoading(false);
    }
  }, [dispatch, user]);

  useEffect(() => { if (natureError) setError(natureError); }, [natureError]);
  useEffect(() => { if (poError) setError(poError); }, [poError]);
  useEffect(() => { if (submitError) setError(submitError); }, [submitError]);
  useEffect(() => {
    if (hasAccessPermission) {
      fetchContractNatures('I');
      fetchPOList();
    }
  }, [fetchContractNatures, hasAccessPermission]);

  // ── Loading / Access Denied screens ─────────────────────────────────────

  if (cadreLoading) {
    return (
      <div className="w-full mx-auto space-y-6 p-4 md:p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-800 mx-auto mb-4" />
          <p className="text-slate-600 text-lg">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  if (!hasAccessPermission) {
    return (
      <div className="w-full mx-auto space-y-6 p-4 md:p-8">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-12 pb-12">
            <div className="text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Access Denied</h2>
              <p className="text-slate-600 mb-4">
                You do not have permission to access the Quarterly Report module.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left">
                <h3 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Required Permissions:
                </h3>
                <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
                  {isCorporateOfficeUser ? (
                    <li>GM or GGM designation required for Corporate Office</li>
                  ) : (
                    <li>CGM role assignment required for non-Corporate Office units</li>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="w-full mx-auto space-y-6 p-4 md:p-8">
      <Tabs value={activeMainTab} onValueChange={setActiveMainTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="create" className="data-[state=active]:bg-blue-800 data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Create Report
            </TabsTrigger>
            <TabsTrigger value="drafts" className="data-[state=active]:bg-blue-800 data-[state=active]:text-white">
              <FileEdit className="w-4 h-4 mr-2" />
              My Drafts
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="create">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="pt-6">

              {/* Category tabs + Quarter/Year row */}
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
                      <Calendar className="w-3.5 h-3.5 inline mr-1" />Quarter
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

              {/* Tab content */}
              <Tabs value={activeTab} onValueChange={handleTabChange}>
                {(['I', 'II', 'III'] as Category[]).map((category) => (
                  <TabsContent key={category} value={category} className="space-y-4 mt-0">

                    {error && (
                      <div className="p-2.5 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <p className="text-red-700">{error}</p>
                        <Button variant="ghost" size="sm" onClick={() => setError(null)} className="ml-auto h-7 text-xs">
                          Dismiss
                        </Button>
                      </div>
                    )}

                    {successMessage && (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-md flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <p className="text-emerald-700">{successMessage}</p>
                      </div>
                    )}

                    {canShowForm() && (
                      <div className="space-y-4 animate-in fade-in duration-300">
                        <QuarterlyFormTable
                          entries={tableEntries}
                          onAddEntry={handleAddEntry}
                          onUpdateEntry={handleUpdateEntry}
                          onDeleteEntry={handleDeleteEntry}
                          showNewEntry={false}
                          setShowNewEntry={() => {}}
                          natureOptions={natureOptions}
                          poOptions={poOptions}
                          natureLoading={natureLoading}
                          poLoading={poLoading}
                          canViewPO={canViewPO}
                          // ✅ Nature shown for ALL categories (I, II, III)
                          showNature={true}
                          // ✅ PO shown only for Cat I & II (requiresPO=true)
                          showNatureAndPO={categoryInfo[category].requiresPO}
                          fetchPOList={fetchPOList}
                          filterOption={filterOption}
                        />

                        {tableEntries.length > 0 && (
                          <div className="flex justify-end gap-2">
                            <Button
                              onClick={handleSaveDraft}
                              variant="outline"
                              className="h-9 text-sm border-blue-200 text-blue-800 hover:bg-blue-50"
                              disabled={submitLoading}
                            >
                              {submitLoading
                                ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                                : <Save className="w-3.5 h-3.5 mr-1.5" />
                              }
                              {draftBatchId ? 'Update Draft' : 'Save Draft'}
                            </Button>
                            <Button
                              onClick={handleSubmitAllToCVO}
                              className="bg-blue-800 hover:bg-blue-900 h-9 text-sm"
                              disabled={submitLoading}
                            >
                              {submitLoading
                                ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Submitting...</>
                                : <><Send className="w-3.5 h-3.5 mr-1.5" />Submit to CVO</>
                              }
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
        </TabsContent>

        <TabsContent value="drafts">
          <MyDrafts />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuarterlyReport;