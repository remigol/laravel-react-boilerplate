export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  status: number;
  data?: T;
  errors?: Record<string, string[]> | string | null;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
