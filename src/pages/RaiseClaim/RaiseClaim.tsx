import React, { useEffect, useMemo } from 'react';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { Card } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchTourRequests } from '@/features/raiseClaim/raiseClaimSlice';
import { RootState } from '@/app/store';
import Loader from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { getRaiseClaimData } from '@/features/raiseClaim/getRaiseClaim';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

const columns = [
  { accessorKey: "srno", header: "Sr No" },
  { accessorKey: "source", header: "Tour From" },
  { accessorKey: "destination", header: "Tour To" },
  { accessorKey: "tourStartDate", header: "Start Date" },
  { accessorKey: "requestDate", header: "End Date" },
  { accessorKey: "status", header: "Tour Status" },
  { accessorKey: "isAdvanceTaken", header: "Advance Taken" },
  { accessorKey: "action", header: "Action" },
];

const RaiseClaim = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const tourData = useAppSelector((state: RootState) => state.tour?.recipientTours?.data);
  const raiseClaimData = useAppSelector((state:RootState)=>state.raiseClaim)
  const raiseClaimDataLoading = useAppSelector((state:RootState)=>state.raiseClaim?.loading)
  const { loading } = useAppSelector((state: RootState) => state.tour?.recipientTours);
  const user = useAppSelector((state: RootState) => state.user);

  useEffect(() => {
    const empId = (user as any)?.EmpId ?? (user as any)?.empId;
    if (empId) dispatch(fetchTourRequests(empId));
  }, [dispatch, (user as any)?.EmpId, (user as any)?.empId]);

  // ✅ Filter only statusId === 2
  const filtered = useMemo(
    () => (Array.isArray(tourData) ? tourData.filter((r: any) => r?.statusId === 2) : []),
    [tourData]
  );

  const tableData = useMemo(() => {
    return filtered.map((row: any, idx: number) => ({
      srno: idx + 1,
      source: row.source,
      destination: row.destination,
      tourStartDate: row.tourStartDate?.slice(0, 10) ?? '',
      requestDate: row.requestDate?.slice(0, 10) ?? '',
      status: row.status ?? '—',
      isAdvanceTaken: row.isAdvanceTaken ? "Yes" : "No",
      action: (
        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={async() => {
             const result =  await dispatch(getRaiseClaimData(row?.tourId)).unwrap()
             if(result?.statusCode===200){
                return navigate('/raise-claim-approver')
             }else{
                toast.error('Something went Wrong.')
             }

            }}
          >
            Raise Claim
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-red-500 text-red-600 hover:bg-red-50"
            onClick={() => console.log('Tour Not Availed clicked for', row)}
          >
            Tour Not Availed
          </Button>
        </div>
      ),
    }));
  }, [filtered]);

  return (
    <>
      {(loading || raiseClaimDataLoading) && <Loader />}
      <Card className="m-4">
        <div className="p-4 font-bold text-primary drop-shadow text-3xl">
          Tour List
        </div>
        <div className="p-4">
          <Table>
            <TableHeader className="[&_tr]:bg-primary [&_th]:text-white">
              <TableRow>
                {columns.map(col => (
                  <TableHead key={col.accessorKey}>{col.header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center text-sm text-muted-foreground"
                  >
                    No Data
                  </TableCell>
                </TableRow>
              ) : (
                tableData.map((row, idx) => (
                  <TableRow key={idx}>
                    {columns.map(col => (
                      <TableCell key={col.accessorKey}>
                        {row[col.accessorKey as keyof typeof row] as any}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </>
  );
};

export default RaiseClaim;
