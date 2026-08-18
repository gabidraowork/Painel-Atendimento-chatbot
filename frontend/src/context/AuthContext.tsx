import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { User, LoginCredentials, RegisterPayload } from "../types";
import { AuthService } from "../services/auth.service";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => AuthService.getStoredUser());
  const [token, setToken] = useState<string | null>(() => AuthService.getStoredToken());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sincroniza estado de autenticação
  useEffect(() => {
    const storedUser = AuthService.getStoredUser();
    const storedToken = AuthService.getStoredToken();
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AuthService.login(credentials);
      setUser(response.user);
      setToken(response.token);
    } catch (err: any) {
      const message = err?.message || "Falha ao realizar login no servidor.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      await AuthService.register(payload);
      // Realiza login automático após cadastro bem-sucedido
      const response = await AuthService.login({
        email: payload.email,
        password: payload.password,
      });
      setUser(response.user);
      setToken(response.token);
    } catch (err: any) {
      const message = err?.message || "Falha ao realizar cadastro no servidor.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    AuthService.logout();
    setUser(null);
    setToken(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser utilizado dentro de um <AuthProvider />");
  }
  return context;
}

export default AuthContext;
