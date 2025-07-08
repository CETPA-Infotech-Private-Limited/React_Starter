import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const BankingDetails = () => {
  const [formData, setFormData] = useState({
    sapReferenceDate: '',
    sapReferenceNo: '',
    transactionDate: '',
    utrNo: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="mt-6 p-4 border border-blue-200 shadow-sm rounded-xl bg-white w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-extrabold text-blue-800">Banking Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {[
          { id: 'sapReferenceDate', label: 'SAP Reference Date', type: 'date' },
          { id: 'sapReferenceNo', label: 'SAP Reference No.', type: 'text' },
          { id: 'transactionDate', label: 'Transaction Date', type: 'date' },
          { id: 'utrNo', label: 'UTR No.', type: 'text' },
        ].map((field) => (
          <div key={field.id} className="grid grid-cols-3 gap-4 items-center">
            <Label htmlFor={field.id} className="text-sm text-blue-600 col-span-1">
              {field.label}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              value={(formData as any)[field.id]}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className="col-span-2"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default BankingDetails;
