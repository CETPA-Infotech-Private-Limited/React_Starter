// components/QuarterlyFormTable.tsx
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
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  Send,
  Clock,
  Table2,
  AlertCircle,
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
}

const getStatusBadge = (status?: string) => {
  const statusConfig = {
    draft: { color: 'bg-slate-100 text-slate-700', icon: Clock },
    submitted: { color: 'bg-blue-100 text-blue-700', icon: Send },
    under_review: { color: 'bg-amber-100 text-amber-700', icon: Clock },
    approved: { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
    rejected: { color: 'bg-red-100 text-red-700', icon: AlertCircle },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
  const Icon = config.icon;

  return (
    <Badge className={`${config.color} flex items-center gap-1 w-fit`}>
      <Icon className="w-3 h-3" />
      {status?.replace('_', ' ').toUpperCase() || 'DRAFT'}
    </Badge>
  );
};

export const QuarterlyFormTable: React.FC<QuarterlyFormTableProps> = ({
  entries,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  showNewEntry,
  setShowNewEntry,
}) => {
  const [editingEntry, setEditingEntry] = useState<QuarterlyFormEntry | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

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

  const formatCost = (value: number) => {
    return value.toFixed(2);
  };

  const formatPercentage = (value: number) => {
    return value > 0 ? `+${value.toFixed(2)}%` : `${value.toFixed(2)}%`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
          <Table2 className="w-5 h-5" />
          Quarterly Report Entries
          {entries.length > 0 && (
            <Badge variant="outline" className="ml-2">
              {entries.length} {entries.length === 1 ? 'Entry' : 'Entries'}
            </Badge>
          )}
        </h3>
        <Button
          onClick={handleAdd}
          className="bg-blue-800 hover:bg-blue-900"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Entry
        </Button>
      </div>

      <div className="rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="w-[60px] font-semibold text-slate-700 text-center">
                  S. No.
                </TableHead>
                <TableHead className="min-w-[200px] font-semibold text-slate-700">
                  Name of Work & Location
                </TableHead>
                <TableHead className="min-w-[120px] font-semibold text-slate-700 text-right">
                  Est. Cost (₹ Lacs)
                </TableHead>
                <TableHead className="min-w-[120px] font-semibold text-slate-700 text-right">
                  Tendered Cost (₹ Lacs)
                </TableHead>
                <TableHead className="min-w-[100px] font-semibold text-slate-700 text-right">
                  % Above/Below SOR
                </TableHead>
                <TableHead className="min-w-[130px] font-semibold text-slate-700">
                  Agmt./LOA No.
                </TableHead>
                <TableHead className="min-w-[150px] font-semibold text-slate-700">
                  Agency
                </TableHead>
                <TableHead className="min-w-[110px] font-semibold text-slate-700">
                  Date of Start
                </TableHead>
                <TableHead className="min-w-[110px] font-semibold text-slate-700">
                  Completion Time
                </TableHead>
                <TableHead className="min-w-[130px] font-semibold text-slate-700">
                  Physical Progress
                </TableHead>
                <TableHead className="min-w-[150px] font-semibold text-slate-700">
                  Engineer in Charge
                </TableHead>
                <TableHead className="min-w-[150px] font-semibold text-slate-700">
                  Remarks
                </TableHead>
                <TableHead className="w-[120px] font-semibold text-slate-700 text-center">
                  Status
                </TableHead>
                <TableHead className="w-[100px] font-semibold text-slate-700 text-center">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={14} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <Table2 className="w-8 h-8 text-slate-300" />
                      <p className="text-slate-500">No entries added yet</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAdd}
                        className="mt-2"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Entry
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                entries.map((entry) => (
                  <TableRow key={entry.id} className="hover:bg-slate-50">
                    <TableCell className="text-center font-medium">
                      {entry.sno}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-800">{entry.nameOfWork}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{entry.location}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {formatCost(entry.estimatedCostLacs)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {formatCost(entry.tenderedCostLacs)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`font-mono text-sm ${
                        entry.percentageAboveBelowSOR > 0 
                          ? 'text-red-600' 
                          : entry.percentageAboveBelowSOR < 0 
                            ? 'text-emerald-600' 
                            : 'text-slate-600'
                      }`}>
                        {formatPercentage(entry.percentageAboveBelowSOR)}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {entry.agmtLOANo}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{entry.agency}</span>
                    </TableCell>
                    <TableCell className="text-sm">
                      {entry.dateOfStart ? new Date(entry.dateOfStart).toLocaleDateString('en-IN') : '-'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {entry.timeOfCompletion ? new Date(entry.timeOfCompletion).toLocaleDateString('en-IN') : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <span className="text-sm">{entry.physicalProgress}</span>
                        {entry.physicalProgress && (
                          <div className="w-full bg-slate-100 rounded-full h-1.5">
                            <div 
                              className="bg-blue-600 h-1.5 rounded-full" 
                              style={{ 
                                width: `${Math.min(parseFloat(entry.physicalProgress) || 0, 100)}%` 
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {entry.engineerInCharge}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600 max-w-[200px] truncate">
                      {entry.remarks || '-'}
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(entry.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(entry)}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="w-4 h-4 text-slate-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(entry.id)}
                          className={`h-8 w-8 p-0 ${
                            deleteConfirm === entry.id ? 'text-red-600' : 'text-slate-600'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Add/Edit Dialog */}
      <QuarterlyFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        entry={editingEntry}
        onSave={handleSave}
        nextSno={entries.length + 1}
      />
    </div>
  );
};