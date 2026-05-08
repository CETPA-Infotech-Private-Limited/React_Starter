// components/MyDrafts.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { DataTable } from '@/components/ui/data-table2';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { getMyDrafts, selectDraftsList, selectDraftsLoading } from '@/features/Drafts/MyDraftsSlice';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FileEdit,
  Calendar,
  Building2,
  Edit,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { RootState } from '@/app/store';
import DraftEditForm from './DraftEditForm';
import { submitReport } from '@/features/SubmitReport/submitReportSlice';
import toast from 'react-hot-toast';

// Types (same as before)
interface TimeOfCompletion {
  id: number;
  completionDate: string;
  type: string;
}

interface DraftReport {
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

interface DraftBatch {
  submissionBatchId: number;
  submittedByEmpCode: number;
  submissionDate: string;
  batchComment: string | null;
  isDraftBatch: boolean;
  reports: DraftReport[];
}

interface FlattenedDraft {
  submissionBatchId: number;
  submittedByEmpCode: number;
  submissionDate: string;
  batchComment: string | null;
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
  originalReport: DraftReport;
  originalBatch: DraftBatch;
}

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

const MyDrafts: React.FC = () => {
  const dispatch = useAppDispatch();
  const draftsList = useAppSelector(selectDraftsList);
  const loading = useAppSelector(selectDraftsLoading);
  const user = useAppSelector((state: RootState) => state.user);
  
  const [selectedBatch, setSelectedBatch] = useState<DraftBatch | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [submittingAll, setSubmittingAll] = useState(false);
  const [selectedBatchIds, setSelectedBatchIds] = useState<number[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch drafts
  const fetchDrafts = () => {
    if (user) {
      dispatch(getMyDrafts({
        empCode: user?.EmpCode?.toString() || '',
        unitId: user?.unitId || '',
        department: user?.Department || '',
      }));
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, [dispatch, user]);

  // Flatten data for table display
  const flattenedData = useMemo(() => {
    const result: FlattenedDraft[] = [];
    
    draftsList?.forEach((batch: DraftBatch) => {
      batch.reports?.forEach((report: DraftReport) => {
        const firstCompletion = report.timeOfCompletions && report.timeOfCompletions.length > 0 
          ? report.timeOfCompletions[0].completionDate 
          : null;

        result.push({
          submissionBatchId: batch.submissionBatchId,
          submittedByEmpCode: batch.submittedByEmpCode,
          submissionDate: batch.submissionDate,
          batchComment: batch.batchComment,
          reportId: report.reportId,
          poNo: report.poNo,
          department: report.department,
          categoryType: report.categoryType,
          nameOfWorkAndLocation: report.nameOfWorkAndLocation,
          estimatedCostLacs: report.estimatedCostLacs,
          tenderedCostLacs: report.tenderedCostLacs,
          percentAboveBelowSOR: report.percentAboveBelowSOR,
          agreementNo: report.agreementNo,
          agency: report.agency,
          dateOfStart: report.dateOfStart,
          timeOfCompletion: firstCompletion,
          physicalProgress: report.physicalProgress,
          engineerInChargeDetails: report.engineerInChargeDetails,
          remarks: report.remarks,
          originalReport: report,
          originalBatch: batch,
        });
      });
    });
    
    return result;
  }, [draftsList]);

  // Handle edit draft - Open the same quarterly form
  const handleEditDraft = (batch: DraftBatch) => {
    setSelectedBatch(batch);
    setShowEditForm(true);
  };

  // Handle back to drafts list
  const handleBackToList = () => {
    setSelectedBatch(null);
    setShowEditForm(false);
    fetchDrafts(); // Refresh drafts list
  };

  // Handle selection change
  const handleSelectionChange = (selectedRows: FlattenedDraft[]) => {
    // Get unique batch IDs from selected rows
    const batchIds = [...new Set(selectedRows.map(row => row.submissionBatchId))];
    setSelectedBatchIds(batchIds);
  };

  // Submit all selected drafts
  const handleSubmitAllDrafts = async () => {
    const batchesToSubmit = selectedBatchIds.length > 0 
      ? draftsList.filter(batch => selectedBatchIds.includes(batch.submissionBatchId))
      : draftsList; // If none selected, submit all

    if (batchesToSubmit.length === 0) {
      setError('No drafts to submit');
      return;
    }

    setSubmittingAll(true);
    setError(null);
    setSuccessMessage(null);

    let successCount = 0;
    let failCount = 0;

    for (const batch of batchesToSubmit) {
      try {
        // Convert batch reports to table entries format
        const tableEntries = batch.reports.map((report: DraftReport, index: number) => ({
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
          status: 'draft' as any,
        }));

        const formData = {
          quarter: 'Q1', // Default, will be overridden by period dates
          year: new Date().getFullYear().toString(),
          category: batch.reports[0]?.categoryType === '1' ? 'I' : batch.reports[0]?.categoryType === '2' ? 'II' : 'III',
          contractNature: batch.reports[0]?.categoryType || '1',
          poId: batch.reports[0]?.poNo || '',
        };

        const resultAction = await dispatch(submitReport({
          formData,
          tableEntries,
          user,
          comment: 'Submitted from drafts'
        }));

        if (submitReport.fulfilled.match(resultAction)) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (error) {
        failCount++;
      }
    }

    setSubmittingAll(false);

    if (successCount > 0 && failCount === 0) {
      setSuccessMessage(`Successfully submitted ${successCount} draft(s)!`);
      fetchDrafts(); // Refresh list
    } else if (successCount > 0 && failCount > 0) {
      setError(`Submitted ${successCount} draft(s), ${failCount} failed.`);
      fetchDrafts();
    } else {
      setError('Failed to submit drafts. Please try again.');
    }

    setTimeout(() => {
      setSuccessMessage(null);
      setError(null);
    }, 5000);
  };

  // Table columns with selection
  const columns: ColumnDef<FlattenedDraft>[] = useMemo(() => [
    {
      id: 'sno',
      header: 'S. No.',
      cell: ({ row }) => (
        <span className="text-sm text-slate-600">{row.index + 1}</span>
      ),
      size: 50,
    },
    {
      accessorKey: 'submissionBatchId',
      header: 'Batch ID',
      cell: ({ getValue }) => (
        <span className="font-mono text-sm">#{getValue()}</span>
      ),
      size: 80,
    },
    {
      accessorKey: 'nameOfWorkAndLocation',
      header: 'Name of Work & Location',
      cell: ({ getValue }) => (
        <span className="text-sm">{getValue() || '-'}</span>
      ),
      size: 200,
    },
    {
      accessorKey: 'poNo',
      header: 'PO Number',
      cell: ({ getValue }) => (
        <span className="font-medium text-blue-800 text-sm font-mono">{getValue()}</span>
      ),
      size: 140,
    },
    {
      accessorKey: 'agency',
      header: 'Agency',
      cell: ({ getValue }) => (
        <div className="flex items-center gap-1">
          <Building2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
          <span className="text-sm">{getValue()}</span>
        </div>
      ),
      size: 150,
    },
    {
      accessorKey: 'estimatedCostLacs',
      header: 'Est. Cost (₹ Lacs)',
      cell: ({ getValue }) => (
        <span className="font-mono text-sm text-right block">
          {formatCurrency(getValue())}
        </span>
      ),
      size: 120,
    },
    {
      accessorKey: 'physicalProgress',
      header: 'Progress',
      cell: ({ getValue }) => {
        const progress = getValue() as number;
        return (
          <div className="space-y-1 min-w-[80px]">
            <span className="text-sm">{progress}%</span>
            <div className="w-full bg-slate-200 rounded-full h-1.5">
              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }} />
            </div>
          </div>
        );
      },
      size: 100,
    },
    {
      accessorKey: 'submissionDate',
      header: 'Saved Date',
      cell: ({ getValue }) => (
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="w-3 h-3 text-slate-400" />
          {formatDate(getValue() as string)}
        </div>
      ),
      size: 110,
    },
    {
      id: 'reportsCount',
      header: 'Entries',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs">
          {row.original.originalBatch.reports?.length || 0}
        </Badge>
      ),
      size: 70,
    },
    {
      id: 'type',
      header: 'Type',
      cell: () => (
        <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300 flex items-center gap-1 w-fit">
          <FileEdit className="w-3 h-3" />
          Draft
        </Badge>
      ),
      size: 90,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleEditDraft(row.original.originalBatch)}
          className="h-8 text-blue-800 hover:text-blue-900 hover:bg-blue-50"
        >
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </Button>
      ),
      size: 90,
    },
  ], []);

  // If a draft is selected for editing, show the edit form
  if (showEditForm && selectedBatch) {
    return (
      <DraftEditForm 
        batch={selectedBatch} 
        onBack={handleBackToList} 
      />
    );
  }

  // Otherwise show the drafts list
  return (
    <div className="space-y-4">
      {/* Submit All Button - Outside Card */}
      {draftsList.length > 0 && (
        <div className="flex items-center justify-between px-4 md:px-8">
          <div>
            {selectedBatchIds.length > 0 && (
              <span className="text-sm text-slate-600">
                {selectedBatchIds.length} batch(es) selected
              </span>
            )}
          </div>
          <Button
            onClick={handleSubmitAllDrafts}
            className="bg-blue-800 hover:bg-blue-900"
            disabled={submittingAll}
          >
            {submittingAll ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                {selectedBatchIds.length > 0 
                  ? `Submit Selected (${selectedBatchIds.length})` 
                  : 'Submit All Drafts'}
              </>
            )}
          </Button>
        </div>
      )}

      {/* Messages */}
      {error && (
        <div className="px-4 md:px-8">
          <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      {successMessage && (
        <div className="px-4 md:px-8">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <p className="text-emerald-700">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Drafts Table */}
      <div className="px-4 md:px-8">
        <Card>
          <CardHeader className="pb-4 border-b border-slate-100">
            <CardTitle className="text-xl font-bold text-blue-800">
              My Drafts
              {draftsList.length > 0 && (
                <Badge variant="outline" className="ml-2">
                  {draftsList.length} {draftsList.length === 1 ? 'Draft' : 'Drafts'}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <DataTable
              data={flattenedData}
              columns={columns}
              loading={loading}
              showSearch={true}
              searchPlaceholder="Search drafts..."
              showPagination={true}
              pageSizeOptions={[5, 10, 20, 50]}
              defaultPageSize={10}
              showSelect={true}
              onSelectionChange={handleSelectionChange}
              rowKeyAccessor={(row) => row.reportId}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyDrafts;