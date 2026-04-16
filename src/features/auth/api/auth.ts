import api from "@services/axiosInstance";
import {  RegisterData, LoginData, AuthResponse,} from "@/features/auth/types/auth";

// Register
export const registerUser = async ( data: RegisterData ): Promise<AuthResponse> => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value as any);
    }
  });

  const res = await api.post<AuthResponse>("/auth/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// Login
export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/login", data);
  return res.data;
};

