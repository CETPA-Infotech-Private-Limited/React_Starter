import React, { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import toast from "react-hot-toast";

export interface LeaveRow {
  id: string;
  startDate: string;
  endDate: string;
  daDeductable: "Yes" | "No";
  amount: string; // auto (placeholder)
}

const LeaveSection = ({
  include, setInclude,
  rows, setRows, onDeductableChange,
}: {
  include: boolean; setInclude: (v:boolean)=>void;
  rows: LeaveRow[];
  setRows: React.Dispatch<React.SetStateAction<LeaveRow[]>>;
  onDeductableChange: (amt: number) => void;
}) => {

  useEffect(() => {
    if (!include) onDeductableChange(0);
    else {
      const total = rows.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);
      onDeductableChange(Number(total.toFixed(2)));
    }
  }, [include, rows, onDeductableChange]);

  const update = (id: string, patch: Partial<LeaveRow>) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r));
  };

  const addRow = () => {
    setRows(prev => [...prev, { id: Date.now().toString(), startDate: "", endDate: "", daDeductable: "Yes", amount: "0" }]);
    toast.success("Leave row added");
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
        <CardTitle className="text-lg flex justify-start w-full font-bold text-blue-900"><label className="flex items-center gap-2">
          <Checkbox id="inc-leave" checked={include} onCheckedChange={(v)=>setInclude(!!v)} />
          <span className="text-sm text-blue-900">Leave availed with/between tour</span>
        </label></CardTitle>
        
      </CardHeader>

      {!include ? (
        null
      ) : (
        <CardContent className="p-6">
          <div className="overflow-x-auto rounded-lg border border-blue-100">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-blue-700 to-blue-600">
                  <TableHead className="text-white">Sr.No.</TableHead>
                  <TableHead className="text-white">Leave Start Date</TableHead>
                  <TableHead className="text-white">Leave End Date</TableHead>
                  <TableHead className="text-white">DA Deductable</TableHead>
                  <TableHead className="text-white">Amount (Auto)</TableHead>
                  <TableHead className="text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r, idx)=>(
                  <TableRow key={r.id} className="bg-white hover:bg-blue-50">
                    <TableCell className="text-center font-bold">{idx+1}</TableCell>
                    <TableCell><Input type="date" value={r.startDate} onChange={e=>update(r.id,{startDate:e.target.value})} /></TableCell>
                    <TableCell><Input type="date" value={r.endDate} onChange={e=>update(r.id,{endDate:e.target.value})} /></TableCell>
                    <TableCell>
                      <Select value={r.daDeductable} onValueChange={(v:any)=>update(r.id,{daDeductable:v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
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
      )}
    </Card>
  );
};

export default LeaveSection;
