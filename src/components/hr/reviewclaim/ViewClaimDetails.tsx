// ViewClaimDetails.tsx
import React from 'react';

const ViewClaimDetails = ({ claim }: { claim: any }) => {
  return (
    <div className="mt-6 p-4 border rounded bg-white shadow">
      <h2 className="text-xl font-semibold mb-3 text-primary">Claim Details</h2>
      <p>
        <strong>Employee Name:</strong> {claim.employeeName}
      </p>
      <p>
        <strong>Patient Name:</strong> {claim.patientName}
      </p>
      <p>
        <strong>Relation:</strong> {claim.relation}
      </p>
      <p>
        <strong>Requested Date:</strong> {claim.requestedDate}
      </p>
      <p>
        <strong>Claim Amount:</strong> ₹{claim.claimAmount}
      </p>
    </div>
  );
};

export default ViewClaimDetails;
