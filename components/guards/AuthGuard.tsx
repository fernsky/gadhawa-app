import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/signin");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(app)/(tabs)");
    }
  }, [isAuthenticated, segments]);

  return <>{children}</>;
}
