import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HelpSection from './components/HelpSection';
import SignUpButton from './components/SignUpButton';
import Create from './sections/Create';

export default function SignUpScreen() {
  const [sectionSelected, setSectionSelected] = useState<'create' | 'link' | 'code' | null>("create");
  const [helpVisible, setHelpVisible] = useState(false);
  // return <Create />;
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
        <View className="items-center">
          <Image
            source={require('@/assets/icons/snack_white.svg')}
            style={{ width: 120, height: 100 }}
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
        <View className="relative flex-row items-center justify-center gap-3 w-[96px] mx-auto">
          {/* Connecting Line */}
          <View className="absolute h-[2px] bg-snack-pink left-6 right-[6px] top-1/2 -translate-y-1/2 z-0" />

          <View className="w-6 h-6 rounded-full border-2 border-snack-pink items-center justify-center z-10">
            <View className="w-3 h-3 rounded-full bg-white" />
          </View>
          <View className="w-3 h-3 rounded-full bg-white z-10" />
          <View className="w-3 h-3 rounded-full bg-white z-10" />
          <View className="w-3 h-3 rounded-full bg-white z-10" />
        </View>

        {sectionSelected === "create" && (
          <Create>
            <View className="w-full">
              <SignUpButton
                variant="primary"
                title="CONTINUE"
                onPress={() => setSectionSelected("link")}
              />
            </View>
          </Create>
        )}

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
