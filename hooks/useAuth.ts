import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,
  setToken: async (token: string) => {
    await SecureStore.setItemAsync("userToken", token);
    set({ token, isAuthenticated: true });
  },
  signOut: async () => {
    await SecureStore.deleteItemAsync("userToken");
    set({ token: null, isAuthenticated: false });
  },
}));
