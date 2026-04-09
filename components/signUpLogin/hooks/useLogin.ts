import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useLoginContext } from '../context/LoginContext';
import { BadLoginResponse, LoginParams, LoginResponse } from '../interfaces';
import { login } from '../services/auth';

export const useLogin = () => {
  const { setAccessToken, setRefreshToken } = useLoginContext();
  return useMutation<LoginResponse, BadLoginResponse, LoginParams>({
    mutationFn: ({ email, password }) => login({ email, password }),
    onSuccess: (data) => {
      setAccessToken(data.token.access);
      setRefreshToken(data.token.refresh);
      router.push('/watch');
    },
    onError: (error) => {
      console.error('Error in login:', error);
    }
  });
};
