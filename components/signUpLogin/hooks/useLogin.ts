import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useSignUpLoginContext } from '../context/SignUpLoginContext';
import { LoginParams } from '../interfaces';
import { login } from '../services/auth';

export const useLogin = () => {
  const { setAccessToken, setRefreshToken } = useSignUpLoginContext();
  return useMutation({
    mutationFn: ({ email, password }: LoginParams) => login({ email, password }),
    onSuccess: (data) => {
      setAccessToken(data.access);
      setRefreshToken(data.refresh);
      router.push('/watch');
    }
  });
};
