import { Fragment, ReactNode, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

interface LinkEmailProps {
  children?: ReactNode;
}

export default function LinkEmail({ children }: LinkEmailProps) {
  const [email, setEmail] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  return (
    <Fragment>
      {/* Header Title */}
      <Text className="text-white text-2xl font-jost-bold text-center uppercase tracking-widest leading-tight mb-4">
        LINK YOUR E-MAIL ADDRESS{'\n'}TO YOUR NEW SNAK WALLET
      </Text>

      {/* Subtitle */}
      <Text className="text-white text-left font-jost text-base">
        Your e-mail address will be directly associated to your new SNAK wallet, and it will be used as your main ID to use this App.
      </Text>

      {/* Actions Container */}
      <View className="flex flex-col w-full mb-6">
        {/* Email Input */}
        <View className="w-full bg-black/20 rounded-2xl py-4 mb-8">
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="E-MAIL"
            placeholderTextColor="#A0A0A0"
            className="text-white text-center text-lg font-jost"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Checkbox */}
        <Pressable
          className="flex-row items-start gap-4 mb-6"
          onPress={() => setAcceptedTerms(!acceptedTerms)}
        >
          <View className={`w-7 h-7 rounded bg-white items-center justify-center mt-1`}>
            {acceptedTerms && (
              <View className="w-5 h-5 bg-snack-pink rounded-[2px]" />
            )}
          </View>
          <Text className="text-white text-base font-jost flex-1 leading-snug">
            I have read and accept SNAK's <Text className="text-snack-pink">privacy policy</Text>{'\n'}and <Text className="text-snack-pink">terms and conditions</Text>.
          </Text>
        </Pressable>

        {children}
      </View>
    </Fragment>
  );
}
