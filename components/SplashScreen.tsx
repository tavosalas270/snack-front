import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { Image } from 'expo-image';
import LogoGlow from '@/components/LogoGlow';

export default function SplashScreenComponent() {
  return (
    <ImageBackground
      source={require('@/assets/images/FondoUno.png')}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Glow effect behind the logo using the new reusable LogoGlow component */}
        <LogoGlow size={600} />
        
        {/* SVG Logo */}
        <Image 
          source={require('@/assets/icons/snack_white.svg')}
          style={styles.logo}
          contentFit="contain"
        />
      </View>

      <Text style={styles.footerText}>
        © 2023 SNAK. All rights reserved.
      </Text>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 250, // Fixed height space so SVG centers properly
  },
  logo: {
    width: 260,
    height: 100,
    zIndex: 10,
  },
  footerText: {
    fontFamily: 'Jost_400Regular',
    position: 'absolute',
    bottom: 40,
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
});

