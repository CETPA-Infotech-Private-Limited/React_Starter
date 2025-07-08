import { z } from 'zod';

export const hospitalSchema = z.object({
  hospitalName: z.string().min(1, 'Hospital Name is required'),
  hospitalAddress: z.string().min(1, 'Hospital Address is required'),
  hospitalRegistration: z.string().min(1, 'Registration Number is required'),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  accountHolderName: z.string().optional(),
  ifscCode: z.string().optional(),
  branchAddress: z.string().optional(),
});

export type HospitalFormValues = z.infer<typeof hospitalSchema>;
