import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form, FormField, FormLabel, FormControl, FormMessage, FormItem } from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z
  .object({
    approvedAmount: z
      .string()
      .min(1, 'Approved amount is required')
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Enter a valid number greater than 0',
      }),
    estimatedAmount: z.number(),
    agree: z.literal(true, {
      errorMap: () => ({
        message: 'You must accept the declaration',
      }),
    }),
  })
  .refine((data) => Number(data.approvedAmount) < data.estimatedAmount, {
    message: 'Approved amount must be less than estimated amount',
    path: ['approvedAmount'],
  });

type FormValues = z.infer<typeof formSchema>;

type AdvanceApprovalFormProps = {
  estimatedAmount: number;
  approvalLoading: boolean;
  onSubmit: (data: { approvedAmount: number }) => void;
};

export default function AdvanceApprovalForm({ estimatedAmount, onSubmit, approvalLoading }: AdvanceApprovalFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      approvedAmount: '',
      estimatedAmount,
      agree: false,
    },
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit({ approvedAmount: Number(values.approvedAmount) });
  };

  return (
    <Card className="border border-blue-200 shadow-lg rounded-xl p-4">
      <CardHeader>
        <CardTitle className="text-blue-800 text-lg font-bold">Advance Approval Form</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Estimated Amount - Display only */}
            <div className="flex flex-col gap-1">
              <FormLabel className="text-blue-800 text-sm font-semibold">Estimated Amount</FormLabel>
              <Input value={`₹ ${estimatedAmount.toLocaleString()}`} disabled className="border border-blue-200 bg-blue-50" />
            </div>

            {/* Approved Amount Input */}
            <FormField
              control={form.control}
              name="approvedAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-800 text-sm font-semibold">Approved Amount</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter approved amount" type="number" className="border border-blue-200" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Terms and Declaration */}
            <FormField
              control={form.control}
              name="agree"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox id="agree" checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel htmlFor="agree" className="text-sm text-gray-700 font-normal">
                      I, the undersigned, hereby declare that the information given in this form is correct and complete to the best of my knowledge and belief.
                    </FormLabel>
                  </div>
                  <FormMessage className="ml-7" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="md:col-span-2 text-right">
              <Button type="submit" disabled={approvalLoading}>
                {approvalLoading ? 'Submitting...' : 'Submit Approval'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
