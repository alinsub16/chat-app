import React, { useState, useCallback, useMemo } from "react";
import { useProfile } from "@/features/userProfile/hooks/useProfile";
import Avatar from "@/components/ui/Avatar";
import { useConversation } from "@/features/chat/hooks/useConversation";
import { ChevronLeft } from "lucide-react";

export type ProfileTab = {
  label: string;
  value: string;
};

type ProfileHeaderProps = {
  name: string;
  avatarUrl: string;
  tabs?: ProfileTab[];
  defaultTab?: string;
  activeTab?: string; 
  onTabChange?: (tab: string) => void;
  onBack?: () => void;
};

const DEFAULT_TABS: ProfileTab[] = [
  { label: "Chat", value: "chat" },
  { label: "Files", value: "files" },
];

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onTabChange,
  onBack,
}) => {
  const resolvedTabs = useMemo(() => tabs ?? DEFAULT_TABS, [tabs]);

  // uncontrolled fallback
  const [internalTab, setInternalTab] = useState( defaultTab ?? resolvedTabs[0]?.value );

  const { user } = useProfile();
  const { conversations } = useConversation();

  const isControlled = controlledActiveTab !== undefined;
  const activeTab = isControlled ? controlledActiveTab : internalTab;

  const handleTabChange = useCallback(
    (tab: string) => {
      if (!isControlled) {
        setInternalTab(tab);
      }
      onTabChange?.(tab);
    },
    [isControlled, onTabChange]
  );

  const currentConversation = conversations[0];

  const otherUser = currentConversation?.participants.find((p) => String(p._id) !== String(user?._id));
  const displayName = otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : "Unknown User";
  const avatar = otherUser?.profilePicture || null;

  return (
    <div className="flex items-center gap-4 bg-neutral-800 px-6 py-3 text-white">
      {onBack && (
        <button
          onClick={onBack}
          className="md:hidden mr-2"
        > 
          <ChevronLeft size={22} className="text-gray-300" />
        </button>
      )}
      
      {/* Profile */}
      <div className="flex items-center gap-3 min-w-0">
        <Avatar avatar={avatar} name={displayName} className="w-10 h-10"/>

        <span className="text-base font-semibold truncate">{name}</span>
      </div>

      {/* Tabs */}
      <div className="ml-2 flex gap-6">
        {resolvedTabs.map((tab) => {
          const isActive = activeTab === tab.value;

          return (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`relative pb-2 text-sm font-medium transition-colors
                ${
                  isActive
                    ? "text-white after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-indigo-500"
                    : "text-gray-400 hover:text-white"
                }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      
    </div>
  );
};

export default React.memo(ProfileHeader);