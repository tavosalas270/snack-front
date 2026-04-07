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

export interface LoginResponse {
  access: string;
  refresh: string;
}
