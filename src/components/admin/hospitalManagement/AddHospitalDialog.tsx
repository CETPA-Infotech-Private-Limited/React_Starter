import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { hospitalSchema, HospitalFormValues } from '@/schemas/hospitalSchema';

interface Props {
  open: boolean;
  onClose: () => void;
  defaultValues?: HospitalFormValues;
  onSubmit: (values: HospitalFormValues) => void;
  isEditing: boolean;
  isViewOnly?: boolean;
}

const AddHospitalDialog: React.FC<Props> = ({ open, onClose, defaultValues, onSubmit, isEditing, isViewOnly = false }) => {
  const form = useForm<HospitalFormValues>({
    resolver: zodResolver(hospitalSchema),
    defaultValues: {
      hospitalName: '',
      hospitalAddress: '',
      hospitalRegistration: '',
      bankName: '',
      accountNumber: '',
      accountHolderName: '',
      ifscCode: '',
      branchAddress: '',
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    } else {
      form.reset();
    }
  }, [defaultValues, form]);

  const handleFormSubmit = (values: HospitalFormValues) => {
    if (!isViewOnly) {
      onSubmit(values);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-800">
            {isViewOnly ? 'View Hospital Details' : isEditing ? 'Edit Hospital Details' : 'Add New Hospital'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {(
              [
                'hospitalName',
                'hospitalAddress',
                'hospitalRegistration',
                'bankName',
                'accountNumber',
                'accountHolderName',
                'ifscCode',
                'branchAddress',
              ] as (keyof HospitalFormValues)[]
            ).map((field) => (
              <FormField
                key={field}
                control={form.control}
                name={field}
                render={({ field: f }) => (
                  <FormItem>
                    <FormLabel className="text-blue-800 text-sm font-semibold">
                      {f.name.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                      {['hospitalName', 'hospitalAddress', 'hospitalRegistration'].includes(f.name) ? ' *' : ''}
                    </FormLabel>
                    <FormControl>
                      <Input {...f} disabled={isViewOnly || (f.name === 'hospitalRegistration' && isEditing)} placeholder={`Enter ${f.name}`} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <div className="md:col-span-2 flex justify-end gap-4 mt-4">
              <Button type="button" variant="secondary" onClick={onClose}>
                {isViewOnly ? 'Close' : 'Cancel'}
              </Button>
              {!isViewOnly && <Button type="submit">{isEditing ? 'Update Hospital' : 'Add Hospital'}</Button>}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHospitalDialog;
