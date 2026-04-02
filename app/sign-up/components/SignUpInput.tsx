import { TextInput, TextInputProps, View } from 'react-native';

interface SignUpInputProps extends TextInputProps {}

export default function SignUpInput(props: SignUpInputProps) {
  return (
    <View className="w-full mb-4">
      <TextInput
        className="w-full bg-white/20 border border-white/30 rounded-3xl px-6 py-4 text-white font-jost text-lg"
        placeholderTextColor="#e2e8f0"
        {...props}
      />
    </View>
  );
}
