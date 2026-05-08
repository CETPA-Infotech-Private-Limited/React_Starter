'use client';

import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  flexRender,
  ColumnDef,
  Row,
  PaginationState,
  getFilteredRowModel,
  getPaginationRowModel,
  FilterFn,
  ExpandedState,
  VisibilityState,
} from '@tanstack/react-table';
import {
  ChevronDown,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Search,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Settings2,
  Loader2,
  Calendar,
  X,
  Loader,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import debounce from 'lodash/debounce';

// ─── Loader ───────────────────────────────────────────────────────────────────

// ─── Types ────────────────────────────────────────────────────────────────────

const nameSearchFilter: FilterFn<any> = (row, columnId, filterValue) => {
  const value = row.getValue(columnId);
  if (!value) return false;
  const searchTerm = String(filterValue ?? '').toLowerCase().trim();
  if (!searchTerm) return true;
  return String(value).toLowerCase().includes(searchTerm);
};

export type DateRange = { from?: Date; to?: Date };

type DataTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  showSearch?: boolean;
  searchPlaceholder?: string;
  leftElements?: React.ReactNode;
  RightElements?: React.ReactNode;
  renderRowSubComponent?: (props: { row: Row<TData>; original: TData }) => React.ReactNode;
  onRowClick?: (original: TData) => void;
  className?: string;
  showSelect?: boolean;
  onSelectionChange?: (selected: TData[]) => void;
  selectedRowKeys?: (string | number)[];
  rowKeyAccessor?: (row: TData) => string | number;
  // Server-side pagination
  totalRecords?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (pageIndex: number, pageSize: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  manualPagination?: boolean;
  loading?: boolean;
  showPagination?: boolean;
  // Search
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchDebounce?: number;
  customSearchFn?: (row: TData, searchTerm: string) => boolean;
  searchColumns?: string[];
  // Date filter
  showDateFilter?: boolean;
  dateRange?: DateRange;
  onDateRangeChange?: (dateRange: DateRange) => void;
  fromDatePlaceholder?: string;
  toDatePlaceholder?: string;
  maxDateRangeDays?: number;
  getRowClassName?: (row: TData) => string;
  // ✅ Column visibility
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: (visibility: VisibilityState) => void;
};

export function DataTable<TData>({
  data,
  columns,
  pageSizeOptions = [5, 10, 20, 30, 50, 100],
  defaultPageSize = 10,
  showSearch = true,
  searchPlaceholder = 'Search...',
  leftElements,
  RightElements,
  renderRowSubComponent,
  onRowClick,
  className = '',
  showSelect = false,
  onSelectionChange,
  selectedRowKeys = [],
  rowKeyAccessor,
  totalRecords = 0,
  currentPage = 0,
  pageSize: externalPageSize,
  onPageChange,
  onPageSizeChange,
  manualPagination = false,
  loading = false,
  showPagination = true,
  searchValue = '',
  onSearchChange,
  searchDebounce: searchDebounceMs = 300,
  customSearchFn,
  searchColumns = [],
  showDateFilter = false,
  dateRange,
  onDateRangeChange,
  fromDatePlaceholder = 'From date',
  toDatePlaceholder = 'To date',
  maxDateRangeDays,
  getRowClassName,
  // ✅ Column visibility props
  columnVisibility: externalColumnVisibility,
  onColumnVisibilityChange,
}: DataTableProps<TData>) {
  const [expanded, setExpanded] = React.useState<ExpandedState>({});
  const [globalFilter, setGlobalFilter] = React.useState(searchValue);
  const [internalDateRange, setInternalDateRange] = React.useState<DateRange>(dateRange ?? {});
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [currentlyExpandedId, setCurrentlyExpandedId] = React.useState<string | null>(null);

  // ✅ Internal column visibility state (used when no external state provided)
  const [internalColumnVisibility, setInternalColumnVisibility] =
    React.useState<VisibilityState>(externalColumnVisibility ?? {});

  // Sync external columnVisibility → internal
  React.useEffect(() => {
    if (externalColumnVisibility) {
      setInternalColumnVisibility(externalColumnVisibility);
    }
  }, [externalColumnVisibility]);

  const activeColumnVisibility = externalColumnVisibility ?? internalColumnVisibility;

  const handleColumnVisibilityChange = React.useCallback(
    (updater: VisibilityState | ((old: VisibilityState) => VisibilityState)) => {
      const newVisibility =
        typeof updater === 'function' ? updater(activeColumnVisibility) : updater;
      setInternalColumnVisibility(newVisibility);
      onColumnVisibilityChange?.(newVisibility);
    },
    [activeColumnVisibility, onColumnVisibilityChange]
  );

  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const requestQueue = React.useRef<Array<() => Promise<void>>>([]);
  const isProcessingQueue = React.useRef(false);

  const normalizedSelectedKeys = React.useMemo(
    () => selectedRowKeys.map(String),
    [selectedRowKeys]
  );

  const rowSelection = React.useMemo(
    () =>
      normalizedSelectedKeys.reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as Record<string, boolean>
      ),
    [normalizedSelectedKeys]
  );

  const getRowKey = React.useCallback(
    (row: TData): string => {
      if (rowKeyAccessor) return String(rowKeyAccessor(row));
      return String(
        (row as any)?.auditDetailId ??
          (row as any)?.reimbursementId ??
          (row as any)?.reimbrusementId ??
          (row as any)?.id ??
          ''
      );
    },
    [rowKeyAccessor]
  );

  const currentPageSize = externalPageSize ?? defaultPageSize;

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: currentPage,
    pageSize: currentPageSize,
  });

  React.useEffect(() => {
    setPagination({ pageIndex: currentPage, pageSize: currentPageSize });
  }, [currentPage, currentPageSize]);

  React.useEffect(() => {
    if (searchValue !== undefined && searchValue !== globalFilter) {
      setGlobalFilter(searchValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  React.useEffect(() => {
    if (dateRange) setInternalDateRange(dateRange);
  }, [dateRange]);

  React.useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
      requestQueue.current = [];
      isProcessingQueue.current = false;
    };
  }, []);

  const processQueue = React.useCallback(async () => {
    if (isProcessingQueue.current || requestQueue.current.length === 0) return;
    isProcessingQueue.current = true;
    while (requestQueue.current.length > 0) {
      const request = requestQueue.current.shift();
      if (request) {
        try {
          await request();
          await new Promise<void>((resolve) => setTimeout(resolve, 100));
        } catch (error) {
          console.error('Queue processing error', error);
        }
      }
    }
    isProcessingQueue.current = false;
  }, []);

  const handleExpansionChange = React.useCallback(
    (updater: any) => {
      const newExpanded = typeof updater === 'function' ? updater(expanded) : updater;
      if (typeof newExpanded === 'object') {
        const expandedRowIds = Object.keys(newExpanded).filter((key) => newExpanded[key]);
        if (expandedRowIds.length > 1) {
          const lastExpandedRowId = expandedRowIds[expandedRowIds.length - 1];
          setExpanded({ [lastExpandedRowId]: true } as ExpandedState);
          setCurrentlyExpandedId(lastExpandedRowId);
        } else if (expandedRowIds.length === 1) {
          setExpanded(newExpanded);
          setCurrentlyExpandedId(expandedRowIds[0]);
        } else {
          setExpanded(newExpanded);
          setCurrentlyExpandedId(null);
        }
      } else {
        setExpanded(newExpanded);
        setCurrentlyExpandedId(null);
      }
    },
    [expanded]
  );

  const toggleRowExpansion = React.useCallback(
    (row: Row<TData>) => {
      const rowId = row.id;
      if ((expanded as any)[rowId]) {
        const newExpanded = { ...(expanded as any) };
        delete newExpanded[rowId];
        setExpanded(newExpanded);
        setCurrentlyExpandedId(null);
      } else {
        setExpanded({ [rowId]: true } as ExpandedState);
        setCurrentlyExpandedId(rowId);
      }
    },
    [expanded]
  );

  const globalFilterFn: FilterFn<TData> = React.useCallback(
    (row, columnId, filterValue) => {
      const searchTerm = String(filterValue ?? '').toLowerCase().trim();
      if (!searchTerm) return true;
      if (customSearchFn) return customSearchFn(row.original, searchTerm);
      if (searchColumns.length > 0) {
        return searchColumns.some((columnKey) => {
          const value = row.getValue(columnKey) as any;
          if (value == null) return false;
          return String(value).toLowerCase().includes(searchTerm);
        });
      }
      return Object.values(row.original as any).some((value) => {
        if (value == null) return false;
        return String(value).toLowerCase().includes(searchTerm);
      });
    },
    [customSearchFn, searchColumns]
  );

  const debouncedSearchHandler = React.useMemo(
    () =>
      debounce((value: string) => {
        if (onSearchChange) onSearchChange(value);
        onPageChange?.(0, pagination.pageSize);
      }, searchDebounceMs),
    [onSearchChange, onPageChange, pagination.pageSize, searchDebounceMs]
  );

  const handleSearchChange = React.useCallback(
    (value: string) => {
      setGlobalFilter(value);
      if (!manualPagination) {
        setPagination((p) => ({ ...p, pageIndex: 0 }));
        return;
      }
      if (onSearchChange) debouncedSearchHandler(value);
    },
    [manualPagination, onSearchChange, debouncedSearchHandler]
  );

  const handleFromDateChange = React.useCallback(
    (date: Date | undefined) => {
      let newRange = { ...internalDateRange, from: date };
      setInternalDateRange(newRange);
      if (maxDateRangeDays && date && internalDateRange.to) {
        const diffDays = Math.ceil(
          Math.abs(internalDateRange.to.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diffDays > maxDateRangeDays) {
          const newTo = new Date(date);
          newTo.setDate(newTo.getDate() + maxDateRangeDays - 1);
          newRange = { ...newRange, to: newTo };
          setInternalDateRange(newRange);
        }
      }
      if (manualPagination) {
        onDateRangeChange?.(newRange);
        onPageChange?.(0, pagination.pageSize);
      }
      return newRange;
    },
    [internalDateRange, maxDateRangeDays, manualPagination, onDateRangeChange, onPageChange, pagination.pageSize]
  );

  const handleToDateChange = React.useCallback(
    (date: Date | undefined) => {
      let newRange = { ...internalDateRange, to: date };
      setInternalDateRange(newRange);
      if (maxDateRangeDays && date && internalDateRange.from) {
        const diffDays = Math.ceil(
          Math.abs(date.getTime() - internalDateRange.from.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diffDays > maxDateRangeDays) {
          const newFrom = new Date(date);
          newFrom.setDate(newFrom.getDate() - maxDateRangeDays + 1);
          newRange = { ...newRange, from: newFrom };
          setInternalDateRange(newRange);
        }
      }
      if (manualPagination) {
        onDateRangeChange?.(newRange);
        onPageChange?.(0, pagination.pageSize);
      }
      return newRange;
    },
    [internalDateRange, maxDateRangeDays, manualPagination, onDateRangeChange, onPageChange, pagination.pageSize]
  );

  const handleClearDateFilter = React.useCallback(() => {
    const emptyRange: DateRange = {};
    setInternalDateRange(emptyRange);
    if (manualPagination) {
      onDateRangeChange?.(emptyRange);
      onPageChange?.(0, pagination.pageSize);
    }
  }, [manualPagination, onDateRangeChange, onPageChange, pagination.pageSize]);

  const handleRowClickInternal = React.useCallback(
    (row: Row<TData>) => {
      if (loading || isProcessing) return;
      requestQueue.current.push(async () => {
        setIsProcessing(true);
        if (abortControllerRef.current) abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();
        try {
          if (renderRowSubComponent) toggleRowExpansion(row);
          if (onRowClick) await onRowClick(row.original);
        } catch (err: any) {
          if (err.name !== 'AbortError') console.error('Error in row click', err);
        } finally {
          setTimeout(() => setIsProcessing(false), 100);
        }
      });
      processQueue();
    },
    [loading, isProcessing, renderRowSubComponent, onRowClick, toggleRowExpansion, processQueue]
  );

  const serverTotalPages = manualPagination && totalRecords > 0
    ? Math.ceil(totalRecords / pagination.pageSize)
    : 1;

  const table = useReactTable({
    data,
    columns,
    getRowId: (originalRow) => getRowKey(originalRow),
    state: {
      expanded,
      pagination,
      rowSelection,
      columnVisibility: activeColumnVisibility,  // ✅
      ...(manualPagination ? {} : { globalFilter }),
    },
    onColumnVisibilityChange: handleColumnVisibilityChange as any, // ✅
    onRowSelectionChange: () => {},
    manualPagination,
    pageCount: manualPagination ? serverTotalPages : undefined,
    enableRowSelection: true,
    autoResetPageIndex: false,
    autoResetExpanded: false,
    enableMultiRowSelection: false,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onExpandedChange: handleExpansionChange,
    ...(manualPagination
      ? {}
      : {
          onGlobalFilterChange: setGlobalFilter,
          getFilteredRowModel: getFilteredRowModel(),
        }),
    ...(showPagination ? { getPaginationRowModel: getPaginationRowModel() } : {}),
    globalFilterFn,
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === 'function' ? updater(pagination) : updater;
      setPagination(newPagination);
      if (manualPagination)
        onPageChange?.(newPagination.pageIndex, newPagination.pageSize);
    },
  });

  const clientFilteredCount = manualPagination
    ? data?.length ?? 0
    : table?.getFilteredRowModel?.()?.rows?.length ?? 0;

  const totalPages = manualPagination
    ? serverTotalPages
    : Math.max(1, Math.ceil(clientFilteredCount / pagination.pageSize));

  const rowModel = table?.getRowModel?.();

  const allVisibleSelected = React.useMemo(() => {
    const visible = rowModel.rows.map((r) => r.original);
    return visible.length > 0 && visible.every((row) => normalizedSelectedKeys.includes(getRowKey(row)));
  }, [rowModel.rows, normalizedSelectedKeys, getRowKey]);

  const someVisibleSelected = React.useMemo(() => {
    const visible = rowModel.rows.map((r) => r.original);
    return !allVisibleSelected && visible.some((row) => normalizedSelectedKeys.includes(getRowKey(row)));
  }, [allVisibleSelected, rowModel.rows, normalizedSelectedKeys, getRowKey]);

  const handleRowSelect = React.useCallback(
    (row: TData, checked: boolean) => {
      if (!onSelectionChange) return;
      const key = getRowKey(row);
      const currentSelected = data.filter((r) => normalizedSelectedKeys.includes(getRowKey(r)));
      if (checked) {
        onSelectionChange([...currentSelected, row]);
      } else {
        onSelectionChange(currentSelected.filter((r) => getRowKey(r) !== key));
      }
    },
    [onSelectionChange, data, normalizedSelectedKeys, getRowKey]
  );

  const handleSelectAll = React.useCallback(
    (checked: boolean) => {
      if (!onSelectionChange) return;
      const currentSelected = data.filter((r) => normalizedSelectedKeys.includes(getRowKey(r)));
      const visibleOriginals = rowModel.rows.map((r) => r.original);
      if (checked) {
        const toAdd = visibleOriginals.filter((r) => !normalizedSelectedKeys.includes(getRowKey(r)));
        onSelectionChange([...currentSelected, ...toAdd]);
      } else {
        const visibleKeys = new Set(visibleOriginals.map(getRowKey));
        onSelectionChange(currentSelected.filter((r) => !visibleKeys.has(getRowKey(r))));
      }
    },
    [onSelectionChange, data, normalizedSelectedKeys, rowModel.rows, getRowKey]
  );

  const handlePageSizeChange = React.useCallback(
    (size: number) => {
      if (manualPagination) {
        onPageSizeChange?.(size);
        onPageChange?.(0, size);
      }
      setPagination((prev) => ({ ...prev, pageSize: size, pageIndex: 0 }));
    },
    [manualPagination, onPageSizeChange, onPageChange]
  );

  const handlePageChange = React.useCallback(
    (pageIndex: number) => {
      if (manualPagination) onPageChange?.(pageIndex, pagination.pageSize);
      setPagination((prev) => ({ ...prev, pageIndex }));
    },
    [manualPagination, onPageChange, pagination.pageSize]
  );

  const pageIndex = pagination.pageIndex;
  const totalRows = manualPagination ? totalRecords : clientFilteredCount;
  const currentStart = totalRows === 0 ? 0 : pageIndex * pagination.pageSize + 1;
  const currentEnd = Math.min((pageIndex + 1) * pagination.pageSize, totalRows);
  const selectedCount = normalizedSelectedKeys.length;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      pages.push(0);
      let start = Math.max(1, pageIndex - 1);
      let end = Math.min(totalPages - 2, pageIndex + 1);
      if (pageIndex <= 2) end = Math.min(3, totalPages - 2);
      if (pageIndex >= totalPages - 3) start = Math.max(totalPages - 4, 1);
      if (start > 1) pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 2) pages.push('...');
      pages.push(totalPages - 1);
    }
    return pages;
  };

  // ✅ Column Visibility Popover
  const ColumnVisibilityToggle = () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1.5 text-xs border-slate-200 text-slate-600 hover:text-slate-800"
          disabled={loading || isProcessing}
        >
          <Settings2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Columns</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-48 p-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 py-1 mb-1">
          Toggle Columns
        </p>
        <div className="space-y-0.5">
          {table
            .getAllLeafColumns()
            .filter((col) => col.getCanHide())
            .map((col) => {
              const headerText =
                typeof col.columnDef.header === 'string' ? col.columnDef.header : col.id;
              return (
                <label
                  key={col.id}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-50 cursor-pointer text-sm text-slate-700 select-none"
                >
                  <Checkbox
                    checked={col.getIsVisible()}
                    onCheckedChange={(checked) => col.toggleVisibility(!!checked)}
                    className="h-3.5 w-3.5"
                  />
                  <span className="capitalize">{headerText}</span>
                </label>
              );
            })}
        </div>
      </PopoverContent>
    </Popover>
  );

  const renderCardView = () => {
    const visibleColumns = table.getVisibleLeafColumns();
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 p-3">
        {rowModel.rows.map((row, rowIndex) => {
          const isSelected = row.getIsSelected();
          const isExpanded = row.getIsExpanded();
          const customRowClass = getRowClassName ? getRowClassName(row.original) : '';
          return (
            <div
              key={row.id}
              className={cn(
                'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden',
                isExpanded && 'ring-2 ring-primary',
                customRowClass
              )}
            >
              <div className="p-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {showSelect && (
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          handleRowSelect(row.original, checked === true)
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="h-4 w-4"
                        disabled={loading || isProcessing}
                      />
                    )}
                    {renderRowSubComponent && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (loading || isProcessing) return;
                          handleRowClickInternal(row);
                        }}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
                        disabled={loading || isProcessing}
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-primary" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Row {rowIndex + 1}</div>
                </div>
              </div>
              <div
                className={cn(
                  'p-3',
                  (onRowClick || renderRowSubComponent) && !loading && !isProcessing
                    ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    : ''
                )}
                onClick={() => handleRowClickInternal(row)}
              >
                <div className="space-y-3">
                  {visibleColumns.map((column) => {
                    const cell = row.getAllCells().find((c) => c.column.id === column.id);
                    if (!cell) return null;
                    const headerText =
                      typeof column.columnDef.header === 'string'
                        ? column.columnDef.header
                        : column.id;
                    return (
                      <div key={cell.id} className="flex items-start justify-between gap-2 text-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-300 min-w-[100px]">
                          {headerText}
                        </span>
                        <span className="text-gray-900 dark:text-gray-100 text-right break-words flex-1">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {isExpanded && renderRowSubComponent && (
                <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30 md:p-3 sm:p-0">
                  {renderRowSubComponent({ row, original: row.original })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {/* ── Top Controls ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-0">
        {leftElements && (
          <div className="flex items-center gap-2">{leftElements}</div>
        )}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 ml-auto">
          {/* Date Filter */}
          {showDateFilter && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                {/* From Date */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        'h-9 w-full sm:w-[140px] justify-start text-left font-normal',
                        !internalDateRange.from && 'text-muted-foreground'
                      )}
                      disabled={loading || isProcessing}
                    >
                      <Calendar className="mr-2 h-3.5 w-3.5" />
                      {internalDateRange.from
                        ? format(internalDateRange.from, 'MMM dd, yyyy')
                        : fromDatePlaceholder}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={internalDateRange.from}
                      onSelect={(date) => {
                        const newRange = handleFromDateChange(date);
                        if (!manualPagination) onDateRangeChange?.(newRange);
                      }}
                      disabled={loading || isProcessing}
                    />
                  </PopoverContent>
                </Popover>
                <span className="text-muted-foreground text-sm hidden sm:inline">to</span>
                {/* To Date */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        'h-9 w-full sm:w-[140px] justify-start text-left font-normal',
                        !internalDateRange.to && 'text-muted-foreground'
                      )}
                      disabled={loading || isProcessing}
                    >
                      <Calendar className="mr-2 h-3.5 w-3.5" />
                      {internalDateRange.to
                        ? format(internalDateRange.to, 'MMM dd, yyyy')
                        : toDatePlaceholder}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={internalDateRange.to}
                      onSelect={(date) => {
                        const newRange = handleToDateChange(date);
                        if (!manualPagination) onDateRangeChange?.(newRange);
                      }}
                      disabled={loading || isProcessing}
                    />
                  </PopoverContent>
                </Popover>
                {(internalDateRange?.from || internalDateRange?.to) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClearDateFilter}
                    className="h-9 w-9"
                    disabled={loading || isProcessing}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap justify-end">
            {RightElements && (
              <div className="flex items-center gap-2">{RightElements}</div>
            )}
            {/* ✅ Column Visibility Toggle */}
            <ColumnVisibilityToggle />
            {/* Search */}
            {showSearch && (
              <div className="relative w-full sm:w-auto sm:min-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  value={globalFilter ?? ''}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="pl-8 pr-8 py-1.5 h-9 text-sm rounded-md"
                  disabled={loading || isProcessing}
                />
                {(loading || isProcessing) && manualPagination && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-muted-foreground" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected count badge */}
      {showSelect && selectedCount > 0 && (
        <div className="flex items-center justify-between px-3 py-2 rounded-md bg-primary/5 border border-primary/20">
          <span className="text-xs font-medium text-primary">
            {selectedCount} row{selectedCount !== 1 ? 's' : ''} selected
          </span>
        </div>
      )}

      {/* ── Table / Card View ── */}
      <div className="relative">
        {loading && <Loader />}

        {/* Desktop Table */}
        <div className="hidden md:block rounded-md border border-border overflow-hidden shadow-sm bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-primary/95 to-primary">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b border-border">
                    {showSelect && (
                      <th className="w-10 px-3 py-3">
                        <div className="flex items-center justify-center">
                          <Checkbox
                            checked={allVisibleSelected}
                            indeterminate={someVisibleSelected}
                            onCheckedChange={(checked) => handleSelectAll(checked === true)}
                            className="h-3.5 w-3.5"
                            disabled={loading || isProcessing}
                          />
                        </div>
                      </th>
                    )}
                    {renderRowSubComponent && (
                      <th className="w-8 px-3 py-3" />
                    )}
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-3 py-3 text-left text-xs font-semibold text-primary-foreground uppercase tracking-wider"
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={cn(
                              'flex items-center gap-1',
                              header.column.getCanSort() && !loading && !isProcessing
                                ? 'cursor-pointer select-none hover:opacity-80 transition-opacity'
                                : ''
                            )}
                            onClick={
                              loading || isProcessing
                                ? undefined
                                : header.column.getToggleSortingHandler()
                            }
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getCanSort() && (
                              <span className="flex items-center">
                                {
                                  { asc: <ArrowUp className="h-3 w-3" />, desc: <ArrowDown className="h-3 w-3" /> }[
                                    header.column.getIsSorted() as string
                                  ] ?? (!header.column.getIsSorted() && (
                                    <ArrowUpDown className="h-3 w-3 opacity-40" />
                                  ))
                                }
                              </span>
                            )}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-border">
                {rowModel.rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={
                        table.getAllColumns().length +
                        (renderRowSubComponent ? 1 : 0) +
                        (showSelect ? 1 : 0)
                      }
                      className="px-6 py-12 text-center"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Settings2 className="h-8 w-8 text-muted-foreground/50" />
                        <p className="text-muted-foreground italic text-sm">
                          {loading || isProcessing ? 'Loading data...' : 'No results found.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  rowModel.rows.map((row, rowIndex) => {
                    const isSelected = row.getIsSelected();
                    const isExpanded = row.getIsExpanded();
                    const customRowClass = getRowClassName ? getRowClassName(row.original) : '';
                    return (
                      <React.Fragment key={row.id}>
                        <tr
                          onClick={() => handleRowClickInternal(row)}
                          className={cn(
                            'hover:bg-muted/50 transition-all duration-150',
                            (onRowClick || renderRowSubComponent) && !loading && !isProcessing
                              ? 'cursor-pointer'
                              : '',
                            isExpanded ? 'bg-muted/40' : '',
                            rowIndex % 2 === 0 ? 'bg-background' : 'bg-surface/50',
                            loading || isProcessing ? 'opacity-60' : '',
                            customRowClass
                          )}
                        >
                          {showSelect && (
                            <td
                              className="px-3 py-2.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center justify-center">
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={(checked) =>
                                    handleRowSelect(row.original, checked === true)
                                  }
                                  className="h-3.5 w-3.5"
                                  disabled={loading || isProcessing}
                                />
                              </div>
                            </td>
                          )}
                          {renderRowSubComponent && (
                            <td className="px-3 py-2.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (loading || isProcessing) return;
                                  handleRowClickInternal(row);
                                }}
                                className="p-0.5 hover:bg-muted rounded-md transition-colors disabled:opacity-50"
                                disabled={loading || isProcessing}
                              >
                                {isExpanded ? (
                                  <ChevronDown className="h-3.5 w-3.5 text-primary" />
                                ) : (
                                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                                )}
                              </button>
                            </td>
                          )}
                          {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className="px-3 py-2.5 text-sm text-text-secondary">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          ))}
                        </tr>
                        {isExpanded && renderRowSubComponent && (
                          <tr className="bg-muted/20">
                            <td
                              colSpan={
                                row.getVisibleCells().length +
                                (showSelect ? 1 : 0) +
                                (renderRowSubComponent ? 1 : 0)
                              }
                              className="p-0"
                            >
                              <div>
                                {renderRowSubComponent({ row, original: row.original })}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="block md:hidden">
          {rowModel.rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12">
              <Settings2 className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-muted-foreground italic text-sm">
                {loading || isProcessing ? 'Loading data...' : 'No results found.'}
              </p>
            </div>
          ) : (
            renderCardView()
          )}
        </div>
      </div>

      {/* ── Pagination ── */}
      {showPagination && totalRows > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-0">
          <div className="flex items-center gap-3 order-2 sm:order-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Rows</span>
              <Select
                value={String(pagination.pageSize)}
                onValueChange={(v) => handlePageSizeChange(Number(v))}
                disabled={loading || isProcessing}
              >
                <SelectTrigger className="h-7 w-[70px] text-xs rounded-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((size) => (
                    <SelectItem key={size} value={String(size)} className="text-xs">
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-xs text-muted-foreground px-2 py-0.5 rounded bg-muted/30 font-medium">
              {currentStart}–{currentEnd} of {totalRows.toLocaleString()}
              {(loading || isProcessing) && manualPagination && ' Loading...'}
            </div>
          </div>
          <div className="flex items-center gap-1 order-1 sm:order-2">
            <button
              onClick={() => handlePageChange(pageIndex - 1)}
              disabled={loading || isProcessing || pageIndex === 0}
              className="px-2.5 py-1.5 border border-border rounded-md hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-0.5 text-xs font-medium"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline text-xs">Prev</span>
            </button>
            <div className="flex items-center gap-0.5">
              {getPageNumbers().map((page, index) => {
                if (page === '...') {
                  return (
                    <span key={`dots-${index}`} className="px-1.5 text-xs text-muted-foreground">
                      ...
                    </span>
                  );
                }
                const pageNum = page as number;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    disabled={loading || isProcessing}
                    className={cn(
                      'px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors min-w-[32px]',
                      pageNum === pageIndex
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-border hover:bg-muted',
                      (loading || isProcessing) ? 'opacity-50 cursor-not-allowed' : ''
                    )}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => handlePageChange(pageIndex + 1)}
              disabled={loading || isProcessing || pageIndex >= totalPages - 1}
              className="px-2.5 py-1.5 border border-border rounded-md hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-0.5 text-xs font-medium"
            >
              <span className="hidden sm:inline text-xs">Next</span>
              <ChevronRightIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}