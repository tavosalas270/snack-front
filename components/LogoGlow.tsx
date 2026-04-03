import { View, StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

interface LogoGlowProps {
  size?: number;
}

export default function LogoGlow({ size = 600 }: LogoGlowProps) {
  return (
    <View style={[styles.glowContainer, { width: size, height: size }]} pointerEvents="none">
      <Svg height={size} width={size}>
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
        <Rect x="0" y="0" width={size} height={size} fill="url(#glow)" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  glowContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
