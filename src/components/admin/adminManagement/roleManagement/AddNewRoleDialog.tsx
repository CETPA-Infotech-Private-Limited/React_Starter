import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface AddNewRoleDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string }) => void;
  initialData?: { name: string; description: string } | null;
}

const AddNewRoleDialog: React.FC<AddNewRoleDialogProps> = ({ open, onClose, onSubmit, initialData = null }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [initialData, open]);

  const handleSubmit = () => {
    if (!name.trim()) {
      return alert('Role name is required');
    }

    onSubmit({ name: name.trim(), description: description.trim() });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Role' : 'Add New Role'}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="space-y-1">
            <Label htmlFor="role-name">Role Name</Label>
            <Input id="role-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter role name" />
          </div>

          <div className="space-y-1">
            <Label htmlFor="role-description">Description</Label>
            <Textarea id="role-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description" />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit}>{isEditMode ? 'Update Role' : 'Add Role'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewRoleDialog;
