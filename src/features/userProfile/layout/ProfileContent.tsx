import React from "react";
import { useProfile } from "@/features/userProfile/hooks/useProfile";
import { Mail, Phone, User } from "lucide-react";

const ProfileContent = () => {
  const { user } = useProfile();

  const fullName = `${user?.firstName || ""} ${
    user?.middleName || ""
  } ${user?.lastName || ""}`;

  return (
    <div className="p-6 space-y-6">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center">
        <img
          src={user?.profilePicture || "/default-avatar.png"}
          alt={user?.firstName}
          className="w-20 h-20 rounded-full object-cover shadow-md"
        />

        <h2 className="mt-3 text-xl font-semibold">{fullName}</h2>
      </div>

      {/* Info Section */}
      <div className="bg-gray-900 rounded-xl p-4 space-y-4 shadow-sm">
        <h3 className="text-md font-semibold border-b border-gray-700 pb-2">
          Personal Information
        </h3>

        {/* Email */}
        <div className="flex items-center gap-3">
          <Mail size={18} className="text-gray-400" />
          <div>
            <p className="text-xs text-gray-400">Email</p>
            <p className="text-sm">{user?.email || "N/A"}</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3">
          <Phone size={18} className="text-gray-400" />
          <div>
            <p className="text-xs text-gray-400">Phone</p>
            <p className="text-sm">{user?.phoneNumber || "N/A"}</p>
          </div>
        </div>

        {/* Full Name */}
        <div className="flex items-center gap-3">
          <User size={18} className="text-gray-400" />
          <div>
            <p className="text-xs text-gray-400">Full Name</p>
            <p className="text-sm">{fullName}</p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gray-900 rounded-xl p-4 shadow-sm">
        <h3 className="text-md font-semibold mb-2">About</h3>
        <p className="text-sm text-gray-400">
          Bio
         </p> 
      </div>
    </div>
  );
};

export default ProfileContent;