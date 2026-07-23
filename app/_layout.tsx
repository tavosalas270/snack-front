import PixelWebView from '@/components/analytics/PixelWebView';
import { analyticsPixelRef } from '@/utils/analytics';
import { LoginProvider, useLoginContext } from '@/components/signUpLogin/context';
import { CherryBombOne_400Regular, useFonts } from '@expo-google-fonts/cherry-bomb-one';
import { Jost_400Regular, Jost_700Bold } from '@expo-google-fonts/jost';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import 'react-native-reanimated';
import '../global.css';

import SplashScreenComponent from '@/components/SplashScreen';
import { useColorScheme } from '@/hooks/use-color-scheme';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: 'signUpLogin',
};

function InitialLayout() {
  const { accessToken, isLoadingAuth } = useLoginContext();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoadingAuth) return; // Esperar a que el storage seguro termine de leer

    const inAuthGroup = segments.length > 0 && segments[0] === 'signUpLogin';
    const inHomeGroup = segments.length > 0 && segments[0] === 'home';

    if (!accessToken && inHomeGroup) {
      // Si no hay token y quiere entrar a contenido protegido, lo mandamos a login
      router.replace('/signUpLogin');
    } else if (accessToken && (!segments.length || inAuthGroup)) {
      // Si ya hay token y está en el login o raíz, lo auto-logeamos a la vista principal
      router.replace('/home');
    }
  }, [accessToken, segments, isLoadingAuth]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="signUpLogin/index" />
      <Stack.Screen name="home/index" />
    </Stack>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 8, // 8 hours
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <LoginProvider>
              <InitialLayout />
              {/* WebView oculta para inyectar eventos de Meta/TikTok */}
              <PixelWebView ref={analyticsPixelRef} />
            </LoginProvider>
            <StatusBar style="auto" />
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
