import api from "@services/axiosInstance";
import { SearchUser } from "@/features/search/types/searchType";

// Search users by query
export const searchUsers = async (query: string): Promise<SearchUser[]> => {
  const res = await api.get<SearchUser[]>("/search/users", {
    params: { query },
  });

  return res.data;
};