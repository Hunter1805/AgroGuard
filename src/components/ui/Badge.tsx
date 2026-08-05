import React from 'react';

interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'neutral';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'primary', children, className = '' }) => {
  const styles = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary/10 text-secondary border-secondary/20',
    tertiary: 'bg-tertiary/10 text-tertiary border-tertiary/20',
    error: 'bg-error/10 text-error border-error/20',
    neutral: 'bg-surface-container-highest text-on-surface-variant border-white/10',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono-label border ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};
