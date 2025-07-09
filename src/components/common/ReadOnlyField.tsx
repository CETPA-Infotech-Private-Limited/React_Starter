import { Label } from '../ui/label';

export function ReadOnlyField({ label, value, trailing }: { label: string; value?: string; trailing?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-blue-800 text-sm font-semibold">{label}</Label>
      <div className="border border-blue-100 rounded-md px-3 py-2 bg-blue-50 flex items-center justify-between">
        <span className="text-gray-800">{value || '-'}</span>
        {trailing && <div className="ml-2">{trailing}</div>}
      </div>
    </div>
  );
}
