import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import RequestAdvanceForm from "./RequestAdvanceForm";

const RequestAdvanceTable = () => {
  const [showForm, setShowForm] = useState(false);

  const handleCheckboxChange = (checked: boolean) => {
    setShowForm(checked);
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">UnSettled Advance List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 font-semibold">S.No</th>
                <th className="px-4 py-2 font-semibold">Employee Name</th>
                <th className="px-4 py-2 font-semibold">Patient Name</th>
                <th className="px-4 py-2 font-semibold">Relation</th>
                <th className="px-4 py-2 font-semibold">Advance Amount</th>
                <th className="px-4 py-2 font-semibold">Request Date</th>
                <th className="px-4 py-2 font-semibold">Approved Amount</th>
                <th className="px-4 py-2 font-semibold">Approved Date</th>
                <th className="px-4 py-2 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Data rows would go here */}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-4 flex items-center gap-2">
        <Checkbox id="new-request" onCheckedChange={handleCheckboxChange} />
        <label htmlFor="new-request" className="text-sm font-medium">
          New Advance Request
        </label>
      </Card>

      {showForm && <RequestAdvanceForm />}
    </div>
  );
};

export default RequestAdvanceTable;
