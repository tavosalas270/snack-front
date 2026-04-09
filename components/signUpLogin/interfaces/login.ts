import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Invalid e-mail format'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export interface LoginParams {
  email: string;
  password: string;
}

export interface AcessResponse {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  token: AcessResponse;
  status: number;
}

export interface BadLoginResponse {
  status: number;
}
