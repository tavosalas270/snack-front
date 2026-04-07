import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useLoginContext } from '../context/LoginContext';
import { LoginParams } from '../interfaces';
import { login } from '../services/auth';

export const useLogin = () => {
  const { setAccessToken, setRefreshToken } = useLoginContext();
  return useMutation({
    mutationFn: ({ email, password }: LoginParams) => login({ email, password }),
    onSuccess: (data) => {
      setAccessToken(data.access);
      setRefreshToken(data.refresh);
      router.push('/watch');
    },
    onError: (error) => {
      console.log(error);
    }
  });
};
