import "react-native-gesture-handler"; // Add this at the very top
import "../global.css";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "@/providers/AuthProvider";
import { AppProvider } from "@/providers/AppProvider";
import { AuthGuard } from "@/components/guards/AuthGuard";
import {
  useFonts,
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { ErrorBoundary } from "@/components/error-boundary";
import { View } from "react-native";
import { toastVariants } from "@/components/ui/toasts/variants";

// Initialize QueryClient outside of component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        // Wait for fonts and any other resources
        if (fontsLoaded || fontError) {
          await SplashScreen.hideAsync();
          setIsReady(true);
        }
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, [fontsLoaded, fontError]);

  if (!isReady) {
    return null;
  }

  return (
    <View className="flex-1">
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <AuthProvider>
            <AuthGuard>
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: "fade", // Changed to fade for smoother transitions
                }}
              >
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(app)" />
              </Stack>
            </AuthGuard>
          </AuthProvider>
        </AppProvider>
        <Toast config={toastVariants} position="top" topOffset={70} />
      </QueryClientProvider>
    </View>
  );
}
