import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

export type Language = "English" | "Nepali";

interface AppState {
  language: null | Language;
  setLanguage: (language: Language) => Promise<void>;
  showLanguageSplash: boolean;
  setShowLanguageSplash: (shouldShow: boolean) => Promise<void>;
}

export const useApp = create<AppState>((set) => ({
  language: null,
  showLanguageSplash: true,
  setLanguage: async (language: Language) => {
    await SecureStore.setItemAsync("language", language);
    set({ language });
  },
  setShowLanguageSplash: async (shouldShow: boolean) => {
    await SecureStore.setItemAsync("showLanguageSplash", `${shouldShow}`);
    set({ showLanguageSplash: shouldShow });
  },
}));
