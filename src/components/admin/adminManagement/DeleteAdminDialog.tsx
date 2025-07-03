import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const DeleteAdminDialog = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Remove Admin</DialogTitle>
      </DialogHeader>
      <DialogDescription>Are you sure you want to remove this employee from the admin role?</DialogDescription>
      <DialogFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="destructive">
          Remove
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default DeleteAdminDialog;
