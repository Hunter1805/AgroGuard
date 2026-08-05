import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = 'Selecione...',
  required = false,
  disabled = false,
  error,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="font-label-sm text-[12px] font-medium text-on-surface-variant"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required={required}
          className={`
            w-full appearance-none bg-surface-container-highest border rounded-md
            px-3 py-2 pr-9 text-[13px] text-on-surface font-body-sm
            focus:outline-none focus:ring-1 transition-all cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error
              ? 'border-error focus:ring-error/50 focus:border-error'
              : 'border-white/10 focus:ring-primary/50 focus:border-primary/50'
            }
          `}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
        />
      </div>
      {error && (
        <p className="text-[11px] text-error font-body-sm">{error}</p>
      )}
    </div>
  );
};
