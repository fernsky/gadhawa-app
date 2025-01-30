export interface AppState {
  theme: "light" | "dark";
}

export interface AppContextType extends AppState {
  setTheme: (theme: "light" | "dark") => Promise<void>;
}
