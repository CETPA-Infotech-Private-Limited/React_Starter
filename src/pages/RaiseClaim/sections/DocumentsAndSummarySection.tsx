// src/components/claim/sections/DocumentsAndSummarySection.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const Row = ({ label, value, danger=false }: {label:string; value:string|number; danger?:boolean}) => (
  <div className={`flex items-center justify-between border-b ${danger ? "text-red-600" : "text-blue-900"} border-red-100 py-2`}>
    <span>{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
);

const DocumentsAndSummarySection = ({
  documents, setDocuments,
  transportationSubtotal, accommodationSubtotal, daSubtotal, leaveDADeductable, totalAll
}: {
  documents: { tickets: boolean; hotel: boolean };
  setDocuments: React.Dispatch<React.SetStateAction<{tickets:boolean; hotel:boolean}>>;
  transportationSubtotal: number;
  accommodationSubtotal: number;
  daSubtotal: number;
  leaveDADeductable: number;
  totalAll: number;
}) => {
  return (
    <Card className="shadow-lg border border-blue-200 rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-50 border-b border-blue-200 rounded-t-xl">
        <CardTitle className="text-lg font-bold text-blue-900">Documents Attached & Claim Summaries</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Documents */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg border border-blue-100 p-4">
            <div className="flex items-center gap-3">
              <Checkbox id="tickets" checked={documents.tickets} onCheckedChange={(v)=>setDocuments(d=>({...d, tickets: !!v}))}/>
              <label htmlFor="tickets" className="font-medium text-blue-900">Tickets, Boarding Pass, Bills</label>
            </div>
          </div>
          <div className="rounded-lg border border-blue-100 p-4">
            <div className="flex items-center gap-3">
              <Checkbox id="hotel" checked={documents.hotel} onCheckedChange={(v)=>setDocuments(d=>({...d, hotel: !!v}))}/>
              <label htmlFor="hotel" className="font-medium text-blue-900">Hotel Bills</label>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-lg border border-blue-100">
          <div className="bg-blue-50 text-blue-900 font-semibold px-4 py-2 rounded-t-lg">
            Claim Summaries
          </div>
          <div className="p-4">
            <Row label="Transportation(₹)" value={transportationSubtotal.toFixed(2)} />
            <Row label="Accommodation(₹)" value={accommodationSubtotal.toFixed(2)} />
            <Row label="Daily Allowance(₹)" value={daSubtotal.toFixed(2)} />
            <Row label="Leave DA Deductable(₹)" value={leaveDADeductable.toFixed(2)} danger />
            <Row label="Total(₹)" value={totalAll.toFixed(2)} />
            <Row label="Advance Claimed(₹)" value={"0"} />
            <Row label="Balance Claim(₹)" value={totalAll.toFixed(2)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentsAndSummarySection;
