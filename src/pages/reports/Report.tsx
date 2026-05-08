'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { DataTable } from '@/components/ui/data-table2';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  getPendingReports,
  selectPendingReports,
  selectPendingReportsLoading,
  selectSubmitting,
  submitReport,
} from '@/features/CVO/GetReportsSlice';
import { ColumnDef, VisibilityState } from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Building2, User, CheckCheck, Loader2, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { RootState } from '@/app/store';
import { getNewUnit } from '@/features/dmsApi/GetUnitsSlice';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TimeOfCompletion {
  id: number;
  completionDate: string;
  type: string;
}

interface Report {
  reportId: number;
  poNo: string;
  unitId: number | null;
  department: string;
  userEmpCode: number;
  categoryType: string;
  thresholdValue: number;
  periodStartDate: string | null;
  periodEndDate: string | null;
  nameOfWorkAndLocation: string | null;
  estimatedCostLacs: number;
  tenderedCostLacs: number | null;
  percentAboveBelowSOR: number | null;
  agreementNo: string | null;
  agency: string;
  dateOfStart: string | null;
  physicalProgress: number;
  engineerInChargeDetails: string | null;
  remarks: string | null;
  gst: number | null;
  cgst: number | null;
  sgst: number | null;
  reportStatusId: number;
  reportIsDraft: boolean;
  timeOfCompletions: TimeOfCompletion[];
  attachments: any[];
}

interface SubmissionBatch {
  submissionBatchId: number;
  submittedByEmpCode: number;
  submissionDate: string;
  batchComment: string | null;
  isDraftBatch: boolean;
  reports: Report[];
}

interface FlattenedReport {
  submissionBatchId: number;
  submittedByEmpCode: number;
  submissionDate: string;
  batchComment: string | null;
  isDraftBatch: boolean;
  reportId: number;
  poNo: string;
  department: string;
  categoryType: string;
  nameOfWorkAndLocation: string | null;
  estimatedCostLacs: number;
  tenderedCostLacs: number | null;
  percentAboveBelowSOR: number | null;
  agreementNo: string | null;
  agency: string;
  dateOfStart: string | null;
  timeOfCompletion: string | null;
  physicalProgress: number;
  engineerInChargeDetails: string | null;
  remarks: string | null;
  reportStatusId: number;
  reportIsDraft: boolean;
  originalReport: Report;
  originalBatch: SubmissionBatch;
}

interface Unit {
  id: number;
  name: string;
  sequenceID: number;
  abbrivation: string;
  suCode: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCurrency = (amount: number | null) => {
  if (amount === null || amount === undefined) return '-';
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// ─── TabTable ─────────────────────────────────────────────────────────────────

interface TabTableProps {
  data: FlattenedReport[];
  columns: ColumnDef<FlattenedReport>[];
  loading: boolean;
  submitting: boolean;
  onApprove: (selected: FlattenedReport[]) => void;
  // ✅ showPO: true for Cat I & II, false for Cat III
  showPO: boolean;
}

const TabTable = ({
  data,
  columns,
  loading,
  submitting,
  onApprove,
  showPO,
}: TabTableProps) => {
  const [selectedReports, setSelectedReports] = useState<FlattenedReport[]>([]);

  // ✅ Derive column visibility from showPO prop
  const columnVisibility = useMemo<VisibilityState>(
    () => ({ poNo: showPO }),
    [showPO]
  );

  const selectedRowKeys = useMemo(
    () => selectedReports.map((r) => r.reportId),
    [selectedReports]
  );

  const selectedBatchIds = useMemo(() => {
    const eligible = selectedReports.filter(
      (r) => !r.reportIsDraft && r.reportStatusId !== 3
    );
    return [...new Set(eligible.map((r) => r.submissionBatchId))];
  }, [selectedReports]);

  const pendingInTab = useMemo(
    () => data.filter((r) => !r.reportIsDraft && r.reportStatusId !== 3),
    [data]
  );

  const handleApproveClick = () => {
    if (selectedBatchIds.length === 0) {
      onApprove(pendingInTab);
    } else {
      onApprove(selectedReports);
    }
  };

  React.useEffect(() => {
    setSelectedReports([]);
  }, [data]);

  return (
    <div>
      <DataTable
        data={data}
        columns={columns}
        columnVisibility={columnVisibility}     // ✅ controlled externally
        showSelect={true}
        onSelectionChange={setSelectedReports}
        selectedRowKeys={selectedRowKeys}
        rowKeyAccessor={(row) => row.reportId}
        loading={loading}
        showSearch={false}
        searchPlaceholder="Search reports..."
        showPagination={true}
        pageSizeOptions={[5, 10, 20, 50]}
        defaultPageSize={10}
      />

      {pendingInTab.length > 0 && (
        <div className="flex justify-end mt-4">
          <Button
            onClick={handleApproveClick}
            disabled={submitting}
            className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white shadow gap-2"
          >
            <CheckCheck className="w-4 h-4" />
            {selectedBatchIds.length > 0
              ? `Approve Selected (${selectedBatchIds.length})`
              : `Approve All (${pendingInTab.length})`}
          </Button>
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const ReportList = () => {
  const dispatch = useAppDispatch();
  const pendingReports = useAppSelector(selectPendingReports);
  const loading = useAppSelector(selectPendingReportsLoading);
  const submitting = useAppSelector(selectSubmitting);
  const user = useAppSelector((state: RootState) => state.user);
  const units: Unit[] = useAppSelector(
    (state: RootState) => state.units?.units?.unit ?? []
  );

  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  const [department, setDepartment] = useState<string>('');
  const [poNo, setPoNo] = useState<string>('');
  const [poNoInput, setPoNoInput] = useState<string>('');

  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [pendingApproveReports, setPendingApproveReports] = useState<FlattenedReport[]>([]);
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    dispatch(getNewUnit());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getPendingReports({ unitId: selectedUnitId, department, poNo }));
  }, [dispatch, selectedUnitId, department, poNo]);

  const flattenedData = useMemo(() => {
    const result: FlattenedReport[] = [];
    pendingReports?.forEach((batch: SubmissionBatch) => {
      if (!batch) return;
      batch.reports?.forEach((report: Report) => {
        if (!report) return;
        const firstCompletion =
          report.timeOfCompletions?.length > 0
            ? report.timeOfCompletions[0].completionDate
            : null;

        result.push({
          submissionBatchId:      batch.submissionBatchId,
          submittedByEmpCode:     batch.submittedByEmpCode,
          submissionDate:         batch.submissionDate,
          batchComment:           batch.batchComment ?? null,
          isDraftBatch:           batch.isDraftBatch ?? false,
          reportId:               report.reportId,
          poNo:                   report.poNo ?? '',
          department:             report.department ?? '',
          categoryType:           report.categoryType ?? '1',
          nameOfWorkAndLocation:  report.nameOfWorkAndLocation ?? null,
          estimatedCostLacs:      report.estimatedCostLacs ?? 0,
          tenderedCostLacs:       report.tenderedCostLacs ?? null,
          percentAboveBelowSOR:   report.percentAboveBelowSOR ?? null,
          agreementNo:            report.agreementNo ?? null,
          agency:                 report.agency ?? '',
          dateOfStart:            report.dateOfStart ?? null,
          timeOfCompletion:       firstCompletion,
          physicalProgress:       report.physicalProgress ?? 0,
          engineerInChargeDetails: report.engineerInChargeDetails ?? null,
          remarks:                report.remarks ?? null,
          reportStatusId:         report.reportStatusId ?? 0,
          reportIsDraft:          report.reportIsDraft ?? false,
          originalReport:         report,
          originalBatch:          batch,
        });
      });
    });
    return result;
  }, [pendingReports]);

  const departmentOptions = useMemo(
    () => [...new Set(flattenedData.map((r) => r.department).filter(Boolean))].sort(),
    [flattenedData]
  );

  const cat1Data = useMemo(() => flattenedData.filter((r) => r.categoryType === '1'), [flattenedData]);
  const cat2Data = useMemo(() => flattenedData.filter((r) => r.categoryType === '2'), [flattenedData]);
  const cat3Data = useMemo(() => flattenedData.filter((r) => r.categoryType === '3'), [flattenedData]);

  const selectedBatchIds = useMemo(() => {
    const eligible = pendingApproveReports.filter(
      (r) => !r.reportIsDraft && r.reportStatusId !== 3
    );
    return [...new Set(eligible.map((r) => r.submissionBatchId))];
  }, [pendingApproveReports]);

  const eligibleCount = useMemo(
    () => pendingApproveReports.filter((r) => !r.reportIsDraft && r.reportStatusId !== 3).length,
    [pendingApproveReports]
  );

  const handleApproveSelected = async () => {
    if (selectedBatchIds.length === 0) {
      toast.error('No eligible reports to approve');
      return;
    }
    const resultAction = await dispatch(
      submitReport({
        submissionBatchIds: selectedBatchIds,
        approverEmpCode:    user?.EmpCode ?? 0,
        approverRole:       user?.Designation ?? '',
        action:             2,
        remarks,
      })
    );
    if (submitReport.fulfilled.match(resultAction)) {
      setApproveDialogOpen(false);
      setRemarks('');
      setPendingApproveReports([]);
      dispatch(getPendingReports({ unitId: selectedUnitId, department, poNo }));
    }
  };

  const handleClearFilters = () => {
    setSelectedUnitId(null);
    setDepartment('');
    setPoNo('');
    setPoNoInput('');
  };

  const hasActiveFilters = !!(selectedUnitId || department || poNo);

  const tabConfig = [
    { value: 'cat1', label: 'Category I',   data: cat1Data, showPO: true  },
    { value: 'cat2', label: 'Category II',  data: cat2Data, showPO: true  },
    { value: 'cat3', label: 'Category III', data: cat3Data, showPO: false }, // ✅ PO hidden
  ];

  const columns: ColumnDef<FlattenedReport>[] = useMemo(
    () => [
      {
        id: 'sno',
        header: 'S. No.',
        enableHiding: false,   // ✅ always visible
        cell: ({ row }) => (
          <span className="text-sm text-slate-600">{row.index + 1}</span>
        ),
        size: 50,
      },
      {
        accessorKey: 'nameOfWorkAndLocation',
        header: 'Name of Work & Location',
        enableHiding: false,   // ✅ always visible
        cell: ({ getValue }) => (
          <span className="text-sm">{(getValue() as string) || '-'}</span>
        ),
        size: 250,
      },
      {
        accessorKey: 'estimatedCostLacs',
        header: 'Est. Cost (₹ Lacs)',
        cell: ({ getValue }) => (
          <span className="font-mono text-sm text-right block">
            {formatCurrency(getValue() as number)}
          </span>
        ),
        size: 130,
      },
      {
        accessorKey: 'tenderedCostLacs',
        header: 'Tendered Cost (₹ Lacs)',
        cell: ({ getValue }) => (
          <span className="font-mono text-sm text-right block">
            {formatCurrency(getValue() as number | null)}
          </span>
        ),
        size: 150,
      },
      {
        accessorKey: 'percentAboveBelowSOR',
        header: '% Above/Below SOR',
        cell: ({ getValue }) => {
          const value = getValue() as number | null;
          if (value === null || value === undefined)
            return <span className="text-sm">-</span>;
          return (
            <span
              className={`text-sm font-medium ${
                value > 0
                  ? 'text-red-600'
                  : value < 0
                  ? 'text-emerald-600'
                  : 'text-slate-600'
              }`}
            >
              {value > 0 ? '+' : ''}{value}%
            </span>
          );
        },
        size: 100,
      },
      {
        accessorKey: 'agreementNo',
        header: 'Agmt./LOA No.',
        cell: ({ getValue }) => (
          <span className="text-sm font-mono">{(getValue() as string) || '-'}</span>
        ),
        size: 120,
      },
      {
        accessorKey: 'agency',
        header: 'Agency',
        cell: ({ getValue }) => (
          <div className="flex items-center gap-1">
            <Building2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <span className="text-sm">{getValue() as string}</span>
          </div>
        ),
        size: 180,
      },
      {
        accessorKey: 'dateOfStart',
        header: 'Date of Start',
        cell: ({ getValue }) => (
          <span className="text-sm">{formatDate(getValue() as string)}</span>
        ),
        size: 110,
      },
      {
        accessorKey: 'timeOfCompletion',
        header: 'Time of Completion',
        cell: ({ getValue }) => (
          <span className="text-sm">{formatDate(getValue() as string)}</span>
        ),
        size: 120,
      },
      {
        accessorKey: 'physicalProgress',
        header: 'Physical Progress',
        cell: ({ getValue }) => {
          const progress = getValue() as number;
          return (
            <div className="space-y-1 min-w-[100px]">
              <span className="text-sm font-medium">{progress}%</span>
              <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
          );
        },
        size: 130,
      },
      {
        accessorKey: 'engineerInChargeDetails',
        header: 'Engineer in Charge',
        cell: ({ getValue }) => (
          <div className="flex items-center gap-1">
            <User className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <span className="text-sm">{(getValue() as string) || '-'}</span>
          </div>
        ),
        size: 170,
      },
      {
        accessorKey: 'remarks',
        header: 'Remarks',
        cell: ({ getValue }) => (
          <span className="text-sm text-slate-600 max-w-[200px] truncate block">
            {(getValue() as string) || '-'}
          </span>
        ),
        size: 150,
      },
      {
        // ✅ PO Number — hidden for Cat III via columnVisibility prop
        accessorKey: 'poNo',
        header: 'PO Number',
        cell: ({ getValue }) => (
          <span className="font-medium text-blue-800 text-sm font-mono">
            {(getValue() as string) || '-'}
          </span>
        ),
        size: 140,
      },
    ],
    []
  );

  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader className="pb-4 border-b border-slate-100">
          <CardTitle className="text-xl font-bold text-blue-800">Reports</CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          <Tabs defaultValue="cat1">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">

              {/* Left — Category Tabs */}
              <TabsList className="bg-slate-100 p-1 rounded-lg">
                {tabConfig.map(({ value, label, data }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className="relative data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm rounded-md px-4 py-1.5 text-sm font-medium transition-all"
                  >
                    {label}
                    {data.length > 0 && (
                      <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                        {data.length}
                      </span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Right — Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Unit */}
                <Select
                  value={selectedUnitId ? String(selectedUnitId) : 'all'}
                  onValueChange={(val) =>
                    setSelectedUnitId(val === 'all' ? null : Number(val))
                  }
                  disabled={loading}
                >
                  <SelectTrigger className="w-[150px] h-8 text-xs border-slate-200">
                    <SelectValue placeholder="All Units" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Units</SelectItem>
                    <div className="h-px bg-slate-100 my-1" />
                    {[...units]
                      .sort((a, b) => a.sequenceID - b.sequenceID)
                      .map((unit) => (
                        <SelectItem key={unit.id} value={String(unit.id)}>
                          <span className="flex items-center gap-2">
                            <span className="text-xs font-mono text-slate-400 w-10">
                              {unit.abbrivation}
                            </span>
                            {unit.name}
                          </span>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                {/* Department */}
                <Select
                  value={department || 'all'}
                  onValueChange={(val) => setDepartment(val === 'all' ? '' : val)}
                  disabled={loading}
                >
                  <SelectTrigger className="w-[140px] h-8 text-xs border-slate-200">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <div className="h-px bg-slate-100 my-1" />
                    {departmentOptions.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* PO Number */}
                <div className="flex gap-1">
                  <Input
                    value={poNoInput}
                    onChange={(e) => setPoNoInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setPoNo(poNoInput.trim());
                    }}
                    placeholder="PO Number..."
                    className="w-[120px] h-8 text-xs border-slate-200"
                    disabled={loading}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-2.5 border-slate-200"
                    onClick={() => setPoNo(poNoInput.trim())}
                    disabled={loading}
                  >
                    <Search className="w-3 h-3" />
                  </Button>
                </div>

                {/* Clear all */}
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-slate-400 hover:text-red-500 gap-1"
                    onClick={handleClearFilters}
                  >
                    <X className="w-3 h-3" />
                    Clear
                  </Button>
                )}

                {/* Active filter pills */}
                {hasActiveFilters && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {selectedUnitId && (
                      <Badge
                        className="bg-blue-50 text-blue-700 border-blue-200 cursor-pointer hover:bg-blue-100 text-xs h-6"
                        onClick={() => setSelectedUnitId(null)}
                      >
                        {units.find((u) => u.id === selectedUnitId)?.name ?? 'Unit'} ✕
                      </Badge>
                    )}
                    {department && (
                      <Badge
                        className="bg-purple-50 text-purple-700 border-purple-200 cursor-pointer hover:bg-purple-100 text-xs h-6"
                        onClick={() => setDepartment('')}
                      >
                        {department} ✕
                      </Badge>
                    )}
                    {poNo && (
                      <Badge
                        className="bg-amber-50 text-amber-700 border-amber-200 cursor-pointer hover:bg-amber-100 text-xs h-6"
                        onClick={() => { setPoNo(''); setPoNoInput(''); }}
                      >
                        PO: {poNo} ✕
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── Tab Content ── */}
            {tabConfig.map(({ value, data, showPO }) => (
              <TabsContent key={value} value={value}>
                <TabTable
                  data={data}
                  columns={columns}
                  loading={loading}
                  submitting={submitting}
                  showPO={showPO}   // ✅ Cat III gets false
                  onApprove={(reports) => {
                    setPendingApproveReports(reports);
                    setApproveDialogOpen(true);
                  }}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* ── Approve Dialog ── */}
      <Dialog
        open={approveDialogOpen}
        onOpenChange={(open) => {
          if (!submitting) {
            setApproveDialogOpen(open);
            if (!open) setRemarks('');
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl text-emerald-800 flex items-center gap-2">
              <CheckCheck className="w-5 h-5" />
              Approve Reports
            </DialogTitle>
            <DialogDescription>
              You are about to approve{' '}
              <strong>{selectedBatchIds.length}</strong> batch
              {selectedBatchIds.length !== 1 ? 'es' : ''} containing{' '}
              <strong>{eligibleCount}</strong> eligible report(s).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="bg-slate-50 rounded-lg p-3 text-sm">
              <p className="font-medium text-slate-700 mb-2">Reports to be approved:</p>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {pendingApproveReports
                  .filter((r) => !r.reportIsDraft && r.reportStatusId !== 3)
                  .slice(0, 10)
                  .map((report) => (
                    <div key={report.reportId} className="text-xs text-slate-600 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 flex-shrink-0" />
                      {report.nameOfWorkAndLocation || '-'} — {report.poNo}
                    </div>
                  ))}
                {eligibleCount > 10 && (
                  <p className="text-xs text-slate-500 italic">
                    ...and {eligibleCount - 10} more
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700">
                Remarks{' '}
                <span className="text-slate-400 font-normal">(Optional)</span>
              </Label>
              <Textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add approval remarks..."
                className="border-slate-200"
                rows={3}
                disabled={submitting}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => { setApproveDialogOpen(false); setRemarks(''); }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApproveSelected}
              disabled={submitting || selectedBatchIds.length === 0}
              className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white gap-2"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Approving...</>
              ) : (
                <><CheckCheck className="w-4 h-4" />Confirm Approve</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportList;