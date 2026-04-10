import { ReactNode } from 'react';
import { TouchableOpacityProps } from 'react-native';
import { z } from 'zod';

// ─── Schemas ────────────────────────────────────────────────────────────────

export const linkEmailSchema = z.object({
  email: z.email('Invalid e-mail format'),
  acceptedTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

export const verifyCodeSchema = z.object({
  code: z.array(z.string().min(1)).length(5),
});

export const setCredentialsSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters').max(30, 'Username too long'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      });
    }
  });

// ─── Sub-section types ───────────────────────────────────────────────────────
export type SubSectionType = 'create' | 'link' | 'code' | 'credentials' | null;

// ─── Form value types ────────────────────────────────────────────────────────

export type LinkEmailFormValues = z.infer<typeof linkEmailSchema>;
export type VerifyCodeFormValues = z.infer<typeof verifyCodeSchema>;
export type SetCredentialsFormValues = z.infer<typeof setCredentialsSchema>;

// ─── Form data types ────────────────────────────────────────────────────────
export interface LinkEmailData {
  email: string;
  acceptedTerms: boolean;
}

export interface VerifyCodeData {
  code: string[];
}

export interface SetCredentialsData {
  username: string;
  password: string;
  confirmPassword: string;
}

export interface SignUpParams {
  username: string;
  email: string;
  password: string;
}

export interface SignUpResponse {
  status: string;
  message: string;
  code: number;
  data: {
    username: string;
    email: string;
    password: string;
  }
}

// ─── Component props ─────────────────────────────────────────────────────────

export interface CreateProps {
  children?: ReactNode;
}

export interface LinkEmailProps {
  onContinue: (data: LinkEmailFormValues) => void;
}

export interface VerifyCodeProps {
  onContinue: (data: VerifyCodeFormValues) => void;
  onRequestNewCode: () => void;
}

export interface SetCredentialsProps {}

export interface SignUpButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'option';
  selected?: boolean;
}

export type HelpSectionProps = {
  visible: boolean;
  onClose: () => void;
};
