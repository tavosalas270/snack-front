import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

export default function SplashScreenComponent() {
  return (
    <LinearGradient
      colors={['#2E0259', '#48038C', '#BF0FB4']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Glow effect behind the text using SVG for perfect radial blending */}
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
        
        <View style={styles.logoRow}>
          <Text style={styles.textContainer}>SNAK</Text>
          <View style={styles.exclamationWrapper}>
            <Text style={styles.textContainer}>!</Text>
            {/* The pink dot overlay for the ! */}
            <View style={styles.pinkDot} />
          </View>
        </View>
      </View>

      <Text style={styles.footerText}>
        © 2023 SNAK. All rights reserved.
      </Text>
    </LinearGradient>
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
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  textContainer: {
    fontFamily: 'CherryBombOne_400Regular',
    fontSize: 70,
    letterSpacing: 2,
    color: '#FFFFFF',
    // Removed textShadow entirely to make the exact sharp edge as Image 1
  },
  exclamationWrapper: {
    position: 'relative',
  },
  pinkDot: {
    position: 'absolute',
    backgroundColor: '#BF0FB4', // snack-pink
    width: 22,
    height: 22,
    borderRadius: 11,
    bottom: 15,
    left: 8,
  },
  footerText: {
    fontFamily: 'Jost_400Regular',
    position: 'absolute',
    bottom: 40,
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
});

