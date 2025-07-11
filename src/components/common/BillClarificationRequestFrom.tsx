import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import FormTextField from './FormTextField';
import { Loader2, Send } from 'lucide-react';

const formSchema = z.object({
  Medicine: z.string().optional(),
  MedicineNotIn: z.string().optional(),
  Consultation: z.string().optional(),
  ConsultationNotIn: z.string().optional(),
  Investigation: z.string().optional(),
  InvestigationNotIn: z.string().optional(),
  RoomRent: z.string().optional(),
  Procedure: z.string().optional(),
  Other: z.string().optional(),
  OtherNotIn: z.string().optional(),
  OverallClarification: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  onSubmit: (data: FormValues) => void;
  submitting?: boolean;
};

export default function BillClarificationRequestForm({ onSubmit, submitting = false }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const handleFormSubmit = (data: FormValues) => {
    onSubmit(data);
  };

  return (
    <Card className="border border-blue-100 shadow-sm rounded-md text-xs">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-blue-800 text-center  font-semibold">Bill Clarification Request</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <FormTextField name="Medicine" label="Medicine" register={register} errors={errors} />
          <FormTextField name="MedicineNotIn" label="Medicine (Not In Bill)" register={register} errors={errors} />
          <FormTextField name="Consultation" label="Consultation" register={register} errors={errors} />
          <FormTextField name="ConsultationNotIn" label="Consultation (Not In Bill)" register={register} errors={errors} />
          <FormTextField name="Investigation" label="Investigation" register={register} errors={errors} />
          <FormTextField name="InvestigationNotIn" label="Investigation (Not In Bill)" register={register} errors={errors} />
          <FormTextField name="RoomRent" label="Room Rent" register={register} errors={errors} />
          <FormTextField name="Procedure" label="Procedure" register={register} errors={errors} />
          <FormTextField name="Other" label="Other" register={register} errors={errors} />
          <FormTextField name="OtherNotIn" label="Other (Not In Bill)" register={register} errors={errors} />
          <FormTextField name="OverallClarification" label="Clarification" register={register} errors={errors} />
        </CardContent>

        <CardFooter className="justify-end pt-0">
          <Button type="submit" size="sm" disabled={submitting}>
            {submitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                <span>Send For Clarification</span>
              </div>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
