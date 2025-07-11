import React from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '../ui/textarea';

type Props<T> = {
  name: keyof T;
  label?: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  placeholder?: string;
};

export default function FormTextField<T>({ name, label, register, errors, placeholder }: Props<T>) {
  return (
    <div className="space-y-1">
      <Label className=" font-medium text-primary">{label || String(name)}</Label>
      <Textarea {...register(name as string)} placeholder={placeholder || `Enter ${label || String(name)}`} className="h-8 text-xs px-2" />
      {errors[name] && <p className="text-red-500 text-[10px]">{(errors[name] as any)?.message}</p>}
    </div>
  );
}
