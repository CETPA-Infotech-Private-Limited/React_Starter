import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export type PatientDetailsProps = {
  name: string;
  relation: string;
  dob: string;
  gender: string;
};

export function PatientDetailsCard({ name, relation, dob, gender }: PatientDetailsProps) {
  return (
    <Card className="border border-blue-200 shadow-xl rounded-2xl font-sans text-sm px-4 py-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-blue-800 tracking-tight">Patient Details</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-2">
        <ReadOnlyField label="Patient Name" value={name} />
        <ReadOnlyField label="Relation" value={relation} />
        <ReadOnlyField label="Date of Birth" value={dob} />
        <ReadOnlyField label="Gender" value={gender} />
      </CardContent>
    </Card>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-blue-800 text-sm font-semibold">{label}</Label>
      <div className="border border-blue-100 rounded-md px-3 py-2 bg-blue-50 text-gray-800">{value || '-'}</div>
    </div>
  );
}
