import React, { useState, useCallback, useMemo } from "react";

export type ProfileTab = {
  label: string;
  value: string;
};

type ProfileHeaderProps = {
  name: string;
  avatarUrl: string;
  tabs?: ProfileTab[];
  defaultTab?: string;
  activeTab?: string; // controlled mode
  onTabChange?: (tab: string) => void;
};

const DEFAULT_TABS: ProfileTab[] = [
  { label: "Chat", value: "chat" },
  { label: "Files", value: "files" },
];

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  avatarUrl,
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onTabChange,
}) => {
  const resolvedTabs = useMemo(() => tabs ?? DEFAULT_TABS, [tabs]);

  // uncontrolled fallback
  const [internalTab, setInternalTab] = useState(
    defaultTab ?? resolvedTabs[0]?.value
  );

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

  return (
    <div className="flex items-center gap-6 bg-neutral-800 px-6 py-3 text-white">
      {/* Profile */}
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={avatarUrl}
          alt={name}
          className="h-10 w-10 rounded-full object-cover"
          loading="lazy"
        />
        <span className="text-base font-semibold truncate">{name}</span>
      </div>

      {/* Tabs */}
      <div className="ml-6 flex gap-6">
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