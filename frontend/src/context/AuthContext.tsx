import React, { createContext, useCallback, useEffect, useState } from 'react';
import { authApi } from '../api/auth.api';
import type { AuthResponse, AuthState, LoginCredentials, RegisterData, User } from '../types';
import { storage } from '../utils/storage';

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => storage.getUser<User>());
  const [token, setToken] = useState<string | null>(() => storage.getToken());
  const [roles, setRoles] = useState<string[]>(() => {
    const savedUser = storage.getUser<User>();
    return savedUser?.role_names || [];
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const setAuthSession = (authData: { user: User; token: string; roles: string[] }) => {
    storage.setToken(authData.token);
    storage.setUser(authData.user);
    setToken(authData.token);
    setUser(authData.user);
    setRoles(authData.roles);
  };

  const clearAuthSession = () => {
    storage.clearAuth();
    setToken(null);
    setUser(null);
    setRoles([]);
  };

  const refreshUser = useCallback(async () => {
    const currentToken = storage.getToken();
    if (!currentToken) {
      clearAuthSession();
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApi.getMe();
      if (response.data) {
        setUser(response.data.user);
        setRoles(response.data.roles);
        storage.setUser(response.data.user);
      }
    } catch {
      clearAuthSession();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();

    // Listen for global unauthorized triggers
    const handleUnauthorized = () => {
      clearAuthSession();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [refreshUser]);

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await authApi.login(credentials);
    if (!response.data) {
      throw new Error(response.message || 'Login failed');
    }

    setAuthSession(response.data);
    return response.data;
  };

  const register = async (data: RegisterData): Promise<AuthResponse> => {
    const response = await authApi.register(data);
    if (!response.data) {
      throw new Error(response.message || 'Registration failed');
    }

    setAuthSession(response.data);
    return response.data;
  };

  const logout = async (): Promise<void> => {
    try {
      if (token) {
        await authApi.logout();
      }
    } catch {
      // Proceed with local logout regardless of server error
    } finally {
      clearAuthSession();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        roles,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
