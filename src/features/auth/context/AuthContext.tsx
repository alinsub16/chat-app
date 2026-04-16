import React, { createContext, useState, ReactNode } from "react";
import { AuthResponse, LoginData, RegisterData } from "@/features/auth/types/auth";
import { loginUser, registerUser } from "@/features/auth/api/auth";


/**
 * Defines the shape of the Auth Context
 * This ensures type safety across the app when consuming auth data
 */
interface AuthContextType {
  token: string | null;
  authLoading: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

/**
 * Create Auth Context
 * Starts as undefined to enforce usage inside AuthProvider
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider
 * Responsible for handling authentication state and exposing auth actions
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles user login
   * - Calls API
   * - Stores token in state and localStorage
   * - Handles error properly
   */
  const login = async (data: LoginData) => {
    setAuthLoading(true);
    setError(null); 

    try {
      const res: AuthResponse = await loginUser(data);
      setToken(res.token);
      localStorage.setItem("token", res.token);

    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login failed";

      setError(message);

      throw new Error(message);

    } finally {
      setAuthLoading(false);
    }
  };

  /**
   * Handles user registration
   */
  const register = async (data: RegisterData) => {
    setAuthLoading(true);
    setError(null);

    try {
      const res: AuthResponse = await registerUser(data);

      // Save token after successful registration
      setToken(res.token);
      localStorage.setItem("token", res.token);

    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed";

      setError(message);
      throw new Error(message);

    } finally {
      setAuthLoading(false);
    }
  };

  /**
   * Logs out the user
   */
  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");

  };

  /**
   * AuthContext Provider
   * Makes auth state and functions available globally to the app
   */
  return (
    <AuthContext.Provider
      value={{
        token,
        authLoading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};