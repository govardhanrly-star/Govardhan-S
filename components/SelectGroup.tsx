import React from 'react';

interface SelectGroupProps {
  label: string;
  value: string | number;
  onChange: (val: string) => void;
  options: { label: string; value: string | number }[];
  helperText?: string;
}

export const SelectGroup: React.FC<SelectGroupProps> = ({
  label,
  value,
  onChange,
  options,
  helperText,
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white border border-slate-300 text-slate-900 py-2 px-3 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      {helperText && <p className="text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};
