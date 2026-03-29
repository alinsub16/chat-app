import React, { createContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/features/auth/types/auth";
import {getProfile,updateProfile,changePassword,changeEmail,} from "@/features/userProfile/api/profileAPI";
import { useAuth } from "@/features/auth/hooks/useAuth";

/**
 * ProfileContextType
 * Defines all profile-related state and actions
 */
 export interface ProfileContextType {
  user: User | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (current: string, next: string) => Promise<void>;
  changeEmail: (current: string, next: string) => Promise<void>;
}

/**
 * Create ProfileContext
 * Starts as undefined to enforce usage within ProfileProvider
 */
export const ProfileContext = createContext<ProfileContextType | undefined>(
  undefined
);

/**
 * ProfileProvider
 * Handles:
 * - Fetching user profile
 * - Updating profile data
 * - Managing profile-related state
 * - Syncing with Auth (via token)
 */
export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();


  /**
   * Fetch user profile whenever token changes
   * - If no token → clear user
   * - If token exists → fetch profile from API
   */
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const profile = await getProfile();
        setUser(profile.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  /**
   * Refresh profile manually
   * Useful after updates or external changes
   */
  const refreshProfile = async () => {
    const profile = await getProfile();
    setUser(profile.user);
  };

  /**
   * Update user profile data
   * Sends partial updates and replaces local state with response
   */
  const updateUserProfile = async (data: Partial<User>) => {
  if (!user) return;

  const prevUser = user;

  //  Create NEW object (avoid mutation leaks)
  const optimisticUser = {
    ...user,
    ...data,
    _id: user._id, // ensure ID is preserved
  };

  setUser(optimisticUser);

  try {
    const updated = await updateProfile(data);

    // Ensure update only applies if same user
    if (updated._id === user._id) {
      setUser(updated);
    }
  } catch (err) {
    setUser(prevUser); // rollback
    throw err;
  }
  };

  /**
   * Change user password
   * Only triggers backend operation, does not modify local user state
   */
  const changeUserPassword = async (current: string, next: string) => {
     await changePassword(current, next);
  
  };

  /**
   * Change user email
   * Backend handles update; frontend does not directly mutate user state
   */
  const changeUserEmail = async (current: string, next: string) => {
    await changeEmail(current, next);
  };

  /**
   * Provide profile state and actions to the app
   */
  return (
    <ProfileContext.Provider
      value={{
        user,
        loading,
        refreshProfile,
        updateProfile: updateUserProfile,
        changePassword: changeUserPassword,
        changeEmail: changeUserEmail,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};