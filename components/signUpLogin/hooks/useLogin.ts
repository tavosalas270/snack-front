import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { LoginParams } from '../interfaces';
import { login } from '../services/auth';

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: LoginParams) => login({ email, password }),
    onSuccess: () => {
      router.push('/watch');
    }
  });
};
