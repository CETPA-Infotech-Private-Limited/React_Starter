import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Plus,
  Edit3,
  Save,
  X,
  Laptop,
  Smartphone,
  HardDrive,
  Phone,
  Briefcase,
  Tablet,
  Wrench,
  Settings,
  DollarSign,
} from 'lucide-react';
import { grades } from '@/lib/helperFunction';
const AddEditIntitlement = ({
  showModal,
  setShowModal,
  isEditMode,
  selectedEntitlement,
  formData,
  handleInputChange,
  setSelectedEntitlement,
  resetForm,
  isLoading,
  handleSubmit,
}) => {
  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Grade Entitlement' : 'Add New Grade Entitlement'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? `Update entitlement amounts for ${selectedEntitlement?.level}`
              : 'Set entitlement amounts for a new grade level'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="level">Grade Level</Label>
            <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select grade level" />
              </SelectTrigger>
              <SelectContent>
                {grades.map((grade) => (
                  <SelectItem key={grade} value={grade.lavel}>
                    {grade.lavel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="laptopAmount">Laptop Amount (₹)</Label>
            <Input
              id="laptopAmount"
              type="number"
              placeholder="0"
              value={formData.laptopAmount}
              onChange={(e) => handleInputChange('laptopAmount', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="laptopRepairAmount">Laptop Repair Amount (₹)</Label>
            <Input
              id="laptopRepairAmount"
              type="number"
              placeholder="0"
              value={formData.laptopRepairAmount}
              onChange={(e) => handleInputChange('laptopRepairAmount', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tabletAmount">Tablet Amount (₹)</Label>
            <Input
              id="tabletAmount"
              type="number"
              placeholder="0"
              value={formData.tabletAmount}
              onChange={(e) => handleInputChange('tabletAmount', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hardDiskAmount">Hard Disk Amount (₹)</Label>
            <Input
              id="hardDiskAmount"
              type="number"
              placeholder="0"
              value={formData.hardDiskAmount}
              onChange={(e) => handleInputChange('hardDiskAmount', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="briefcaseAmount">Briefcase Amount (₹)</Label>
            <Input
              id="briefcaseAmount"
              type="number"
              placeholder="0"
              value={formData.briefcaseAmount}
              onChange={(e) => handleInputChange('briefcaseAmount', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="landlineAmount">Landline Amount (₹)</Label>
            <Input
              id="landlineAmount"
              type="number"
              placeholder="0"
              value={formData.landlineAmount}
              onChange={(e) => handleInputChange('landlineAmount', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobileAmount">Mobile Amount (₹)</Label>
            <Input
              id="mobileAmount"
              type="number"
              placeholder="0"
              value={formData.mobileAmount}
              onChange={(e) => handleInputChange('mobileAmount', e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setShowModal(false);
              setSelectedEntitlement(null);
              resetForm();
            }}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? (isEditMode ? 'Updating...' : 'Adding...') : isEditMode ? 'Update' : 'Add Grade'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditIntitlement;
