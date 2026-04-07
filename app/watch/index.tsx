import LogoGlow from '@/components/LogoGlow';
import { Image } from 'expo-image';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const VIDEO_SOURCE = require('../../antigravity/resources/prueba.mp4');

export default function WatchScreen() {
  const player = useVideoPlayer(VIDEO_SOURCE, player => {
    player.loop = true;
    player.play();
  });

  return (
    <View className="flex-1 h-full bg-snack-dark-purple">
      {/* Background */}
      <Image
        source={require('@/assets/images/FondoUno.png')}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
      />

      <SafeAreaView className="flex-1 justify-center items-center relative z-10">
        <View className="absolute z-0 items-center justify-center pointer-events-none">
          <LogoGlow size={600} />
        </View>

        <Text className="text-white font-cherry-bomb text-4xl mb-8 z-10" style={{ textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }}>
          SNACK TV
        </Text>

        <View className="w-11/12 max-w-md h-72 sm:h-80 md:h-96 z-10 self-center bg-black/40 rounded-3xl p-[2px] border border-snack-pink/50">
          <View className="w-full h-full rounded-3xl overflow-hidden bg-black/80">
            <VideoView
              style={{ width: '100%', height: '100%' }}
              player={player}
              fullscreenOptions={{ enable: true }}
              allowsPictureInPicture
              onFullscreenEnter={() => {
                ScreenOrientation.unlockAsync();
              }}
              onFullscreenExit={() => {
                ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
              }}
            />
          </View>
        </View>

        <Text className="text-white font-jost text-base mt-8 z-10 opacity-90 px-8 text-center leading-6">
          Enjoy our latest content.{'\n'}Tap the player for controls.
        </Text>
      </SafeAreaView>
    </View>
  );
}
