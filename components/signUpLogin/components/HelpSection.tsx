import { AntDesign } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { HelpSectionProps } from '../interfaces/signup';

export default function HelpSection({ visible, onClose }: HelpSectionProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('What is a wallet?');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      title: 'What is a wallet?',
      content: 'Crypto wallets keep your private keys — the passwords that give you access to your cryptocurrencies — safe and accessible, allowing you to send and receive cryptocurrencies like Bitcoin and Ethereum. They come in many forms, from hardware wallets like Ledger (which looks like a USB stick) to mobile apps like Coinbase Wallet, which makes using crypto as easy as shopping with a credit card online.'
    },
    { title: 'Why do I need a wallet?', content: 'Because it gives you control over your own funds.' },
    { title: 'Why use a third party wallet?', content: 'Third party wallets offer a better experience and features.' },
    { title: 'Can I use this app without a wallet?', content: 'You can browse, but you will need a wallet to transact.' }
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        {/* Backdrop */}
        <Pressable
          className="absolute inset-0 bg-black/40"
          onPress={onClose}
        />

        {/* Bottom Sheet */}
        <View className="bg-white rounded-t-3xl overflow-hidden mt-20 max-h-[90%]">
          {/* Handle */}
          <View className="w-full items-center py-4">
            <View className="w-12 h-1 bg-gray-300 rounded-full" />
          </View>

          <ScrollView className="px-6 pb-12" showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View className="flex-row items-center justify-between relative mb-4">
              {/* Empty view for flex balancing */}
              <View className="w-10" />

              <View className="flex-row items-center gap-2">
                <View className="w-7 h-7 rounded-full border-2 border-[#1ca7b9] items-center justify-center">
                  <Text className="text-[#1ca7b9] font-bold text-sm leading-tight text-center">?</Text>
                </View>
                <Text className="text-black font-jost-bold text-2xl tracking-widest uppercase">HELP</Text>
              </View>

              <Pressable
                onPress={onClose}
                className="w-14 h-14 rounded-full bg-snack-pink/10 items-center justify-center"
              >
                <AntDesign name="close" size={20} color="#BF0FB4" />
              </Pressable>
            </View>

            {/* Accordion List */}
            <View className="gap-2">
              {sections.map((section, index) => {
                const isExpanded = expandedSection === section.title;
                return (
                  <View key={index} className="border-b border-pink-100 py-4">
                    <Pressable
                      onPress={() => toggleSection(section.title)}
                      className="flex-row justify-between items-center"
                    >
                      <Text className="text-snack-pink font-jost font-semibold text-lg max-w-[85%]">
                        {section.title}
                      </Text>
                      <AntDesign
                        name={isExpanded ? "up" : "down"}
                        size={16}
                        color="#BF0FB4"
                      />
                    </Pressable>

                    {isExpanded && (
                      <Text className="text-gray-800 font-jost mt-3 leading-6 text-[15px]">
                        {section.content}
                      </Text>
                    )}
                  </View>
                );
              })}

              {/* Actions */}
              <View className="border-b border-pink-100 py-4">
                <Pressable className="items-center">
                  <Text className="text-snack-pink font-jost-bold text-lg tracking-widest uppercase">
                    CONTACT US
                  </Text>
                </Pressable>
              </View>
              <View className="py-4">
                <Pressable className="items-center">
                  <Text className="text-snack-pink font-jost-bold text-lg tracking-widest uppercase">
                    ABOUT SNAK
                  </Text>
                </Pressable>
              </View>
            </View>

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
