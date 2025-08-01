import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import TableList from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Info, X, User, Mail, Phone, Building, MapPin, Briefcase, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const ProfileChangeRequests = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const personalProfileData = [
    {
      id: 1,
      employeeName: 'E001',
      EmployeeName: 'John Doe',
      Post: 'Manager',
      Designation: 'HR Manager',
      Department: 'HR',
      'Personal Area': 'Corporate',
      'Mobile No.': '1234567890',
      Email: 'john.doe@example.com',
      newData: {
        EmployeeName: 'John Doe',
        Post: 'Senior Manager',
        Designation: 'Senior HR Manager',
        Department: 'Human Resources',
        'Personal Area': 'Head Office',
        'Mobile No.': '1234567891',
        Email: 'john.doe@company.com',
      },
    },
    {
      id: 2,
      employeeName: 'E002',
      EmployeeName: 'Jane Smith',
      Post: 'Developer',
      Designation: 'Frontend Developer',
      Department: 'IT',
      'Personal Area': 'Tech',
      'Mobile No.': '9876543210',
      Email: 'jane.smith@example.com',
      newData: {
        EmployeeName: 'Jane Smith-Wilson',
        Post: 'Developer',
        Designation: 'Senior Frontend Developer',
        Department: 'Technology',
        'Personal Area': 'Tech Hub',
        'Mobile No.': '9876543211',
        Email: 'jane.wilson@company.com',
      },
    },
  ];

  const reportingManagerData = [
    {
      id: 1,
      employeeName: 'E003',
      EmployeeName: 'Alice Johnson',
      CurrentManager: 'Bob Wilson',
      RequestedManager: 'Sarah Davis',
      'Mobile No.': '5551234567',
      Email: 'alice.johnson@example.com',
      Reason: 'Team restructuring',
      newData: {
        EmployeeName: 'Alice Johnson',
        CurrentManager: 'Bob Wilson',
        RequestedManager: 'Sarah Davis',
        Department: 'Business Operations',
        Reason: 'Team restructuring',
      },
    },
  ];

  const dependentListData = [
    {
      id: 1,
      employeeName: 'E001',
      EmployeeName: 'John Doe',
      DependentName: 'Jane Doe',
      Relationship: 'Spouse',
      Action: 'Add',
      'Mobile No.': '1234567890',
      Email: 'john.doe@example.com',
      newData: {
        EmployeeName: 'John Doe',
        DependentName: 'Jane Doe',
        Relationship: 'Spouse',
        Action: 'Add',
        DateOfBirth: '1990-05-15',
      },
    },
    {
      id: 2,
      employeeName: 'E002',
      EmployeeName: 'Jane Smith',
      DependentName: 'Tom Smith',
      Relationship: 'Child',
      Action: 'Update',
      'Mobile No.': '9876543210',
      Email: 'jane.smith@example.com',
      newData: {
        EmployeeName: 'Jane Smith',
        DependentName: 'Tom Smith-Wilson',
        Relationship: 'Child',
        Action: 'Update',
        DateOfBirth: '2015-08-22',
      },
    },
  ];

  const openDialog = (employee) => {
    setSelectedEmployee(employee);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedEmployee(null);
  };

  const personalProfileColumns = [
    {
      id: 'id',
      header: 'Id',
      cell: ({ row }) => row.original.id,
    },
    {
      id: 'employeeCode',
      header: 'Employee Code',
      cell: ({ row }) => row.original.employeeName,
    },
    {
      id: 'employeeName',
      header: 'Employee Name',
      cell: ({ row }) => row.original.EmployeeName,
    },
    {
      id: 'Mobile No.',
      header: 'Mobile No.',
      cell: ({ row }) => row.original['Mobile No.'],
    },
    {
      id: 'Email',
      header: 'Email',
      cell: ({ row }) => row.original.Email,
    },
    {
      id: 'completeInfo',
      header: 'Info',
      cell: ({ row }) => (
        <Button onClick={() => openDialog(row.original)} className="bg-blue-600 hover:bg-blue-700" size="sm">
          <Info className="w-4 h-4" />
        </Button>
      ),
    },
    {
      id: 'Actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex justify-center gap-2">
          <Button className="bg-green-700 hover:bg-green-800" size="sm">
            Accept
          </Button>
          <Button className="bg-red-700 hover:bg-red-800" size="sm">
            Reject
          </Button>
        </div>
      ),
    },
  ];

  const reportingManagerColumns = [
    {
      id: 'id',
      header: 'Id',
      cell: ({ row }) => row.original.id,
    },
    {
      id: 'employeeCode',
      header: 'Employee Code',
      cell: ({ row }) => row.original.employeeName,
    },
    {
      id: 'employeeName',
      header: 'Employee Name',
      cell: ({ row }) => row.original.EmployeeName,
    },
    {
      id: 'currentManager',
      header: 'Current Manager',
      cell: ({ row }) => row.original.CurrentManager,
    },
    {
      id: 'requestedManager',
      header: 'Requested Manager',
      cell: ({ row }) => row.original.RequestedManager,
    },
    {
      id: 'reason',
      header: 'Reason',
      cell: ({ row }) => row.original.Reason,
    },
    {
      id: 'completeInfo',
      header: 'Info',
      cell: ({ row }) => (
        <Button onClick={() => openDialog(row.original)} className="bg-blue-600 hover:bg-blue-700" size="sm">
          <Info className="w-4 h-4" />
        </Button>
      ),
    },
    {
      id: 'Actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex justify-center gap-2">
          <Button className="bg-green-700 hover:bg-green-800" size="sm">
            Accept
          </Button>
          <Button className="bg-red-700 hover:bg-red-800" size="sm">
            Reject
          </Button>
        </div>
      ),
    },
  ];

  const dependentListColumns = [
    {
      id: 'id',
      header: 'Id',
      cell: ({ row }) => row.original.id,
    },
    {
      id: 'employeeCode',
      header: 'Employee Code',
      cell: ({ row }) => row.original.employeeName,
    },
    {
      id: 'employeeName',
      header: 'Employee Name',
      cell: ({ row }) => row.original.EmployeeName,
    },
    {
      id: 'dependentName',
      header: 'Dependent Name',
      cell: ({ row }) => row.original.DependentName,
    },
    {
      id: 'relationship',
      header: 'Relationship',
      cell: ({ row }) => row.original.Relationship,
    },
    {
      id: 'action',
      header: 'Action',
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            row.original.Action === 'Add'
              ? 'bg-green-100 text-green-800'
              : row.original.Action === 'Update'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {row.original.Action}
        </span>
      ),
    },
    {
      id: 'completeInfo',
      header: 'Info',
      cell: ({ row }) => (
        <Button onClick={() => openDialog(row.original)} className="bg-blue-600 hover:bg-blue-700" size="sm">
          <Info className="w-4 h-4" />
        </Button>
      ),
    },
    {
      id: 'Actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex justify-center gap-2">
          <Button className="bg-green-700 hover:bg-green-800" size="sm">
            Accept
          </Button>
          <Button className="bg-red-700 hover:bg-red-800" size="sm">
            Reject
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="text-2xl font-bold text-gray-800 flex items-center">Profile Change Requests</div>
      </div>

      <Tabs defaultValue="personal-profile" className="w-full">
        <TabsList className="grid grid-cols-3 w-auto ml-auto">
          <TabsTrigger value="personal-profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Personal Profile
          </TabsTrigger>
          <TabsTrigger value="reporting-manager" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Reporting Manager
          </TabsTrigger>
          <TabsTrigger value="dependent-list" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            Dependent List
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal-profile" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Profile Changes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TableList data={personalProfileData} columns={personalProfileColumns} inputPlaceholder="Search personal profile requests..." />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reporting-manager" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Reporting Manager Changes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TableList data={reportingManagerData} columns={reportingManagerColumns} inputPlaceholder="Search reporting manager requests..." />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dependent-list" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Dependent List Changes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TableList data={dependentListData} columns={dependentListColumns} inputPlaceholder="Search dependent list requests..." />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog Overlay */}
      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="max-w-7xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Employee Profile Change Request
            </DialogTitle>
          </DialogHeader>

          {selectedEmployee && (
            <div className="space-y-4">
              {/* Employee Code */}
              <div className="text-center bg-blue-50 p-2 rounded-lg">
                <span className="text-sm text-blue-600">Employee Code: </span>
                <span className="font-bold text-lg text-blue-800">{selectedEmployee.employeeName}</span>
              </div>

              {/* Current Details Card */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Current Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div>
                      <span className="text-gray-600 text-sm">Name: </span>
                      <span className="font-medium text-gray-800">{selectedEmployee.EmployeeName}</span>
                    </div>
                    {selectedEmployee['Mobile No.'] && (
                      <div>
                        <span className="text-gray-600 text-sm">Mobile: </span>
                        <span className="font-medium text-gray-800">{selectedEmployee['Mobile No.']}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    {selectedEmployee.Email && (
                      <div>
                        <span className="text-gray-600 text-sm">Email: </span>
                        <span className="font-medium text-gray-800 break-all">{selectedEmployee.Email}</span>
                      </div>
                    )}
                    {selectedEmployee.Post && (
                      <div>
                        <span className="text-gray-600 text-sm">Post: </span>
                        <span className="font-medium text-gray-800">{selectedEmployee.Post}</span>
                      </div>
                    )}
                    {selectedEmployee.CurrentManager && (
                      <div>
                        <span className="text-gray-600 text-sm">Current Manager: </span>
                        <span className="font-medium text-gray-800">{selectedEmployee.CurrentManager}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    {selectedEmployee.Designation && (
                      <div>
                        <span className="text-gray-600 text-sm">Designation: </span>
                        <span className="font-medium text-gray-800">{selectedEmployee.Designation}</span>
                      </div>
                    )}
                    {selectedEmployee.Department && (
                      <div>
                        <span className="text-gray-600 text-sm">Department: </span>
                        <span className="font-medium text-gray-800">{selectedEmployee.Department}</span>
                      </div>
                    )}
                    {selectedEmployee.DependentName && (
                      <div>
                        <span className="text-gray-600 text-sm">Dependent: </span>
                        <span className="font-medium text-gray-800">{selectedEmployee.DependentName}</span>
                      </div>
                    )}
                    {selectedEmployee.Relationship && (
                      <div>
                        <span className="text-gray-600 text-sm">Relationship: </span>
                        <span className="font-medium text-gray-800">{selectedEmployee.Relationship}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Requested Details Card */}
              {selectedEmployee.newData && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Requested Changes
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      {selectedEmployee.newData.EmployeeName && (
                        <div>
                          <span className="text-blue-600 text-sm">Name: </span>
                          <span className="font-medium text-blue-800">{selectedEmployee.newData.EmployeeName}</span>
                        </div>
                      )}
                      {selectedEmployee.newData['Mobile No.'] && (
                        <div>
                          <span className="text-blue-600 text-sm">Mobile: </span>
                          <span className="font-medium text-blue-800">{selectedEmployee.newData['Mobile No.']}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      {selectedEmployee.newData.Email && (
                        <div>
                          <span className="text-blue-600 text-sm">Email: </span>
                          <span className="font-medium text-blue-800 break-all">{selectedEmployee.newData.Email}</span>
                        </div>
                      )}
                      {selectedEmployee.newData.Post && (
                        <div>
                          <span className="text-blue-600 text-sm">Post: </span>
                          <span className="font-medium text-blue-800">{selectedEmployee.newData.Post}</span>
                        </div>
                      )}
                      {selectedEmployee.newData.RequestedManager && (
                        <div>
                          <span className="text-blue-600 text-sm">Requested Manager: </span>
                          <span className="font-medium text-blue-800">{selectedEmployee.newData.RequestedManager}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      {selectedEmployee.newData.Designation && (
                        <div>
                          <span className="text-blue-600 text-sm">Designation: </span>
                          <span className="font-medium text-blue-800">{selectedEmployee.newData.Designation}</span>
                        </div>
                      )}
                      {selectedEmployee.newData.Department && (
                        <div>
                          <span className="text-blue-600 text-sm">Department: </span>
                          <span className="font-medium text-blue-800">{selectedEmployee.newData.Department}</span>
                        </div>
                      )}
                      {selectedEmployee.newData.DependentName && (
                        <div>
                          <span className="text-blue-600 text-sm">Dependent: </span>
                          <span className="font-medium text-blue-800">{selectedEmployee.newData.DependentName}</span>
                        </div>
                      )}
                      {selectedEmployee.newData.Relationship && (
                        <div>
                          <span className="text-blue-600 text-sm">Relationship: </span>
                          <span className="font-medium text-blue-800">{selectedEmployee.newData.Relationship}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-3 border-t border-gray-200 justify-center">
                <Button className="px-8 bg-green-600 hover:bg-green-700 text-white">Accept Request</Button>
                <Button className="px-8 bg-red-600 hover:bg-red-700 text-white">Reject Request</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileChangeRequests;
