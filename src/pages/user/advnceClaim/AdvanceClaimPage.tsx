import { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { getMyClaims } from '@/features/user/claim/claimSlice';
import RequestAdvanceForm from '@/components/user/RequestAdvanceForm';

const AdvanceClaimPage = () => {
  const [showForm, setShowForm] = useState(false);
  const user = useAppSelector((state: RootState) => state.user);
  const { data: claimList } = useAppSelector((state: RootState) => state.claim);
  const dispatch = useAppDispatch();
  console.log('claimList', claimList);

  const handleCheckboxChange = (checked: boolean) => {
    setShowForm(checked);
  };

  useEffect(() => {
    dispatch(getMyClaims(Number(user.EmpCode)));
  }, [dispatch, user.EmpCode]);
  return (
    <div className="p-6 space-y-6 font-sans">
      <Card className="p-4 border border-blue-200 shadow-sm rounded-xl bg-white">
        <h2 className="text-xl font-extrabold text-blue-800 mb-4 tracking-tight">Unsettled Advance List</h2>

        <div className="overflow-x-auto rounded-lg border border-blue-100 shadow-sm ">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gradient-to-r from-blue-500 to-blue-400 text-white font-semibold text-xs">
              <tr>
                <th className="px-4 py-2">S.No</th>
                <th className="px-4 py-2">Employee Name</th>
                <th className="px-4 py-2">Patient Name</th>
                <th className="px-4 py-2">Relation</th>
                <th className="px-4 py-2">Advance Amount</th>
                <th className="px-4 py-2">Request Date</th>
                <th className="px-4 py-2">Approved Amount</th>
                <th className="px-4 py-2">Approved Date</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Example row */}
              <tr className="odd:bg-white even:bg-blue-50 border-b border-blue-100 hover:bg-blue-100 transition-colors duration-200">
                <td className="px-4 py-2 font-semibold">1</td>
                <td className="px-4 py-2">Anil Sharma</td>
                <td className="px-4 py-2">Riya Sharma</td>
                <td className="px-4 py-2">Daughter</td>
                <td className="px-4 py-2">₹ 15,000</td>
                <td className="px-4 py-2">01/07/2025</td>
                <td className="px-4 py-2">₹ 12,000</td>
                <td className="px-4 py-2">03/07/2025</td>
                <td className="px-4 py-2">
                  <button className="text-blue-600 font-medium hover:underline text-xs">Settle</button>
                </td>
              </tr>
              {/* Add more rows dynamically */}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-4 flex items-center gap-3 border border-blue-200 shadow-sm bg-blue-50 rounded-xl">
        <Checkbox id="new-request" onCheckedChange={handleCheckboxChange} />
        <label htmlFor="new-request" className="text-sm font-medium text-blue-800">
          New Advance Request
        </label>
      </Card>

      {showForm && <RequestAdvanceForm />}
    </div>
  );
};

export default AdvanceClaimPage;
