import React, { useState, useRef, useCallback } from "react";
import { useProfile } from "@/features/userProfile/hooks/useProfile";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { MoreVertical, User, Settings, LogOut } from "lucide-react";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import ProfileDrawer from "@/features/userProfile/components/ProfileDrawer";
import Avatar from "@/components/ui/Avatar";

const UserProfileMenu = () => {
  const { user } = useProfile();
  const { logout } = useAuth();

  const [open, setOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  /**
   * Close dropdown (used by outside click)
   */
  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  /**
   * Toggle dropdown open/close
   */
  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const fullName = `${user?.firstName} ${user?.lastName}`;


  // Use ONLY ONCE
  useOnClickOutside(ref, handleClose);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={handleToggle}
      >
        <Avatar avatar={user?.profilePicture || null} name={fullName} className="w-8 h-8"/>
        <MoreVertical size={16} />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-primary shadow-lg rounded-md p-2 z-50">
          
          <button
            onClick={() => {
              setOpen(false);
              setShowProfile(true);
            }}
            className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-800 rounded-md"
          >
            <User size={16} />
            <span>Profile</span>
          </button>

          <button className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-800 rounded-md">
            <Settings size={16} />
            <span>Settings</span>
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-800 rounded-md text-red-500"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
      <ProfileDrawer
        open={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </div>
    
  );
};

export default UserProfileMenu;