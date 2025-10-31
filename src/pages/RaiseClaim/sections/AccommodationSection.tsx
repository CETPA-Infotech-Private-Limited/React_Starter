import React, { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload } from "lucide-react";
import toast from "react-hot-toast";

export interface AccommodationRow {
  id: string;
  checkInDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
  location: string;
  classOfCity: string;
  ownArrangement: "Yes" | "No";
  freeProvidedByCompany: "Yes" | "No";
  hotelName: string;
  billed: string;
  tax: string;
  totalBilled: string;
  claimed: string;
  billFile: File | null;
}

const AccommodationSection = ({
  include, setInclude,
  rows, setRows, onSubtotalChange,
}: {
  include: boolean; setInclude: (v:boolean)=>void;
  rows: AccommodationRow[];
  setRows: React.Dispatch<React.SetStateAction<AccommodationRow[]>>;
  onSubtotalChange: (n: number) => void;
}) => {

  // when hidden, propagate 0 subtotal
  useEffect(() => {
    if (!include) onSubtotalChange(0);
    else {
      const s = rows.reduce((sum, r) => sum + (parseFloat(r.claimed) || 0), 0);
      onSubtotalChange(Number(s.toFixed(2)));
    }
  }, [include, rows, onSubtotalChange]);

  const updateRow = (id: string, field: keyof AccommodationRow, value: any) => {
    setRows(prev => prev.map(r => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const handleAmount = (id: string, field: "billed" | "tax", value: string) => {
    const row = rows.find(r => r.id === id);
    if (!row) return;
    const billed = field === "billed" ? parseFloat(value) || 0 : parseFloat(row.billed) || 0;
    const tax = field === "tax" ? parseFloat(value) || 0 : parseFloat(row.tax) || 0;
    const total = billed + tax;
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value, totalBilled: String(total), claimed: String(total) } : r));
  };

  const addRow = () => {
    setRows(prev => [...prev, {
      id: Date.now().toString(),
      checkInDate: "", checkInTime: "", checkOutDate: "", checkOutTime: "",
      location: "", classOfCity: "Select", ownArrangement: "No", freeProvidedByCompany: "No",
      hotelName: "", billed: "0", tax: "0", totalBilled: "0", claimed: "0", billFile: null,
    }]);
    toast.success("Accommodation row added");
  };

  const removeRow = (id: string) => {
    if (rows.length === 1) { toast.error("At least one row is required."); return; }
    setRows(prev => prev.filter(r => r.id !== id));
  };

  const subtotalText = useMemo(
    () => (include ? rows.reduce((s,r)=>s+(parseFloat(r.claimed)||0),0) : 0).toFixed(2),
    [rows, include]
  );

  return (
    <Card className="shadow-lg border border-blue-200 rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-50 border-b border-blue-200 rounded-t-xl flex items-center justify-between">
        <CardTitle className="text-lg flex justify-start w-full font-bold text-blue-900"> <label className="flex items-center gap-2">
          <Checkbox checked={include} onCheckedChange={(v)=>setInclude(!!v)} id="inc-acc" />
          <span className="text-sm text-blue-900">Include Accommodation</span>
        </label></CardTitle>
       
      </CardHeader>

      {/* collapsed note */}
      {!include ? (
        null
      ) : (
        <CardContent className="p-6">
          <div className="overflow-x-auto rounded-lg border border-blue-100">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-blue-700 to-blue-600">
                  <TableHead className="text-white">Sr.No.</TableHead>
                  <TableHead className="text-white" colSpan={2}>Check In</TableHead>
                  <TableHead className="text-white" colSpan={2}>Check Out</TableHead>
                  <TableHead className="text-white">Location</TableHead>
                  <TableHead className="text-white">Class of City</TableHead>
                  <TableHead className="text-white">Own Arrangement</TableHead>
                  <TableHead className="text-white">Free by Company</TableHead>
                  <TableHead className="text-white">Hotel Name</TableHead>
                  <TableHead className="text-white">Billed(₹)</TableHead>
                  <TableHead className="text-white">Tax(₹)</TableHead>
                  <TableHead className="text-white">Total Billed(₹)</TableHead>
                  <TableHead className="text-white">Claimed(₹)</TableHead>
                  <TableHead className="text-white">Upload</TableHead>
                  <TableHead className="text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r, idx)=>(
                  <TableRow key={r.id} className="bg-white hover:bg-blue-50">
                    <TableCell className="text-center font-bold">{idx+1}</TableCell>
                    <TableCell><Input type="date" value={r.checkInDate} onChange={e=>updateRow(r.id,"checkInDate",e.target.value)} /></TableCell>
                    <TableCell><Input type="time" value={r.checkInTime} onChange={e=>updateRow(r.id,"checkInTime",e.target.value)} /></TableCell>
                    <TableCell><Input type="date" value={r.checkOutDate} onChange={e=>updateRow(r.id,"checkOutDate",e.target.value)} /></TableCell>
                    <TableCell><Input type="time" value={r.checkOutTime} onChange={e=>updateRow(r.id,"checkOutTime",e.target.value)} /></TableCell>
                    <TableCell><Input value={r.location} onChange={e=>updateRow(r.id,"location",e.target.value)} placeholder="Location" /></TableCell>
                    <TableCell>
                      <Select value={r.classOfCity} onValueChange={(v)=>updateRow(r.id,"classOfCity",v)}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Select">Select</SelectItem>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select value={r.ownArrangement} onValueChange={(v:any)=>updateRow(r.id,"ownArrangement",v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="No">No</SelectItem>
                          <SelectItem value="Yes">Yes</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select value={r.freeProvidedByCompany} onValueChange={(v:any)=>updateRow(r.id,"freeProvidedByCompany",v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="No">No</SelectItem>
                          <SelectItem value="Yes">Yes</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell><Input value={r.hotelName} onChange={e=>updateRow(r.id,"hotelName",e.target.value)} placeholder="Hotel Name" /></TableCell>
                    <TableCell><Input type="number" value={r.billed} onChange={(e)=>handleAmount(r.id,"billed",e.target.value)} /></TableCell>
                    <TableCell><Input type="number" value={r.tax} onChange={(e)=>handleAmount(r.id,"tax",e.target.value)} /></TableCell>
                    <TableCell><Input readOnly value={r.totalBilled} className="bg-blue-100 cursor-not-allowed" /></TableCell>
                    <TableCell><Input type="number" value={r.claimed} onChange={e=>updateRow(r.id,"claimed",e.target.value)} /></TableCell>
                    <TableCell>
                      <label htmlFor={`afile-${r.id}`}>
                        <Button variant="outline" size="sm" onClick={()=>document.getElementById(`afile-${r.id}`)?.click()}>
                          <Upload className="h-4 w-4 mr-1" />{r.billFile?"✓":"Upload"}
                        </Button>
                      </label>
                      <input id={`afile-${r.id}`} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                        onChange={(e)=>{const f=e.target.files?.[0]; if(f) updateRow(r.id,"billFile",f);}} />
                    </TableCell>
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

export default AccommodationSection;
