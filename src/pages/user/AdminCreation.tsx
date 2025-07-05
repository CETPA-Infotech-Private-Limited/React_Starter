'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Edit, X } from 'lucide-react';
import { extractUniqueUnits } from '@/lib/helperFunction';
import { useAppSelector } from '@/app/hooks';
import axiosInstance from '@/services/axiosInstance';
import TableList from '@/components/ui/data-table';

const Table = ({ children, ...props }) => (
  <table className="w-full border-collapse" {...props}>{children}</table>
);
const TableHeader = ({ children }) => (<thead className="bg-gray-50">{children}</thead>);
const TableBody = ({ children }) => (<tbody className="divide-y divide-gray-200">{children}</tbody>);
const TableHead = ({ children, className = "" }) => (
  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>{children}</th>
);
const TableRow = ({ children }) => (<tr className="hover:bg-gray-50">{children}</tr>);
const TableCell = ({ children, className = "", colSpan, ...props }: { children: React.ReactNode; className?: string; colSpan?: number; [x: string]: any }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${className}`} {...(colSpan !== undefined ? { colSpan } : {})} {...props}>{children}</td>
);

const AdminCreationMed = () => {
  const employeeList = useAppSelector((state) => state.employee.employees);
  const unitsDD = extractUniqueUnits(employeeList);
 

  const [selectedUnit, setSelectedUnit] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('users');

  
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [rolesData, usersListRes, rolesListRes] = await Promise.all([
          axiosInstance.get('/User/GetAllRoles'),
          axiosInstance.get('/User/GetAllUserDetails'),
          axiosInstance.get('/Role/GetAllRoleDetails'),
        ]);
        setAvailableRoles(rolesData.data);
        setUsersList(usersListRes.data);
        setRolesList(rolesListRes.data);
      } catch (error) {
        console.error('Initial load failed', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedUnit) {
      const filtered = employeeList.filter(emp => emp.unitId.toString() === selectedUnit);
      setUsers(filtered);
    }
  }, [selectedUnit, employeeList]);

  const handleRoleChange = (roleId, checked) => {
    if (checked) {
      setSelectedRoles(prev => [...prev, roleId]);
    } else {
      setSelectedRoles(prev => prev.filter(id => id !== roleId));
    }
  };
console.log(unitsDD, "unitsDD in AdminCreationMed");
  const assignAdminRole = async () => {
    if (!selectedUnit || !selectedUser) {
      alert('Please select both unit and user.');
      return;
    }

    const payload = {
      empCode: Number(selectedUser),
      empUnit: selectedUnit,
      userRoles: selectedRoles.map(roleId => ({ roleId })),
    };

    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post('/User/AddUserRoleMpping', payload);
      if (response.status === 200 || response.status === 201) {
        alert('Admin assigned successfully!');
        const updatedUsers = await axiosInstance.get('/User/GetAllUserDetails');
        setUsersList(updatedUsers.data);
        setSelectedUser('');
        setSelectedRoles([]);
      } else {
        alert('Something went wrong.');
      }
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to assign role.');
    } finally {
      setIsSubmitting(false);
    }
  };
  console.log(usersList, "usersList in AdminCreationMed");
  const filteredUsers = usersList.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.employeeCode?.includes(searchTerm)
  );

  console.log(filteredUsers, "filteredUsers in AdminCreationMed");

  const getRoleBadgeColor = (role) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-red-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-teal-500'
    ];
    return colors[role.length % colors.length] || 'bg-gray-500';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex space-x-1 mb-6">
          <Button 
            onClick={() => setActiveTab('users')}
            className={activeTab === 'users' ? "bg-blue-600 hover:bg-blue-700 text-white px-6" : "bg-gray-200 text-gray-700 px-6"}
          >
            Users
          </Button>
          <Button 
            onClick={() => setActiveTab('roles')}
            className={activeTab === 'roles' ? "bg-blue-600 hover:bg-blue-700 text-white px-6" : "bg-gray-200 text-gray-700 px-6"}
          >
            Roles
          </Button>
        </div>
      </div>

      {activeTab === 'users' && (
        <>
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Unit
                  </label>
                  <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {unitsDD.map(unit => (
                        <SelectItem key={unit.id} value={unit.unitId.toString()}>
                          {unit.unitName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select User
                  </label>
                  <div className="relative">
                    <Select value={selectedUser} onValueChange={setSelectedUser}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                       <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.empCode} value={user.empCode.toString()}>
                      {user.empName} ({user.empCode})
                    </SelectItem>
                  ))}
                </SelectContent>
                    </Select>
                    {selectedUser && (
                      <button
                        onClick={() => setSelectedUser('')}
                        className="absolute right-8 top-1/2 transform -translate-y-1/2"
                      >
                        <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Roles
                  </label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {availableRoles.map(role => (
                      <div key={role.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={role.id}
                          checked={selectedRoles.includes(role.id)}
                          onCheckedChange={(checked) => handleRoleChange(role.id, checked)}
                        />
                        <label htmlFor={role.id} className="text-sm text-gray-700">
                          {role.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={assignAdminRole}
                  disabled={isSubmitting || !selectedUser || selectedRoles.length === 0}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting ? 'Adding...' : 'Add Role'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Users List</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search employee by name and emp code..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee Code</TableHead>
                    <TableHead>Employee Name</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map(user => (
                      <TableRow key={user.id}>
                        <TableCell>{user.employeeCode}</TableCell>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.roles?.map(role => (
                              <Badge key={role} className={`${getRoleBadgeColor(role)} text-white`}>
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{user.unit}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === 'roles' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>User Role Mapping</CardTitle>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                + Add Role
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-48">Role</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead className="w-24">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rolesList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-500">
                      No roles found
                    </TableCell>
                  </TableRow>
                ) : (
                  rolesList.map(role => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {role.permissions?.map(permission => (
                            <Badge key={permission} className="bg-blue-500 text-white text-xs">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
           
          </CardContent>
        </Card>
        
      )}
    </div>
  );
};

export default AdminCreationMed;
