import { AntDesign } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import SignUpButton from '../components/SignUpButton';
import Create from '../subSections/Create';
import LinkEmail from '../subSections/LinkEmail';
import VerifyCode from '../subSections/VerifyCode';

export default function SignUp() {
  const [sectionSelected, setSectionSelected] = useState<'create' | 'link' | 'code' | null>("create");

  const handleBack = () => {
    if (sectionSelected === 'code') {
      setSectionSelected('link');
    } else if (sectionSelected === 'link') {
      setSectionSelected('create');
    }
  };

  return (
    <View className="flex-1 w-full mt-4">
      {/* Absolute Back Button for sub-sections. We use a negative top margin to place it correctly relative to the logo section from the parent if needed, or just let it sit here. Using an absolute position that goes up allows it to overlay the header space. */}
      {sectionSelected !== "create" && (
        <Pressable
          onPress={handleBack}
          className="absolute left-0 -top-28 w-12 h-12 rounded-full bg-pink-200 items-center justify-center z-50"
        >
          <AntDesign name="arrow-left" size={24} color="#BF0FB4" />
        </Pressable>
      )}

      {/* Progress Dots */}
      <View className="relative flex-row items-center justify-center gap-3 w-[96px] mx-auto mb-8">
        {/* Connecting Line */}
        <View className="absolute h-[2px] bg-snack-pink left-2 right-2 top-1/2 -translate-y-1/2 z-0" />

        {/* Dot 1 */}
        {sectionSelected === "create" ? (
          <View className="w-6 h-6 rounded-full border-2 border-snack-pink items-center justify-center z-10 bg-[#1E0942]">
            <View className="w-3 h-3 rounded-full bg-white" />
          </View>
        ) : (
          <View className="w-3 h-3 rounded-full bg-snack-pink z-10" />
        )}

        {/* Dot 2 */}
        {sectionSelected === "create" ? (
          <View className="w-3 h-3 rounded-full bg-white z-10" />
        ) : sectionSelected === "link" ? (
          <View className="w-6 h-6 rounded-full border-2 border-snack-pink items-center justify-center z-10 bg-[#1E0942]">
            <View className="w-3 h-3 rounded-full bg-white" />
          </View>
        ) : (
          <View className="w-3 h-3 rounded-full bg-snack-pink z-10" />
        )}

        {/* Dot 3 */}
        {sectionSelected === "create" || sectionSelected === "link" ? (
          <View className="w-3 h-3 rounded-full bg-white z-10" />
        ) : sectionSelected === "code" ? (
          <View className="w-6 h-6 rounded-full border-2 border-snack-pink items-center justify-center z-10 bg-[#1E0942]">
            <View className="w-3 h-3 rounded-full bg-white" />
          </View>
        ) : (
          <View className="w-3 h-3 rounded-full bg-snack-pink z-10" />
        )}

        {/* Dot 4 */}
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

      {sectionSelected === "link" && (
        <LinkEmail>
          <View className="w-full">
            <SignUpButton
              variant="primary"
              title="CONTINUE"
              onPress={() => setSectionSelected("code")}
            />
          </View>
        </LinkEmail>
      )}

      {sectionSelected === "code" && (
        <VerifyCode>
          <View className="w-full">
            <SignUpButton
              variant="primary"
              title="CONTINUE"
              onPress={() => console.log('Submit Code')}
            />
            <Pressable onPress={() => console.log('Request new code')} className="mt-8 mb-4">
              <Text className="text-snack-pink font-jost-bold text-base text-center uppercase tracking-widest">
                REQUEST A NEW CODE
              </Text>
            </Pressable>
          </View>
        </VerifyCode>
      )}
    </View>
  );
}
