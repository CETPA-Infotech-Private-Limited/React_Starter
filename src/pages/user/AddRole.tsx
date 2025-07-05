import { RootState } from '@/app/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import axiosInstance from '@/services/axiosInstance';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Loader from '@/components/ui/loader';
import toast from 'react-hot-toast';

interface Role {
  id: number;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

const AddRoles = () => {
  // setting variables
  const user = useSelector((state: RootState) => state.user);
  const [rolesData, setRolesData] = useState<Role[]>([]);
  const [roleName, setRoleName] = useState<string>('');
  const [roleDescription, setRoleDescription] = useState<string>('');

  const [roleDialogOpen, setRoleDialogOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // handling adding/editing of the roles
  const handleOpenAddRoleDialog = () => {
    resetRoleForm();
    setRoleDialogOpen(true);
  };

  const resetRoleForm = () => {
    setRoleName('');
    setRoleDescription('');
  };

  const handleSubmitRole = async () => {
    if (!roleName.trim()) {
      toast.error('Role name is required');
      return;
    }
    if (!roleDescription.trim()) {
      toast.error('Role description is required');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/User/AddNewRole', {
        name: roleName.trim(),
        description: roleDescription.trim(),
      });
      setIsLoading(false)
  toast.success(response.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 mt-1">
      {isLoading && <Loader />}

      <Card className="rounded-lg shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-violet-50 rounded-t-lg">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-gray-800">Manage Roles</CardTitle>
            <Button onClick={handleOpenAddRoleDialog}>+ Add Role</Button>
          </div>
        </CardHeader>

        {/* <CardContent>
          <div className="mt-6">
            {rolesData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No roles found. Click "Add Role" to create your first role.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rolesData.map((role) => (
                  <Card key={role.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-semibold text-gray-800 truncate">{role.name}</CardTitle>
                        <div className="flex items-center gap-1">
                          <Button onClick={() => handleEditRole(role)} variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action will permanently delete the role "{role.name}". This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteRole(role.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-600 text-sm leading-relaxed">{role.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent> */}
      </Card>

      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Role</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Role Name</label>
              <Input
                type="text"
                placeholder="Enter role name"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Role Description</label>
              <Textarea
                placeholder="Enter role description"
                value={roleDescription}
                onChange={(e) => setRoleDescription(e.target.value)}
                className="w-full min-h-[100px]"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setRoleDialogOpen(false)} variant="outline" className="mr-2">
              Cancel
            </Button>
            <Button onClick={handleSubmitRole}>Add Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddRoles;
