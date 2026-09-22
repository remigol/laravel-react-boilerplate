import apiClient from './client';
import type { ApiResponse, AuthResponse, LoginCredentials, RegisterData, User } from '../types';

export const authApi = {
  login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>('/v1/auth/login', credentials);
  },

  register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>('/v1/auth/register', data);
  },

  getMe(): Promise<ApiResponse<{ user: User; roles: string[] }>> {
    return apiClient.get<{ user: User; roles: string[] }>('/v1/auth/me');
  },

  logout(): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/v1/auth/logout');
  },
};
