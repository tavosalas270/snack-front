import { useMutation } from '@tanstack/react-query';
import { useSignUpContext } from '../context';
import { BadLoginResponse, SignUpParams, SignUpResponse } from '../interfaces';
import { signUp } from '../services';

export const useSignUpForm = () => {
  const { setTabSelected, setSubSectionSelected } = useSignUpContext();

  return useMutation<SignUpResponse, BadLoginResponse, SignUpParams>({
    mutationFn: ({ username, email, password }) => signUp({ username, email, password }),
    onSuccess: () => {
      // Reset signup flow and switch to login tab
      setSubSectionSelected('create');
      setTabSelected('login');
    },
    onError: (error) => {
      console.error('Error in sign up:', error);
    },
  });
};
