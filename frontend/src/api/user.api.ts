import apiClient from './client';
import type { ApiResponse, User, UserFormData } from '../types';

export const userApi = {
  getUsers(): Promise<ApiResponse<User[]>> {
    return apiClient.get<User[]>('/v1/users');
  },

  getUser(id: number): Promise<ApiResponse<User>> {
    return apiClient.get<User>(`/v1/users/${id}`);
  },

  createUser(data: UserFormData): Promise<ApiResponse<User>> {
    return apiClient.post<User>('/v1/users', data);
  },

  updateUser(id: number, data: Partial<UserFormData>): Promise<ApiResponse<User>> {
    return apiClient.put<User>(`/v1/users/${id}`, data);
  },

  deleteUser(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/v1/users/${id}`);
  },
};
