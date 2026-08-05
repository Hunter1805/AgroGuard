import React from 'react';

interface DashboardSectionProps {
  children: React.ReactNode;
  className?: string;
}

/** Wrapper de seção do Dashboard — mantém espaçamento e largura máxima consistentes. */
export const DashboardSection: React.FC<DashboardSectionProps> = ({ children, className = '' }) => (
  <section className={`${className}`}>{children}</section>
);
