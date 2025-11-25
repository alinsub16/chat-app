// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode} from "react";
import { User, AuthResponse, LoginData, RegisterData } from "@/features/auth/types/auth";
import { loginUser, registerUser, getProfile, updateProfile, changePassword, changeEmail } from "@/features/auth/api/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;       // for profile fetch
  authLoading: boolean;   // for login/register actions
  error: string | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  changeEmail: (currentPassword: string, newEmail: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile on mount
useEffect(() => {
  const fetchProfile = async () => {
    try {
      if (token) {
        const profile = await getProfile();
        setUser(profile.user);
        console.log("PROFILE RESULT:", user);
      } else {
        setUser(null);
      }
    } catch (err:any) {
      console.error("Failed to fetch profile:", err);
      logout();
    } finally {
      setLoading(false); 
    }
  };
  fetchProfile();
}, [token]);

const login = async (data: LoginData) => {
  setAuthLoading(true);
  setError(null);
  try {
    const res: AuthResponse = await loginUser(data);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem("token", res.token);
  } catch (err: any) {
    const errorMessage =
      err.response?.data?.message ||
      err.response?.data?.error ||
      "Login failed";
    setError(errorMessage);
    throw new Error(errorMessage); // ✅ Rethrow for AuthForm to catch
  } finally {
    setAuthLoading(false);
  }
};

const register = async (data: RegisterData) => {
  setAuthLoading(true);
  setError(null);
  try {
    const res: AuthResponse = await registerUser(data);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem("token", res.token);
  } catch (err: any) {
    const errorMessage =
      err.response?.data?.message ||
      err.response?.data?.error ||
      "Registration failed";
    setError(errorMessage);
    throw new Error(errorMessage); // ✅ Correct variable
  } finally {
    setAuthLoading(false);
  }
};

  const refreshProfile = async () => {
    try {
      const profile = await getProfile();
      
      setUser(profile.user);
 
    } catch {
      logout();
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        authLoading,
        error,
        login,
        register,
        logout,
        refreshProfile,
        updateProfile: async (data) => {
          const updated = await updateProfile(data);
          setUser(updated);
        },
        changePassword: async (curr, next) => {
          await changePassword(curr, next);
        },
        changeEmail: async (curr, next) => {
          await changeEmail(curr, next);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

