import React, { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { RootState } from "@/app/store";
import { fetchTourRequests } from "@/features/raiseClaim/raiseClaimSlice";
import { getRaiseClaimData } from "@/features/raiseClaim/getRaiseClaim";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import type { ColumnDef } from "@tanstack/react-table";
import TableList from "@/components/ui/data-table";
import Loader from "@/components/ui/loader";

// ⬇️ Import Shadcn AlertDialog
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { getOwnArrangementAmount, tourNotAvailed } from "@/features/tourNotAvailed/tourNotAvailedSlice";

// ⬇️ Your thunk (adjust path if different)

type RaiseClaimRow = {
  srno: number;
  source: string;
  destination: string;
  tourStartDate: string;
  requestDate: string;
  status: string;
  isAdvanceTaken: string;
  action: React.ReactNode;
};

const RaiseClaim = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const tourData = useAppSelector(
    (state: RootState) => state.tour?.recipientTours?.data
  );
  const { loading } = useAppSelector(
    (state: RootState) => state.tour?.recipientTours || { loading: false }
  );
  const raiseClaimDataLoading = useAppSelector(
    (state: RootState) => state.raiseClaim?.loading
  );
  const user = useAppSelector((state: RootState) => state.user);

  // 🔐 We’ll use EmpId/empId as recipientId
  const recipientId = (user as any)?.EmpId ?? (user as any)?.empId;

  // ⚙️ Confirm dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedTourId, setSelectedTourId] = useState<number | string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 🧩 Fetch tours on mount
  useEffect(() => {
    if (recipientId) dispatch(fetchTourRequests(recipientId));
  }, [dispatch, recipientId]);

  // 🧩 Filter tours with statusId === 2
  const filtered = useMemo(
    () =>
      Array.isArray(tourData)
        ? tourData.filter((r: any) => r?.statusId === 2)
        : [],
    [tourData]
  );

  // 🧩 Prepare Table Data
  const data: RaiseClaimRow[] = useMemo(() => {
    return filtered.map((row: any, idx: number) => ({
      srno: idx + 1,
      source: row.source,
      destination: row.destination,
      tourStartDate: row.tourStartDate?.slice(0, 10) ?? "",
      requestDate: row.requestDate?.slice(0, 10) ?? "",
      status: row.status ?? "—",
      isAdvanceTaken: row.isAdvanceTaken ? "Yes" : "No",
      action: (
        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={async () => {
              try {
                const result = await dispatch(getRaiseClaimData(row?.tourId)).unwrap();
                dispatch(getOwnArrangementAmount())
                if (result?.statusCode === 200) {
                  navigate("/raise-claim-approver",
                     {
    state: {
      tourId: row?.tourId,}}
                  );
                } else {
                  toast.error("Something went wrong.");
                }
              } catch (e) {
                toast.error("Failed to fetch claim data.");
              }
            }}
          >
            Raise Claim
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="border-red-500 text-red-600 hover:bg-red-50"
            onClick={() => {
              setSelectedTourId(row?.tourId);
              setConfirmOpen(true);
            }}
          >
            Tour Not Availed
          </Button>
        </div>
      ),
    }));
  }, [filtered, dispatch, navigate]);

  // 🧩 Define Columns
  const columns: ColumnDef<RaiseClaimRow>[] = [
    { accessorKey: "srno", header: "Sr No" },
    { accessorKey: "source", header: "Tour From" },
    { accessorKey: "destination", header: "Tour To" },
    { accessorKey: "tourStartDate", header: "Start Date" },
    { accessorKey: "requestDate", header: "End Date" },
    { accessorKey: "status", header: "Tour Status" },
    { accessorKey: "isAdvanceTaken", header: "Advance Taken" },
    {
      accessorKey: "action",
      header: "Action",
      enableSorting: false,
      cell: ({ row }) => row.original.action,
    },
  ];

  // ✅ Confirm OK handler
  const handleConfirm = async () => {
    if (!selectedTourId || !recipientId) {
      toast.error("Invalid data. Please try again.");
      return;
    }
    try {
      setSubmitting(true);
      await dispatch(
        tourNotAvailed({ tourId: selectedTourId, recipientId})
      ).unwrap();

      setConfirmOpen(false);
      setSelectedTourId(null);

      // Refresh list (optional but useful)
      dispatch(fetchTourRequests(recipientId));
    } catch (e: any) {
      // toast handled in thunk; still keep UI consistent
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {(loading || raiseClaimDataLoading) && <Loader />}
      <Card className="m-4 p-4">
        <div className="pb-2 font-bold text-primary text-3xl">Tour List</div>
        <TableList
          columns={columns}
          data={data}
          searchKey="destination"
          isLoading={loading || raiseClaimDataLoading}
        />
      </Card>

      {/* 🔔 Confirmation Dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={(v) => !submitting && setConfirmOpen(v)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Mark this tour as <b>Not Availed</b>? 
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={submitting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {submitting ? "Submitting..." : "Yes, Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RaiseClaim;
