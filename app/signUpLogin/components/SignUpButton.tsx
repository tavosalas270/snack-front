import { LinearGradient } from 'expo-linear-gradient';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface SignUpButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'option';
  selected?: boolean;
}

export default function SignUpButton({ title, variant = 'primary', selected, ...props }: SignUpButtonProps) {
  if (variant === 'primary') {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        {...props}
        className={`w-full shadow-lg overflow-hidden ${props.disabled ? 'opacity-50' : 'opacity-100'}`}
      >
        <LinearGradient
          colors={['#0076FF', '#00E4E4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="w-full py-6 items-center justify-center"
          style={{ borderRadius: 9999 }}
        >
          <Text className="text-white text-xl font-jost-bold uppercase tracking-wider">
            {title}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'secondary') {
    return (
      <TouchableOpacity
        className="w-full py-4 rounded-full items-center justify-center border-2 border-snack-pink active:opacity-80"
        {...props}
      >
        <Text className="text-snack-pink text-xl font-jost-bold uppercase tracking-wider">
          {title}
        </Text>
      </TouchableOpacity>
    );
  }

  // Option button (from Wallet selection)
  return (
    <TouchableOpacity
      className={`w-full py-5 rounded-full items-center justify-center border-2 mb-4 active:opacity-80 ${selected ? 'border-snack-pink bg-black/40' : 'border-gray-500 bg-transparent'
        }`}
      {...props}
    >
      <Text className={`text-lg font-jost-bold uppercase tracking-widest ${selected ? 'text-white' : 'text-gray-300'
        }`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
