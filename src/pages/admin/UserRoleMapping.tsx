import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import AdminTable from '@/components/admin/adminManagement/AdminTable';
import AddUserMapRole from '@/components/admin/userRoleMapping/AddUserMapRole';
import { Button } from '@/components/ui/button';
import Loader from '@/components/ui/loader';
import { fetchMasterRole } from '@/features/allRole/materRoleListSlice';
import { findEmployeeDetails } from '@/lib/helperFunction';
import { Trash2 } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '@/services/axiosInstance';
import { fetchEmpRoleList } from '@/features/allRole/empRoleListSlice';
import { Role } from '@/features/allRole/materRoleListSlice'; // ✅ Import Role interface

interface Employee {
  empCode: number;
  empName: string;
  designation: string;
  unitId: number;
}

const UserRoleMapping = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedEmpCode, setSelectedEmpCode] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const masterRoleList = useAppSelector((state: RootState) => state.masterRole.roles);
  const employeesList = useAppSelector((state: RootState) => state.employee.employees);
  const { userList, loading: isUserListLoading } = useAppSelector((state: RootState) => state.empRoleList);

  const employeesListFiltered = useMemo(() => employeesList.filter((emp) => emp.unitId === 396), [employeesList]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchMasterRole());
    dispatch(fetchEmpRoleList());
  }, [dispatch]);

  const handleAdd = async () => {
    if (!selectedEmployee || !selectedRole) {
      toast.error('Please select role and employee');
      return;
    }

    console.log('selectedRole', selectedRole);
    const payload = {
      empCode: selectedEmployee.empCode,
      empUnit: 396,
      userRoles: [{ roleId: selectedRole.id }],
    };

    setLoading(true);
    try {
      const res = await axiosInstance.post('/User/AddUserRoleMapping', payload);
      const { statusCode, message } = res.data;

      if (statusCode === 200) {
        if (message.includes('already exist')) {
          toast.error('User is already mapped to this role.');
        } else {
          toast.success('Role assigned successfully!');
        }
      } else {
        toast.error(message || 'Failed to assign role');
      }
    } catch (e) {
      console.error('Add user-role mapping error:', e);
      toast.error('Something went wrong.');
    } finally {
      resetForm();
      setIsAddOpen(false);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedEmployee(null);
    setSelectedRole(null);
    setSelectedEmpCode(null);
  };

  const columns = useMemo(
    () => [
      { accessorKey: 'SrNo', header: 'Sr.No.', cell: ({ row }: any) => row.index + 1 },
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'dis', header: 'Designation' },
      { accessorKey: 'role', header: 'Role' },
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
                  setSelectedEmpCode(rowData.empCode);
                  setSelectedEmployee({
                    empCode: rowData.empCode,
                    empName: rowData.name,
                    designation: rowData.dis,
                    unitId: rowData.empUnitId,
                  });
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
                  setSelectedEmpCode(rowData.empCode);
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
      (userList || []).map((employee, idx) => {
        const emp = findEmployeeDetails(employeesList, employee.empCode?.toString())?.employee || {};
        return {
          SrNo: idx + 1,
          empCode: employee.empCode,
          name: emp.empName || 'N/A',
          dis: emp.designation || 'N/A',
          role: employee.roles?.[0]?.roleName || 'N/A',
          empUnitId: emp.unitId || 0,
        };
      }),
    [userList, employeesList]
  );

  if (loading || isUserListLoading) return <Loader />;

  return (
    <div>
      <AdminTable data={tableData} columns={columns} onAddClick={() => setIsAddOpen(true)} />

      <AddUserMapRole
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        roles={masterRoleList}
        employees={employeesListFiltered}
        selectedEmployee={selectedEmployee}
        selectedRole={selectedRole}
        onEmployeeChange={setSelectedEmployee}
        onRoleChange={setSelectedRole}
        onSubmit={handleAdd}
      />
    </div>
  );
};

export default UserRoleMapping;
