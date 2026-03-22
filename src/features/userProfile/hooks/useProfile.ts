import { useContext } from "react";
import { ProfileContext } from "@/features/userProfile/context/profileContext";

/**
 * useProfile hook
 * Safely consumes ProfileContext
 * Ensures it is used only inside ProfileProvider
 */
export const useProfile = () => {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error("useProfile must be used within ProfileProvider");
  }

  return context;
};