import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import useAuthStore from "@/store/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";
    const inAppGroup = segments[0] === "(app)";
    if (!isAuthenticated && inAppGroup) {
      // Redirect to signin if trying to access app routes while not authenticated
      router.replace("/(auth)/signin");
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to home if trying to access auth routes while authenticated
      router.replace("/(app)");
    }
  }, [isAuthenticated, segments]);

  return <>{children}</>;
}
