import { useState } from "react";

export type ProfileTab = {
  label: string;
  value: string;
};

type ProfileHeaderProps = {
  name: string;
  avatarUrl: string;
  tabs?: ProfileTab[];
  defaultTab?: string;
  onTabChange?: (tab: string) => void;
};

const ProfileHeader:React.FC<ProfileHeaderProps> = ({ name, avatarUrl, tabs = [ { label: "Chat", value: "chat" }, { label: "Files", value: "files" }, { label: "Photos", value: "photos" }, ], defaultTab, onTabChange, }) => {
  const [activeTab, setActiveTab] = useState( defaultTab ?? tabs[0].value );

  const handleTabChange = (tab: string) => { setActiveTab(tab); onTabChange?.(tab); };

  return (
    <div className="flex items-center gap-6 bg-neutral-800 px-6 py-3 text-white">
      {/* Profile */}
      <div className="flex items-center gap-3">
        <img src={avatarUrl} alt={name} className="h-10 w-10 rounded-full object-cover" />
        <span className="text-base font-semibold whitespace-nowrap"> {name} </span>
      </div>

      {/* Tabs */}
      <div className="ml-6 flex gap-6">
        {tabs.map((tab) => {
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

export default ProfileHeader;
