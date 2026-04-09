import { zodResolver } from '@hookform/resolvers/zod';
import { Fragment, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';
import { SignUpButton } from '../components';
import { useSignUpContext } from '../context/SignUpContext';
import { SetCredentialsFormValues, SetCredentialsProps, setCredentialsSchema } from '../interfaces';

export default function SetCredentials({ onContinue }: SetCredentialsProps) {
  const { setCredentialsData, setSetCredentialsData } = useSignUpContext();

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm<SetCredentialsFormValues>({
    resolver: zodResolver(setCredentialsSchema),
    defaultValues: setCredentialsData,
    mode: 'onChange',
  });

  // Save changes to context on unmount so they are retained for handleBack or tab switch
  useEffect(() => {
    return () => {
      setSetCredentialsData(getValues());
    };
  }, [getValues, setSetCredentialsData]);

  const onSubmit = (data: SetCredentialsFormValues) => {
    setSetCredentialsData(data);
    onContinue(data);
  };

  return (
    <Fragment>
      {/* Header Title */}
      <Text className="text-white text-2xl font-jost-bold text-center uppercase tracking-widest leading-tight mb-4">
        SET YOUR CREDENTIALS
      </Text>

      {/* Subtitle */}
      <Text className="text-white text-center font-jost text-base mb-4">
        Choose a username and a secure password.
      </Text>

      {/* Actions Container */}
      <View className="flex flex-col w-full mb-6">
        {/* Username Input */}
        <View className="w-full mb-4">
          <View className={`w-full bg-black/20 rounded-2xl py-2 ${errors.username ? 'border border-red-500' : ''}`}>
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="USERNAME"
                  placeholderTextColor="#A0A0A0"
                  className="text-white text-center text-lg font-jost"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              )}
            />
          </View>
          {errors.username && (
            <Text className="text-red-500 text-sm mt-1 ml-2 font-jost">
              {errors.username.message}
            </Text>
          )}
        </View>

        {/* Password Input */}
        <View className="w-full mb-4">
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
                  autoCapitalize="none"
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

        {/* Confirm Password Input */}
        <View className="w-full mb-6">
          <View className={`w-full bg-black/20 rounded-2xl py-2 ${errors.confirmPassword ? 'border border-red-500' : ''}`}>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="CONFIRM PASSWORD"
                  placeholderTextColor="#A0A0A0"
                  className="text-white text-center text-lg font-jost"
                  secureTextEntry
                  autoCapitalize="none"
                />
              )}
            />
          </View>
          {errors.confirmPassword && (
            <Text className="text-red-500 text-sm mt-1 ml-2 font-jost">
              {errors.confirmPassword.message}
            </Text>
          )}
        </View>

        <View className="w-full">
          <SignUpButton
            variant="primary"
            title="CONTINUE"
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid}
          />
        </View>
      </View>
    </Fragment>
  );
}
