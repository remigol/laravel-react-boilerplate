import apiClient from './client';
import type { ApiResponse, Role } from '../types';

export const roleApi = {
  getRoles(): Promise<ApiResponse<Role[]>> {
    return apiClient.get<Role[]>('/v1/roles');
  },
};
