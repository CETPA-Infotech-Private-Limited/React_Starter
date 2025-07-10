import React, { useMemo, useState, useRef, useEffect } from 'react';
import ClaimSettlementList from '@/components/hr/reviewclaim/ClaimSettlementList';
import HospitalizationBillDetails from '@/components/doctor/doctorreview/HospitalizationBillDetails';
import { Button } from '@/components/ui/button';
import { EyeIcon, FileSearch, EyeOff } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks'; // Corrected: removed duplicate useAppSelector
import { RootState } from '@/app/store';
import { getDoctorClaimListData, postDocReview } from '@/features/doctor/doctorSlice'; // Ensure this path is correct
import { findEmployeeDetails } from '@/lib/helperFunction';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { fetchClaimDetails } from '@/features/medicalClaim/getClaimDetailsSlice';
import { getClaimDataHr } from '@/features/hr/getClaimRequestSlice';
import { json } from 'node:stream/consumers';

const DoctorReviewPage = () => {
  const dispatch = useAppDispatch();

  // Correctly access the status and error from your doctorSlice
  // Assuming your doctorSlice has a state structure like:
  // doctor: {
  //   doctorClaims: [...],
  //   postDocReviewStatus: 'idle' | 'pending' | 'succeeded' | 'failed',
  //   postDocReviewError: null | string,
  //   // ...other doctor-related states
  // }
  const data = useAppSelector(
    (state: RootState) => state.submitClaimProcessSlice // Assuming this is the slice property that holds the status and error of the postDocReview thunk
  );
  console.log(data, 'data from doctorSlice');

  const claimDrData = useAppSelector((state: RootState) => state.submitClaimProcessSlice.response);
  const { employees } = useAppSelector((state: RootState) => state.employee);
  const user = useAppSelector((state: RootState) => state.user);
  const claimDetail = useAppSelector((state: RootState) => state);
  // console.log(claimDetail, 'claimDetail from doctorSlice');

  const [selectedClaim, setSelectedClaim] = useState<any | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);

  const [billComments, setBillComments] = useState<Record<number, string>>({});
  const [preHospComments, setPreHospComments] = useState<Record<number, string>>({});

  const [form, setForm] = useState({
    postHospitalization: '',
    postHospComment: '',
    doctorSpecialDisease: '',
    doctorComment: '',
    additionalComment: '',
    verified: false,
  });

  const dummyClaimDetail = {
    advanceBasicDetails: {
      patientName: 'John Doe',
      dateOfAdmission: '2024-06-10',
      dateofDischarge: '2024-06-15',
      doctorName: 'Dr. Smith',
      hospitalName: 'City Hospital',
      hospitalRegNo: 'HOSP12345',
      treatmentType: 'Surgery',
      payTo: 'City Hospital Pvt Ltd',
      directCliamApprovedAmount: 12000,
    },
    billDetails: {
      medicineBill: 5000,
      medicineClaim: 4500,
      consultationBill: 3000,
      consultationClaim: 2800,
      investigationBill: 2000,
      investigationClaim: 2000,
      roomRentBill: 4000,
      roomRentClaim: 3500,
      othersBill: 1000,
      otherClaim: 800,
    },
    preHospitalizationExpenses: {
      medicineBillDate: '2024-06-05',
      medicineBillAmount: 800,
      medicineClaimAmount: 700,
      consultationBillDate: '2024-06-03',
      consultationBillAmount: 500,
      consultationClaimAmount: 400,
      investigationBillDate: '2024-06-02',
      investigationBillAmount: 600,
      investigationClaimAmount: 600,
      othersBillDate: '2024-06-01',
      otherBillAmount: 300,
      otherClaimAmount: 200,
    },
  };

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Effect to reset form and comments when details are hidden or a new claim is selected
  useEffect(() => {
    if (!showDetails || !selectedClaim) {
      setBillComments({});
      setPreHospComments({});
      setForm({
        postHospitalization: '',
        postHospComment: '',
        doctorSpecialDisease: '',
        doctorComment: '',
        additionalComment: '',
        verified: false,
      });
    }
  }, [showDetails, selectedClaim]);

  // Console log all relevant component state
  useEffect(() => {
    console.groupCollapsed('Current Component State (DoctorReviewPage)');
    console.log('selectedClaim:', selectedClaim);
    console.log('showDetails:', showDetails);
    console.log('billComments:', billComments);
    console.log('preHospComments:', preHospComments);
    console.log('form:', form);
    // You can also log Redux state here if it's relevant to the component's render
   ;
    
   
    console.groupEnd();
  }, [selectedClaim, showDetails, billComments, preHospComments, form]);


  // Use a separate useEffect to handle post-submission logic based on Redux state
// Dependencies for this effect

  const handleSubmit = async () => {
    if (!selectedClaim) return;

    const commentsArray = [];

    if (form.postHospComment) {
      commentsArray.push({ commentKey: 'postHospComment', commentValue: form.postHospComment });
    }
    if (form.doctorComment) {
      commentsArray.push({ commentKey: 'doctorSpecialDiseaseComment', commentValue: form.doctorComment });
    }
    if (form.additionalComment) {
      commentsArray.push({ commentKey: 'additionalComment', commentValue: form.additionalComment });
    }
    if (form.postHospitalization) {
      commentsArray.push({ commentKey: 'postHospitalizationApplicable', commentValue: form.postHospitalization });
    }
    if (form.doctorSpecialDisease) {
      commentsArray.push({ commentKey: 'doctorDeclaresSpecialDisease', commentValue: form.doctorSpecialDisease });
    }
    commentsArray.push({ commentKey: 'doctorVerified', commentValue: form.verified ? 'true' : 'false' });

    Object.entries(billComments).forEach(([id, comment]) => {
      if (comment) {
        commentsArray.push({ commentKey: `billItemComment_${id}`, commentValue: comment });
      }
    });

    Object.entries(preHospComments).forEach(([id, comment]) => {
      if (comment) {
        commentsArray.push({ commentKey: `preHospItemComment_${id}`, commentValue: comment });
      }
    });

    const payload = {
  claimId: selectedClaim.claimId || selectedClaim.id,
  doctorId: user?.EmpCode ?? 0,
  hrRecipentId: 57, // Replace with actual value if dynamic
  claimType: Number(selectedClaim.claimTypeId) || 3,
  claimStatus: 24,
  isSpecailDisease: form.doctorSpecialDisease === 'Yes',
  comments: commentsArray,
};

dispatch(postDocReview(payload));

  };




  useEffect(() => {
    if (user?.EmpCode) {
      // You might want to use the actual user.EmpCode for getDoctorClaimListData
      dispatch(getDoctorClaimListData(102199)); // Placeholder, consider using user.EmpCode
    }
  }, [user?.EmpCode, dispatch]);

  useEffect(() => {
    if (showDetails && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showDetails]);

  const handleViewToggle = (rowData: any) => {
    const isSame = selectedClaim?.id === rowData.id;
    if (isSame) {
      const shouldShow = !showDetails;
      setShowDetails(shouldShow);
      if (!shouldShow) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      setSelectedClaim(rowData);
      setShowDetails(true);
      setBillComments({});
      setPreHospComments({});
      setForm({
        postHospitalization: '',
        postHospComment: '',
        doctorSpecialDisease: '',
        doctorComment: '',
        additionalComment: '',
        verified: false,
      });

      if (rowData.claimId || rowData.id) {
        dispatch(fetchClaimDetails(rowData.claimId || rowData.id));
        dispatch(getClaimDataHr(rowData.claimId|| rowData.id ));
      }
    }
  };
  

  const columns = useMemo(
    () => [
      {
        accessorKey: 'srNo',
        header: 'Sr. No',
        cell: ({ row }: any) => row.index + 1,
      },
      {
        accessorKey: 'employeeName',
        header: 'Employee Name',
      },
      {
        accessorKey: 'patientName',
        header: 'Patient Name',
      },
      {
        accessorKey: 'relation',
        header: 'Relation',
      },
      {
        accessorKey: 'requestedDate',
        header: 'Requested Date',
      },
      {
        accessorKey: 'claimAmount',
        header: 'Claim Amount (₹)',
        cell: ({ getValue }: any) => `₹ ${getValue()?.toLocaleString?.() ?? ''}`,
      },
      {
        accessorKey: 'action',
        header: 'Action',
        cell: ({ row }: any) => {
          const rowData = row.original;
          const isSelected = selectedClaim?.id === rowData.id;

          return (
            <Button
              size="sm"
              onClick={() => handleViewToggle(rowData)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 flex items-center gap-1 rounded-full px-3 py-1.5 text-xs"
            >
              {isSelected && showDetails ? <EyeOff className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
              {isSelected && showDetails ? 'Hide' : 'View'}
            </Button>
          );
        },
      },
    ],
    [selectedClaim, showDetails]
  );

  const empData = findEmployeeDetails(employees, user.EmpCode);

  const claimList = Array.isArray(claimDrData?.data)
    ? claimDrData.data.map((value) => ({
        id: value.claimId,
        claimId: value.claimId,
        employeeName: empData?.employee?.empName ?? 'Employee',
        patientName: empData?.employee?.empName ?? 'Patient',
        relation: 'Self',
        requestedDate: 'Time',
        claimAmount: value.cliamAmount,
        directClaimId: value.directClaimId,
      }))
    : [];

  return (
    <div className="p-6 bg-gradient-to-br from-white via-blue-50 to-white min-h-screen font-sans">
      <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <FileSearch className="text-blue-600 w-6 h-6" />
          <h1 className="text-2xl font-bold text-blue-800 tracking-tight">Review Claim Requests</h1>
        </div>

        <ClaimSettlementList columns={columns} claimList={claimList} />
      </div>

      {selectedClaim && showDetails && (
        <div
          ref={detailsRef}
          className="space-y-6 transition-all duration-300 bg-white border border-blue-200 rounded-2xl shadow-lg p-6"
        >
          {/* HospitalizationBillDetails component */}
          <HospitalizationBillDetails
            claimDetail={claimDetail}
            billComments={billComments}
            setBillComments={setBillComments}
            preHospComments={preHospComments}
            setPreHospComments={setPreHospComments}
          />

          {/* Doctor's Review Form */}
          <div className="space-y-6 bg-muted/50 p-4 rounded-xl">
            <div className="space-y-2">
              <Label className="font-semibold">Post Hospitalization Applicable</Label>
              <div className="flex gap-4">
                {['Yes', 'No'].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="postHosp"
                      checked={form.postHospitalization === opt}
                      onChange={() => handleChange('postHospitalization', opt)}
                      className="form-radio text-blue-600"
                    />
                    {opt}
                  </label>
                ))}
              </div>

              <div className="mt-2">
                <Label htmlFor="postHospComment" className="font-semibold">Comment for Post Hospitalization Treatment Advice</Label>
                <Textarea
                  id="postHospComment"
                  value={form.postHospComment}
                  onChange={(e) => handleChange('postHospComment', e.target.value)}
                  placeholder="Enter comment"
                />
              </div>
            </div>

            <div className="space-y-3 border rounded-md p-4">
              <Label className="font-semibold">Declaration by Doctor</Label>
              <div className="flex gap-6">
                <Label className="font-medium">Special Disease</Label>
                {['Yes', 'No'].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="docDisease"
                      checked={form.doctorSpecialDisease === opt}
                      onChange={() => handleChange('doctorSpecialDisease', opt)}
                      className="form-radio text-blue-600"
                    />
                    {opt}
                  </label>
                ))}
              </div>

              <div className="mt-2">
                <Label htmlFor="doctorComment" className="font-semibold">Comment for Special Disease</Label>
                <Textarea
                  id="doctorComment"
                  value={form.doctorComment}
                  onChange={(e) => handleChange('doctorComment', e.target.value)}
                  placeholder="Enter comment"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalComment" className="font-semibold">Additional Comments / Recommendation</Label>
              <Textarea
                id="additionalComment"
                value={form.additionalComment}
                onChange={(e) => handleChange('additionalComment', e.target.value)}
                placeholder="Enter any additional comments"
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="verified"
                checked={form.verified}
                onCheckedChange={(checked) => handleChange('verified', !!checked)}
              />
              <Label htmlFor="verified">Verified</Label>
            </div>

            <div className="flex justify-end">
              <Button
                className="bg-indigo-600 text-white hover:bg-indigo-700"
                onClick={handleSubmit}
                 // Disable button during submission
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorReviewPage;