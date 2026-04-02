import { useState } from 'react';

export const useSignUpForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const isValid = email.length > 0 && password.length > 0 && password === confirmPassword;

    return {
        email, setEmail,
        password, setPassword,
        confirmPassword, setConfirmPassword,
        isValid
    };
};
