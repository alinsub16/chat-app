// src/api/auth.ts
import api from "@services/axiosInstance";
import { User, RegisterData, LoginData, AuthResponse } from "@/features/auth/types/auth";

// Register
export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/register", data);
  return res.data;
};

// Login
export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/login", data);
  return res.data;
};

// Get logged-in user
export const getProfile = async (): Promise<User> => {
  const res = await api.get<User>("/auth/profile");
  return res.data;
};

// Update profile
export const updateProfile = async (data: Partial<User>): Promise<User> => {
  const res = await api.put<User>("/auth/me", data);
  return res.data;
};

// Change password
export const changePassword = async (currentPassword: string, newPassword: string): Promise<User> => {
  const res = await api.put<User>("/auth/me/password", {
    currentPassword,
    password: newPassword,
  });
  return res.data;
};

// Change email
export const changeEmail = async (currentPassword: string, newEmail: string): Promise<User> => {
  const res = await api.put<User>("/auth/me/email", {
    currentPassword,
    email: newEmail,
  });
  return res.data;
};
