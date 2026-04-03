import { Fragment, ReactNode, useRef, useState } from 'react';
import { Text, TextInput, View } from 'react-native';

interface VerifyCodeProps {
  children?: ReactNode;
}

export default function VerifyCode({ children }: VerifyCodeProps) {
  const [code, setCode] = useState(['', '', '', '', '']);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-advance to the next input if a character is entered
    if (text && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Navigate back to the previous input if backspace is pressed on an empty input
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <Fragment>
      {/* Header Title */}
      <Text className="text-white text-2xl font-jost-bold text-center uppercase tracking-widest leading-tight">
        PLEASE ENTER YOUR{'\n'}VERIFICATION CODE
      </Text>

      {/* Subtitle */}
      <Text className="text-white text-left font-jost text-base">
        We have sent you a verification code to the selected e-mail address, please fill in the code in the fields below.
      </Text>

      {/* Actions Container */}
      <View className="flex flex-col w-full mb-6">
        {/* Code Inputs */}
        <View className="flex-row justify-between mb-8 w-full px-2">
          {[0, 1, 2, 3, 4].map((index) => (
            <View
              key={index}
              className="w-[52px] h-[64px] bg-black/20 rounded-xl relative justify-center items-center"
            >
              <TextInput
                ref={(ref) => { inputRefs.current[index] = ref; }}
                value={code[index]}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                className="text-white text-3xl font-jost-bold text-center w-full h-full pb-3"
              />
              <View className="absolute bottom-3 w-6 h-[2px] bg-white" />
            </View>
          ))}
        </View>

        {children}
      </View>
    </Fragment>
  );
}
