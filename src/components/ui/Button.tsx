import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      icon,
      isLoading = false,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary: 'bg-primary hover:bg-primary/90 text-on-primary font-semibold shadow-md glow-success',
      secondary: 'bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 font-medium',
      ghost: 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest',
      outline: 'border border-white/10 hover:border-white/20 text-on-surface-variant hover:text-on-surface bg-transparent',
      danger: 'bg-error/10 hover:bg-error/20 text-error border border-error/20 font-medium',
    };

    const sizes = {
      sm: 'px-2.5 py-1 text-[11px] rounded-md gap-1.5',
      md: 'px-3.5 py-2 text-[13px] rounded-md gap-2',
      lg: 'px-5 py-2.5 text-[14px] rounded-lg gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 size={size === 'sm' ? 12 : 14} className="animate-spin" />
        ) : (
          icon
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
