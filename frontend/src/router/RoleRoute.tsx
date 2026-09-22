import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '../hooks/useRole';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from '../components/common/Spinner';

export interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallbackPath?: string;
}

export const RoleRoute: React.FC<RoleRouteProps> = ({
  children,
  allowedRoles,
  fallbackPath = '/403',
}) => {
  const { isLoading } = useAuth();
  const { hasAnyRole, isSuperAdmin } = useRole();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-xs text-slate-500 font-medium tracking-wide">
            Verifying permissions...
          </p>
        </div>
      </div>
    );
  }

  // Super admin always has access, or user must have one of allowed roles
  const hasAccess = isSuperAdmin || hasAnyRole(allowedRoles);

  if (!hasAccess) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};
