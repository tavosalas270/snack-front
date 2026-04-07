import { zodResolver } from '@hookform/resolvers/zod';
import { Fragment, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, Text, TextInput, View } from 'react-native';
import SignUpButton from '../components/SignUpButton';
import { useSignUpLoginContext } from '../context/SignUpLoginContext';
import { LinkEmailFormValues, LinkEmailProps, linkEmailSchema } from '../interfaces/signup';

export default function LinkEmail({ onContinue }: LinkEmailProps) {
  const { linkEmailData, setLinkEmailData } = useSignUpLoginContext();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors, isValid },
  } = useForm<LinkEmailFormValues>({
    resolver: zodResolver(linkEmailSchema),
    defaultValues: linkEmailData,
    mode: 'onChange',
  });

  // Save changes to context on unmount so they are retained for handleBack or tab switch
  useEffect(() => {
    return () => {
      setLinkEmailData(getValues());
    };
  }, [getValues, setLinkEmailData]);

  const acceptedTerms = watch('acceptedTerms');

  const onSubmit = (data: LinkEmailFormValues) => {
    // Also save manually when continuing just in case
    setLinkEmailData(data);
    onContinue(data);
  };

  return (
    <Fragment>
      {/* Header Title */}
      <Text className="text-white text-2xl font-jost-bold text-center uppercase tracking-widest leading-tight mb-4">
        LINK YOUR E-MAIL ADDRESS{'\n'}TO YOUR NEW SNAK WALLET
      </Text>

      {/* Subtitle */}
      <Text className="text-white text-left font-jost text-base mb-4">
        Your e-mail address will be directly associated to your new SNAK wallet, and it will be used as your main ID to use this App.
      </Text>

      {/* Actions Container */}
      <View className="flex flex-col w-full mb-6">
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

        {/* Checkbox */}
        <View className="mb-6">
          <Pressable
            className="flex-row items-start gap-4"
            onPress={() => setValue('acceptedTerms', !acceptedTerms, { shouldValidate: true })}
          >
            <View className={`w-7 h-7 rounded items-center justify-center mt-1 bg-white ${errors.acceptedTerms ? 'border border-red-500' : ''}`}>
              {acceptedTerms && (
                <View className="w-5 h-5 bg-snack-pink rounded-[2px]" />
              )}
            </View>
            <Text className="text-white text-base font-jost flex-1 leading-snug">
              I have read and accept SNAK's <Text className="text-snack-pink">privacy policy</Text>{'\n'}and <Text className="text-snack-pink">terms and conditions</Text>.
            </Text>
          </Pressable>
          {errors.acceptedTerms && (
            <Text className="text-red-500 text-sm mt-1 ml-2 font-jost">
              {errors.acceptedTerms.message}
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
