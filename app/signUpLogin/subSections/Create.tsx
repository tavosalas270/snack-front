import { Fragment, ReactNode, useState } from 'react';
import { Text, View } from 'react-native';
import SignUpButton from '../components/SignUpButton';

interface CreateProps {
  children?: ReactNode;
}

export default function Create({ children }: CreateProps) {
  const [selectedWallet, setSelectedWallet] = useState<'create' | 'own' | null>('create');

  return (
    <Fragment>
      {/* Header Title */}
      <Text className="text-white text-2xl font-jost-bold text-center uppercase tracking-widest leading-tight mb-12">
        Which type of wallet would you like to use?
      </Text>

      {/* Actions Container */}
      <View className="flex flex-col w-full gap-4 mb-6">

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

        {children}
      </View>

    </Fragment>
  );
}
