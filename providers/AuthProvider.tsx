import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthState, AuthContextType } from "@/types/auth";

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    loadAuthState();
  }, []);

  const loadAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      const userStr = await AsyncStorage.getItem("user");

      if (token && userStr) {
        const user = JSON.parse(userStr);
        setState({ isAuthenticated: true, token, user });
      }
    } catch (error) {
      console.error("Error loading auth state:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login: async (token) => {
          await AsyncStorage.setItem("auth_token", token);
          setState((prev) => ({ ...prev, isAuthenticated: true, token }));
        },
        logout: async () => {
          await AsyncStorage.multiRemove(["auth_token", "user"]);
          setState(initialState);
        },
        updateUser: async (user) => {
          await AsyncStorage.setItem("user", JSON.stringify(user));
          setState((prev) => ({ ...prev, user }));
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
