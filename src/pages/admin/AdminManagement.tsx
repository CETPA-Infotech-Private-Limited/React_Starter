import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import axiosInstance from '@/services/axiosInstance';
import toast from 'react-hot-toast';
import Loader from '@/components/ui/loader';
import { findEmployeeDetails } from '@/lib/helperFunction';
import { Button } from '@/components/ui/button';
import AdminTable from '@/components/admin/adminManagement/AdminTable';
import AddAdminDialog from '@/components/admin/adminManagement/AddAdminDialog';
import DeleteAdminDialog from '@/components/admin/adminManagement/DeleteAdminDialog';
import Heading from '@/components/ui/heading';
import { Trash2 } from 'lucide-react';

// Helpers

const AdminManagement = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [selectedEmpCode, setSelectedEmpCode] = useState<any>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { employees: employeesList, units } = useSelector((state: RootState) => state.employee);

  // Memoized select options
  const selectOptions = useMemo(
    () =>
      units.map((unit) => ({
        value: unit.unitId,
        label: unit.unitName.charAt(0)?.toUpperCase() + unit.unitName.slice(1)?.toLowerCase(),
      })),
    [units]
  );

  const filteredEmployeesList = useMemo(() => {
    if (!selectedUnit) return [];
    return employeesList.filter((emp) => emp.unitName?.toLowerCase() === selectedUnit.label?.toLowerCase());
  }, [selectedUnit, employeesList]);

  const employeeOptions = useMemo(
    () =>
      filteredEmployeesList.map((emp) => ({
        value: emp.empId ?? '',
        label: emp.empName,
        empName: emp.empName,
        empCode: emp.empCode,
        designation: emp.designation,
        department: emp.department,
      })),
    [filteredEmployeesList]
  );

  const handleAdd = async () => {
    if (!selectedUnit || !selectedEmployee) {
      toast.error('Please select unit and employee');
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post('/AdminManage/CreateRolesandPermssion', {
        unitId: selectedUnit.value,
        portalId: 2,
        userId: selectedEmployee?.value,
        isActive: true,
      });

      const { statusCode, message } = res.data;
      if (statusCode === 200) {
        if (message.includes('already exist')) {
          toast.error('User is already an admin.');
        } else {
          toast.success('Admin added successfully!');
        }
      }
    } catch (e) {
      console.error('Add admin error:', e);
      toast.error('Something went wrong.');
    } finally {
      resetForm();
      setIsAddOpen(false);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    // Placeholder for future logic
    try {
      // Delete logic here
    } catch (e) {
      toast.error('Error removing admin');
    } finally {
      resetForm();
    }
  };

  const resetForm = () => {
    setSelectedUnit(null);
    setSelectedEmployee(null);
    setSelectedEmpCode(null);
  };

  const columns = useMemo(
    () => [
      { accessorKey: 'SrNo', header: 'Sr.No.', cell: ({ row }: any) => row.index + 1 },
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'dis', header: 'Designation' },
      { accessorKey: 'unit', header: 'Unit Name' },
      {
        accessorKey: 'action',
        header: 'Action',
        cell: ({ row }: any) => {
          const rowData = row.original;
          return (
            <>
              <Button
                size="sm"
                onClick={() => {
                  setSelectedEmpCode({ value: rowData.empCode, label: rowData.empCode });
                  setSelectedUnit({ value: rowData.unit, label: rowData.unit });
                  setIsAddOpen(true);
                }}
              >
                Edit
              </Button>
              <Button
                className="ml-3"
                variant="destructive"
                size="icon"
                onClick={() => {
                  setSelectedEmpCode(rowData);
                  setSelectedUnit({ value: rowData.unit });
                  setIsDeleteOpen(true);
                }}
              >
                <Trash2 />
              </Button>
            </>
          );
        },
      },
    ],
    []
  );

  const tableData = useMemo(
    () =>
      roles.map((role, idx) => {
        const emp = findEmployeeDetails(employeesList, role.empId?.toString())?.employee || {};
        return {
          SrNo: idx + 1,
          empCode: role.empCode,
          name: emp.empName,
          dis: emp.designation,
          unit: role.unitName,
          ...role,
        };
      }),
    [roles, employeesList]
  );

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <Heading className="my-4">Manage Unit Wise Admin</Heading>
      <AdminTable data={tableData} columns={columns} onAddClick={() => setIsAddOpen(true)} />
      <AddAdminDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        units={selectOptions}
        employees={employeeOptions}
        selectedUnit={selectedUnit}
        selectedEmployee={selectedEmployee}
        onUnitChange={setSelectedUnit}
        onEmployeeChange={setSelectedEmployee}
        onSubmit={handleAdd}
      />
      <DeleteAdminDialog open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDelete} />
    </div>
  );
};

export default AdminManagement;
