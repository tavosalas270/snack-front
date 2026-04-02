import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';

interface SignUpButtonProps extends TouchableOpacityProps {
  title: string;
}

export default function SignUpButton({ title, ...props }: SignUpButtonProps) {
  return (
    <TouchableOpacity
      className="w-full bg-snack-pink py-4 rounded-3xl items-center justify-center active:opacity-80 border-2 border-white/20"
      {...props}
    >
      <Text className="text-white text-xl font-cherry-bomb">
        {title}
      </Text>
    </TouchableOpacity>
  );
}
