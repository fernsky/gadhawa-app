export interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  role: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
}

export interface AuthContextType extends AuthState {
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
}
