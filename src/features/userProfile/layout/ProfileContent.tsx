import React, { useState, useRef, useEffect } from "react";
import { useProfile } from "@/features/userProfile/hooks/useProfile";
import { Mail, Phone, User, Pencil, Camera, Check } from "lucide-react";
import EditProfileModal from "@/features/userProfile/components/EditProfileModal";
import Avatar from "@/components/ui/Avatar";
import { sileo } from "sileo";

const ProfileContent = () => {
  const { user, updateProfile } = useProfile();

  const [uploading, setUploading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  // BIO STATE
  const [bio, setBio] = useState("");
  const [editingBio, setEditingBio] = useState(false);
  const [savingBio, setSavingBio] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!user) return null;

  const fullName = `${user.firstName || ""} ${user.middleName || ""} ${user.lastName || ""}`;
  const name = `${user.firstName || ""} ${user.lastName || ""}`;

  //  Sync bio when user updates
  useEffect(() => {
    setBio(user.bio || "");
  }, [user]);

  // ================= BIO SAVE =================
  const handleSaveBio = async () => {
    if (savingBio) return;

    //  prevent unnecessary API call
    if (bio.trim() === (user.bio || "").trim()) {
      setEditingBio(false);
      return;
    }

    try {
      setSavingBio(true);

      await updateProfile({
        bio: bio.trim(), // allow empty string
      } as any);

      setEditingBio(false);

      sileo.success({ title: "Changes saved" });
    } catch (err) {
      sileo.error({
        title: "Error",
        description: "Failed to update bio",
      });
    } finally {
      setSavingBio(false);
    }
  };

  // ================= IMAGE PICK =================
  const handlePickImage = () => {
    fileInputRef.current?.click();
  };

  // ================= IMAGE UPLOAD =================
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
      sileo.error({
        title: "Upload failed",
        description: "Could not update profile picture",
      });
    } finally {
      setUploading(false);
      URL.revokeObjectURL(localUrl);
    }
  };

  return (
    <div className="md:p-6 px-2 pt-10 space-y-6 overflow-y-auto h-screen">
      {/* PROFILE HEADER */}
      <div className="flex flex-col items-center text-center relative">
        <div className="relative">
          <Avatar
            avatar={preview || user.profilePicture || null}
            name={name}
            size={100}
            className="w-24 h-24 shadow-md"
          />

          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!uploading && (
            <button
              onClick={handlePickImage}
              className="absolute bottom-0 right-0 bg-gray-800 p-2 rounded-full shadow hover:bg-gray-700 transition"
            >
              <Camera size={14} />
            </button>
          )}
        </div>

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

      {/* INFO */}
      <div className="bg-gray-900 rounded-xl p-4 space-y-4 shadow-sm relative">
        <h3 className="text-md font-semibold border-b border-gray-700 pb-2">
          Personal Information
        </h3>

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

      {/* ABOUT (INLINE BIO) */}
      <div className="bg-gray-900 rounded-xl p-4 shadow-sm relative">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-md font-semibold">About</h3>

          <button
            onClick={
              editingBio ? handleSaveBio : () => setEditingBio(true)
            }
            disabled={savingBio}
            className="text-gray-400 hover:text-white transition disabled:opacity-50"
          >
            {editingBio ? <Check size={16} /> : <Pencil size={16} />}
          </button>
        </div>

        {editingBio ? (
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-gray-800 text-sm text-white p-2 rounded-md outline-none resize-none"
            rows={3}
            placeholder="Write something about yourself..."
          />
        ) : (
          <p className="text-sm text-gray-400">
            {bio?.trim() ? bio : "No bio yet"}
          </p>
        )}
      </div>

      {openEdit && (
        <EditProfileModal onClose={() => setOpenEdit(false)} />
      )}
    </div>
  );
};

export default ProfileContent;