import Select from 'react-select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const AddAdminDialog = ({ open, onClose, units, employees, selectedUnit, selectedEmployee, onUnitChange, onEmployeeChange, onSubmit }) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">Add New Admin</DialogTitle>
      </DialogHeader>
      <div className="space-y-6">
        <div>
          <Label>
            Select Unit <span className="text-red-500">*</span>
          </Label>
          <Select className="mt-2" options={units} value={selectedUnit} onChange={onUnitChange} placeholder="Select a Unit" isSearchable />
        </div>

        <div>
          <Label>
            Select Employee <span className="text-red-500">*</span>
          </Label>
          <Select
            isDisabled={!selectedUnit}
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
            styles={{
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected
                  ? '#e0f2fe' // background color for selected option only
                  : base.backgroundColor,
                color: state.isSelected ? '#0c4a6e' : base.color,
                fontWeight: state.isSelected ? '600' : base.fontWeight,
              }),
            }}
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

export default AddAdminDialog;
