import React, { useEffect } from "react";
import ProfileContent from "@/features/userProfile/layout/ProfileContent";
import { X } from "lucide-react";
import { useProfileView } from "@/features/userProfile/hooks/useProfileView";

type Props = {
  open: boolean;
  onClose: () => void;
};

const ProfileDrawer: React.FC<Props> = ({ open, onClose }) => {
  const { clearSelectedUser } = useProfileView();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const handleClose = () => {
    clearSelectedUser();
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={handleClose}
      />

      {/* Drawer (MY PROFILE ONLY - always from RIGHT) */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-1/2 bg-primary z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">
            My Profile
          </h2>

          <button
            onClick={handleClose}
            className="p-1 rounded bg-gray-700 cursor-pointer hover:bg-gray-800 transition text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <ProfileContent />
      </div>
    </>
  );
};

export default ProfileDrawer;