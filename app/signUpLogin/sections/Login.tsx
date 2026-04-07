import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';
import { SignUpButton } from '../components';
import { loginSchema, LoginFormValues } from '../interfaces';

export default function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit = (data: LoginFormValues) => {
    // Navigate on successful validate
    router.push('/watch' as any);
  };

  return (
    <View className="flex-1 w-full mt-8">
      <Text className="text-white text-2xl font-jost-bold text-center uppercase tracking-widest leading-tight mb-12">
        WELCOME TO SNAK
      </Text>

      {/* Email Input */}
      <View className="w-full mb-4">
        <View className={`w-full bg-black/20 rounded-2xl py-2 ${errors.email ? 'border border-red-500' : ''}`}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="E-MAIL"
                placeholderTextColor="#A0A0A0"
                className="text-white text-center text-lg font-jost"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />
        </View>
        {errors.email && (
          <Text className="text-red-500 text-sm mt-1 ml-2 font-jost">
            {errors.email.message}
          </Text>
        )}
      </View>

      {/* Password Input */}
      <View className="w-full mb-8">
        <View className={`w-full bg-black/20 rounded-2xl py-2 ${errors.password ? 'border border-red-500' : ''}`}>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="PASSWORD"
                placeholderTextColor="#A0A0A0"
                className="text-white text-center text-lg font-jost"
                secureTextEntry
              />
            )}
          />
        </View>
        {errors.password && (
          <Text className="text-red-500 text-sm mt-1 ml-2 font-jost">
            {errors.password.message}
          </Text>
        )}
      </View>

      <View className="w-full">
        <SignUpButton
          variant="primary"
          title="LOG IN"
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid}
        />
      </View>
    </View>
  );
}
