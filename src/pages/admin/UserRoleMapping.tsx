import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import AdminTable from '@/components/admin/adminManagement/AdminTable';
import AddUserMapRole from '@/components/admin/userRoleMapping/AddUserMapRole';
import { Button } from '@/components/ui/button';
import Loader from '@/components/ui/loader';
import { fetchMasterRole, Role } from '@/features/allRole/materRoleListSlice';
import { fetchEmpRoleList } from '@/features/allRole/empRoleListSlice';
import { findEmployeeDetails } from '@/lib/helperFunction';
import toast from 'react-hot-toast';
import axiosInstance from '@/services/axiosInstance';

interface Employee {
  empCode: number;
  empName: string;
  designation: string;
  unitId: number;
}

const UserRoleMapping = () => {
  const dispatch = useAppDispatch();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const masterRoleList = useAppSelector((state: RootState) => state.masterRole.roles);
  const { employees: employeesList, units } = useAppSelector((state: RootState) => state.employee);
  const { userList, loading: isUserListLoading } = useAppSelector((state: RootState) => state.empRoleList);

  useEffect(() => {
    dispatch(fetchMasterRole());
    dispatch(fetchEmpRoleList());
  }, [dispatch]);

  const unitOptions = useMemo(() => units.map((unit) => ({ unitId: unit.unitId, unitName: unit.unitName })), [units]);

  const employeesListFiltered = useMemo(() => {
    if (!selectedUnit) return [];
    return employeesList.filter((emp) => emp.unitId === selectedUnit.unitId);
  }, [employeesList, selectedUnit]);

  const resetForm = () => {
    setSelectedEmployee(null);
    setSelectedRoles([]);
    setSelectedUnit(null);
    setIsEditing(false);
  };

  const handleSubmit = async () => {
    if (!selectedEmployee || !selectedRoles.length || !selectedUnit) {
      toast.error('Please select unit, employee, and at least one role.');
      return;
    }

    const empCode = selectedEmployee.empCode;
    const empUnit = selectedUnit.unitId.toString();

    const endpoint = isEditing ? '/User/EditEmpRole' : '/User/AddUserRoleMapping';
    const method = isEditing ? 'put' : 'post';

    const payload = isEditing
      ? {
          empCode,
          empUnit,
          roles: selectedRoles.map((r) => ({
            roleId: r.id,
            roleName: r.value,
          })),
        }
      : {
          empCode,
          empUnit,
          userRoles: selectedRoles.map((r) => ({
            roleId: r.id,
          })),
        };

    setLoading(true);
    try {
      const res = await axiosInstance[method](endpoint, payload);
      const { statusCode, message } = res.data;

      if (statusCode === 200) {
        toast.success(isEditing ? 'Role(s) updated successfully!' : 'Role(s) assigned successfully!');
        dispatch(fetchEmpRoleList());
      } else {
        toast.error(message || 'Request failed.');
      }
    } catch (e) {
      console.error('Role mapping error:', e);
      toast.error('Something went wrong.');
    } finally {
      resetForm();
      setIsAddOpen(false);
      setLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'SrNo',
        header: 'Sr. No.',
        cell: ({ row }: any) => row.index + 1,
      },
      { accessorKey: 'name', header: 'Employee Name' },
      { accessorKey: 'dis', header: 'Designation' },
      { accessorKey: 'role', header: 'Role(s)' },
      {
        accessorKey: 'action',
        header: 'Action',
        cell: ({ row }: any) => {
          const rowData = row.original;
          return (
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => {
                  const unit = units.find((u) => u.unitId === rowData.empUnitId);
                  setSelectedUnit(unit || null);
                  setSelectedEmployee({
                    empCode: rowData.empCode,
                    empName: rowData.name,
                    designation: rowData.dis,
                    unitId: rowData.empUnitId,
                  });

                  const rolesFromUser = userList.find((u) => u.empCode === rowData.empCode)?.roles || [];
                  const matchedRoles = rolesFromUser
                    .map((r) => masterRoleList.find((m) => m.value.toLowerCase() === r.roleName.toLowerCase()))
                    .filter(Boolean) as Role[];

                  setSelectedRoles(matchedRoles);
                  setIsEditing(true);
                  setIsAddOpen(true);
                }}
              >
                Edit
              </Button>
            </div>
          );
        },
      },
    ],
    [units, userList, masterRoleList]
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
          role: (employee.roles || []).map((r) => r.roleName).join(', '),
          empUnitId: emp.unitId || 0,
        };
      }),
    [userList, employeesList]
  );

  if (loading || isUserListLoading) return <Loader />;

  return (
    <div className="p-6 font-sans">
      <div className="bg-white border border-blue-200 shadow-lg rounded-xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-blue-800">User Role Mapping</h1>

        <AdminTable
          data={tableData}
          columns={columns}
          onAddClick={() => {
            resetForm();
            setIsAddOpen(true);
          }}
          inputPlaceholder="Search by name or designation"
        />

        <AddUserMapRole
          open={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          roles={masterRoleList}
          unitOptions={unitOptions}
          employees={employeesListFiltered}
          selectedUnit={selectedUnit}
          selectedEmployee={selectedEmployee}
          selectedRoles={selectedRoles}
          onUnitChange={setSelectedUnit}
          onEmployeeChange={setSelectedEmployee}
          onRoleChange={setSelectedRoles}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default UserRoleMapping;
