import { useState, useCallback, useRef } from "react";
import { searchUsers as searchUsersApi } from "@features/search/api/searchApi";
import { SearchUser } from "@features/search/types/searchType";

// Debounce utility
const debounce = <F extends (...args: any[]) => void>(fn: F, delay: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<F>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

interface UseSearchUsersReturn {
  users: SearchUser[];
  loading: boolean;
  error: string | null;
  searchUsers: (query: string) => void;
}

export const useSearchUsers = (debounceTime = 300): UseSearchUsersReturn => {
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setUsers([]);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const results = await searchUsersApi(query);
        setUsers(results);
      } catch (err: any) {
        setError(err.message || "Failed to fetch users");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Debounced version
  const debouncedSearch = useRef(debounce(search, debounceTime)).current;

  return {
    users,
    loading,
    error,
    searchUsers: debouncedSearch,
  };
};
