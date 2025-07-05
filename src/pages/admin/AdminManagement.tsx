import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { Trash2, Pencil } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AddNewRoleDialog from '@/components/admin/adminManagement/roleManagement/AddNewRoleDialog';
import RoleTable from '@/components/admin/adminManagement/roleManagement/RoleTable';
import { createRole, fetchRoles } from '@/features/roleManagement/roleSlice';
import { useAppDispatch } from '@/app/hooks';

const AdminManagement = () => {
  const dispatch = useAppDispatch();

  const appple = 'a';
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [selectedEmpCode, setSelectedEmpCode] = useState<any>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<{ roleId?: number; name: string; description: string } | null>(null);

  const { employees: employeesList, units } = useSelector((state: RootState) => state.employee);
  const { roles: allRoles, loading: roleLoading } = useSelector((state: RootState) => state.roles);

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

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
        empCode: emp.empCode, // Needed for API
        designation: emp.designation,
        department: emp.department,
      })),
    [filteredEmployeesList]
  );

  // ✅ Updated to use static roleId 3
  const handleAdd = async () => {
    if (!selectedUnit || !selectedEmployee?.empCode) {
      toast.error('Please select unit and employee');
      return;
    }

    const payload = {
      empCode: selectedEmployee.empCode,
      empUnitId: selectedUnit.value,
      userRoles: [{ roleId: 3 }],
    };

    setLoading(true);
    try {
      const res = await axiosInstance.post('/User/AddUserRoleMapping', payload);
      const { statusCode, message } = res.data;

      if (statusCode === 200) {
        if (message.includes('already exist')) {
          toast.error('User is already an admin.');
        } else {
          toast.success('Admin added successfully!');
        }
      } else {
        toast.error(message || 'Failed to add admin');
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
    try {
      // Add delete logic
    } catch (e) {
      toast.error('Error removing admin');
    } finally {
      resetForm();
    }
  };

  const handleRoleSubmit = (data: { name: string; description: string }) => {
    if (selectedRole?.roleId) {
      toast.error('Edit API not implemented yet');
    } else {
      dispatch(
        createRole({
          roleName: data.name,
          description: data.description,
        }) as any
      )
        .unwrap()
        .then(() => {
          toast.success('Role added');
          setRoleDialogOpen(false);
          setSelectedRole(null);
        })
        .catch((err) => {
          toast.error(err || 'Failed to add role');
        });
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

  const roleColumns = useMemo(
    () => [
      { accessorKey: 'SrNo', header: 'Sr.No.', cell: ({ row }: any) => row.index + 1 },
      { accessorKey: 'roleName', header: 'Role Name' },
      { accessorKey: 'description', header: 'Description' },
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

  if (loading || roleLoading) return <Loader />;

  return (
    <div className="p-6">
      <Tabs defaultValue="admin" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="admin">Admin</TabsTrigger>
          <TabsTrigger value="role">Role</TabsTrigger>
        </TabsList>

        {/* Admin Tab */}
        <TabsContent value="admin">
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
        </TabsContent>

        {/* Role Tab */}
        <TabsContent value="role">
          <Heading className="my-4">Manage Roles</Heading>
          <RoleTable
            data={allRoles}
            columns={roleColumns}
            onAddClick={() => {
              setSelectedRole(null);
              setRoleDialogOpen(true);
            }}
          />

          <AddNewRoleDialog
            open={roleDialogOpen}
            onClose={() => {
              setRoleDialogOpen(false);
              setSelectedRole(null);
            }}
            onSubmit={handleRoleSubmit}
            initialData={selectedRole}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminManagement;
