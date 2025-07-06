'use client';

import React, { forwardRef } from 'react';
import DatePicker, { ReactDatePickerProps as DatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarIcon } from 'lucide-react';

interface ShadDatePickerProps extends DatePickerProps {
  placeholder?: string;
  className?: string;
}

const CustomInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { className?: string }>(
  ({ value, onClick, placeholder, className }, ref) => (
    <div
      onClick={onClick}
      className={`flex items-center border border-blue-200 rounded-lg px-3 py-3 text-xs cursor-pointer hover:border-blue-400 transition w-full ${className}`}
    >
      <input ref={ref} readOnly value={value} placeholder={placeholder} className="flex-1 bg-transparent outline-none text-xs" />
      <CalendarIcon className="ml-2 h-4 w-4 text-blue-500 shrink-0" />
    </div>
  )
);
CustomInput.displayName = 'CustomInput';

const ShadDatePicker: React.FC<ShadDatePickerProps> = ({ selected, onChange, placeholder = 'Select date', className = '', ...props }) => {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      customInput={<CustomInput placeholder={placeholder} className={className} />}
      wrapperClassName="w-full"
      {...props}
    />
  );
};

export default ShadDatePicker;
