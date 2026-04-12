// useProfileView.ts
import { useContext } from "react";
import { ProfileViewContext } from "@/features/userProfile/context/userProfileViewContext";

export const useProfileView = () => {
  const ctx = useContext(ProfileViewContext);

  if (!ctx) {
    throw new Error("useProfileView must be used inside ProfileViewProvider");
  }

  return ctx;
};