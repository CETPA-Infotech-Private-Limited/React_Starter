'use client';

import React, { useEffect, useMemo, useState } from 'react';
import HospitalTable from '@/components/admin/hospitalManagement/HospitalTable';
import AddHospitalDialog from '@/components/admin/hospitalManagement/AddHospitalDialog';
import { Button } from '@/components/ui/button';
import { HospitalFormValues } from '@/schemas/hospitalSchema';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'react-hot-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Eye, Pencil, Ban } from 'lucide-react';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface ExtendedHospital extends HospitalFormValues {
  isActive?: boolean;
  isBlocked?: boolean;
}

const dummyHospitals: ExtendedHospital[] = [
  {
    hospitalName: 'Apollo Hospitals',
    hospitalAddress: 'Chennai, Tamil Nadu',
    hospitalRegistration: 'TN/APOLLO/2022/001',
    bankName: 'HDFC Bank',
    accountNumber: '123456789012',
    accountHolderName: 'Apollo Hospitals Ltd',
    ifscCode: 'HDFC0000123',
    branchAddress: 'Greams Road Branch, Chennai',
    isActive: true,
    isBlocked: false,
  },
  {
    hospitalName: 'AIIMS Delhi',
    hospitalAddress: 'New Delhi',
    hospitalRegistration: 'DL/AIIMS/2022/002',
    bankName: 'SBI',
    accountNumber: '987654321012',
    accountHolderName: 'AIIMS',
    ifscCode: 'SBIN0000090',
    branchAddress: 'AIIMS Campus, New Delhi',
    isActive: false,
    isBlocked: false,
  },
];

const HospitalManagement = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [hospitalData, setHospitalData] = useState<ExtendedHospital | undefined>();
  const [tableData, setTableData] = useState<ExtendedHospital[]>([]);

  useEffect(() => {
    setTableData(dummyHospitals);
  }, []);

  const handleSubmit = (formValues: ExtendedHospital) => {
    if (isEditing) {
      setTableData((prev) => prev.map((item) => (item.hospitalRegistration === formValues.hospitalRegistration ? { ...item, ...formValues } : item)));
      toast.success('Hospital updated successfully');
    } else {
      setTableData((prev) => [...prev, { ...formValues, isActive: true, isBlocked: false }]);
      toast.success('Hospital added successfully');
    }

    setIsAddOpen(false);
    setIsEditing(false);
    setIsViewOnly(false);
    setHospitalData(undefined);
  };

  const toggleActiveStatus = (registration: string) => {
    setTableData((prev) => prev.map((h) => (h.hospitalRegistration === registration ? { ...h, isActive: !h.isActive } : h)));
    toast.success('Hospital status updated');
  };

  const toggleBlockStatus = (hospital: ExtendedHospital) => {
    setTableData((prev) =>
      prev.map((h) => (h.hospitalRegistration === hospital.hospitalRegistration ? { ...h, isBlocked: !h.isBlocked, isActive: false } : h))
    );
    toast.success(hospital.isBlocked ? 'Hospital unblocked' : 'Hospital blocked');
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'SrNo',
        header: 'Sr. No.',
        enableSorting: false,
        cell: ({ row }: any) => row.index + 1,
      },
      { accessorKey: 'hospitalName', header: 'Hospital Name' },
      { accessorKey: 'hospitalAddress', header: 'Hospital Address' },
      { accessorKey: 'hospitalRegistration', header: 'Registration Number' },
      { accessorKey: 'bankName', header: 'Bank Name' },
      { accessorKey: 'accountNumber', header: 'Account No.' },
      { accessorKey: 'accountHolderName', header: 'Account Holder Name' },
      { accessorKey: 'ifscCode', header: 'IFSC Code' },
      { accessorKey: 'branchAddress', header: 'Branch Address' },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }: any) => {
          const data = row.original as ExtendedHospital;
          return (
            <Badge variant={data.isBlocked ? 'destructive' : data.isActive ? 'default' : 'secondary'}>
              {data.isBlocked ? 'Blocked' : data.isActive ? 'Active' : 'Inactive'}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'action',
        header: 'Actions',
        cell: ({ row }: any) => {
          const data = row.original as ExtendedHospital;
          return (
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <TooltipProvider>
                  {/* View */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          setIsViewOnly(true);
                          setIsEditing(false);
                          setHospitalData(data);
                          setIsAddOpen(true);
                        }}
                      >
                        <Eye size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>View</TooltipContent>
                  </Tooltip>

                  {/* Edit */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        className="bg-blue-600 text-white"
                        onClick={() => {
                          setIsEditing(true);
                          setIsViewOnly(false);
                          setHospitalData(data);
                          setIsAddOpen(true);
                        }}
                      >
                        <Pencil size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit</TooltipContent>
                  </Tooltip>
                  <div className="flex items-center gap-2 pl-1">
                    <Switch
                      checked={data.isActive}
                      onCheckedChange={() => toggleActiveStatus(data.hospitalRegistration)}
                      disabled={data.isBlocked}
                      id={`switch-${data.hospitalRegistration}`}
                    />
                    <label htmlFor={`switch-${data.hospitalRegistration}`} className="text-sm">
                      {data.isActive ? 'Active' : 'Inactive'}
                    </label>
                  </div>

                  {/* Block / Unblock */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="destructive">
                            <Ban size={16} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{data.isBlocked ? 'Unblock this hospital?' : 'Block this hospital?'}</AlertDialogTitle>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => toggleBlockStatus(data)}>{data.isBlocked ? 'Unblock' : 'Block'}</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TooltipTrigger>
                    <TooltipContent>{data.isBlocked ? 'Unblock' : 'Block'}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Active/Inactive Switch */}
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="p-6 font-sans">
      <div className="bg-white border border-blue-200 shadow-lg rounded-xl p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-800">Hospital Management</h1>
        </div>

        <HospitalTable
          data={tableData}
          columns={columns}
          onAddClick={() => {
            setIsAddOpen(true);
            setIsEditing(false);
            setIsViewOnly(false);
            setHospitalData(undefined);
          }}
          inputPlaceholder="Search by name or registration number"
        />

        <AddHospitalDialog
          open={isAddOpen}
          onClose={() => {
            setIsAddOpen(false);
            setIsEditing(false);
            setIsViewOnly(false);
            setHospitalData(undefined);
          }}
          defaultValues={hospitalData}
          isEditing={isEditing}
          isViewOnly={isViewOnly}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default HospitalManagement;
