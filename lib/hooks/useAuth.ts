import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { signup, signin, signout } from "@/lib/api/auth";
import type { SignupInput, AuthError } from "@/lib/api/auth";
import type { AuthResponse } from "@/lib/types/auth";
import * as SecureStore from "expo-secure-store";
import { queryClient } from "@/lib/query/client";

export function useSignup(
  options?: Omit<
    UseMutationOptions<AuthResponse, AuthError, SignupInput>,
    "mutationFn"
  >
) {
  return useMutation({
    mutationFn: signup,
    onSuccess: async (data, variables, context) => {
      await SecureStore.setItemAsync("token", data.access_token);
      queryClient.setQueryData(["user"], data.user);
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error: AuthError, variables, context) => {
      options?.onError?.(error, variables, context);
    },
  });
}

export function useSignin() {
  return useMutation({
    mutationFn: signin,
    onSuccess: async (data) => {
      await SecureStore.setItemAsync("token", data.access_token);
      // Store user data or handle auth state
    },
  });
}

export function useSignout() {
  return useMutation({
    mutationFn: signout,
    onSuccess: async () => {
      await SecureStore.deleteItemAsync("token");
      // Clear user data or handle auth state
    },
  });
}
