import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import SignUpButton from './components/SignUpButton';
import SignUpInput from './components/SignUpInput';

export default function SignUpScreen() {
  return (
    <View className="flex-1">
      <Image
        source={require('@/assets/images/FondoUno.png')}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
      />
      <View className="flex-1 items-center justify-center px-6">
        <Image
          source={require('@/assets/icons/snack_white.svg')}
          style={{ width: 180, height: 80, marginBottom: 40 }}
          contentFit="contain"
        />

        <Text className="text-4xl text-white mb-8 text-center font-cherry-bomb">
          Regístrate
        </Text>

        <SignUpInput placeholder="Correo Electrónico" />
        <SignUpInput placeholder="Contraseña" secureTextEntry />
        <SignUpInput placeholder="Confirmar Contraseña" secureTextEntry />

        <View className="mt-8 w-full">
          <SignUpButton title="Crear Cuenta" onPress={() => { }} />
        </View>
      </View>
    </View>
  );
}
