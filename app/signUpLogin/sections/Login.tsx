import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import SignUpButton from '../components/SignUpButton';

export default function Login() {

  const [emailUser, setEmailUser] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View className="flex-1 w-full mt-8">
      <Text className="text-white text-2xl font-jost-bold text-center uppercase tracking-widest leading-tight mb-12">
        WELCOME TO SNAK
      </Text>
      <View className="w-full bg-black/20 rounded-2xl py-2 mb-4">
        <TextInput
          value={emailUser}
          onChangeText={setEmailUser}
          placeholder="E-MAIL OR USERNAME"
          placeholderTextColor="#A0A0A0"
          className="text-white text-center text-lg font-jost"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View className="w-full bg-black/20 rounded-2xl py-2 mb-8">
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="PASSWORD"
          placeholderTextColor="#A0A0A0"
          className="text-white text-center text-lg font-jost"
          secureTextEntry
        />
      </View>
      <View className="w-full">
        <SignUpButton
          variant="primary"
          title="LOG IN"
          onPress={() => console.log('Login')}
        />
      </View>
    </View>
  );
}
