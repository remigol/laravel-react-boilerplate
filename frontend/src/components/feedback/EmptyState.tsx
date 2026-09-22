import React from 'react';
import { cn } from '../../utils/cn';
import { Inbox } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <Inbox className="h-12 w-12 text-slate-300" />,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div className={cn('text-center py-12 px-4 rounded-xl border border-dashed border-slate-200 bg-white', className)}>
      <div className="flex justify-center mb-3">{icon}</div>
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      {description && <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
