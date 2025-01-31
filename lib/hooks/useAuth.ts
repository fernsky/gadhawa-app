import { useMutation } from "@tanstack/react-query";
import { signup, signin, signout } from "@/lib/api/auth";
import type { SignupInput, AuthError, SigninInput } from "@/lib/api/auth";
import useAuthStore from "@/store/auth";
import { useRouter } from "expo-router";
import { logout } from "@/lib/api/auth";
import * as Haptics from "expo-haptics";
import { toast } from "@/lib/toast";

export function useSignin(options?: {
  onSuccess?: () => void;
  onError?: (error: AuthError) => void;
}) {
  const store = useAuthStore();

  return useMutation({
    mutationFn: signin,
    onSuccess: async (data) => {
      await store.login(data.access_token, data.user);
      options?.onSuccess?.();
    },
    onError: (error: AuthError) => {
      options?.onError?.(error);
    },
  });
}

export function useSignup(options?: {
  onSuccess?: () => void;
  onError?: (error: AuthError) => void;
}) {
  const store = useAuthStore();

  return useMutation({
    mutationFn: signup,
    onSuccess: async (data) => {
      await store.login(data.access_token, data.user);
      options?.onSuccess?.();
    },
    onError: (error: AuthError) => {
      options?.onError?.(error);
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const store = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      store.logout();
      await logout();
    },
    onMutate: () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    onSuccess: () => {
      toast.success("Goodbye!", "You have been successfully logged out");
      // Redirect to login screen
      router.replace("/(auth)/signin");
    },
    onError: (error) => {
      console.error("Logout error:", error);
      toast.error(
        "Logout failed",
        "There was a problem logging out. Please try again."
      );
    },
  });
}
// Utility hook to access auth state
export function useAuth() {
  const { isAuthenticated, user, token } = useAuthStore();
  return { isAuthenticated, user, token };
}
