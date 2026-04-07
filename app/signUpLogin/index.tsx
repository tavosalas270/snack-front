import LogoGlow from '@/components/LogoGlow';
import { HelpSection } from '@/components/signUpLogin/components';
import { SignUpLoginProvider } from '@/components/signUpLogin/context/SignUpContext';
import { Login, SignUp } from '@/components/signUpLogin/sections';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUpLoginScreen() {
  return (
    <SignUpLoginProvider>
      <SignUpLoginScreenContent />
    </SignUpLoginProvider>
  );
}

function SignUpLoginScreenContent() {
  const [tabSelected, setTabSelected] = useState<'login' | 'sign'>('login');
  const [helpVisible, setHelpVisible] = useState(false);

  return (
    <View className="flex-1 justify-between h-full py-8">
      {/* Background */}
      <Image
        source={require('@/assets/images/FondoUno.png')}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
      />

      <SafeAreaView className="flex flex-col h-full justify-between px-6">
        {/* Top Section: Logo & Tabs */}
        <View className="items-center relative w-full">
          <View className="relative items-center justify-center mt-2">
            <LogoGlow size={500} />
            <Image
              source={require('@/assets/icons/snack_white.svg')}
              style={{ width: 120, height: 100 }}
              contentFit="contain"
            />
          </View>

          <View className="flex-row items-center rounded-full p-1 mt-4">
            <Pressable
              onPress={() => setTabSelected('login')}
              className={`px-6 py-2 rounded-full overflow-hidden ${tabSelected === 'login' ? 'bg-snack-pink' : ''}`}
            >
              <Text className="text-white font-jost-bold">LOGIN</Text>
            </Pressable>
            <Pressable
              onPress={() => setTabSelected('sign')}
              className={`px-6 py-2 rounded-full overflow-hidden ${tabSelected === 'sign' ? 'bg-snack-pink' : ''}`}
            >
              <Text className="text-white font-jost-bold">SIGN UP</Text>
            </Pressable>
          </View>
        </View>

        {/* Content Section */}
        <View className="flex-1 mt-4 relative">
          {tabSelected === 'login' ? <Login /> : <SignUp />}
        </View>

        {/* Footer */}
        <View className="w-full items-center">
          {/*Help Section Button*/}
          <Pressable
            onPress={() => setHelpVisible(true)}
            className="w-8 h-8 rounded-full border-white border-2 items-center justify-center mb-3"
          >
            <Text className="text-white font-bold">?</Text>
          </Pressable>
          <Text className="text-white tracking-widest text-xs font-jost">
            © 2023 SNAK. All rights reserved.
          </Text>
        </View>
      </SafeAreaView>
      <HelpSection visible={helpVisible} onClose={() => setHelpVisible(false)} />
    </View>
  )
}
