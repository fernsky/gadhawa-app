import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { signup, signin, signout } from "@/lib/api/auth";
import type { SignupInput, AuthError, SigninInput } from "@/lib/api/auth";
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

export function useSignin(
  options?: Omit<
    UseMutationOptions<AuthResponse, AuthError, SigninInput>,
    "mutationFn"
  >
) {
  return useMutation({
    mutationFn: signin,
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

export function useSignout() {
  return useMutation({
    mutationFn: signout,
    onSuccess: async () => {
      await SecureStore.deleteItemAsync("token");
      // Clear user data or handle auth state
    },
  });
}
