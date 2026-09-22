import { useMemo } from 'react';
import { useAuth } from './useAuth';

export const useRole = () => {
  const { roles, user } = useAuth();

  const userRoles = useMemo(() => {
    if (roles && roles.length > 0) return roles;
    if (user?.role_names && user.role_names.length > 0) return user.role_names;
    if (user?.roles && user.roles.length > 0) return user.roles.map((r) => r.slug);
    return [];
  }, [roles, user]);

  const hasRole = (roleSlug: string): boolean => {
    return userRoles.includes(roleSlug);
  };

  const hasAnyRole = (roleSlugs: string[]): boolean => {
    return roleSlugs.some((slug) => userRoles.includes(slug));
  };

  const hasAllRoles = (roleSlugs: string[]): boolean => {
    return roleSlugs.every((slug) => userRoles.includes(slug));
  };

  const isSuperAdmin = useMemo(() => hasRole('super-admin'), [userRoles]);
  const isAdmin = useMemo(() => hasRole('admin') || isSuperAdmin, [userRoles, isSuperAdmin]);
  const isUser = useMemo(() => hasRole('user'), [userRoles]);

  return {
    userRoles,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isSuperAdmin,
    isAdmin,
    isUser,
  };
};
