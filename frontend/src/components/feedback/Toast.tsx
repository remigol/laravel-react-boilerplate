import React from 'react';
import { useToast } from '../../hooks/useToast';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />,
          error: <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />,
          warning: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />,
          info: <Info className="h-5 w-5 text-sky-500 shrink-0" />,
        };

        const borders = {
          success: 'border-emerald-200 bg-white shadow-emerald-100',
          error: 'border-rose-200 bg-white shadow-rose-100',
          warning: 'border-amber-200 bg-white shadow-amber-100',
          info: 'border-sky-200 bg-white shadow-sky-100',
        };

        return (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all animate-in fade-in slide-in-from-top-2 duration-200',
              borders[toast.type]
            )}
          >
            {icons[toast.type]}
            <p className="text-sm font-medium text-slate-800 grow pt-0.5">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 rounded p-0.5 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
