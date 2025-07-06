import Select from 'react-select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const AddUserMapRole = ({
  open,
  onClose,
  roles,
  unitOptions,
  employees,
  selectedUnit,
  selectedEmployee,
  selectedRoles,
  onUnitChange,
  onEmployeeChange,
  onRoleChange,
  onSubmit,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Assign Role(s)</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label>
              Select Unit <span className="text-red-500">*</span>
            </Label>
            <Select
              className="mt-2"
              options={unitOptions}
              getOptionLabel={(unit) => unit.unitName}
              getOptionValue={(unit) => unit.unitId.toString()}
              value={selectedUnit}
              onChange={onUnitChange}
              placeholder="Select Unit"
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
            />
          </div>

          <div>
            <Label>
              Select Role(s) <span className="text-red-500">*</span>
            </Label>
            <Select
              isMulti
              className="mt-2"
              options={roles}
              getOptionLabel={(role) => role.value}
              getOptionValue={(role) => role.id.toString()}
              value={selectedRoles}
              onChange={onRoleChange}
              placeholder="Select one or more roles"
            />
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserMapRole;
