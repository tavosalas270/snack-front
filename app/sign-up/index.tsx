import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useState } from 'react';
import SignUpButton from './components/SignUpButton';

export default function SignUpScreen() {
  const [selectedWallet, setSelectedWallet] = useState<'create' | 'own' | null>('create');

  return (
    <View className="flex-1">
      {/* Background */}
      <Image 
        source={require('@/assets/images/FondoUno.png')}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
      />
      
      <SafeAreaView className="flex-1 pt-12 px-6">
        
        {/* Top Section: Logo & Tabs */}
        <View className="items-center mb-8">
          <Image 
            source={require('@/assets/icons/snack_white.svg')}
            style={{ width: 140, height: 60 }}
            contentFit="contain"
          />
          
          <View className="flex-row items-center mt-6 bg-black/20 rounded-full p-1 border border-white/10">
            <View className="px-6 py-2">
              <Text className="text-white font-jost-bold">LOGIN</Text>
            </View>
            <View className="bg-snack-pink px-6 py-2 rounded-full">
              <Text className="text-white font-jost-bold">SIGN UP</Text>
            </View>
          </View>
        </View>

        {/* Progress Dots */}
        <View className="flex-row items-center justify-center gap-3 mb-10">
          <View className="w-6 h-6 rounded-full border-2 border-white items-center justify-center">
            <View className="w-3 h-3 rounded-full bg-snack-pink" />
          </View>
          <View className="w-3 h-3 rounded-full bg-white/40" />
          <View className="w-3 h-3 rounded-full bg-white/40" />
          <View className="w-3 h-3 rounded-full bg-white/40" />
        </View>

        {/* Header Title */}
        <Text className="text-white text-3xl font-jost-bold text-center uppercase tracking-widest mb-10 leading-tight">
          Which type of wallet would you like to use?
        </Text>

        {/* Wallet Selection */}
        <View className="flex-1 w-full justify-center">
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

        {/* Main CTA */}
        <View className="w-full mt-4 mb-8">
          <SignUpButton 
            variant="primary" 
            title="CONTINUE" 
            onPress={() => {}} 
          />
        </View>

        {/* Footer */}
        <View className="w-full items-center mb-6">
          <View className="w-8 h-8 rounded-full border border-white items-center justify-center mb-3">
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
