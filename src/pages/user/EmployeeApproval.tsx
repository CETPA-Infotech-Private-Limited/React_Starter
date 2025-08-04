import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import TableList from '@/components/ui/data-table';
import { Info, User, Calendar, MapPin, Building, Phone, Mail, FileText, UserCheck } from 'lucide-react';

const EmployeeApproval = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const personalProfileData = [
    {
      id: 1,
      name: 'Rajesh Kumar Singh',
      gender: 'Male',
      dateOfBirth: '1985-03-15',
      officialInfo: 'EMP001',
      dateOfJoining: '2010-07-01',
      location: 'Corporate office',
      department: 'ADMINISTRATION',
      contractor: 'AKAL',
      mobile: '+91-9876543210',
      email: 'rajesh.singh@company.com',
      appointmentOrder: 'APO-2010-001.pdf',
      registrationType: 'Contractual',
    },
    {
      id: 2,
      name: 'Priya Sharma',
      gender: 'Female',
      dateOfBirth: '1990-08-22',
      officialInfo: 'EMP002',
      dateOfJoining: '2015-03-12',
      location: 'Noida',
      department: 'IT',
      contractor: 'AMITY',
      mobile: '+91-9876543211',
      email: 'priya.sharma@company.com',
      appointmentOrder: 'APO-2015-045.pdf',
      registrationType: 'New User',
    },
    {
      id: 3,
      name: 'Amit Patel',
      gender: 'Male',
      dateOfBirth: '1988-12-10',
      officialInfo: 'EMP003',
      dateOfJoining: '2012-09-18',
      location: 'Ahmedabad',
      department: 'ELECTRICAL',
      contractor: 'NIPPON',
      mobile: '+91-9876543212',
      email: 'amit.patel@company.com',
      appointmentOrder: 'APO-2012-078.pdf',
      registrationType: 'Contractual',
    },
    {
      id: 4,
      name: 'Sunita Yadav',
      gender: 'Female',
      dateOfBirth: '1987-05-28',
      officialInfo: 'EMP004',
      dateOfJoining: '2011-11-05',
      location: 'Mumbai(N)',
      department: 'FINANCE',
      contractor: 'NISG',
      mobile: '+91-9876543213',
      email: 'sunita.yadav@company.com',
      appointmentOrder: 'APO-2011-156.pdf',
      registrationType: 'New User',
    },
    {
      id: 5,
      name: 'Vikram Singh',
      gender: 'Male',
      dateOfBirth: '1983-01-14',
      officialInfo: 'EMP005',
      dateOfJoining: '2008-04-22',
      location: 'Jaipur',
      department: 'CIVIL',
      contractor: 'AKAL',
      mobile: '+91-9876543214',
      email: 'vikram.singh@company.com',
      appointmentOrder: 'APO-2008-234.pdf',
      registrationType: 'Contractual',
    },
    {
      id: 6,
      name: 'Meera Gupta',
      gender: 'Female',
      dateOfBirth: '1992-07-03',
      officialInfo: 'EMP006',
      dateOfJoining: '2017-01-15',
      location: 'DDU Kolkata',
      department: 'HR',
      contractor: 'AMITY',
      mobile: '+91-9876543215',
      email: 'meera.gupta@company.com',
      appointmentOrder: 'APO-2017-089.pdf',
      registrationType: 'New User',
    },
    {
      id: 7,
      name: 'Ravi Verma',
      gender: 'Male',
      dateOfBirth: '1986-11-19',
      officialInfo: 'EMP007',
      dateOfJoining: '2013-06-10',
      location: 'Meerut',
      department: 'MECHANICAL',
      contractor: 'NIPPON',
      mobile: '+91-9876543216',
      email: 'ravi.verma@company.com',
      appointmentOrder: 'APO-2013-167.pdf',
      registrationType: 'Contractual',
    },
    {
      id: 8,
      name: 'Kavita Singh',
      gender: 'Female',
      dateOfBirth: '1989-04-07',
      officialInfo: 'EMP008',
      dateOfJoining: '2014-08-30',
      location: 'Prayagraj(E)',
      department: 'SAFETY',
      contractor: 'NISG',
      mobile: '+91-9876543217',
      email: 'kavita.singh@company.com',
      appointmentOrder: 'APO-2014-203.pdf',
      registrationType: 'New User',
    },
    {
      id: 9,
      name: 'Deepak Joshi',
      gender: 'Male',
      dateOfBirth: '1984-09-25',
      officialInfo: 'EMP009',
      dateOfJoining: '2009-12-14',
      location: 'Vadodara',
      department: 'S&T',
      contractor: 'AKAL',
      mobile: '+91-9876543218',
      email: 'deepak.joshi@company.com',
      appointmentOrder: 'APO-2009-298.pdf',
      registrationType: 'Contractual',
    },
    {
      id: 10,
      name: 'Anita Kumari',
      gender: 'Female',
      dateOfBirth: '1991-06-12',
      officialInfo: 'EMP010',
      dateOfJoining: '2016-02-28',
      location: 'Ajmer',
      department: 'TRAFFIC',
      contractor: 'AMITY',
      mobile: '+91-9876543219',
      email: 'anita.kumari@company.com',
      appointmentOrder: 'APO-2016-134.pdf',
      registrationType: 'New User',
    },
    {
      id: 11,
      name: 'Suresh Chandra',
      gender: 'Male',
      dateOfBirth: '1982-10-08',
      officialInfo: 'EMP011',
      dateOfJoining: '2007-05-16',
      location: 'Prayagraj(W)',
      department: 'LAW',
      contractor: 'NIPPON',
      mobile: '+91-9876543220',
      email: 'suresh.chandra@company.com',
      appointmentOrder: 'APO-2007-045.pdf',
      registrationType: 'Contractual',
    },
    {
      id: 12,
      name: 'Pooja Agarwal',
      gender: 'Female',
      dateOfBirth: '1993-02-18',
      officialInfo: 'EMP012',
      dateOfJoining: '2018-07-09',
      location: 'Mumbai(S)',
      department: 'STORES',
      contractor: 'NISG',
      mobile: '+91-9876543221',
      email: 'pooja.agarwal@company.com',
      appointmentOrder: 'APO-2018-176.pdf',
      registrationType: 'New User',
    },
    {
      id: 13,
      name: 'Manish Kumar',
      gender: 'Male',
      dateOfBirth: '1987-12-30',
      officialInfo: 'EMP013',
      dateOfJoining: '2012-10-11',
      location: 'Tundla',
      department: 'SECURITY',
      contractor: 'AKAL',
      mobile: '+91-9876543222',
      email: 'manish.kumar@company.com',
      appointmentOrder: 'APO-2012-287.pdf',
      registrationType: 'Contractual',
    },
    {
      id: 14,
      name: 'Rekha Mishra',
      gender: 'Female',
      dateOfBirth: '1985-08-05',
      officialInfo: 'EMP014',
      dateOfJoining: '2010-01-25',
      location: 'Ambala',
      department: 'VIGILANCE',
      contractor: 'AMITY',
      mobile: '+91-9876543223',
      email: 'rekha.mishra@company.com',
      appointmentOrder: 'APO-2010-012.pdf',
      registrationType: 'New User',
    },
    {
      id: 15,
      name: 'Ashok Tiwari',
      gender: 'Male',
      dateOfBirth: '1981-03-27',
      officialInfo: 'EMP015',
      dateOfJoining: '2006-09-08',
      location: 'Noida',
      department: 'DFCCIL',
      contractor: 'NIPPON',
      mobile: '+91-9876543224',
      email: 'ashok.tiwari@company.com',
      appointmentOrder: 'APO-2006-189.pdf',
      registrationType: 'Contractual',
    },
  ];

  const handleInfoClick = (employee) => {
    setSelectedEmployee(employee);
    setIsDialogOpen(true);
  };

  // Simplified columns for the main table (only 5 key columns)
  const personalProfileColumns = [
    {
      id: 'employeeCode',
      header: 'Employee Code',
      cell: ({ row }) => <span className="font-medium text-blue-600">{row.original.officialInfo}</span>,
    },
    {
      id: 'employeeName',
      header: 'Employee Name',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {/* <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div> */}
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
      },
      {
          id: 'gender',
          header: 'Gender',
          cell : ({row})=> row.original.gender
        
    },
    {
      id: 'department',
      header: 'Department',
      cell: ({ row }) => row.original.department
    },
    {
      id: 'registrationType',
      header: 'Registration Type',
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.original.registrationType === 'Contractual' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
          }`}
        >
          {row.original.registrationType}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex justify-center gap-2">
          <Dialog open={isDialogOpen && selectedEmployee?.id === row.original.id} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700" size="sm" onClick={() => handleInfoClick(row.original)}>
                <Info className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-7xl w-full max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  New Employee Approval Request
                </DialogTitle>
              </DialogHeader>

              {selectedEmployee && (
                <div className="space-y-4">
                  {/* Employee Code */}
                  <div className="text-center bg-blue-50 p-2 rounded-lg">
                    <span className="text-sm text-blue-600">Employee Code: </span>
                    <span className="font-bold text-lg text-blue-800">{selectedEmployee.officialInfo}</span>
                  </div>

                  {/* Current Details Card */}
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Employee Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <div>
                          <span className="text-gray-600 text-sm">Name: </span>
                          <span className="font-medium text-gray-800">{selectedEmployee.name}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">Gender: </span>
                          <span className="font-medium text-gray-800">{selectedEmployee.gender}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">Date of Birth: </span>
                          <span className="font-medium text-gray-800">{selectedEmployee.dateOfBirth}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div>
                          <span className="text-gray-600 text-sm">Mobile: </span>
                          <span className="font-medium text-gray-800">{selectedEmployee.mobile}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">Email: </span>
                          <span className="font-medium text-gray-800 break-all">{selectedEmployee.email}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">Date of Joining: </span>
                          <span className="font-medium text-gray-800">{selectedEmployee.dateOfJoining}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div>
                          <span className="text-gray-600 text-sm">Department: </span>
                          <span className="font-medium text-gray-800">{selectedEmployee.department}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">Location: </span>
                          <span className="font-medium text-gray-800">{selectedEmployee.location}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 text-sm">Contractor: </span>
                          <span className="font-medium text-gray-800">{selectedEmployee.contractor}</span>
                        </div>
                      </div>
                    </div>

                    {/* Additional Information Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
                      <div>
                        <span className="text-gray-600 text-sm">Registration Type: </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            selectedEmployee.registrationType === 'Contractual' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {selectedEmployee.registrationType}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Appointment Order: </span>
                        <span className="font-medium text-gray-800">{selectedEmployee.appointmentOrder}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-3 border-t border-gray-200 justify-center">
                    <Button className="px-8 bg-green-600 hover:bg-green-700 text-white">Accept Request</Button>
                    <Button className="px-8 bg-red-600 hover:bg-red-700 text-white">Reject Request</Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
             Employee Registration Approval
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TableList data={personalProfileData} columns={personalProfileColumns} inputPlaceholder="Search employee requests..." />
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeApproval;
