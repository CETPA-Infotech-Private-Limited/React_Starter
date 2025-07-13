import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormLabel, FormControl, FormMessage, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ShadDatePicker from '@/components/common/ShadDatePicker';
import { Send } from 'lucide-react';

// ✅ Schema aligned with API
const formSchema = z.object({
  sapRefNumber: z.string().min(1, 'SAP Reference Number is required'),
  referenceDate: z.date({ required_error: 'Reference Date is required' }),
  amountPaid: z
    .string()
    .min(1, 'Amount Paid is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Enter a valid amount',
    }),
  comment: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  initialData?: Partial<FormValues>;
  loading: boolean;
  onSubmit: (data: { SapRefNumber: string; ReferenceDate: string; AmountPaid: number; Comment?: string }) => void;
};

export default function AdvanceBankingDetailsForm({ initialData, loading, onSubmit }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sapRefNumber: initialData?.sapRefNumber || '',
      referenceDate: initialData?.referenceDate ? new Date(initialData.referenceDate) : new Date(),
      amountPaid: initialData?.amountPaid?.toString() || '',
      comment: initialData?.comment || '',
    },
  });

  const handleSubmit = (values: FormValues) => {
    const safeDate =
      values.referenceDate instanceof Date && !isNaN(values.referenceDate.getTime()) ? values.referenceDate.toISOString() : new Date().toISOString(); // fallback just in case

    onSubmit({
      SapRefNumber: values.sapRefNumber,
      ReferenceDate: safeDate,
      AmountPaid: parseFloat(values.amountPaid),
      Comment: values.comment,
    });
  };

  return (
    <Card className="border border-blue-200 shadow-lg rounded-xl p-4">
      <CardHeader>
        <CardTitle className="text-blue-800 text-lg font-bold">Banking Approval Details</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:grid-cols-3">
            {/* SAP Ref Number */}
            <FormField
              control={form.control}
              name="sapRefNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-blue-800">SAP Reference Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter SAP reference number" className="border border-blue-200" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Reference Date */}
            <Controller
              control={form.control}
              name="referenceDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-blue-800">Reference Date</FormLabel>
                  <FormControl>
                    <ShadDatePicker selected={field.value} onChange={field.onChange} showTimeSelect timeIntervals={1} placeholder="Select reference date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount Paid */}
            <FormField
              control={form.control}
              name="amountPaid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-blue-800">Amount Paid</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step="0.01" placeholder="Enter amount paid" className="border border-blue-200" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Comment */}
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem className="md:col-span-2 lg:col-span-3">
                  <FormLabel className="text-sm font-semibold text-blue-800">Comment (optional)</FormLabel>
                  <FormControl>
                    <textarea {...field} rows={2} placeholder="Any comment..." className="w-full border border-blue-200 rounded-md px-3 py-2 text-sm" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="md:col-span-2 lg:col-span-3 text-right">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  'Submitting...'
                ) : (
                  <div className="flex items-center gap-2">
                    Submit & Approve
                    <Send className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
