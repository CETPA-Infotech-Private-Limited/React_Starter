import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FinancialDetails = () => {
  const financialData = [
    { srNo: 1, type: 'Reference Date', comments: '15-10-23' },
    { srNo: 2, type: 'SAP Reference No.', comments: 'SAP36868' },
  ];

  return (
    <Card className="mt-6 p-4 border border-blue-200 shadow-sm rounded-xl bg-white w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-extrabold text-blue-800">Financial Details</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-blue-50 border-b">
                <th className="p-3 text-left text-blue-700 font-medium">Sr No</th>
                <th className="p-3 text-left text-blue-700 font-medium">Type</th>
                <th className="p-3 text-left text-blue-700 font-medium">Comments</th>
              </tr>
            </thead>
            <tbody>
              {financialData.map((item, index) => (
                <tr key={item.srNo} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-3">{item.srNo}</td>
                  <td className="p-3 text-blue-600">{item.type}</td>
                  <td className="p-3">{item.comments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialDetails;
