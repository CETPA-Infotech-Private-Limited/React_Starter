import Select from 'react-select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const AddUserMapRole = ({ open, onClose, roles, employees, selectedEmployee, selectedRole, onEmployeeChange, onRoleChange, onSubmit }) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">New User Map</DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        <div>
          <Label>
            Select Role <span className="text-red-500">*</span>
          </Label>
          <Select
            className="mt-2"
            options={roles}
            getOptionLabel={(role) => role.value}
            getOptionValue={(role) => role.id.toString()}
            value={selectedRole}
            onChange={onRoleChange}
            placeholder="Select a Role"
            isSearchable
          />
        </div>
        <div>
          <Label>
            Select Employee <span className="text-red-500">*</span>
          </Label>
          <Select
            className="mt-2"
            options={employees}
            value={selectedEmployee}
            onChange={onEmployeeChange}
            placeholder="Select an Employee"
            isSearchable
            isClearable
            formatOptionLabel={(option) => (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full font-bold uppercase">{option.empName?.[0]}</div>
                <div>
                  <div className="text-sm font-medium text-gray-800">{option.empName}</div>
                  <div className="text-xs text-gray-500">
                    {option.empCode} | {option.designation} | {option.department}
                  </div>
                </div>
              </div>
            )}
            filterOption={(option, inputValue) => {
              const { empName, empCode, designation, department } = option.data;
              const search = inputValue.toLowerCase();
              return (
                empName?.toLowerCase().includes(search) ||
                empCode?.toLowerCase().includes(search) ||
                designation?.toLowerCase().includes(search) ||
                department?.toLowerCase().includes(search)
              );
            }}
          />
        </div>
      </div>

      <DialogFooter className="mt-8 flex justify-end gap-4">
        <Button onClick={onClose} variant="secondary">
          Cancel
        </Button>
        <Button onClick={onSubmit}>Add Admin</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default AddUserMapRole;
