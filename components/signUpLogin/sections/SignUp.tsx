import { AntDesign } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import { SignUpButton } from '../components';
import { useSignUpContext } from '../context/SignUpContext';
import { Create, LinkEmail, SetCredentials, VerifyCode } from '../subSections';

export default function SignUp() {
  const { subSectionSelected, setSubSectionSelected } = useSignUpContext();

  const handleBack = () => {
    if (subSectionSelected === 'credentials') {
      setSubSectionSelected('code');
    } else if (subSectionSelected === 'code') {
      setSubSectionSelected('link');
    } else if (subSectionSelected === 'link') {
      setSubSectionSelected('create');
    }
  };

  return (
    <View className="flex-1 w-full mt-8">
      {/* Absolute Back Button for sub-sections. We use a negative top margin to place it correctly relative to the logo section from the parent if needed, or just let it sit here. Using an absolute position that goes up allows it to overlay the header space. */}
      {subSectionSelected !== "create" && (
        <Pressable
          onPress={handleBack}
          className="absolute left-0 -top-52 w-12 h-12 rounded-full bg-pink-200 items-center justify-center z-50"
        >
          <AntDesign name="arrow-left" size={24} color="#BF0FB4" />
        </Pressable>
      )}

      {/* Progress Dots */}
      <View className="relative flex-row items-center justify-center gap-3 w-[132px] mx-auto mb-12">
        {/* Connecting Line */}
        <View className="absolute h-[2px] bg-snack-pink left-2 right-2 top-1/2 -translate-y-1/2 z-0" />

        {/* Dot 1 – create */}
        {subSectionSelected === "create" ? (
          <View className="w-6 h-6 rounded-full border-2 border-snack-pink items-center justify-center z-10 bg-[#1E0942]">
            <View className="w-3 h-3 rounded-full bg-white" />
          </View>
        ) : (
          <View className="w-3 h-3 rounded-full bg-snack-pink z-10" />
        )}

        {/* Dot 2 – link */}
        {subSectionSelected === "create" ? (
          <View className="w-3 h-3 rounded-full bg-white z-10" />
        ) : subSectionSelected === "link" ? (
          <View className="w-6 h-6 rounded-full border-2 border-snack-pink items-center justify-center z-10 bg-[#1E0942]">
            <View className="w-3 h-3 rounded-full bg-white" />
          </View>
        ) : (
          <View className="w-3 h-3 rounded-full bg-snack-pink z-10" />
        )}

        {/* Dot 3 – code */}
        {subSectionSelected === "create" || subSectionSelected === "link" ? (
          <View className="w-3 h-3 rounded-full bg-white z-10" />
        ) : subSectionSelected === "code" ? (
          <View className="w-6 h-6 rounded-full border-2 border-snack-pink items-center justify-center z-10 bg-[#1E0942]">
            <View className="w-3 h-3 rounded-full bg-white" />
          </View>
        ) : (
          <View className="w-3 h-3 rounded-full bg-snack-pink z-10" />
        )}

        {/* Dot 4 – credentials */}
        {subSectionSelected === "create" || subSectionSelected === "link" || subSectionSelected === "code" ? (
          <View className="w-3 h-3 rounded-full bg-white z-10" />
        ) : (
          <View className="w-6 h-6 rounded-full border-2 border-snack-pink items-center justify-center z-10 bg-[#1E0942]">
            <View className="w-3 h-3 rounded-full bg-white" />
          </View>
        )}
      </View>

      {subSectionSelected === "create" && (
        <Create>
          <View className="w-full">
            <SignUpButton
              variant="primary"
              title="CONTINUE"
              onPress={() => setSubSectionSelected("link")}
            />
          </View>
        </Create>
      )}

      {subSectionSelected === "link" && (
        <LinkEmail onContinue={() => setSubSectionSelected("code")} />
      )}

      {subSectionSelected === "code" && (
        <VerifyCode
          onContinue={() => setSubSectionSelected("credentials")}
          onRequestNewCode={() => console.log('Request new code')}
        />
      )}

      {subSectionSelected === "credentials" && (
        <SetCredentials />
      )}
    </View>
  );
}
