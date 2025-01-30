import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState, AppContextType } from "@/types/app";

const initialState: AppState = {
  theme: "light",
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  useEffect(() => {
    loadAppState();
  }, []);

  const loadAppState = async () => {
    try {
      const theme = await AsyncStorage.getItem("app_theme");
      setState({
        theme: (theme as "light" | "dark") || "light",
      });
    } catch (error) {
      console.error("Error loading app state:", error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        setTheme: async (theme) => {
          await AsyncStorage.setItem("app_theme", theme);
          setState((prev) => ({ ...prev, theme }));
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
