import React from "react";
import { X, Mail, Phone, User } from "lucide-react";
import { useProfileView } from "@/features/userProfile/hooks/useProfileView";
import Avatar from "@/components/ui/Avatar";

const maskEmail = (email?: string) => {
  if (!email) return "N/A";

  const [name, domain] = email.split("@");
  if (!domain) return "N/A";

  const hidden = "*".repeat(Math.max(3, name.length));
  return `${hidden}@${domain}`;
};

const maskPhone = (phone?: string) => {
  if (!phone) return "N/A";

  return phone.slice(0, 2) + "*".repeat(phone.length - 2);
};

const ViewUserProfileModal = () => {
  const { selectedUser, clearSelectedUser } = useProfileView();

  const open = !!selectedUser;

  if (!open || !selectedUser) return null;

  const fullName = `${selectedUser.firstName || ""} ${
    selectedUser.middleName || ""
  } ${selectedUser.lastName || ""}`;
  const name = `${selectedUser.firstName || ""} ${selectedUser.lastName || ""}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* 🌫 Blur Background */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={clearSelectedUser}
      />

      {/* Modal Card */}
      <div className="relative w-[92%] md:w-[520px] bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-800">
          <h2 className="text-white text-lg font-semibold">
            User Profile
          </h2>

          <button
            onClick={clearSelectedUser}
            className="p-1 rounded bg-gray-700 cursor-pointer hover:bg-gray-800 transition"
          >
            <X size={18} className="text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">

          {/* Avatar + Name */}
          <div className="flex flex-col items-center text-center">
            <Avatar avatar={selectedUser.profilePicture || null} name={name} size={100} className="w-24 h-24 shadow-md" />

            <h2 className="mt-3 text-xl font-semibold text-white">
              {name}
            </h2>
          </div>

          {/* Info Card */}
          <div className="bg-gray-800 rounded-xl p-4 space-y-5">

            {/* Email */}
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm text-white">
                  {maskEmail(selectedUser.email)}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="text-sm text-white">
                  {maskPhone(selectedUser.phoneNumber)}
                </p>
              </div>
            </div>

            {/* Full Name */}
            <div className="flex items-center gap-3">
              <User size={18} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Full Name</p>
                <p className="text-sm text-white">{fullName}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUserProfileModal;