import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, Eye, XCircle } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

export const SectionHeader = ({ title, subtitle, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
  </div>
);

export const InfoCard = ({ title, children, className = '' }) => (
  <div className={`bg-gray-50 rounded-lg p-4 border border-gray-200 ${className}`}>
    <h3 className="font-bold  mb-3">{title}</h3>
    {children}
  </div>
);

export const DisplayField = ({ label, value, className = '', valueClassName = '' }) => (
  <div className={`flex flex-row items-center gap-4 ${className}`}>
    <label className="text-sm font-medium text-primary mb-1">{label}</label>
    <div className={`text-sm text-gray-900 py-1 ${valueClassName}`}>{value || '-'}</div>
  </div>
);

export const DisplayTable = ({ headers, children, className = '' }) => (
  <div className={`overflow-x-auto ${className}`}>
    <table className="min-w-full border border-gray-300 rounded-lg">
      <thead className="bg-gray-50">
        <tr>
          {headers.map((header, index) => (
            <th key={index} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
    </table>
  </div>
);

export const StatusBadge = ({ status, type = 'default' }) => {
  const variants = {
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    default: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${variants[type]}`}>{status}</span>;
};

export const BillItemDisplayRow = ({
  serialNo,
  billType,
  billedAmount,
  claimedAmount,
  included,
  clarification,
  comment,
  onCommentChange,
}: {
  serialNo: number;
  billType: string;
  billedAmount: number;
  claimedAmount: number;
  included: boolean;
  clarification: string;
  comment: string;
  onCommentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <tr className="hover:bg-gray-50">
    <td className="px-4 py-3">{serialNo}</td>
    <td className="px-4 py-3">{billType}</td>
    <td className="px-4 py-3 text-right">₹{billedAmount.toFixed(2)}</td>
    <td className="px-4 py-3 text-right">₹{claimedAmount.toFixed(2)}</td>
    <td className="px-4 py-3 text-center">
      <div className="flex items-center justify-center gap-2">
        {included ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
        <span className="text-xs">{included ? 'Included' : 'Not Included'}</span>
      </div>
    </td>
    <td className="px-4 py-3">{clarification || '-'}</td>
    <td className="px-4 py-3">
      <Input placeholder="Doctor's comment" value={comment} onChange={onCommentChange} className="text-sm" />
    </td>
  </tr>
);

export const PreHospDisplayRow = ({
  serialNo,
  billType,
  billedDate,
  billedAmount,
  claimedAmount,
  hasFiles,
  fileLinks = [],
  comment,
  onCommentChange,
}: {
  serialNo: number;
  billType: string;
  billedDate?: string;
  billedAmount: number;
  claimedAmount: number;
  hasFiles: number;
  fileLinks?: string[];
  comment: string;
  onCommentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="px-4 py-3">{serialNo}</td>
        <td className="px-4 py-3">{billType}</td>
        <td className="px-4 py-3">{billedDate || '-'}</td>
        <td className="px-4 py-3 text-right">₹{billedAmount.toFixed(2)}</td>
        <td className="px-4 py-3 text-right">₹{claimedAmount.toFixed(2)}</td>
        <td className="px-4 py-3 text-center">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="text-blue-600 text-sm">
                <Eye className="w-4 h-4 mr-1" />
                {hasFiles} file{hasFiles !== 1 && 's'}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Attached Files</DialogTitle>
              </DialogHeader>
              <div className="mt-2 space-y-2">
                {fileLinks.length ? (
                  fileLinks.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">
                      File {i + 1}
                    </a>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No files available.</p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </td>
        <td className="px-4 py-3">
          <Input placeholder="Doctor's comment" value={comment} onChange={onCommentChange} className="text-sm" />
        </td>
      </tr>
    </>
  );
};
