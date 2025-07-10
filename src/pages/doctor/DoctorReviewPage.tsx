import React, { useMemo, useState, useRef, useEffect } from 'react';
import ClaimSettlementList from '@/components/hr/reviewclaim/ClaimSettlementList';
import HospitalizationBillDetails from '@/components/doctor/doctorreview/HospitalizationBillDetails';
import { Button } from '@/components/ui/button';
import { EyeIcon, FileSearch, EyeOff } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import {getDoctorClaimListData} from '@/features/doctor/doctorSlice';
import { findEmployeeDetails } from '@/lib/helperFunction';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { fetchClaimDetails } from '@/features/medicalClaim/getClaimDetailsSlice';



  const DoctorReviewPage = () => {
  const dispatch = useAppDispatch();
  const claimDrData = useAppSelector((state: RootState) => state.submitClaimProcessSlice);
  const claimListData = claimDrData.response.data
 


  const { employees } = useAppSelector((state: RootState) => state.employee);
  const user = useAppSelector((state: RootState) => state.user);
  const claimDetail = useAppSelector((state: RootState) => state.getClaimHr.claimDetail);

  const [selectedClaim, setSelectedClaim] = useState<any | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    postHospitalization: '',
    postHospComment: '',
    employeeSpecialDisease: '',
    specialDiseaseName: '',
    doctorSpecialDisease: '',
    doctorComment: '',
    additionalComment: '',
    verified: false,
  });

  const dummyClaimDetail = {
    advanceBasicDetails: {
      patientName: "John Doe",
      dateOfAdmission: "2024-06-10",
      dateofDischarge: "2024-06-15",
      doctorName: "Dr. Smith",
      hospitalName: "City Hospital",
      hospitalRegNo: "HOSP12345",
      treatmentType: "Surgery",
      payTo: "City Hospital Pvt Ltd",
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
      medicineBillDate: "2024-06-05",
      medicineBillAmount: 800,
      medicineClaimAmount: 700,
      consultationBillDate: "2024-06-03",
      consultationBillAmount: 500,
      consultationClaimAmount: 400,
      investigationBillDate: "2024-06-02",
      investigationBillAmount: 600,
      investigationClaimAmount: 600,
      othersBillDate: "2024-06-01",
      otherBillAmount: 300,
      otherClaimAmount: 200,
    }
  };

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    console.log('Submitted Form:', form);
  };

  useEffect(() => {
    if (user?.EmpCode) {
      dispatch(getDoctorClaimListData(102199));
    }
  }, [user?.EmpCode]);
 
  //  useEffect(()=>{
  //   dispatch(fetchClaimDetails(claimListData?.advanceId))
  //  },[claimListData])

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
    }

    if (rowData.directClaimId) {
      
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
        cell: ({ getValue }: any) => `₹ ${getValue().toLocaleString()}`,
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

  const claimList = Array.isArray(claimDrData)
    ? claimDrData.map((value) => ({
        id: value.claimId,
        employeeName: empData.employee.empName,
        patientName: empData.employee.empName,
        relation: 'Self',
        requestedDate: new Date(value.requestDate).toLocaleDateString(),
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
          {/* ✅ Fallback to dummy data if claimDetail is undefined */}
          <HospitalizationBillDetails claimDetail={claimDetail ?? dummyClaimDetail} />

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
                    />
                    {opt}
                  </label>
                ))}
              </div>

              <div className="mt-2">
                <Label className="font-semibold">Comment for Post Hospitalization Treatment Advice</Label>
                <Textarea
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
                    />
                    {opt}
                  </label>
                ))}
              </div>

              <div className="mt-2">
                <Label className="font-semibold">Comment for Special Disease</Label>
                <Textarea
                  value={form.doctorComment}
                  onChange={(e) => handleChange('doctorComment', e.target.value)}
                  placeholder="Enter comment"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Additional Comments / Recommendation</Label>
              <Textarea
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
              <Button className="bg-indigo-600 text-white" onClick={handleSubmit}>
                Send to HR
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorReviewPage;
