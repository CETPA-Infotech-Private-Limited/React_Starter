// src/pages/ApproverPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { RootState } from "@/app/store";
import TransportationSection, { TransportationRow } from "./sections/TransportationSection";
import AccommodationSection, { AccommodationRow } from "./sections/AccommodationSection";
import DailyAllowanceSection, { DARow } from "./sections/DailyAllowanceSection";
import LeaveSection, { LeaveRow } from "./sections/LeaveSection";
import DocumentsAndSummarySection from "./sections/DocumentsAndSummarySection";
import DeclarationAndSubmit from "./sections/DeclarationAndSubmit";
import { raiseClaimRequest } from "@/features/raiseClaim/raiseClaimSlice";

// ✅ import from your slice file that exports the thunk & selectors


import toast from "react-hot-toast";
import { amendTourClaim } from "@/features/raiseClaim/getRaiseClaim";
import DocumentPreview from "./sections/DocumentPreview";
import Loader from "@/components/ui/loader";

/* ======================= Time + Calc Utils ======================= */
const pad2 = (n: number) => n.toString().padStart(2, "0");
const toHM = (d: Date) => `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

function hhmmFromHours(floatHours: number): string {
  const mins = Math.max(0, Math.round(floatHours * 60));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}:${pad2(m)}`;
}

function percentForDA(hours: number): number {
  if (hours < 6) return 30;
  if (hours < 12) return 70;
  return 100;
}

function startOfDay(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`);
}
function endOfDay(dateStr: string) {
  return new Date(`${dateStr}T23:59:59.999`);
}

// Merge overlapping [startMs, endMs] intervals for a day
function mergeIntervals(intervals: Array<[number, number]>): Array<[number, number]> {
  if (intervals.length === 0) return [];
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const merged: Array<[number, number]> = [];
  let [curS, curE] = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    const [s, e] = sorted[i];
    if (s <= curE) {
      curE = Math.max(curE, e);
    } else {
      merged.push([curS, curE]);
      [curS, curE] = [s, e];
    }
  }
  merged.push([curS, curE]);
  return merged;
}

function calculateDailySpans(rows: TransportationRow[]) {
  const perDaySegments: Record<string, Array<[number, number]>> = {};
  rows.forEach((r) => {
    if (!r.departureDate || !r.departureTime || !r.arrivalDate || !r.arrivalTime) return;
    const dep = new Date(`${r.departureDate}T${r.departureTime}`);
    const arr = new Date(`${r.arrivalDate}T${r.arrivalTime}`);
    if (isNaN(dep.getTime()) || isNaN(arr.getTime()) || arr <= dep) return;

    let cursor = new Date(dep);
    while (cursor < arr) {
      const dateKey = cursor.toISOString().slice(0, 10);
      const dayS = startOfDay(dateKey);
      const dayE = endOfDay(dateKey);
      const sliceStart = cursor < dayS ? dayS : cursor;
      const sliceEnd = arr < dayE ? arr : dayE;

      const sMs = sliceStart.getTime();
      const eMs = sliceEnd.getTime();
      if (eMs > sMs) {
        if (!perDaySegments[dateKey]) perDaySegments[dateKey] = [];
        perDaySegments[dateKey].push([sMs, eMs]);
      }

      const nextDay = new Date(dayS);
      nextDay.setDate(nextDay.getDate() + 1);
      cursor = nextDay;
    }
  });

  const out: Record<string, { hours: number; startHM: string; endHM: string }> = {};
  Object.entries(perDaySegments).forEach(([dateKey, segs]) => {
    const merged = mergeIntervals(segs);
    let totalMs = 0;
    let minStart = Number.POSITIVE_INFINITY;
    let maxEnd = 0;

    merged.forEach(([s, e]) => {
      totalMs += e - s;
      if (s < minStart) minStart = s;
      if (e > maxEnd) maxEnd = e;
    });

    const hours = totalMs / (1000 * 60 * 60);
    const startHM = toHM(new Date(minStart === Number.POSITIVE_INFINITY ? startOfDay(dateKey) : minStart));
    const endHM = toHM(new Date(maxEnd || endOfDay(dateKey).getTime()));

    out[dateKey] = { hours, startHM, endHM };
  });

  return out;
}

function getSingleDayAccommodationDates(rows: AccommodationRow[]): Set<string> {
  const dates = new Set<string>();
  rows.forEach((r) => {
    if (!r.checkInDate || !r.checkOutDate) return;
    if (r.checkInDate === r.checkOutDate) dates.add(r.checkInDate);
  });
  return dates;
}

/* ======================= Component ======================= */
const ApproverPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation() as { state?: { tourId?: string | number } };

  const user = useAppSelector((state: RootState) => state.user);
  const amendLoading = useAppSelector((state:RootState)=>state.raiseClaim.loading);
  console.log(amendLoading)

  const claim = useAppSelector((state: RootState) => state.raiseClaim?.data);

  // Slab (adjust path as per your store)
  const DASlabRaw = useAppSelector((state: RootState) =>
    (state as any)?.tourNotAvailed?.ownArrangement?.amount ??
    (state as any)?.tourNotAvailed?.ownArrangement?.data?.ownArrangmentAmount ??
    (state as any)?.tourNotAvail?.ownArrangement?.data?.ownArrangmentAmount ??
    0
  );
  const DASlab = Number(DASlabRaw || 0);

  // Subtotals
  const [transportationSubtotal, setTransportationSubtotal] = useState(0);
  const [accommodationSubtotal, setAccommodationSubtotal] = useState(0);
  const [daSubtotal, setDaSubtotal] = useState(0);
  const [leaveDADeductable, setLeaveDADeductable] = useState(0);

  // Toggles
  const [includeAccommodation, setIncludeAccommodation] = useState(true);
  const [includeDA, setIncludeDA] = useState(true);
  const [includeLeave, setIncludeLeave] = useState(true);
  const [isLoading,setIsLoading]= useState(false)

  // Totals
  const maskedAccommodation = includeAccommodation ? accommodationSubtotal : 0;
  const maskedDA = includeDA ? daSubtotal : 0;
  const maskedLeave = includeLeave ? leaveDADeductable : 0;

  const totalAll = useMemo(
    () =>
      Number(
        (transportationSubtotal + maskedAccommodation + maskedDA - maskedLeave).toFixed(2)
      ),
    [transportationSubtotal, maskedAccommodation, maskedDA, maskedLeave]
  );

  // Docs + declaration
  const [documents, setDocuments] = useState<{ tickets: boolean; hotel: boolean }>({
    tickets: true,
    hotel: true,
  });
  const [isDeclared, setIsDeclared] = useState(false);
  const [pdfUrl] = useState(
    (claim as any)?.data?.tourApprovelDetails?.approverDetails?.filePath || ""
  );

  // Guard
  useEffect(() => {
    const isMissing = !claim || typeof claim !== "object";
    const notOk = !isMissing && (claim as any)?.statusCode !== 200;
    const noInner = !isMissing && !(claim as any)?.data;
    if (isMissing || notOk || noInner) navigate("/raise-claim", { replace: true });
  }, [claim, navigate]);

  /* ---------------- Seeds ---------------- */
  const [transportationRows, setTransportationRows] = useState<TransportationRow[]>([
    {
      id: "1",
      departureDate: new Date().toISOString().slice(0, 10),
      departureTime: "",
      source: "",
      modeOfTravel: "select",
      arrivalDate: new Date().toISOString().slice(0, 10),
      arrivalTime: "",
      destination: "",
      billedAmount: "0",
      taxAmount: "0",
      totalBilledAmount: "0",
      claimedAmount: "0",
      billFile: null,
    },
  ]);

  const [accommodationRows, setAccommodationRows] = useState<AccommodationRow[]>([
    {
      id: "1",
      checkInDate: "",
      checkInTime: "",
      checkOutDate: "",
      checkOutTime: "",
      location: "",
      classOfCity: "Select",
      ownArrangement: "No",
      freeProvidedByCompany: "No",
      hotelName: "",
      billed: "0",
      tax: "0",
      totalBilled: "0",
      claimed: "0",
      billFile: null,
    },
  ]);

  const [daRows, setDaRows] = useState<DARow[]>([
    {
      id: "1",
      date: "",
      sourceTime: "",
      endTime: "",
      slabAmount: DASlab,
      totalHHMM: "0:00",
      percentAdmissible: "0",
      amount: "0",
    },
  ]);

  const [leaveRows, setLeaveRows] = useState<LeaveRow[]>([
    { id: "1", startDate: "", endDate: "", daDeductable: "Yes", amount: "0" },
  ]);

  /* ---------------- Auto-calc DA ---------------- */
  useEffect(() => {
    const perDay = calculateDailySpans(transportationRows); // { date: {hours, startHM, endHM} }
    const slab = Number(DASlab || 0);
    const singleDayStay = getSingleDayAccommodationDates(accommodationRows);

    const computed: DARow[] = Object.entries(perDay)
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([date, info], idx) => {
        let percent = percentForDA(info.hours);
        if (singleDayStay.has(date)) percent = 25; // highest precedence
        const amount = Math.round((slab * percent) / 100);

        return {
          id: String(idx + 1),
          date,
          sourceTime: info.startHM,
          endTime: info.endHM,
          slabAmount: slab,
          totalHHMM: hhmmFromHours(info.hours),
          percentAdmissible: String(percent),
          amount: String(amount),
        };
      });

    setDaRows(computed);
    setDaSubtotal(computed.reduce((sum, r) => sum + Number(r.amount || 0), 0));
  }, [transportationRows, accommodationRows, DASlab]);

  /* ---------------- Tour Amend ---------------- */
  const handleAmend = async () => {
    setIsLoading(true)
    const tourId = location?.state?.tourId;
    const empId = (user as any)?.EmpId ?? (user as any)?.empId;

    if (!tourId) {
      toast.error("TourId missing in route state.");
      return;
    }
    if (!empId) {
      toast.error("EmpId missing in user state.");
      return;
    }

    // API expects FormData? Use FormData; else send JSON. (Your thunk handles both.)
    const formData = new FormData();
    formData.append("TourId", String(tourId));
    formData.append("EmpId", String(empId));
    formData.append("RecipientId", String(empId));
    formData.append("StatusId", String(15)); // Re-approval

    try {
      const result = await dispatch(amendTourClaim(formData)).unwrap();

  if (result?.statusCode === 201) {
    navigate("/raise-claim", {
      state: {
        from: "amend-success",
        tourId: formData.get("TourId"), // optional
      },
    
    });
  } else {
    toast.success("Amendment request processed successfully.");
  }
  setIsLoading(false)
    } catch (e: any) {
      setIsLoading(false)
      console.error("Amend error:", e);
    }
  };

  /* ---------------- Submit Claim ---------------- */
  const handleSubmit = async () => {
    if (!isDeclared) return;

    const formData = new FormData();
    formData.append("EmpTourPlanId", "123");
    formData.append("EmpId", "456");
    formData.append("RecipentId", "789");
    formData.append("PurposeOfTour", "Business Meeting");
    formData.append("Source", "New York");
    formData.append("Destination", "Los Angeles");
    formData.append("TantetiveDateOfDeparture", "2025-09-26T08:00:00Z");
    formData.append("NoOfDays", "5");

    formData.append("TransportaionDetailDtos", JSON.stringify(transportationRows));
    formData.append("AccomodationDetailDto", JSON.stringify(accommodationRows));
    formData.append("DailyAllowanceDto", JSON.stringify(daRows));
    formData.append("IsLeaveAvailedwithbetweentour", String(true));

    formData.append("DocumentsAttached.IsApprovedTourProgramme", String(documents.tickets));
    formData.append("DocumentsAttached.IsTickets_BoardingPass_Bills", String(documents.tickets));
    formData.append("DocumentsAttached.IsHotelBills", String(documents.hotel));

    formData.append("ClaimAmount", String(totalAll));

    if (transportationRows[0]?.billFile) {
      formData.append("TransportationUploadDto", transportationRows[0].billFile);
    }
    if (accommodationRows[0]?.billFile) {
      formData.append("AccomodationUploadDto", accommodationRows[0].billFile);
    }

    try {
      await dispatch(raiseClaimRequest(formData));
      console.log("Claim successfully raised.");
    } catch (error) {
      console.error("Error raising claim:", error);
    }
  };

  return (
    <>
    {isLoading && <Loader/>}
     <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen">
      <DocumentPreview
        pdfUrl={pdfUrl}
        onAmend={handleAmend}      // ✅ correct prop
        // amendLoading={amendLoading}
      />

      <TransportationSection
        rows={transportationRows}
        setRows={setTransportationRows}
        onSubtotalChange={setTransportationSubtotal}
      />

      <AccommodationSection
        include={includeAccommodation}
        setInclude={setIncludeAccommodation}
        rows={accommodationRows}
        setRows={setAccommodationRows}
        onSubtotalChange={setAccommodationSubtotal}
      />

      <DailyAllowanceSection
        include={includeDA}
        setInclude={setIncludeDA}
        rows={daRows}
        setRows={setDaRows}
        onSubtotalChange={setDaSubtotal}
        readOnly={true}
      />

      <LeaveSection
        include={includeLeave}
        setInclude={setIncludeLeave}
        rows={leaveRows}
        setRows={setLeaveRows}
        onDeductableChange={setLeaveDADeductable}
      />

      <DocumentsAndSummarySection
        documents={documents}
        setDocuments={setDocuments}
        transportationSubtotal={transportationSubtotal}
        accommodationSubtotal={includeAccommodation ? accommodationSubtotal : 0}
        daSubtotal={includeDA ? daSubtotal : 0}
        leaveDADeductable={includeLeave ? leaveDADeductable : 0}
        totalAll={totalAll}
      />

      <DeclarationAndSubmit
        isDeclared={isDeclared}
        setIsDeclared={setIsDeclared}
        onSubmit={handleSubmit}
        disabledSubmit={!isDeclared}
      />
    </div>
    </>
   
  );
};

export default ApproverPage;
