"use client";

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Pencil,
  Trash2,
  Table2,
  FileText,
  ShoppingCart,
  ChevronRight,
  ChevronLeft,
  ClipboardList,
} from 'lucide-react';
import { QuarterlyFormEntry } from '@/types/types';
import { QuarterlyFormDialog } from './QuarterlyFormDialog';

interface QuarterlyFormTableProps {
  entries: QuarterlyFormEntry[];
  onAddEntry: (entry: QuarterlyFormEntry) => void;
  onUpdateEntry: (entry: QuarterlyFormEntry) => void;
  onDeleteEntry: (entryId: string) => void;
  showNewEntry: boolean;
  setShowNewEntry: (show: boolean) => void;
  natureOptions: any[];
  poOptions: any[];
  natureLoading: boolean;
  poLoading: boolean;
  canViewPO: boolean;
  showNature: boolean;      // ✅ NEW — nature column for ALL categories
  showNatureAndPO: boolean; // existing — PO column for Cat I & II only
  fetchPOList: () => void;
  filterOption: (option: any, inputValue: string) => boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCost = (value: number) => value.toFixed(2);

const formatPercentage = (value: number) =>
  value > 0 ? `+${value.toFixed(2)}%` : `${value.toFixed(2)}%`;

const formatDate = (date: string | null | undefined) =>
  date
    ? new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '-';

// ─── Expand Toggle Cell ───────────────────────────────────────────────────────

const ExpandToggleCell = ({
  expanded,
  onToggle,
  isHeader = false,
}: {
  expanded: boolean;
  onToggle: () => void;
  isHeader?: boolean;
}) => {
  if (isHeader) {
    return (
      <TableHead className="w-[44px] p-0">
        <button
          onClick={onToggle}
          title={expanded ? 'Hide extra columns' : 'Show all columns'}
          className="
            w-full h-full flex flex-col items-center justify-center gap-0.5 py-3 px-1
            group/toggle relative overflow-hidden transition-all duration-200
            hover:bg-blue-50
          "
        >
          <div className={`
            flex items-center justify-center w-5 h-5 rounded-full
            transition-all duration-300
            ${expanded
              ? 'bg-blue-100 text-blue-600'
              : 'bg-slate-200 text-slate-500 group-hover/toggle:bg-blue-100 group-hover/toggle:text-blue-600'
            }
          `}>
            {expanded
              ? <ChevronLeft className="w-3 h-3" />
              : <ChevronRight className="w-3 h-3" />
            }
          </div>
          <span
            className={`
              text-[9px] font-semibold uppercase tracking-widest
              select-none leading-none transition-colors duration-200
              ${expanded ? 'text-blue-500' : 'text-slate-400 group-hover/toggle:text-blue-500'}
            `}
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            {expanded ? 'less' : 'more'}
          </span>
        </button>
      </TableHead>
    );
  }

  return (
    <TableCell className="w-[44px] p-0">
      <div className="flex items-center justify-center h-full py-2">
        <div className={`
          w-px self-stretch
          ${expanded ? 'bg-blue-200' : 'bg-slate-200'}
          transition-colors duration-300
        `} />
      </div>
    </TableCell>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const QuarterlyFormTable: React.FC<QuarterlyFormTableProps> = ({
  entries,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  showNewEntry,
  setShowNewEntry,
  natureOptions,
  poOptions,
  natureLoading,
  poLoading,
  canViewPO,
  showNature,
  showNatureAndPO,
  fetchPOList,
  filterOption,
}) => {
  const [editingEntry, setEditingEntry] = useState<QuarterlyFormEntry | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [colExpanded, setColExpanded] = useState(false);

  const showExtra = colExpanded;

  // ✅ Nature col shows for ALL categories; PO col only for Cat I & II
  const totalCols =
    2 +                          // # + actions
    1 +                          // expand toggle
    (showNature ? 1 : 0) +       // nature col
    (showNatureAndPO ? 1 : 0) +  // PO col
    6 +                          // core cols
    (showExtra ? 5 : 0);         // extra cols

  const handleEdit = (entry: QuarterlyFormEntry) => {
    setEditingEntry(entry);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingEntry(null);
    setDialogOpen(true);
  };

  const handleSave = (entry: QuarterlyFormEntry) => {
    if (editingEntry) {
      onUpdateEntry({ ...entry, id: editingEntry.id, sno: editingEntry.sno });
    } else {
      onAddEntry(entry);
    }
    setDialogOpen(false);
    setEditingEntry(null);
  };

  const handleDelete = (entryId: string) => {
    if (deleteConfirm === entryId) {
      onDeleteEntry(entryId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(entryId);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  return (
    <div className="space-y-3">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-blue-50">
            <ClipboardList className="w-4 h-4 text-blue-700" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-800">Report Entries</h3>
            {entries.length > 0 && (
              <p className="text-xs text-slate-400">
                {entries.length} {entries.length === 1 ? 'entry' : 'entries'} added
              </p>
            )}
          </div>
        </div>
        <Button
          onClick={handleAdd}
          size="sm"
          className="bg-blue-700 hover:bg-blue-800 text-white h-8 px-3 gap-1.5 text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Entry
        </Button>
      </div>

      {/* ── Table ── */}
      <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">

                {/* S.No */}
                <TableHead className="w-[52px] text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  #
                </TableHead>

                {/* ✅ Nature — Cat I, II, III */}
                {showNature && (
                  <TableHead className="min-w-[150px] text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      Nature
                    </div>
                  </TableHead>
                )}

                {/* ✅ PO — Cat I & II only */}
                {showNatureAndPO && (
                  <TableHead className="min-w-[130px] text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    <div className="flex items-center gap-1">
                      <ShoppingCart className="w-3 h-3" />
                      PO No.
                    </div>
                  </TableHead>
                )}

                {/* Core columns */}
                <TableHead className="min-w-[200px] text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Name of Work
                </TableHead>
                <TableHead className="min-w-[110px] text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Est. Cost (₹L)
                </TableHead>
                <TableHead className="min-w-[110px] text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Tendered (₹L)
                </TableHead>
                <TableHead className="min-w-[80px] text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  % ±SOR
                </TableHead>
                <TableHead className="min-w-[140px] text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Agency
                </TableHead>
                <TableHead className="min-w-[110px] text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Progress
                </TableHead>

                {/* Extra columns */}
                {showExtra && (
                  <TableHead className="min-w-[120px] text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Agmt./LOA No.
                  </TableHead>
                )}
                {showExtra && (
                  <TableHead className="min-w-[100px] text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Start Date
                  </TableHead>
                )}
                {showExtra && (
                  <TableHead className="min-w-[100px] text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Completion
                  </TableHead>
                )}
                {showExtra && (
                  <TableHead className="min-w-[130px] text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Engineer
                  </TableHead>
                )}
                {showExtra && (
                  <TableHead className="min-w-[140px] text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Remarks
                  </TableHead>
                )}

                {/* Expand toggle */}
                <ExpandToggleCell
                  expanded={showExtra}
                  onToggle={() => setColExpanded((p) => !p)}
                  isHeader
                />

                {/* Actions */}
                <TableHead className="w-[80px] text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {entries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={totalCols} className="py-14 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <Table2 className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">No entries yet</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Add your first entry to get started
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAdd}
                        className="mt-1 h-8 text-xs border-slate-200 gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add First Entry
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                entries.map((entry) => (
                  <TableRow
                    key={entry.id}
                    className="hover:bg-slate-50/80 transition-colors group border-b border-slate-100 last:border-0"
                  >
                    {/* S.No */}
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                        {entry.sno}
                      </span>
                    </TableCell>

                    {/* ✅ Nature — Cat I, II, III */}
                    {showNature && (
                      <TableCell>
                        <span className="text-xs text-slate-600 font-medium">
                          {entry.natureOfContract || '-'}
                        </span>
                      </TableCell>
                    )}

                    {/* ✅ PO — Cat I & II only */}
                    {showNatureAndPO && (
                      <TableCell>
                        <span className="text-xs font-mono text-blue-700">
                          {entry.poNumber || '-'}
                        </span>
                      </TableCell>
                    )}

                    {/* Name of Work */}
                    <TableCell>
                      <p className="text-sm font-medium text-slate-800 max-w-[200px] truncate">
                        {entry.nameOfWork}
                      </p>
                    </TableCell>

                    {/* Est. Cost */}
                    <TableCell className="text-right">
                      <span className="font-mono text-sm text-slate-700">
                        {formatCost(entry.estimatedCostLacs)}
                      </span>
                    </TableCell>

                    {/* Tendered */}
                    <TableCell className="text-right">
                      <span className="font-mono text-sm text-slate-700">
                        {formatCost(entry.tenderedCostLacs)}
                      </span>
                    </TableCell>

                    {/* % SOR */}
                    <TableCell className="text-right">
                      <span className={`font-mono text-sm font-medium ${
                        entry.percentageAboveBelowSOR > 0
                          ? 'text-red-500'
                          : entry.percentageAboveBelowSOR < 0
                          ? 'text-emerald-600'
                          : 'text-slate-500'
                      }`}>
                        {formatPercentage(entry.percentageAboveBelowSOR)}
                      </span>
                    </TableCell>

                    {/* Agency */}
                    <TableCell>
                      <span className="text-sm text-slate-700 max-w-[130px] truncate block">
                        {entry.agency || '-'}
                      </span>
                    </TableCell>

                    {/* Progress */}
                    <TableCell>
                      <div className="space-y-1 min-w-[90px]">
                        <span className="text-xs font-medium text-slate-700">
                          {entry.physicalProgress || '0'}%
                        </span>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div
                            className="bg-blue-500 h-1.5 rounded-full transition-all"
                            style={{
                              width: `${Math.min(parseFloat(entry.physicalProgress || '0'), 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </TableCell>

                    {/* Extra cells */}
                    {showExtra && (
                      <TableCell>
                        <span className="font-mono text-xs text-slate-600">
                          {entry.agmtLOANo || '-'}
                        </span>
                      </TableCell>
                    )}
                    {showExtra && (
                      <TableCell>
                        <span className="text-xs text-slate-600">
                          {formatDate(entry.dateOfStart)}
                        </span>
                      </TableCell>
                    )}
                    {showExtra && (
                      <TableCell>
                        <span className="text-xs text-slate-600">
                          {formatDate(entry.timeOfCompletion)}
                        </span>
                      </TableCell>
                    )}
                    {showExtra && (
                      <TableCell>
                        <span className="text-xs text-slate-600 max-w-[120px] truncate block">
                          {entry.engineerInCharge || '-'}
                        </span>
                      </TableCell>
                    )}
                    {showExtra && (
                      <TableCell>
                        <span className="text-xs text-slate-500 max-w-[130px] truncate block">
                          {entry.remarks || '-'}
                        </span>
                      </TableCell>
                    )}

                    {/* Expand toggle */}
                    <ExpandToggleCell
                      expanded={showExtra}
                      onToggle={() => setColExpanded((p) => !p)}
                    />

                    {/* Actions */}
                    <TableCell>
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(entry)}
                          className="h-7 w-7 p-0 hover:bg-blue-50 hover:text-blue-700 rounded-md"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(entry.id)}
                          className={`h-7 w-7 p-0 rounded-md transition-colors ${
                            deleteConfirm === entry.id
                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                              : 'hover:bg-red-50 hover:text-red-500'
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ── Dialog ── */}
      <QuarterlyFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        entry={editingEntry}
        onSave={handleSave}
        nextSno={entries.length + 1}
        natureOptions={natureOptions}
        poOptions={poOptions}
        natureLoading={natureLoading}
        poLoading={poLoading}
        canViewPO={canViewPO}
        showNature={showNature}          // ✅ passed to dialog
        showNatureAndPO={showNatureAndPO} // ✅ passed to dialog
        onFetchPO={fetchPOList}
        filterOption={filterOption}
      />
    </div>
  );
};