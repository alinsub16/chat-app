import api from "@services/axiosInstance";
import { User, RegisterData, LoginData, AuthResponse,ProfileResponse } from "@/features/auth/types/auth";

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

