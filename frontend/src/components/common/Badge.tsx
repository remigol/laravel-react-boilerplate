import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className,
}) => {
  const variantStyles = {
    primary: 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-700/10',
    success: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
    warning: 'bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-600/20',
    danger: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/10',
    neutral: 'bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-500/10',
  };

  const sizeStyles = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
};
