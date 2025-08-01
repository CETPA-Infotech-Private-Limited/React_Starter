import { useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import EmployeeSelect from '@/components/employeeSelect/EmployeeSelect';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar} from 'lucide-react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Star, Trophy, Crown, Medal, Zap, Heart, Target, Sparkles, Gem } from 'lucide-react';

const EmployeeOfTheMonth = () => {
  const [selectedUnit, setSelectedUnit] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  const employee = useAppSelector((state: RootState) => state.employee.employees);
    const AllUnits = useAppSelector((state: RootState) => state.employee.units);
  const employeeswithimageURL = employee.filter((emp) => {
        return emp.imageURL != null
  })
    console.log(employeeswithimageURL)

  const filterEmployeesBasedOntheSelectedUnit = employee.filter((emp) => {
    return Number(emp.unitId) == Number(selectedUnit);
  });

  const handleEmployeeAdd = () => {
    // Add your logic here
    console.log('Adding employee:', selectedUser, 'from unit:', selectedUnit);
  };
  const employeeData = {
    name: "Sarah Johnson",
    designation: "Senior Developer",
    department: "Engineering",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="w-full mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="bg-blue-700 text-white p-3">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h5 className="text-2xl font-bold">Employee of the Month</h5>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Select Unit</label>
                    <Select value={selectedUnit} onValueChange={(value) => setSelectedUnit(value)}>
                      <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors">
                        <SelectValue placeholder="Choose a unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {AllUnits?.map((unit) => (
                          <SelectItem key={unit.unitId} value={unit.unitId.toString()} className="cursor-pointer hover:bg-blue-50">
                            {unit.unitName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Employee Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Select Employee</label>
                    <EmployeeSelect unitfilteredemployees={filterEmployeesBasedOntheSelectedUnit} disabled={!selectedUnit} />
                  </div>

                  {/* Action Button */}
                  <div className="">
                    <Button
                      onClick={handleEmployeeAdd}
                      //   disabled={!selectedUnit || !selectedUser}
                      //   className=" bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Award className="w-4 h-4 mr-2" />
                      Add Employee Of The Month
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {employeeswithimageURL.map((card) => (
          <div key={card.empId} className="bg-white rounded-2xl p-6 border-l-4 border-blue-500 shadow-lg mb-6">
            <div className="text-center mb-4">
              <img src={card.imageURL} alt={card.empName} className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-blue-100" />
              <div className="bg-blue-50 rounded-full px-3 py-1 inline-block mb-2">
                <Star className="w-4 h-4 text-blue-600 inline mr-1" />
                <span className="text-blue-700 text-sm font-medium">Employee of the Month</span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 text-center mb-1">{card.empName}</h3>
            <p className="text-blue-600 text-center font-medium">{card.designation}</p>
            <p className="text-gray-500 text-center text-sm">{card.department}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeOfTheMonth;
