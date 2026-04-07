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

// ─── Sub-section types ───────────────────────────────────────────────────────
export type SubSectionType = 'create' | 'link' | 'code' | null;

// ─── Form value types ────────────────────────────────────────────────────────

export type LinkEmailFormValues = z.infer<typeof linkEmailSchema>;
export type VerifyCodeFormValues = z.infer<typeof verifyCodeSchema>;

// ─── Form data types ────────────────────────────────────────────────────────
export interface LinkEmailData {
  email: string;
  acceptedTerms: boolean;
}

export interface VerifyCodeData {
  code: string[];
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

export interface SignUpButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'option';
  selected?: boolean;
}

export type HelpSectionProps = {
  visible: boolean;
  onClose: () => void;
};
