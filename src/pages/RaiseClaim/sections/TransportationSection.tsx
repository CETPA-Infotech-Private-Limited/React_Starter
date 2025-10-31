// src/components/claim/sections/TransportationSection.tsx
import React, { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";
import toast from "react-hot-toast";

export interface TransportationRow {
  id: string;
  departureDate: string;
  departureTime: string;
  source: string;
  modeOfTravel: string;
  arrivalDate: string;
  arrivalTime: string;
  destination: string;
  billedAmount: string;
  taxAmount: string;
  totalBilledAmount: string;
  claimedAmount: string;
  billFile: File | null;
}

const toEpoch = (d?: string, t?: string): number | null => {
  if (!d || !d.trim()) return null;
  const time = (t && t.trim()) ? t : "00:00";
  const ms = new Date(`${d}T${time}`).getTime();
  return Number.isFinite(ms) ? ms : null;
};

const compareRows = (a: TransportationRow, b: TransportationRow) => {
  const aDep = toEpoch(a.departureDate, a.departureTime);
  const bDep = toEpoch(b.departureDate, b.departureTime);
  if (aDep === null && bDep === null) {
    const aArr = toEpoch(a.arrivalDate, a.arrivalTime);
    const bArr = toEpoch(b.arrivalDate, b.arrivalTime);
    if (aArr === null && bArr === null) return 0;
    if (aArr === null) return 1;
    if (bArr === null) return -1;
    return aArr - bArr;
  }
  if (aDep === null) return 1;
  if (bDep === null) return -1;
  if (aDep !== bDep) return aDep - bDep;

  const aArr = toEpoch(a.arrivalDate, a.arrivalTime);
  const bArr = toEpoch(b.arrivalDate, b.arrivalTime);
  if (aArr === null && bArr === null) return 0;
  if (aArr === null) return 1;
  if (bArr === null) return -1;
  return aArr - bArr;
};

const isRowValid = (row: TransportationRow) =>
  row.departureDate && row.departureTime && row.source.trim() &&
  row.modeOfTravel !== "select" && row.arrivalDate && row.arrivalTime &&
  row.destination.trim() && parseFloat(row.billedAmount) > 0;

const TransportationSection = ({
  rows,
  setRows,
  onSubtotalChange,
}: {
  rows: TransportationRow[];
  setRows: React.Dispatch<React.SetStateAction<TransportationRow[]>>;
  onSubtotalChange: (n: number) => void;
}) => {
  const sortedRows = useMemo(() => [...rows].sort(compareRows), [rows]);

  useEffect(() => {
    const subtotal = rows.reduce((s, r) => s + (parseFloat(r.claimedAmount) || 0), 0);
    onSubtotalChange(Number(subtotal.toFixed(2)));
  }, [rows, onSubtotalChange]);

  const updateRow = (id: string, field: keyof TransportationRow, value: any) => {
    setRows(prev => prev.map(r => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const handleAmountChange = (id: string, field: "billedAmount" | "taxAmount", value: string) => {
    const row = rows.find(r => r.id === id);
    if (!row) return;
    const billed = field === "billedAmount" ? parseFloat(value) || 0 : parseFloat(row.billedAmount) || 0;
    const tax = field === "taxAmount" ? parseFloat(value) || 0 : parseFloat(row.taxAmount) || 0;
    const total = billed + tax;
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value, totalBilledAmount: String(total), claimedAmount: String(total) } : r));
  };

  const handleAddRow = (id: string) => {
    const cur = rows.find(r => r.id === id);
    if (!cur || !isRowValid(cur)) { toast.error("Please fill all fields first."); return; }
    setRows(prev => [...prev, {
      id: Date.now().toString(),
      departureDate: "", departureTime: "", source: "", modeOfTravel: "select",
      arrivalDate: "", arrivalTime: "", destination: "",
      billedAmount: "0", taxAmount: "0", totalBilledAmount: "0", claimedAmount: "0", billFile: null,
    }]);
    toast.success("Row added");
  };

  const handleRemoveRow = (id: string) => {
    if (rows.length === 1) { toast.error("At least one row is required."); return; }
    setRows(prev => prev.filter(r => r.id !== id));
    toast.success("Row removed");
  };

  const handleFile = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    updateRow(id, "billFile", f); toast.success(`${f.name} uploaded`);
  };

  const subtotalText = useMemo(
    () => sortedRows.reduce((s, r) => s + (parseFloat(r.claimedAmount) || 0), 0).toFixed(2),
    [sortedRows]
  );

  return (
    <Card className="shadow-lg border border-blue-200 rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-50 border-b border-blue-200 rounded-t-xl">
        <CardTitle className="text-lg font-bold text-blue-900">Transportation Details</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="overflow-x-auto rounded-lg border border-blue-100">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-blue-700 to-blue-600">
                <TableHead className="text-white font-bold py-3">Sr.No.</TableHead>
                <TableHead className="text-white font-bold py-3 text-center" colSpan={3}>Departure</TableHead>
                <TableHead className="text-white font-bold py-3 text-center">Mode of Travel</TableHead>
                <TableHead className="text-white font-bold py-3 text-center" colSpan={3}>Arrival</TableHead>
                <TableHead className="text-white font-bold py-3 text-center" colSpan={5}>Amount Details</TableHead>
                <TableHead className="text-white font-bold py-3 text-center">Actions</TableHead>
              </TableRow>
              <TableRow className="bg-gradient-to-r from-blue-600 to-blue-500">
                <TableHead />
                <TableHead className="text-white">Date</TableHead>
                <TableHead className="text-white">Time</TableHead>
                <TableHead className="text-white">Source/Station</TableHead>
                <TableHead />
                <TableHead className="text-white">Date</TableHead>
                <TableHead className="text-white">Time</TableHead>
                <TableHead className="text-white">Destination</TableHead>
                <TableHead className="text-white">Billed(₹)</TableHead>
                <TableHead className="text-white">Tax(₹)</TableHead>
                <TableHead className="text-white">Total Billed(₹)</TableHead>
                <TableHead className="text-white">Claimed(₹)</TableHead>
                <TableHead className="text-white">Upload Bill</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRows.map((row, idx) => (
                <TableRow key={row.id} className="bg-white hover:bg-blue-50 border-b border-blue-100">
                  <TableCell className="text-center font-bold">{idx + 1}</TableCell>
                  <TableCell><Input type="date" value={row.departureDate} onChange={(e)=>updateRow(row.id,"departureDate",e.target.value)} /></TableCell>
                  <TableCell><Input type="time" value={row.departureTime} onChange={(e)=>updateRow(row.id,"departureTime",e.target.value)} /></TableCell>
                  <TableCell><Input placeholder="Source" value={row.source} onChange={(e)=>updateRow(row.id,"source",e.target.value)} /></TableCell>
                  <TableCell>
                    <Select value={row.modeOfTravel} onValueChange={(v)=>updateRow(row.id,"modeOfTravel",v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="select">Select</SelectItem>
                        <SelectItem value="train">Train</SelectItem>
                        <SelectItem value="bus">Bus</SelectItem>
                        <SelectItem value="flight">Flight</SelectItem>
                        <SelectItem value="taxi">Taxi</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell><Input type="date" value={row.arrivalDate} onChange={(e)=>updateRow(row.id,"arrivalDate",e.target.value)} /></TableCell>
                  <TableCell><Input type="time" value={row.arrivalTime} onChange={(e)=>updateRow(row.id,"arrivalTime",e.target.value)} /></TableCell>
                  <TableCell><Input placeholder="Destination" value={row.destination} onChange={(e)=>updateRow(row.id,"destination",e.target.value)} /></TableCell>
                  <TableCell><Input type="number" value={row.billedAmount} onChange={(e)=>handleAmountChange(row.id,"billedAmount",e.target.value)} /></TableCell>
                  <TableCell><Input type="number" value={row.taxAmount} onChange={(e)=>handleAmountChange(row.id,"taxAmount",e.target.value)} /></TableCell>
                  <TableCell><Input readOnly value={row.totalBilledAmount} className="bg-blue-100 cursor-not-allowed" /></TableCell>
                  <TableCell><Input type="number" value={row.claimedAmount} onChange={(e)=>updateRow(row.id,"claimedAmount",e.target.value)} /></TableCell>
                  <TableCell>
                    <label htmlFor={`tfile-${row.id}`}>
                      <Button variant="outline" size="sm" type="button" onClick={()=>document.getElementById(`tfile-${row.id}`)?.click()}>
                        <Upload className="h-4 w-4 mr-1" /> {row.billFile ? "✓" : "Upload"}
                      </Button>
                    </label>
                    <input id={`tfile-${row.id}`} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e)=>handleFile(row.id,e)} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={()=>handleAddRow(row.id)}>➕</Button>
                      <Button size="sm" variant="outline" onClick={()=>handleRemoveRow(row.id)}>➖</Button>
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

export default TransportationSection;
