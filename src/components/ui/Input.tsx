import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className = '', ...props }) => {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="block text-[12px] font-medium text-on-surface">
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {icon && <span className="absolute left-3 text-on-surface-variant/50 pointer-events-none">{icon}</span>}
        <input
          className={`w-full bg-surface-container-highest/60 border rounded-md py-1.5 ${
            icon ? 'pl-9' : 'pl-3'
          } pr-3 text-[13px] text-on-surface focus:outline-none focus:border-primary/50 placeholder:text-on-surface-variant/40 transition-all ${
            error ? 'border-error' : 'border-white/10'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-error text-[11px] mt-0.5">{error}</p>}
    </div>
  );
};
