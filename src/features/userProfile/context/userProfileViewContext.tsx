import { createContext, useState } from "react";
import { UserProfile } from "@/features/userProfile/types/profileTypes";
import { getUserProfileById } from "@/features/userProfile/api/profileAPI";
import { useProfile } from "@/features/userProfile/hooks/useProfile";

export type ProfileViewContextType = {
  selectedUser: UserProfile | null;
  loading: boolean;
  viewMode: "self" | "other" | null;
  isProfileOpen: boolean;
  getUserProfile: (id: string) => Promise<void>;
  clearSelectedUser: () => void;
};

export const ProfileViewContext = createContext<ProfileViewContextType | null>(null);

export const ProfileViewProvider = ({ children }: any) => {
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"self" | "other" | null>(null);

  const isProfileOpen = !!selectedUser;

  const getUserProfile = async (id: string) => {
    try {
      setLoading(true);

      const data = await getUserProfileById(id);
      setSelectedUser(data);

      setViewMode("other"); // 👈 safe default for chat click
    } finally {
      setLoading(false);
    }
  };

  const clearSelectedUser = () => {
    setSelectedUser(null);
    setViewMode(null);
  };

  return (
    <ProfileViewContext.Provider
      value={{
        selectedUser,
        loading,
        viewMode,
        isProfileOpen,
        getUserProfile,
        clearSelectedUser,
      }}
    >
      {children}
    </ProfileViewContext.Provider>
  );
};