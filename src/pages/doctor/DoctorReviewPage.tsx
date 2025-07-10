import React, { useMemo, useState, useRef, useEffect } from 'react';
import ClaimSettlementList from '@/components/hr/reviewclaim/ClaimSettlementList';
import HospitalizationBillDetails from '@/components/doctor/doctorreview/HospitalizationBillDetails';
import { Button } from '@/components/ui/button';
import { EyeIcon, FileSearch, EyeOff, Eye } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks'; // Corrected: removed duplicate useAppSelector
import { RootState } from '@/app/store';
import { getDoctorClaimListData, postDocReview } from '@/features/doctor/doctorSlice'; // Ensure this path is correct
import { findEmployeeDetails, formatRupees } from '@/lib/helperFunction';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { fetchClaimDetails } from '@/features/medicalClaim/getClaimDetailsSlice';
import { getClaimDataHr } from '@/features/hr/getClaimRequestSlice';
import { json } from 'node:stream/consumers';
import Loader from '@/components/ui/loader';

const DoctorReviewPage = () => {
  const dispatch = useAppDispatch();
  const [selectedClaim, setSelectedClaim] = useState(null);
  const { data: claimDetails, loading: detailsLoading, error: detailsError } = useAppSelector((state: RootState) => state.getClaimDetails);
  const { claimList, loading } = useAppSelector((state: RootState) => state.submitClaimProcessSlice);
  const { employees } = useAppSelector((state: RootState) => state.employee);
  const user = useAppSelector((state: RootState) => state.user);
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
      hrRecipentId: 57,
      claimType: Number(selectedClaim.claimTypeId) || 3,
      claimStatus: 24,
      isSpecailDisease: form.doctorSpecialDisease === 'Yes',
      comments: commentsArray,
    };

    dispatch(postDocReview(payload));
  };

  useEffect(() => {
    if (user?.EmpCode) {
      dispatch(getDoctorClaimListData(Number(user?.EmpCode)));
    }
  }, [user?.EmpCode, dispatch]);

  useEffect(() => {
    if (showDetails && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showDetails]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'sno',
        header: 'Sr. No.',
        enableSorting: false,
        cell: ({ row }: any) => <div className="text-center">{row.index + 1}</div>,
        className: 'text-center',
      },
      {
        accessorKey: 'empId',
        header: 'Employee Name',
        enableSorting: false,
        cell: ({ row }: any) => {
          const result = findEmployeeDetails(employees, String(row.original.empId));
          return <div className="text-center">{result?.employee?.empName || ''}</div>;
        },
        className: 'text-center',
      },
      {
        accessorKey: 'patientId',
        header: 'Patient Name',
        enableSorting: false,
        cell: ({ row }: any) => {
          const result = findEmployeeDetails(employees, String(row.original.patientId));
          return <div className="text-center">{result?.employee?.empName || ''}</div>;
        },
        className: 'text-center',
      },
      {
        accessorKey: 'relation',
        header: 'Relation',
        enableSorting: false,
        cell: () => <div className="text-center">Self</div>,
        className: 'text-center',
      },
      {
        accessorKey: 'requestDate',
        header: 'Request Date',
        cell: ({ row }: any) => <div className="text-center">{row.original.requestDate}</div>,
        className: 'text-center',
      },
      {
        accessorKey: 'advanceAmount',
        header: 'Claim Amount',
        enableSorting: false,
        cell: ({ row }: any) => {
          const amount = row.original.advanceAmount;
          return <div className="text-center">{amount ? formatRupees(amount) : '-'}</div>;
        },
        className: 'text-center',
      },
      {
        accessorKey: 'approvedAmount',
        header: 'Approved Amount',
        enableSorting: false,
        cell: ({ row }: any) => {
          const amount = row.original.approvedAmount;
          return <div className="text-center">{amount ? formatRupees(amount) : '-'}</div>;
        },
        className: 'text-center',
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }: any) => {
          const item = row.original;
          const isSelected = selectedClaim?.claimId === item.claimId;

          return (
            <Button
              variant="link"
              size="sm"
              className="text-blue-600"
              onClick={(e) => {
                e.stopPropagation();
                if (isSelected) {
                  setSelectedClaim(null);
                } else {
                  setShowDetails(true);
                  dispatch(fetchClaimDetails(item.claimId));
                  setSelectedClaim(item);
                }
              }}
            >
              {isSelected ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
              {isSelected ? 'Hide' : 'View'}
            </Button>
          );
        },
      },
    ],
    [employees, dispatch, selectedClaim]
  );

  return (
    <div className="p-6 bg-gradient-to-br from-white via-blue-50 to-white min-h-screen font-sans">
      <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <h1 className="text-2xl font-bold text-blue-800 tracking-tight">Pending Claim Requests</h1>
        </div>
        {claimList?.length && <ClaimSettlementList columns={columns} claimList={claimList} />}
      </div>

      {(loading || detailsLoading) && <Loader />}

      {selectedClaim && claimDetails && (
        <div ref={detailsRef} className="space-y-6 transition-all duration-300 bg-white border border-blue-200 rounded-2xl shadow-lg p-6">
          <HospitalizationBillDetails
            claimDetail={claimDetails}
            billComments={billComments}
            setBillComments={setBillComments}
            preHospComments={preHospComments}
            setPreHospComments={setPreHospComments}
          />

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
                <Label htmlFor="postHospComment" className="font-semibold">
                  Comment for Post Hospitalization Treatment Advice
                </Label>
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
                <Label htmlFor="doctorComment" className="font-semibold">
                  Comment for Special Disease
                </Label>
                <Textarea
                  id="doctorComment"
                  value={form.doctorComment}
                  onChange={(e) => handleChange('doctorComment', e.target.value)}
                  placeholder="Enter comment"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalComment" className="font-semibold">
                Additional Comments / Recommendation
              </Label>
              <Textarea
                id="additionalComment"
                value={form.additionalComment}
                onChange={(e) => handleChange('additionalComment', e.target.value)}
                placeholder="Enter any additional comments"
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="verified" checked={form.verified} onCheckedChange={(checked) => handleChange('verified', !!checked)} />
              <Label htmlFor="verified">Verified</Label>
            </div>

            <div className="flex justify-end">
              <Button className="bg-indigo-600 text-white hover:bg-indigo-700" onClick={handleSubmit}>
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
