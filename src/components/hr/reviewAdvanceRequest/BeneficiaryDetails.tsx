import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

type RawHospitalAccount = {
  beneficiaryName: string | null;
  bankName: string | null;
  accountNumber: string | null;
  branchName: string | null;
  ifscCode: string | null;
  hospitalGSTNo: string | null;
  utrNo: string | null;
  transactionDate: string | null;
  sapRefNumber: string | null;
  sapRefDate: string | null;
};

export function BeneficiaryDetailsCard({
  beneficiaryName,
  bankName,
  accountNumber,
  branchName,
  ifscCode,
  hospitalGSTNo,
  utrNo,
  transactionDate,
  sapRefNumber,
  sapRefDate,
}: RawHospitalAccount) {
  return (
    <Card className="border border-blue-200 shadow-xl rounded-2xl font-sans text-sm p-6">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-blue-800 tracking-tight">Beneficiary Details (Hospital)</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        <ReadOnlyField label="Beneficiary Name" value={beneficiaryName} />
        <ReadOnlyField label="Bank Name" value={bankName} />
        <ReadOnlyField label="Account Number" value={accountNumber} />
        <ReadOnlyField label="Branch Name" value={branchName} />
        <ReadOnlyField label="IFSC Code" value={ifscCode} />
        <ReadOnlyField label="GST Number" value={hospitalGSTNo} />
        <ReadOnlyField label="UTR Number" value={utrNo} />
        <ReadOnlyField label="Transaction Date" value={formatDate(transactionDate)} />
        <ReadOnlyField label="SAP Reference Number" value={sapRefNumber} />
        <ReadOnlyField label="SAP Reference Date" value={formatDate(sapRefDate)} />
      </CardContent>
    </Card>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-blue-800 text-sm font-semibold">{label}</Label>
      <div className="border border-blue-100 rounded-md px-3 py-2 bg-blue-50 text-gray-800">{value && value.trim() !== '' ? value : '-'}</div>
    </div>
  );
}

function formatDate(dateStr: string | null): string {
  if (!dateStr || dateStr.startsWith('0001') || dateStr.trim() === '') return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
