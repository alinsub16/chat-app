import React, { useState } from "react";
import { sileo } from "sileo";
import { useProfile } from "@/features/userProfile/hooks/useProfile";
import {profileSchema,emailSchema,passwordSchema,} from "@/features/userProfile/validation/profileSchema";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { X, Eye, EyeOff } from "lucide-react";

type Props = {
  onClose: () => void;
};

const EditProfileModal: React.FC<Props> = ({ onClose }) => {
  const { user, updateProfile, changePassword, changeEmail } = useProfile();
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [showCurrentPasswordEmail, setShowCurrentPasswordEmail] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // ================= PROFILE STATE =================
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || "",
    middleName: user?.middleName || "",
    lastName: user?.lastName || "",
    phoneNumber: user?.phoneNumber || "",
  });

  const [profileLoading, setProfileLoading] = useState(false);

  // ================= EMAIL STATE =================
  const [email, setEmail] = useState(user?.email || "");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  // ================= PASSWORD STATE =================
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setProfileForm({
    ...profileForm,
    [e.target.name]: e.target.value,
  });
};

  // ================= HANDLERS =================
  const handleProfileSave = async () => {

  const result = profileSchema.safeParse(profileForm);

  if (!result.success) {
    const msg = result.error.issues.map((e) => e.message).join(", ");

    return sileo.error({
      title: "Validation Error",
      description: msg,
    });
  }

  setProfileLoading(true);

  try {
    await updateProfile(profileForm);
    sileo.success({ title: "Changes saved" });
    onClose();
  } catch (err: any) {
    const msg =
      err?.response?.data?.errors?.join(", ") ||
      err?.response?.data?.message ||
      err?.message ||
      "Something went wrong";

    sileo.error({
      title: "Error",
      description: msg,
    });
  } finally {
    setProfileLoading(false);
  }
};
// ================= Handle Email Changes =================
  const handleEmailChange = async () => {
      if (emailLoading) return;

      const result = emailSchema.safeParse({
        email,
        password: emailPassword,
      });

      if (!result.success) {
        const msg = result.error.issues.map((e) => e.message).join(", ");

        return sileo.error({
          title: "Validation Error",
          description: msg,
        });
      }

      if (email === user?.email) {
        return sileo.warning({ title: "No changes in email" });
      }

      setEmailLoading(true);

      try {
        await changeEmail(emailPassword, email);
        sileo.success({ title: "Email updated. Please login again." });
      } catch (err: any) {
        sileo.error({
          title: "Something went wrong",
          description: err?.response?.data?.message,
        });
      } finally {
        setEmailLoading(false);
      }
    };

// ================= Handle Password Change =================
  const handlePasswordChange = async () => {
      if (passwordLoading) return;

      const result = passwordSchema.safeParse({
        currentPassword,
        newPassword,
      });

      if (!result.success) {
        const msg = result.error.issues.map((e) => e.message).join(", ");

        return sileo.warning({
          title: "Validation Error",
          description: msg,
        });
      }

      setPasswordLoading(true);

      try {
        await changePassword(currentPassword, newPassword);
        sileo.success({ title: "Password updated. Please login again." });
      } catch (err: any) {
        sileo.error({
          title: "Something went wrong",
          description: err?.response?.data?.message,
        });
      } finally {
        setPasswordLoading(false);
      }
    };

  return (
    <>
    
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-2">
      {/* Modal Container */}
      <div className="bg-gray-900 w-full max-w-lg h-[85vh] rounded-2xl shadow-xl flex flex-col overflow-hidden">

        {/*  Sticky Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold">Account Settings</h2>
          <button
            onClick={onClose}
            className="p-1 rounded bg-gray-700 cursor-pointer hover:bg-gray-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* ================= PROFILE SECTION ================= */}
          <div className="bg-gray-800/60 rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-400">
              Profile Information
            </h3>

            <div className="grid grid-cols-2 gap-3">  
              <Input
                name="firstName"
                value={profileForm.firstName}
                onChange={handleProfileChange}
                placeholder="First Name"
              />
              <Input
                name="middleName"
                value={profileForm.middleName}
                onChange={handleProfileChange}
                placeholder="Middle Name"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                name="lastName"
                value={profileForm.lastName}
                onChange={handleProfileChange}
                placeholder="Last Name"
              />
              <Input
                name="phoneNumber"
                value={profileForm.phoneNumber}
                onChange={handleProfileChange}
                placeholder="Phone Number"
              />
            </div>

            <Button
              onClick={handleProfileSave}
              disabled={profileLoading}
              className="w-full mt-2"
            >
              {profileLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          {/* ================= EMAIL SECTION ================= */}
          <div className="bg-gray-800/60 rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-400">
              Change Email
            </h3>

            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="New Email"
            />
            <div className="relative">
            <Input
              type={showCurrentPasswordEmail ? "text" : "password"}
              value={emailPassword}
              onChange={(e) => setEmailPassword(e.target.value)}
              placeholder="Current Password"
            />
            <button
                type="button"
                onClick={() => setShowCurrentPasswordEmail(!showCurrentPasswordEmail)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {showCurrentPasswordEmail ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button
              onClick={handleEmailChange}
              disabled={emailLoading}
              className="w-full"
            >
              {emailLoading ? "Updating..." : "Update Email"}
            </Button>
          </div>

          {/* ================= PASSWORD SECTION ================= */}
          <div className="bg-gray-800/60 rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-400">
              Change Password
            </h3>

            <div className="relative">
              <Input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current Password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button
              onClick={handlePasswordChange}
              disabled={passwordLoading}
              className="w-full"
            >
              {passwordLoading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="border-t border-gray-800 p-4">
          <Button
            onClick={onClose}
            className="w-full bg-gray-700 hover:bg-gray-600"
          >
            Close
          </Button>
        </div>
      </div>

      {/* Feedback Modal */}
      {modalMessage && (
        <Modal
          message={modalMessage}
          onClose={() => setModalMessage(null)}
        />
      )}
    </div>
    </>
  );
};

export default EditProfileModal;