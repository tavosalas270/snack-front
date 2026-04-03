import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { Image } from 'expo-image';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

export default function SplashScreenComponent() {
  return (
    <ImageBackground
      source={require('@/assets/images/FondoUno.png')}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Glow effect behind the logo using SVG for perfect radial blending */}
        <View style={styles.glowContainer} pointerEvents="none">
          <Svg height="600" width="600">
            <Defs>
              <RadialGradient
                id="glow"
                cx="50%"
                cy="50%"
                rx="50%"
                ry="50%"
                fx="50%"
                fy="50%"
                gradientUnits="userSpaceOnUse"
              >
                <Stop offset="0%" stopColor="#0798F2" stopOpacity="0.30" />
                <Stop offset="30%" stopColor="#0798F2" stopOpacity="0.15" />
                <Stop offset="70%" stopColor="#0798F2" stopOpacity="0.02" />
                <Stop offset="100%" stopColor="#0798F2" stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Rect x="0" y="0" width="600" height="600" fill="url(#glow)" />
          </Svg>
        </View>
        
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
  glowContainer: {
    position: 'absolute',
    width: 600,
    height: 600,
    alignItems: 'center',
    justifyContent: 'center',
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

