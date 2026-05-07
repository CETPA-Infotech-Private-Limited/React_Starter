import React, { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";

export interface DARow {
  id: string;
  date: string;
  sourceTime: string;
  endTime: string;
  slabAmount: string;
  totalHHMM: string;
  percentAdmissible: string;
  amount: string;
}

const DailyAllowanceSection = ({
  include, setInclude,
  rows, setRows, onSubtotalChange,
}: {
  include: boolean; setInclude: (v:boolean)=>void;
  rows: DARow[];
  setRows: React.Dispatch<React.SetStateAction<DARow[]>>;
  onSubtotalChange: (n: number) => void;
}) => {

  const recomputeRow = (id: string, patch: Partial<DARow>) => {
    setRows(prev => prev.map(r => {
      if (r.id !== id) return r;
      const n = { ...r, ...patch };
      const percent = Math.max(0, Math.min(100, parseFloat(n.percentAdmissible) || 0));
      const base = parseFloat(n.slabAmount) || 0;
      n.amount = String(+((base * percent) / 100).toFixed(2));
      return n;
    }));
  };

  useEffect(() => {
    if (!include) onSubtotalChange(0);
    else {
      const subtotal = rows.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);
      onSubtotalChange(Number(subtotal.toFixed(2)));
    }
  }, [include, rows, onSubtotalChange]);

  const addRow = () => {
    setRows(prev => [...prev, { id: Date.now().toString(), date: "", sourceTime: "", endTime: "", slabAmount: "1500.00", totalHHMM: "0:0", percentAdmissible: "0", amount: "0" }]);
    toast.success("DA row added");
  };
  const removeRow = (id: string) => {
    if (rows.length === 1) { toast.error("At least one row is required."); return; }
    setRows(prev => prev.filter(r => r.id !== id));
  };

  const subtotalText = useMemo(
    () => (include ? rows.reduce((s,r)=>s+(parseFloat(r.amount)||0),0) : 0).toFixed(2),
    [rows, include]
  );

  return (
    <Card className="shadow-lg border border-blue-200 rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-50 border-b border-blue-200 rounded-t-xl flex items-center justify-between">
        <CardTitle className="text-lg flex w-full justify-start items-start font-bold text-blue-900"><label className="flex items-center gap-2">
          <span className="text-sm text-blue-900">Daily Allowance</span>
        </label></CardTitle>
        
      </CardHeader>

     
        <CardContent className="p-6">
          <div className="overflow-x-auto rounded-lg border border-blue-100">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-blue-700 to-blue-600">
                  <TableHead className="text-white">Sr.No.</TableHead>
                  <TableHead className="text-white">Date</TableHead>
                  <TableHead className="text-white">Source Time</TableHead>
                  <TableHead className="text-white">End Time</TableHead>
                  <TableHead className="text-white">DA Slab (₹)</TableHead>
                  <TableHead className="text-white">Total(H:M)</TableHead>
                  <TableHead className="text-white">Percentage Admissible</TableHead>
                  <TableHead className="text-white">Amount (Auto)</TableHead>
                  <TableHead className="text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r, idx)=>(
                  <TableRow key={r.id} className="bg-white hover:bg-blue-50">
                    <TableCell className="text-center font-bold">{idx+1}</TableCell>
                    <TableCell><Input readOnly type="date" value={r.date} onChange={e=>recomputeRow(r.id,{date:e.target.value})} /></TableCell>
                    <TableCell><Input type="time" readOnly value={r.sourceTime} onChange={e=>recomputeRow(r.id,{sourceTime:e.target.value})} /></TableCell>
                    <TableCell><Input type="time" readOnly value={r.endTime} onChange={e=>recomputeRow(r.id,{endTime:e.target.value})} /></TableCell>
                    <TableCell><Input type="number" readOnly value={r.slabAmount} onChange={e=>recomputeRow(r.id,{slabAmount:e.target.value})} /></TableCell>
                    <TableCell><Input readOnly value={r.totalHHMM} className="bg-blue-100 cursor-not-allowed" /></TableCell>
                    <TableCell><Input type="number" readOnly value={r.percentAdmissible} onChange={e=>recomputeRow(r.id,{percentAdmissible:e.target.value})} /></TableCell>
                    <TableCell><Input readOnly value={r.amount} className="bg-blue-100 cursor-not-allowed" /></TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={addRow}>➕</Button>
                        <Button size="sm" variant="outline" onClick={()=>removeRow(r.id)}>➖</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex justify-end">
            <Button className="bg-blue-600 text-white">SUB TOTAL(₹): {subtotalText}</Button>
          </div>
        </CardContent>
      
    </Card>
  );
};
export default DailyAllowanceSection;
