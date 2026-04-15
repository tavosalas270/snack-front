import { LoginProvider, useLoginContext } from '@/components/signUpLogin/context';
import { CherryBombOne_400Regular, useFonts } from '@expo-google-fonts/cherry-bomb-one';
import { Jost_400Regular, Jost_700Bold } from '@expo-google-fonts/jost';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';

import 'react-native-reanimated';
import '../global.css';

import SplashScreenComponent from '@/components/SplashScreen';
import { useColorScheme } from '@/hooks/use-color-scheme';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: 'signUpLogin',
};

function InitialLayout() {
  const { accessToken } = useLoginContext();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inWatchGroup = segments.length > 0 && segments[0] === 'home';

    if (!accessToken && inWatchGroup) {
      router.replace('/signUpLogin');
    }
  }, [accessToken, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="signUpLogin/index" />
      <Stack.Screen name="home/index" />
    </Stack>
  );
}

export default function RootLayout() {
  const queryClient = new QueryClient();
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
      }, 2500);
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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <LoginProvider>
          <InitialLayout />
        </LoginProvider>
        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
