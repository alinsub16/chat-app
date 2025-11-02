import React from "react";

interface ChatListItemProps {
  avatar: string;
  name: string;
  message: string;
  time: string;
  unread?: boolean | string;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  avatar,
  name,
  message,
  time,
  unread = false,
}) => {
  return (
    <div
      className="flex items-center justify-between px-3 py-2 hover:bg-gray-800 transition cursor-pointer rounded-lg"
    >
      {/* Left section: avatar + text */}
      <div className="flex items-center gap-3">
        <img
          src={avatar}
          alt={name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="text-white font-medium">{name}</span>
          <span className="text-gray-400 text-sm truncate w-[160px]">
            {message}
          </span>
        </div>
      </div>

      {/* Right section: time + unread dot */}
      <div className="flex flex-col items-end">
        <span className="text-gray-400 text-xs">{time}</span>
        {unread && <span className="w-2 h-2 bg-blue-500 rounded-full mt-1"></span>}
      </div>
    </div>
  );
};

export default ChatListItem;
