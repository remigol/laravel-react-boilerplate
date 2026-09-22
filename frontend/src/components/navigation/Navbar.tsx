import React from 'react';
import { Menu, Shield, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useRole } from '../../hooks/useRole';

export interface NavbarProps {
  onOpenSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSidebar }) => {
  const { user } = useAuth();
  const { userRoles } = useRole();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 backdrop-blur-xs px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 lg:hidden cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden sm:block">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Environment</span>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Connected to Laravel 12 API</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Active Role Pills */}
        <div className="hidden md:flex items-center gap-1.5">
          {userRoles.map((role) => (
            <span
              key={role}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
            >
              <Shield className="h-3 w-3" />
              <span>{role}</span>
            </span>
          ))}
        </div>

        {/* User profile avatar */}
        <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
            <UserIcon className="h-4 w-4" />
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-xs font-semibold text-slate-800">{user?.name}</p>
            <p className="text-[11px] text-slate-500 truncate max-w-[140px]">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
