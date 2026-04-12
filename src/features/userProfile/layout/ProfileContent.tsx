import React, { useState, useRef } from "react";
import { useProfile } from "@/features/userProfile/hooks/useProfile";
import { Mail, Phone, User, Pencil, Camera } from "lucide-react";
import EditProfileModal from "@/features/userProfile/components/EditProfileModal";
import Avatar from "@/components/ui/Avatar";

const ProfileContent = () => {
  const { user, updateProfile } = useProfile();

  const [uploading, setUploading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!user) return null;

  const fullName = `${user.firstName || ""} ${user.middleName || ""} ${user.lastName || ""}`;
  const name = `${user.firstName || ""} ${user.lastName || ""}`;

  /**
   * Handle image click → open file picker
   */
  const handlePickImage = () => {
    fileInputRef.current?.click();
  };

  /**
   * Handle image change
   */
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("profilePicture", file);

      await updateProfile(formData as any);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
      URL.revokeObjectURL(localUrl);
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center relative">
        <div className="relative">
          <Avatar avatar={user.profilePicture || null} name={name} size={100} className="w-24 h-24 shadow-md" />

          {/* Uploading overlay */}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Edit avatar */}
          {!uploading && (
            <button
              onClick={handlePickImage}
              className="absolute bottom-0 right-0 bg-gray-800 p-2 rounded-full shadow hover:bg-gray-700 transition"
            >
              <Camera size={14} />
            </button>
          )}
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />

        <h2 className="mt-3 text-xl font-semibold">{name}</h2>
      </div>

      {/* Info Section */}
      <div className="bg-gray-900 rounded-xl p-4 space-y-4 shadow-sm relative">
        <h3 className="text-md font-semibold border-b border-gray-700 pb-2">
          Personal Information
        </h3>

        {/* Edit button */}
        <button
          onClick={() => setOpenEdit(true)}
          className="absolute right-4 top-3 flex items-center gap-1 text-xs bg-gray-800 px-2 py-1 rounded-md hover:bg-gray-700"
        >
          <Pencil size={14} />
          Edit
        </button>

        <div className="flex items-center gap-3">
          <Mail size={18} className="text-gray-400" />
          <div>
            <p className="text-xs text-gray-400">Email</p>
            <p className="text-sm">{user.email || "N/A"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone size={18} className="text-gray-400" />
          <div>
            <p className="text-xs text-gray-400">Phone</p>
            <p className="text-sm">{user.phoneNumber || "N/A"}</p>
          </div>
        </div>

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
        <p className="text-sm text-gray-400">No bio yet</p>
      </div>

      {openEdit && (
        <EditProfileModal onClose={() => setOpenEdit(false)} />
      )}
    </div>
  );
};

export default ProfileContent;