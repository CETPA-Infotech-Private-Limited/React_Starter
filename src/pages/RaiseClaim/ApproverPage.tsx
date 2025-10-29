import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Upload } from "lucide-react";
import { useAppSelector } from "@/app/hooks";
import { RootState } from "@/app/store";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

interface TransportationRow {
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

const ApproverPage = () => {
  const navigate = useNavigate();
  const claim = useAppSelector((state: RootState) => state.raiseClaim?.data);

  const [pdfUrl] = useState(
    claim?.data?.tourApprovelDetails?.approverDetails?.filePath
  );

  const [transportationRows, setTransportationRows] = useState<TransportationRow[]>([
    {
      id: "1",
      departureDate: "2025-09-26",
      departureTime: "",
      source: "",
      modeOfTravel: "select",
      arrivalDate: "2025-09-26",
      arrivalTime: "",
      destination: "",
      billedAmount: "0",
      taxAmount: "0",
      totalBilledAmount: "0",
      claimedAmount: "0",
      billFile: null,
    },
  ]);

  console.log("RaiseClaim Redux Data:", claim);

  // ✅ Redirect only when claim missing or not 200
  useEffect(() => {
    const isMissing = !claim || typeof claim !== "object";
    const notOk = !isMissing && (claim as any)?.statusCode !== 200;
    const noInner = !isMissing && !(claim as any)?.data;

    if (isMissing || notOk || noInner) {
      console.warn("No/invalid claim data. Redirecting to /raise-claim...");
      navigate("/raise-claim", { replace: true });
    }
  }, [claim, navigate]);

  // Validate if a row is completely filled
  const isRowValid = (row: TransportationRow): boolean => {
    return (
      row.departureDate !== "" &&
      row.departureTime !== "" &&
      row.source.trim() !== "" &&
      row.modeOfTravel !== "select" &&
      row.arrivalDate !== "" &&
      row.arrivalTime !== "" &&
      row.destination.trim() !== "" &&
      parseFloat(row.billedAmount) > 0
    );
  };

  // Update row data
  const updateRow = (id: string, field: keyof TransportationRow, value: any) => {
    setTransportationRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  // Calculate total billed amount when billed amount or tax changes
  const handleAmountChange = (id: string, field: "billedAmount" | "taxAmount", value: string) => {
    const row = transportationRows.find((r) => r.id === id);
    if (!row) return;

    const billedAmount = field === "billedAmount" ? parseFloat(value) || 0 : parseFloat(row.billedAmount) || 0;
    const taxAmount = field === "taxAmount" ? parseFloat(value) || 0 : parseFloat(row.taxAmount) || 0;
    const totalBilledAmount = billedAmount + taxAmount;

    setTransportationRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              [field]: value,
              totalBilledAmount: totalBilledAmount.toString(),
              claimedAmount: totalBilledAmount.toString(),
            }
          : r
      )
    );
  };

  // Add new row
  const handleAddRow = (currentRowId: string) => {
    const currentRow = transportationRows.find((r) => r.id === currentRowId);

    if (!currentRow) return;

    if (!isRowValid(currentRow)) {
      toast.error("Please fill all required fields before adding a new row.");
      return;
    }

    const newRow: TransportationRow = {
      id: Date.now().toString(),
      departureDate: "",
      departureTime: "",
      source: "",
      modeOfTravel: "select",
      arrivalDate: "",
      arrivalTime: "",
      destination: "",
      billedAmount: "0",
      taxAmount: "0",
      totalBilledAmount: "0",
      claimedAmount: "0",
      billFile: null,
    };

    setTransportationRows((prev) => [...prev, newRow]);
    toast.success("New transportation row added successfully.");
  };

  // Remove row
  const handleRemoveRow = (id: string) => {
    if (transportationRows.length === 1) {
      toast.error("At least one row is required.");
      return;
    }

    setTransportationRows((prev) => prev.filter((row) => row.id !== id));
    toast.success("Transportation row removed successfully.");
  };

  // Calculate subtotal
  const calculateSubtotal = (): number => {
    return transportationRows.reduce(
      (sum, row) => sum + (parseFloat(row.claimedAmount) || 0),
      0
    );
  };

  // Handle file upload
  const handleFileUpload = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      updateRow(id, "billFile", file);
      toast.success(`${file.name} uploaded successfully.`);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen">
      {/* PDF Viewer Section with Buttons */}
      <Card className="relative shadow-lg border border-blue-200 rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-50 border-b border-blue-200 rounded-t-xl">
          <CardTitle className="text-lg font-bold text-blue-900">Document Preview</CardTitle>
        </CardHeader>
        <CardContent className="p-0 relative">
          <iframe
            src={pdfUrl || "about:blank"}
            className="w-full h-[400px] border-0 bg-gray-50"
            title="PDF Viewer"
          />
          {/* Buttons positioned at bottom right of iframe */}
          <div className="p-4 flex justify-end gap-3 bg-gradient-to-t from-white via-white/95 to-transparent border-t border-blue-100">
            <Button className="bg-red-500 hover:bg-red-600 text-white font-semibold shadow-md rounded-lg px-6 py-2 transition-all duration-200 hover:shadow-lg">
              Tour Amendment
            </Button>
            <Button 
              variant="outline" 
              className="bg-white border-2 border-blue-500 text-blue-700 hover:bg-blue-50 font-semibold shadow-md rounded-lg px-6 py-2 transition-all duration-200 hover:shadow-lg"
            >
              <Upload className="h-4 w-4 mr-2 text-blue-600" />
              Upload File
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transportation Table */}
      <Card className="shadow-lg border border-blue-200 rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-50 border-b border-blue-200 rounded-t-xl">
          <CardTitle className="text-lg font-bold text-blue-900">Transportation Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto rounded-lg border border-blue-100">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-blue-700 to-blue-600 hover:bg-blue-700">
                  <TableHead className="text-white font-bold py-3">Sr.No.</TableHead>
                  <TableHead className="text-white font-bold py-3 text-center" colSpan={3}>
                    Departure
                  </TableHead>
                  <TableHead className="text-white font-bold py-3 text-center">Mode of Travel</TableHead>
                  <TableHead className="text-white font-bold py-3 text-center" colSpan={3}>
                    Arrival
                  </TableHead>
                  <TableHead className="text-white font-bold py-3 text-center" colSpan={5}>
                    Amount Details
                  </TableHead>
                  <TableHead className="text-white font-bold py-3 text-center">Actions</TableHead>
                </TableRow>
                <TableRow className="bg-gradient-to-r from-blue-600 to-blue-500 hover:bg-blue-600">
                  <TableHead className="text-white font-semibold py-2"></TableHead>
                  <TableHead className="text-white font-semibold py-2">Date</TableHead>
                  <TableHead className="text-white font-semibold py-2">Time</TableHead>
                  <TableHead className="text-white font-semibold py-2">Source/Station</TableHead>
                  <TableHead className="text-white font-semibold py-2"></TableHead>
                  <TableHead className="text-white font-semibold py-2">Date</TableHead>
                  <TableHead className="text-white font-semibold py-2">Time</TableHead>
                  <TableHead className="text-white font-semibold py-2">Destination</TableHead>
                  <TableHead className="text-white font-semibold py-2">Billed Amount(₹)</TableHead>
                  <TableHead className="text-white font-semibold py-2">Tax Amount(₹)</TableHead>
                  <TableHead className="text-white font-semibold py-2">Total Billed Amount(₹)</TableHead>
                  <TableHead className="text-white font-semibold py-2">Claimed Amount(₹)</TableHead>
                  <TableHead className="text-white font-semibold py-2">Upload Bill</TableHead>
                  <TableHead className="text-white font-semibold py-2"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transportationRows.map((row, index) => (
                  <TableRow 
                    key={row.id} 
                    className="bg-white hover:bg-blue-50 transition-colors duration-150 border-b border-blue-100 group"
                  >
                    <TableCell className="text-blue-900 font-bold text-center py-3">{index + 1}</TableCell>
                    <TableCell className="py-3">
                      <Input
                        type="date"
                        value={row.departureDate}
                        onChange={(e) =>
                          updateRow(row.id, "departureDate", e.target.value)
                        }
                        className="w-32 border-blue-300 focus:border-blue-600 focus:ring-blue-500 rounded-lg bg-white text-blue-900 font-medium"
                      />
                    </TableCell>
                    <TableCell className="py-3">
                      <Input
                        type="time"
                        value={row.departureTime}
                        onChange={(e) =>
                          updateRow(row.id, "departureTime", e.target.value)
                        }
                        className="w-28 border-blue-300 focus:border-blue-600 focus:ring-blue-500 rounded-lg bg-white text-blue-900 font-medium"
                      />
                    </TableCell>
                    <TableCell className="py-3">
                      <Input
                        placeholder="Source"
                        value={row.source}
                        onChange={(e) =>
                          updateRow(row.id, "source", e.target.value)
                        }
                        className="w-32 border-blue-300 focus:border-blue-600 focus:ring-blue-500 rounded-lg bg-white text-blue-900 placeholder-gray-400 font-medium"
                      />
                    </TableCell>
                    <TableCell className="py-3">
                      <Select
                        value={row.modeOfTravel}
                        onValueChange={(value) =>
                          updateRow(row.id, "modeOfTravel", value)
                        }
                      >
                        <SelectTrigger className="w-32 border-blue-300 focus:border-blue-600 focus:ring-blue-500 rounded-lg bg-white text-blue-900 font-medium">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-blue-200 rounded-lg shadow-lg">
                          <SelectItem value="select" className="text-gray-500">Select</SelectItem>
                          <SelectItem value="train" className="text-blue-900">Train</SelectItem>
                          <SelectItem value="bus" className="text-blue-900">Bus</SelectItem>
                          <SelectItem value="flight" className="text-blue-900">Flight</SelectItem>
                          <SelectItem value="taxi" className="text-blue-900">Taxi</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="py-3">
                      <Input
                        type="date"
                        value={row.arrivalDate}
                        onChange={(e) =>
                          updateRow(row.id, "arrivalDate", e.target.value)
                        }
                        className="w-32 border-blue-300 focus:border-blue-600 focus:ring-blue-500 rounded-lg bg-white text-blue-900 font-medium"
                      />
                    </TableCell>
                    <TableCell className="py-3">
                      <Input
                        type="time"
                        value={row.arrivalTime}
                        onChange={(e) =>
                          updateRow(row.id, "arrivalTime", e.target.value)
                        }
                        className="w-28 border-blue-300 focus:border-blue-600 focus:ring-blue-500 rounded-lg bg-white text-blue-900 font-medium"
                      />
                    </TableCell>
                    <TableCell className="py-3">
                      <Input
                        placeholder="Destination"
                        value={row.destination}
                        onChange={(e) =>
                          updateRow(row.id, "destination", e.target.value)
                        }
                        className="w-32 border-blue-300 focus:border-blue-600 focus:ring-blue-500 rounded-lg bg-white text-blue-900 placeholder-gray-400 font-medium"
                      />
                    </TableCell>
                    <TableCell className="py-3">
                      <Input
                        type="number"
                        value={row.billedAmount}
                        onChange={(e) =>
                          handleAmountChange(row.id, "billedAmount", e.target.value)
                        }
                        className="w-24 border-blue-300 focus:border-blue-600 focus:ring-blue-500 rounded-lg bg-white text-blue-900 font-semibold"
                      />
                    </TableCell>
                    <TableCell className="py-3">
                      <Input
                        type="number"
                        value={row.taxAmount}
                        onChange={(e) =>
                          handleAmountChange(row.id, "taxAmount", e.target.value)
                        }
                        className="w-24 border-blue-300 focus:border-blue-600 focus:ring-blue-500 rounded-lg bg-white text-blue-900 font-semibold"
                      />
                    </TableCell>
                    <TableCell className="py-3">
                      <Input
                        type="number"
                        value={row.totalBilledAmount}
                        readOnly
                        className="w-24 bg-blue-100 text-blue-900 border border-blue-200 rounded-lg font-semibold cursor-not-allowed"
                      />
                    </TableCell>
                    <TableCell className="py-3">
                      <Input
                        type="number"
                        value={row.claimedAmount}
                        onChange={(e) =>
                          updateRow(row.id, "claimedAmount", e.target.value)
                        }
                        className="w-24 border-blue-300 focus:border-blue-600 focus:ring-blue-500 rounded-lg bg-white text-blue-900 font-semibold"
                      />
                    </TableCell>
                    <TableCell className="py-3">
                      <label htmlFor={`file-${row.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          className={`border-blue-400 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-500 rounded-lg font-semibold shadow-sm transition-all duration-150 px-3 py-1 ${
                            row.billFile ? "ring-2 ring-green-500" : ""
                          }`}
                          onClick={() =>
                            document.getElementById(`file-${row.id}`)?.click()
                          }
                        >
                          <Upload className="h-4 w-4 mr-1 text-blue-600" />
                          {row.billFile ? "✓" : "Upload"}
                        </Button>
                      </label>
                      <input
                        id={`file-${row.id}`}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(row.id, e)}
                        className="hidden"
                      />
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-400 bg-green-50 text-green-700 hover:bg-green-100 hover:border-green-500 rounded-lg font-bold shadow-sm transition-all duration-150 px-3 py-1"
                          onClick={() => handleAddRow(row.id)}
                          title="Add new row"
                        >
                          ➕
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-400 bg-red-50 text-red-700 hover:bg-red-100 hover:border-red-500 rounded-lg font-bold shadow-sm transition-all duration-150 px-3 py-1"
                          onClick={() => handleRemoveRow(row.id)}
                          title="Remove row"
                        >
                          ➖
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-6 flex justify-end">
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg shadow-lg rounded-lg px-8 py-3 transition-all duration-200 hover:shadow-xl">
              SUB TOTAL(₹): {calculateSubtotal().toFixed(2)}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApproverPage;