import React from 'react';
import { MoreVertical, Eye, Trash2 } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { ChatListItemProps } from "@features/chat/types/conversationTypes";

const ChatListItem: React.FC<ChatListItemProps> = ({
  avatar,
  alt,
  name,
  message,
  time,
  unread = false,
  isOpen,
  isActive,
  isOnline,
  onClick,
  onDeleteClick,
  onViewProfile,
  onMenuToggle,
}) => {
  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMenuToggle?.(!isOpen);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMenuToggle?.(false);
    onDeleteClick?.();
  };

  const handleViewProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMenuToggle?.(false);
    onViewProfile?.();
  };

  return (
    <div
      onClick={onClick}
      className={`
        flex items-center justify-between my-1 px-3 py-2 cursor-pointer rounded-lg relative
        transition-all duration-150
        border border-[#1e2d45]/70
        ${isActive
          ? 'bg-[#1a2235] border-l-2 border-l-[#1553ea] border-r border-r-gray-700/60 '
          : 'hover:bg-gray-800/60 hover:bg-[#141d2b]/80 hover:shadow-sm'
        }
      `}
    >
      {/* LEFT */}
      <div className="flex items-center gap-3">

        {/* Avatar + Status */}
        <div className="relative">
          <Avatar avatar={avatar || null} name={name} className="w-10 h-10" />
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900
              ${isOnline ? 'bg-green-500' : 'bg-gray-500'}
            `}
          />
        </div>

        {/* Name + Message */}
        <div className="flex flex-col">
          <span className={`font-medium text-sm ${isActive ? 'text-white' : 'text-gray-200'}`}>
            {name}
          </span>
          <span className={`text-xs truncate max-w-[160px] ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
            {message}
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col items-end gap-1 relative">
        <span className={`text-xs ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
          {time}
        </span>

        {/* Unread dot */}
        {unread && (
          <span className="w-2 h-2 bg-blue-500 rounded-full ring-2 ring-blue-500/20" />
        )}

        {/* Menu Button */}
        <button
          onClick={toggleMenu}
          className={`p-1 rounded transition ${
            isOpen
              ? 'bg-gray-700 text-white'
              : 'text-gray-500 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <MoreVertical size={16} />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute right-0 top-10 w-44 bg-gray-900 border border-gray-700/80 rounded-lg shadow-2xl z-20 overflow-hidden animate-fadeIn">
            <button
              onClick={handleViewProfile}
              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-800 transition border-b border-gray-700/50"
            >
              <Eye size={14} className="text-blue-400" />
              View Profile
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-gray-800 transition"
            >
              <Trash2 size={14} />
              Delete Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatListItem;