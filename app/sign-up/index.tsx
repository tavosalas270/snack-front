import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SignUpButton from './components/SignUpButton';

export default function SignUpScreen() {
  const [selectedWallet, setSelectedWallet] = useState<'create' | 'own' | null>('create');

  return (
    <View className="flex-1 justify-between h-full py-8">
      {/* Background */}
      <Image
        source={require('@/assets/images/FondoUno.png')}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
      />

      <SafeAreaView className="flex-1 px-6">

        {/* Top Section: Logo & Tabs */}
        <View className="items-center mb-8">
          <Image
            source={require('@/assets/icons/snack_white.svg')}
            style={{ width: 130, height: 110 }}
            contentFit="contain"
          />

          <View className="flex-row items-center rounded-full p-1">
            <View className="px-6 py-2">
              <Text className="text-white font-jost-bold">LOGIN</Text>
            </View>
            <View className="bg-snack-pink px-6 py-2 rounded-full">
              <Text className="text-white font-jost-bold">SIGN UP</Text>
            </View>
          </View>
        </View>

        {/* Progress Dots */}
        <View className="flex-row items-center justify-center gap-3 mt-2">
          <View className="w-6 h-6 rounded-full border-2 border-white items-center justify-center">
            <View className="w-3 h-3 rounded-full bg-snack-pink" />
          </View>
          <View className="w-3 h-3 rounded-full bg-white/40" />
          <View className="w-3 h-3 rounded-full bg-white/40" />
          <View className="w-3 h-3 rounded-full bg-white/40" />
        </View>

        {/* Header Title */}
        <Text className="text-white text-2xl mt-10 mb-12 font-jost-bold text-center uppercase tracking-widest leading-tight">
          Which type of wallet would you like to use?
        </Text>

        {/* Actions Container */}
        <View className="flex-1 w-full gap-4">

          <View className="w-full">
            <SignUpButton
              variant="option"
              title="CREATE A SNAK WALLET"
              selected={selectedWallet === 'create'}
              onPress={() => setSelectedWallet('create')}
            />
            <SignUpButton
              variant="option"
              title="USE MY OWN WALLET"
              selected={selectedWallet === 'own'}
              onPress={() => setSelectedWallet('own')}
            />
          </View>


          <View className="w-full">
            <SignUpButton
              variant="primary"
              title="CONTINUE"
              onPress={() => { }}
            />
          </View>
        </View>

        {/* Footer */}
        <View className="w-full items-center mb-6">
          <View className="w-8 h-8 rounded-full border-white border-2 items-center justify-center mb-3">
            <Text className="text-white font-bold">?</Text>
          </View>
          <Text className="text-white/50 text-xs">
            © 2023 SNAK. All rights reserved.
          </Text>
        </View>

      </SafeAreaView>
    </View>
  );
}
