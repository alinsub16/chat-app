// src/api/auth.ts
import api from "@services/axiosInstance";
import { User,ProfileResponse } from "@/features/auth/types/auth";

// Get other user profile (or any user by ID)
export const getUserProfileById = async (userId: string): Promise<User> => {
  const res = await api.get<User>(`/users/${userId}`);
  return res.data;
};

// Get logged-in user
export const getProfile = async (): Promise<ProfileResponse> => {
  const res = await api.get<ProfileResponse>("/auth/profile");
  return res.data;
};

// Update profile
export const updateProfile = async (data: Partial<User>): Promise<User> => {
  const res = await api.put<User>("/auth/me", data);
  return res.data;
};

// Change password
export const changePassword = async (currentPassword: string, newPassword: string): Promise<User> => {
  const res = await api.put<User>("/auth/me/change-password", {
    currentPassword,
    newPassword,
  });
  return res.data;

};

// Change email
export const changeEmail = async (currentPassword: string, newEmail: string): Promise<User> => {
  const res = await api.put<User>("/auth/me/change-email", {
    currentPassword,
    email: newEmail,
  });
  return res.data;
};
