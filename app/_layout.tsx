import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { useFonts, CherryBombOne_400Regular } from '@expo-google-fonts/cherry-bomb-one';
import { Jost_400Regular, Jost_700Bold } from '@expo-google-fonts/jost';

import '../global.css';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import SplashScreenComponent from '@/components/SplashScreen';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    CherryBombOne_400Regular,
    Jost_400Regular,
    Jost_700Bold,
  });

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 2500); // Retener el splash visual por 2.5s para apreciar la animación/diseño
      return () => clearTimeout(timer);
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  if (showSplash) {
    return <SplashScreenComponent />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="signUpLogin/index" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
