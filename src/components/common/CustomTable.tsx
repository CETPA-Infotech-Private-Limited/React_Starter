'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

interface Column<T> {
  header: string;
  accessor: keyof T | string;
  cell?: (row: T) => React.ReactNode;
}

interface CustomTableProps<T> {
  data: T[];
  columns: Column<T>[];
  globalFilterPlaceholder?: string;
  rightElements?: React.ReactNode;
  pageSize?: number;
}

export default function CustomTable<T>({ data, columns, globalFilterPlaceholder = 'Search...', rightElements, pageSize = 10 }: CustomTableProps<T>) {
  const [searchText, setSearchText] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortAsc, setSortAsc] = React.useState(true);

  const filteredData = data.filter((row) => Object.values(row).join(' ').toLowerCase().includes(searchText.toLowerCase()));

  const sortedData = React.useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a: any, b: any) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortAsc]);

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (col: string) => {
    if (sortColumn === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortColumn(col);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter & Right Side Elements */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={globalFilterPlaceholder}
            className="pl-8 pr-3 py-2 w-full border border-blue-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>{rightElements}</div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-blue-100 shadow-sm">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gradient-to-r from-blue-500 to-blue-400 text-white text-xs">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-4 py-2 cursor-pointer select-none" onClick={() => handleSort(col.accessor.toString())}>
                  {col.header}
                  {sortColumn === col.accessor && (sortAsc ? ' ▲' : ' ▼')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => (
                <tr key={rowIdx} className="odd:bg-white even:bg-blue-50 border-b border-blue-100 hover:bg-blue-100 transition">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-4 py-2 text-xs">
                      {col.cell ? col.cell(row) : (row[col.accessor as keyof T] as any)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-sm text-gray-500">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-gray-600 mt-2">
          <span>
            Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1.5 border rounded disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 border rounded disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
