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
      router.replace("/(app)/home");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(app)/index");
    }
  }, [isAuthenticated, segments]);

  return <>{children}</>;
}
