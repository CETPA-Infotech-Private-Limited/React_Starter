import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormLabel, FormControl, FormMessage, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ShadDatePicker from '@/components/common/ShadDatePicker';
import { Send } from 'lucide-react';

// Zod schema
const formSchema = z.object({
  sapRefNumber: z.string().min(1, 'SAP Ref Number is required'),
  sapRefDate: z.date({ required_error: 'SAP Ref Date is required' }),
  transactionDate: z.date({ required_error: 'Transaction Date is required' }),
  utrNo: z.string().min(1, 'UTR No is required'),
});

type FormValues = z.infer<typeof formSchema>;

type AdvanceBankingDetailsFormProps = {
  initialData?: Partial<FormValues>;
  loading: boolean;
  onSubmit: (data: FormValues) => void;
};

export default function AdvanceBankingDetailsForm({ initialData, loading, onSubmit }: AdvanceBankingDetailsFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sapRefNumber: initialData?.sapRefNumber || '',
      sapRefDate: initialData?.sapRefDate ? new Date(initialData.sapRefDate) : undefined,
      transactionDate: initialData?.transactionDate ? new Date(initialData.transactionDate) : undefined,
      utrNo: initialData?.utrNo || '',
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <Card className="border border-blue-200 shadow-lg rounded-xl p-4">
      <CardHeader>
        <CardTitle className="text-blue-800 text-lg font-bold">SAP & Banking Details</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SAP Ref Number */}
            <FormField
              control={form.control}
              name="sapRefNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-800 text-sm font-semibold">SAP Ref Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter SAP reference number" className="border border-blue-200" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* SAP Ref Date */}
            <Controller
              control={form.control}
              name="sapRefDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-800 text-sm font-semibold">SAP Ref Date</FormLabel>
                  <FormControl>
                    <ShadDatePicker selected={field.value} onChange={field.onChange} showTimeSelect timeIntervals={1} placeholder="Select SAP ref date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Transaction Date */}
            <Controller
              control={form.control}
              name="transactionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-800 text-sm font-semibold">Transaction Date</FormLabel>
                  <FormControl>
                    <ShadDatePicker selected={field.value} showTimeSelect onChange={field.onChange} placeholder="Select transaction date" timeIntervals={1} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* UTR No */}
            <FormField
              control={form.control}
              name="utrNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-800 text-sm font-semibold">UTR No</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter UTR number" className="border border-blue-200" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="md:col-span-2 text-right">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  'Submitting...'
                ) : (
                  <div className="flex items-center gap-2">
                    Submit Banking Info
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
