import React, { useEffect } from 'react';
import { Eye, FileText, Download, Printer, CheckCircle, XCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BillItemDisplayRow, DisplayField, DisplayTable, InfoCard, PreHospDisplayRow, SectionHeader, StatusBadge } from './ReviewComponents';
import { Textarea } from '@/components/ui/textarea';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import { findEmployeeDetails } from '@/lib/helperFunction';
import { getMyClaims } from '@/features/user/claim/claimSlice';
import { getClaimDataHr, getClaimHr } from '@/features/hr/getClaimRequestSlice';

const HospitalizationBillView = (directClaimid) => {

  const user = useAppSelector((state:RootState)=>state.user)
  const directIdData= useAppSelector((state:RootState)=>state.getClaimHr.data)
  console.log(directIdData, 'directids')
  const { employees } = useAppSelector((state: RootState) => state.employee);
  const empData = findEmployeeDetails(employees, user.EmpCode)

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (user?.EmpCode) {
      dispatch(getClaimHr({ recipientId: user.EmpCode, pageId: 1 }));
    }
  }, [dispatch]);
  
  useEffect(()=>{
    dispatch(getMyClaims(user.EmpCode))
  },[dispatch])

useEffect(()=>{
    dispatch(getClaimDataHr())
  },[dispatch])

  const myClaims = useAppSelector((state:RootState)=>state.user)
  console.log(myClaims, "these are my claims")


  const billItems = [
    {
      id: 1,
      billType: 'Medicine',
      billedAmount: 15750.0,
      claimedAmount: 15750.0,
      included: true,
      clarification: 'Prescription medicines as per doctor advice',
    },
    { id: 2, billType: 'Consultation', billedAmount: 3500.0, claimedAmount: 3500.0, included: true, clarification: '' },
    { id: 3, billType: 'Investigation', billedAmount: 8900.0, claimedAmount: 8900.0, included: true, clarification: 'Lab tests and imaging' },
    { id: 4, billType: 'Room Rent', billedAmount: 25200.0, claimedAmount: 22000.0, included: true, clarification: 'Room limit exceeded by ₹3,200' },
    { id: 5, billType: 'Procedure', billedAmount: 45600.0, claimedAmount: 45600.0, included: true, clarification: '' },
    { id: 6, billType: 'Other', billedAmount: 2850.0, claimedAmount: 2850.0, included: false, clarification: 'Non-medical expenses' },
  ];

  const preHospItems = [
    { id: 1, billType: 'Medicine', billedDate: '2024-12-15', billedAmount: 1250.0, claimedAmount: 1250.0, hasFiles: 2 },
    { id: 2, billType: 'Consultation', billedDate: '2024-12-16', billedAmount: 800.0, claimedAmount: 800.0, hasFiles: 1 },
    { id: 3, billType: 'Investigation', billedDate: '2024-12-18', billedAmount: 3200.0, claimedAmount: 3200.0, hasFiles: 3 },
    { id: 4, billType: 'Procedure', billedDate: '', billedAmount: 0, claimedAmount: 0, hasFiles: 0 },
    { id: 5, billType: 'Other', billedDate: '', billedAmount: 0, claimedAmount: 0, hasFiles: 0 },
  ];

  const formData = {
    claimNumber: 'CLM-2024-000156',
    patientName: empData.employee.empName,
    employeeId: empData.employee.empId,
    hospitalName: 'City General Hospital',
    dateOfAdmission: '2024-12-20',
    dateOfDischarge: '2024-12-25',
    specialDisease: 'No',
    specialDiseaseName: '',
    taxable: 'No',
    taxableByHR: 'Yes',
    postHospitalization: 'Yes',
    totalClaimRequested: 98600.0,
    approvedAmount: 95400.0,
    status: "approve",
    clarificationNote: 'All documents verified and claim processed as per company policy.',
  };

  const totalBilled = billItems.reduce((sum, item) => sum + item.billedAmount, 0);
  const totalClaimed = billItems.reduce((sum, item) => sum + (item.included ? item.claimedAmount : 0), 0);
  const preHospTotal = preHospItems.reduce((sum, item) => sum + item.claimedAmount, 0);

  const billHeaders = ['S.No.', 'Bill Type', 'Billed Amount', 'Claimed Amount', 'Status', 'Clarification'];
  const preHospHeaders = ['S.No.', 'Bill Type', 'Billed Date', 'Billed Amount', 'Claimed Amount', 'Documents'];

  return (
    <div className=" p-6 bg-white">
      <div className="mb-8 border-b border-gray-200 pb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Hospitalization Claim Details</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Claim #: <span className="font-medium text-gray-900">{formData.claimNumber}</span>
              </span>
              <StatusBadge status={formData.status} type="success" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <InfoCard title="Patient Information">
          <div className="grid grid-cols-2 gap-3">
            <DisplayField label="Patient Name" value={formData.patientName} />
            <DisplayField label="Employee ID" value={formData.employeeId} />
            <DisplayField label="Date of Admission" value={formData.dateOfAdmission} />
            <DisplayField label="Date of Discharge" value={formData.dateOfDischarge} />
          </div>
        </InfoCard>

        <InfoCard title="Hospital Information">
          <div className="grid grid-cols-2 gap-3">
            <DisplayField label="Hospital Name" value={formData.hospitalName} />
            <DisplayField label="Total Days" value="5 days" />
            <DisplayField label="Treatment Type" value="In-Patient" />
            <DisplayField label="Room Type" value="Private AC" />
          </div>
        </InfoCard>
      </div>

      <div className="mb-8">
        <SectionHeader title="Hospitalization Bill Details (Advance Payment)" subtitle={''} />

        <DisplayTable headers={billHeaders} className="mb-4">
          {billItems.map((item, index) => (
            <BillItemDisplayRow
              key={item.id}
              serialNo={index + 1}
              billType={item.billType}
              billedAmount={item.billedAmount}
              claimedAmount={item.claimedAmount}
              included={item.included}
              clarification={item.clarification}
            />
          ))}
        </DisplayTable>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-gray-600">Sub Total:</div>
              <div className="text-lg font-semibold text-gray-900">₹{totalBilled.toFixed(2)}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-600">Amount Included in Main Bill:</div>
              <div className="text-lg font-semibold text-blue-600">₹{totalClaimed.toFixed(2)}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-600">Amount not Included in Main Bill:</div>
              <div className="text-lg font-semibold text-orange-600">₹{formData.approvedAmount.toFixed(2)}</div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap  items-center w-full mt-4 gap-4">
          <div className="flex-1 max-w-[600px]">
            <div className="font-bold text-lg mb-2">Clarification</div>
            <Textarea placeholder="Add clarification note..." className="w-full" />
          </div>
          <div className="flex items-end ">
            <Button className="mt-6">Seek Clarification</Button>
          </div>
        </div>
      </div>

      {/* Pre Hospitalization Expenses Section */}
      <div className="mb-8">
        <SectionHeader title="Pre Hospitalization Expenses" subtitle="Expenses incurred 30 days before hospitalization" />

        <DisplayTable headers={preHospHeaders} className="mb-4">
          {preHospItems.map((item, index) => (
            <PreHospDisplayRow
              key={item.id}
              serialNo={index + 1}
              billType={item.billType}
              billedDate={item.billedDate}
              billedAmount={item.billedAmount}
              claimedAmount={item.claimedAmount}
              hasFiles={item.hasFiles}
            />
          ))}
        </DisplayTable>

        <div className="text-right bg-gray-50 p-3 rounded">
          <span className="text-sm font-medium text-gray-700">Pre-Hospitalization Total: </span>
          <span className="text-lg font-semibold text-gray-900">₹{preHospTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <InfoCard title="Declaration By Employee">
          <div className="grid grid-cols-2 gap-3">
            <DisplayField
              label="Special Disease"
              value={formData.specialDisease}
              valueClassName={formData.specialDisease === 'Yes' ? 'text-orange-600 font-medium' : ''}
            />
            {formData.specialDisease === 'Yes' && <DisplayField label="Disease Name" value={formData.specialDiseaseName} />}
            <DisplayField
              label="Post Hospitalization Applicable"
              value={formData.postHospitalization}
              valueClassName={formData.postHospitalization === 'Yes' ? 'text-blue-600 font-medium' : ''}
            />
            <DisplayField
              label="Taxable"
              value={formData.taxable}
              valueClassName={formData.taxable === 'Yes' ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}
            />
            <DisplayField
              label="Taxable By HR"
              value={formData.taxableByHR}
              valueClassName={formData.taxableByHR === 'Yes' ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}
            />
          </div>
        </InfoCard>
        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Claim Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-600">Total Requested</div>
              <div className="text-xl font-bold text-gray-900">₹{formData.totalClaimRequested.toFixed(2)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Pre-Hospital</div>
              <div className="text-xl font-bold text-blue-600">₹{preHospTotal.toFixed(2)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Main Hospital</div>
              <div className="text-xl font-bold text-blue-600">₹{totalClaimed.toFixed(2)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Final Approved</div>
              <div className="text-xl font-bold text-green-600">₹{formData.approvedAmount.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      <InfoCard title="Action">
        <div className="flex justify-between items-center mb-4">
          <Button>
            <Send className="w-4 h-4" />
            Send to Doctor
          </Button>
        </div>
      </InfoCard>
    </div>
  );
};

export default HospitalizationBillView;
