// components/ui/ReactSelect.tsx
import React from 'react';
import Select, { Props as SelectProps } from 'react-select';

interface CustomSelectProps extends SelectProps {
  label?: string;
  error?: string;
}

export const ReactSelect: React.FC<CustomSelectProps> = ({ label, error, ...props }) => {
  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      minHeight: '36px',
      height: '36px',
      borderColor: state.isFocused ? '#1e40af' : '#e2e8f0',
      boxShadow: state.isFocused ? '0 0 0 1px #1e40af' : 'none',
      '&:hover': {
        borderColor: '#1e40af',
      },
      fontSize: '14px',
      borderRadius: '6px',
    }),
    valueContainer: (base: any) => ({
      ...base,
      padding: '0 8px',
      marginTop: '-2px',
    }),
    input: (base: any) => ({
      ...base,
      margin: '0',
      padding: '0',
    }),
    placeholder: (base: any) => ({
      ...base,
      color: '#94a3b8',
      fontSize: '14px',
    }),
    singleValue: (base: any) => ({
      ...base,
      color: '#1e293b',
      fontSize: '14px',
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? '#1e40af' : state.isFocused ? '#eff6ff' : 'white',
      color: state.isSelected ? 'white' : '#1e293b',
      fontSize: '14px',
      padding: '8px 12px',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: '#1e40af',
        color: 'white',
      },
    }),
    menu: (base: any) => ({
      ...base,
      zIndex: 50,
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
    }),
    menuList: (base: any) => ({
      ...base,
      padding: '4px',
    }),
    indicatorSeparator: (base: any) => ({
      ...base,
      display: 'none',
    }),
    dropdownIndicator: (base: any) => ({
      ...base,
      padding: '4px',
      color: '#94a3b8',
    }),
    clearIndicator: (base: any) => ({
      ...base,
      padding: '4px',
      color: '#94a3b8',
    }),
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      <Select
        styles={customStyles}
        classNamePrefix="react-select"
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};