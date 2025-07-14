import React, { useMemo, useState, useRef, useEffect } from 'react';
import HospitalizationBillDetails from '@/components/doctor/doctorreview/HospitalizationBillDetails';
import { ClaimDocumentList } from '@/components/doctor/doctorreview/ReviewComponents';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { getDoctorClaimListData, postDocReview } from '@/features/doctor/doctorSlice';
import { findEmployeeDetails, formatRupees } from '@/lib/helperFunction';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { fetchClaimDetails } from '@/features/medicalClaim/getClaimDetailsSlice';
import Loader from '@/components/ui/loader';
import DocumentLinks from '@/components/common/DocumentLinks';
import { format } from 'date-fns';
import ClaimSettlementList from '@/components/hr/reviewClaim/ClaimSettlementList';

const DoctorReviewPage = () => {
  const dispatch = useAppDispatch();
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const [showDetails, setShowDetails] = useState(false);

  const {
    claimList,
    loading,
    docReviewLoading,
    docReviewSuccess: postDocReviewSuccess,
    docReviewError,
  } = useAppSelector((state: RootState) => state.doctorApproval);

  const { data: claimDetails, loading: detailsLoading } = useAppSelector((state: RootState) => state.getClaimDetails);
  const { employees } = useAppSelector((state: RootState) => state.employee);
  const user = useAppSelector((state: RootState) => state.user);
  const [billComments, setBillComments] = useState<Record<number, string>>({});
  const [preHospComments, setPreHospComments] = useState<Record<number, string>>({});

  const initialFormState = {
    postHospitalization: '',
    postHospComment: '',
    doctorSpecialDisease: '',
    doctorComment: '',
    additionalComment: '',
    verified: false,
  };

  const [form, setForm] = useState(initialFormState);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetFormAndComments = () => {
    setBillComments({});
    setPreHospComments({});
    setForm(initialFormState);
    setSelectedClaim(null);
    setShowDetails(false);
  };

  useEffect(() => {
    if (!showDetails && !selectedClaim) {
      resetFormAndComments();
    }
  }, [showDetails, selectedClaim]);

  useEffect(() => {
    if (postDocReviewSuccess) {
      resetFormAndComments();
      dispatch(getDoctorClaimListData(Number(user?.EmpCode)));
    }
  }, [postDocReviewSuccess, dispatch, user?.EmpCode]);

  const handleSubmit = () => {
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
      },
      {
        accessorKey: 'empId',
        header: 'Employee Name',
        enableSorting: false,
        cell: ({ row }: any) => {
          const result = findEmployeeDetails(employees, String(row.original.empId));
          return <div className="text-center">{result?.employee?.empName || ''}</div>;
        },
      },
      {
        accessorKey: 'patientId',
        header: 'Patient Name',
        enableSorting: false,
        cell: ({ row }: any) => {
          const result = findEmployeeDetails(employees, String(row.original.patientId));
          return <div className="text-center">{result?.employee?.empName || ''}</div>;
        },
      },
      {
        accessorKey: 'relation',
        header: 'Relation',
        enableSorting: false,
        cell: () => <div className="text-center">Self</div>,
      },
      {
        accessorKey: 'requestDate',
        header: 'Request Date',
        cell: ({ row }: any) => <div className="text-center">{row.original.requestDate ? format(new Date(row.original.requestDate), 'do MMM yyyy') : '-'}</div>,
      },
      {
        accessorKey: 'advanceAmount',
        header: 'Claim Amount',
        enableSorting: false,
        cell: ({ row }: any) => {
          const amount = row.original.advanceAmount;
          return <div className="text-center">{amount ? formatRupees(amount) : '-'}</div>;
        },
      },
      {
        accessorKey: 'approvedAmount',
        header: 'Approved Amount',
        enableSorting: false,
        cell: ({ row }: any) => {
          const amount = row.original.approvedAmount;
          return <div className="text-center">{amount ? formatRupees(amount) : '-'}</div>;
        },
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
                  setShowDetails(false);
                } else {
                  setShowDetails(true);
                  dispatch(fetchClaimDetails(item.directClaimId));
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
        <h1 className="text-2xl font-bold text-blue-800 mb-5">Pending Claim Requests</h1>
        {(loading || docReviewLoading || detailsLoading) && <Loader />}

        <ClaimSettlementList columns={columns} claimList={claimList?.length > 0 ? claimList : []} />
      </div>

      {selectedClaim && claimDetails && (
        <div ref={detailsRef} className="space-y-6 transition-all bg-white border border-blue-200 rounded-2xl shadow-lg p-6">
          <HospitalizationBillDetails
            claimDetail={claimDetails}
            billComments={billComments}
            setBillComments={setBillComments}
            preHospComments={preHospComments}
            setPreHospComments={setPreHospComments}
          />

          {claimDetails?.documentLists?.length > 0 && (
            <>
              <DocumentLinks documentLists={claimDetails.documentLists} />
              <ClaimDocumentList documents={claimDetails.documentLists} />
            </>
          )}

          <div className="space-y-6 bg-muted/50 p-4 rounded-xl">
            <div>
              <Label className="font-semibold">Post Hospitalization Applicable</Label>
              <div className="flex gap-4 mt-2">
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

            <div>
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
              <Button className="bg-indigo-600 text-white hover:bg-indigo-700" onClick={handleSubmit} disabled={docReviewLoading}>
                {docReviewLoading ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorReviewPage;
