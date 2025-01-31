import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

interface User {
  id: string | number;
  email: string;
  name: string;
  // ... other user properties
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: (token: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      token: null,
      user: null,

      setToken: (token) => set({ token, isAuthenticated: !!token }),

      setUser: (user) => set({ user }),

      login: async (token, user) => {
        await SecureStore.setItemAsync("token", token);
        set({ token, user, isAuthenticated: true });
      },

      logout: async () => {
        await SecureStore.deleteItemAsync("token");
        set({ token: null, user: null, isAuthenticated: false });
      },

      refreshToken: async (token) => {
        await SecureStore.setItemAsync("token", token);
        set({ token, isAuthenticated: true });
      },

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
