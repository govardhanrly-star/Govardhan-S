import React from 'react';

interface InputGroupProps {
  label: string;
  value: number | string;
  onChange: (val: string) => void;
  type?: 'text' | 'number';
  prefix?: string;
  suffix?: string;
  readOnly?: boolean;
  placeholder?: string;
  helperText?: string;
}

export const InputGroup: React.FC<InputGroupProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  prefix,
  suffix,
  readOnly = false,
  placeholder,
  helperText,
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className={`flex items-center border rounded-md overflow-hidden bg-white transition-all focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 ${readOnly ? 'bg-slate-100 border-slate-200' : 'border-slate-300'}`}>
        {prefix && (
          <span className="pl-3 pr-2 text-slate-500 text-sm font-medium bg-slate-50 border-r border-slate-200 h-full flex items-center">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          placeholder={placeholder}
          className={`w-full py-2 px-3 outline-none text-slate-900 placeholder:text-slate-400 ${readOnly ? 'cursor-not-allowed text-slate-500 bg-slate-100' : ''}`}
        />
        {suffix && (
          <span className="pr-3 pl-2 text-slate-500 text-sm font-medium">
            {suffix}
          </span>
        )}
      </div>
      {helperText && <p className="text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};
