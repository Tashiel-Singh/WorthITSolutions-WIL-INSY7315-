/**
 * Elevated Medical Dashboard Surface Card Component
 */
import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'subtle' | 'emeraldBorder' | 'tealBorder';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hoverEffect = false,
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white border-slate-200/80 shadow-card',
    subtle: 'bg-slate-50/70 border-slate-200 shadow-none',
    emeraldBorder: 'bg-white border-slate-200/80 border-t-4 border-t-brand-700 shadow-card',
    tealBorder: 'bg-white border-slate-200/80 border-t-4 border-t-slateBlue-700 shadow-card',
  }[variant];

  const hoverStyles = hoverEffect
    ? 'hover:shadow-card-hover hover:border-slate-300 transition-all duration-200'
    : '';

  return (
    <div
      className={`rounded-xl border p-5 md:p-6 ${variantStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};
