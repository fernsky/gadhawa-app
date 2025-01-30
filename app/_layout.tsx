import "../global.css";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
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
    if (fontsLoaded || fontError) {
      // Hide splash screen once fonts are loaded or if there's an error
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
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
                  animation: "fade",
                  contentStyle: { backgroundColor: "white" },
                }}
              >
                <Stack.Screen
                  name="(auth)"
                  options={{ animation: "slide_from_bottom" }}
                />
                <Stack.Screen
                  name="(app)"
                  options={{ animation: "slide_from_right" }}
                />
              </Stack>
            </AuthGuard>
          </AuthProvider>
        </AppProvider>
        <Toast />
      </QueryClientProvider>
    </View>
  );
}
