import { zodResolver } from '@hookform/resolvers/zod';
import { Fragment, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, Text, TextInput, View } from 'react-native';
import { z } from 'zod';
import SignUpButton from '../components/SignUpButton';

const verifyCodeSchema = z.object({
  code: z.array(z.string().min(1)).length(5),
});

export type VerifyCodeFormValues = z.infer<typeof verifyCodeSchema>;

interface VerifyCodeProps {
  onContinue: (data: VerifyCodeFormValues) => void;
  onRequestNewCode: () => void;
}

export default function VerifyCode({ onContinue, onRequestNewCode }: VerifyCodeProps) {
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { isValid },
  } = useForm<VerifyCodeFormValues>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      code: ['', '', '', '', ''],
    },
    mode: 'onChange',
  });

  const handleCodeChange = (text: string, index: number, onChange: (...event: any[]) => void) => {
    onChange(text); // update react-hook-form state
    
    // Auto-advance to the next input if a character is entered
    if (text && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Navigate back to the previous input if backspace is pressed on an empty input
    const currentCodeArray = getValues('code');
    if (e.nativeEvent.key === 'Backspace' && !currentCodeArray[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setValue(`code.${index - 1}` as any, '', { shouldValidate: true });
    }
  };

  const onSubmit = (data: VerifyCodeFormValues) => {
    onContinue(data);
  };

  return (
    <Fragment>
      {/* Header Title */}
      <Text className="text-white text-2xl font-jost-bold text-center uppercase tracking-widest leading-tight mb-4">
        PLEASE ENTER YOUR{'\n'}VERIFICATION CODE
      </Text>

      {/* Subtitle */}
      <Text className="text-white text-left font-jost text-base mb-8">
        We have sent you a verification code to the selected e-mail address, please fill in the code in the fields below.
      </Text>

      {/* Actions Container */}
      <View className="flex flex-col w-full mb-4">
        {/* Code Inputs */}
        <View className="flex-row justify-between mb-8 w-full px-2">
          {[0, 1, 2, 3, 4].map((index) => (
            <Controller
              key={index}
              control={control}
              name={`code.${index}` as any}
              render={({ field: { onChange, value } }) => (
                <View className="w-[52px] h-[64px] bg-black/20 rounded-xl relative justify-center items-center">
                  <TextInput
                    ref={(ref) => { inputRefs.current[index] = ref; }}
                    value={value}
                    onChangeText={(text) => handleCodeChange(text, index, onChange)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    className="text-white text-3xl font-jost-bold text-center w-full h-full pb-3"
                  />
                  <View className="absolute bottom-3 w-6 h-[2px] bg-white" />
                </View>
              )}
            />
          ))}
        </View>

        <View className="w-full">
          <SignUpButton
            variant="primary"
            title="CONTINUE"
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid}
          />
          <Pressable onPress={onRequestNewCode} className="mt-8 mb-4">
            <Text className="text-snack-pink font-jost-bold text-base text-center uppercase tracking-widest">
              REQUEST A NEW CODE
            </Text>
          </Pressable>
        </View>
      </View>
    </Fragment>
  );
}
