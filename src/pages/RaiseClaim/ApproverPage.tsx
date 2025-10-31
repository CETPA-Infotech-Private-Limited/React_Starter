import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useAppSelector, useAppDispatch } from "@/app/hooks";  // Importing useAppDispatch
import { RootState } from "@/app/store";

import DocumentPreview from "./sections/DocumentPreview";
import TransportationSection, { TransportationRow } from "./sections/TransportationSection";
import AccommodationSection, { AccommodationRow } from "./sections/AccommodationSection";
import DailyAllowanceSection, { DARow } from "./sections/DailyAllowanceSection";
import LeaveSection, { LeaveRow } from "./sections/LeaveSection";
import DocumentsAndSummarySection from "./sections/DocumentsAndSummarySection";
import DeclarationAndSubmit from "./sections/DeclarationAndSubmit";
import { raiseClaimRequest } from "@/features/raiseClaim/raiseClaimSlice";

const ApproverPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();  // Using dispatch here
  const claim = useAppSelector((state: RootState) => state.raiseClaim?.data);

  // subtotals
  const [transportationSubtotal, setTransportationSubtotal] = useState(0);
  const [accommodationSubtotal, setAccommodationSubtotal] = useState(0);
  const [daSubtotal, setDaSubtotal] = useState(0);
  const [leaveDADeductable, setLeaveDADeductable] = useState(0);

  // per-section include (controlled by each section's header checkbox)
  const [includeAccommodation, setIncludeAccommodation] = useState(true);
  const [includeDA, setIncludeDA] = useState(true);
  const [includeLeave, setIncludeLeave] = useState(true);

  // masked totals based on include flags
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

  const [documents, setDocuments] = useState<{ tickets: boolean; hotel: boolean }>({
    tickets: true,
    hotel: true,
  });
  const [isDeclared, setIsDeclared] = useState(false);
  const [pdfUrl] = useState(
    claim?.data?.tourApprovelDetails?.approverDetails?.filePath || ""
  );

  useEffect(() => {
    const isMissing = !claim || typeof claim !== "object";
    const notOk = !isMissing && (claim as any)?.statusCode !== 200;
    const noInner = !isMissing && !(claim as any)?.data;
    if (isMissing || notOk || noInner) navigate("/raise-claim", { replace: true });
  }, [claim, navigate]);

  // demo seeds
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
      slabAmount: "1500.00",
      totalHHMM: "0:0",
      percentAdmissible: "0",
      amount: "0",
    },
  ]);

  const [leaveRows, setLeaveRows] = useState<LeaveRow[]>([
    { id: "1", startDate: "", endDate: "", daDeductable: "Yes", amount: "0" },
  ]);

  const handleSubmit = async () => {
    if (!isDeclared) return;

    const formData = new FormData();

    // Add simple fields
    formData.append("EmpTourPlanId", "123");  // Example EmpTourPlanId, replace with actual value
    formData.append("EmpId", "456"); // Example EmpId, replace with actual value
    formData.append("RecipentId", "789"); // Example RecipentId, replace with actual value
    formData.append("PurposeOfTour", "Business Meeting");
    formData.append("Source", "New York");
    formData.append("Destination", "Los Angeles");
    formData.append("TantetiveDateOfDeparture", "2025-09-26T08:00:00Z");
    formData.append("NoOfDays", "5");

    // Handle section-specific data and files
    formData.append("TransportaionDetailDtos", JSON.stringify(transportationRows));
    formData.append("AccomodationDetailDto", JSON.stringify(accommodationRows));
    formData.append("DailyAllowanceDto", JSON.stringify(daRows));
    formData.append("IsLeaveAvailedwithbetweentour", String(true));  // Example boolean value

    // Attach any documents
    formData.append("DocumentsAttached.IsApprovedTourProgramme", String(documents.tickets));
    formData.append("DocumentsAttached.IsTickets_BoardingPass_Bills", String(documents.tickets));
    formData.append("DocumentsAttached.IsHotelBills", String(documents.hotel));

    // Add subtotals and totals
    formData.append("ClaimAmount", String(totalAll));

    // Handle file uploads (if any)
    if (transportationRows[0].billFile) {
      formData.append("TransportationUploadDto", transportationRows[0].billFile);
    }
    if (accommodationRows[0].billFile) {
      formData.append("AccomodationUploadDto", accommodationRows[0].billFile);
    }

  

    try {
      // Dispatching the raiseClaimRequest action
      await dispatch(raiseClaimRequest(formData));
      console.log("Claim successfully raised.");
      // Optionally, handle success (e.g., show a success message, redirect, etc.)
    } catch (error) {
      console.error("Error raising claim:", error);
      // Optionally, handle error (e.g., show a notification or alert)
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen">
      <DocumentPreview pdfUrl={pdfUrl} />

      {/* Transportation (always visible) */}
      <TransportationSection
        rows={transportationRows}
        setRows={setTransportationRows}
        onSubtotalChange={setTransportationSubtotal}
      />

      {/* Accommodation with inline include checkbox */}
      <AccommodationSection
        include={includeAccommodation}
        setInclude={setIncludeAccommodation}
        rows={accommodationRows}
        setRows={setAccommodationRows}
        onSubtotalChange={setAccommodationSubtotal}
      />

      {/* Daily Allowance with inline include checkbox */}
      <DailyAllowanceSection
        include={includeDA}
        setInclude={setIncludeDA}
        rows={daRows}
        setRows={setDaRows}
        onSubtotalChange={setDaSubtotal}
      />

      {/* Leave with inline include checkbox */}
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
        accommodationSubtotal={maskedAccommodation}
        daSubtotal={maskedDA}
        leaveDADeductable={maskedLeave}
        totalAll={totalAll}
      />

      <DeclarationAndSubmit
        isDeclared={isDeclared}
        setIsDeclared={setIsDeclared}
        onSubmit={handleSubmit}
        disabledSubmit={!isDeclared}
      />
    </div>
  );
};

export default ApproverPage;
