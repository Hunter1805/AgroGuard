import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid';
}

export const Card: React.FC<CardProps> = ({ children, variant = 'glass', className = '', ...props }) => {
  const base = variant === 'glass' ? 'glass-card border border-white/5' : 'bg-surface-container border border-white/5';
  return (
    <div className={`${base} rounded-xl ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`p-4 border-b border-white/5 bg-surface/30 rounded-t-xl flex justify-between items-center ${className}`} {...props}>
    {children}
  </div>
);

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`p-5 ${className}`} {...props}>
    {children}
  </div>
);
