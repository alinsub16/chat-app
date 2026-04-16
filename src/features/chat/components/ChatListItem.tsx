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
      className={`flex items-center justify-between px-3 py-2 transition cursor-pointer rounded-lg relative
        ${
          isActive
            ? "bg-gray-800 text-white border-l-2 border-r-2 border-purple-500"
            : "hover:bg-gray-800 text-gray-300"
        }
      `}
    >
      {/* LEFT */}
      <div className="flex items-center gap-3">
        
        {/* ✅ Avatar + Status */}
        <div className="relative">
          <Avatar avatar={avatar || null} name={name} className="w-10 h-10" />

          {/* ONLINE INDICATOR */}
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-1 border-gray-900
              ${isOnline ? "bg-green-500" : "bg-red-500"}
            `}
          />
        </div>

        <div className="flex flex-col">
          <span
            className={`font-medium ${
              isActive ? "text-white" : "text-gray-200"
            }`}
          >
            {name}
          </span>

          <span
            className={`text-sm truncate max-w-[160px] ${
              isActive ? "text-gray-300" : "text-gray-400"
            }`}
          >
            {message}
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col items-end gap-1 relative">
        <span
          className={`text-xs ${
            isActive ? "text-gray-300" : "text-gray-400"
          }`}
        >
          {time}
        </span>

        {unread && <span className="w-2 h-2 bg-blue-500 rounded-full" />}

        {/* MENU BUTTON */}
        <button
          onClick={toggleMenu}
          className={`p-1 rounded transition ${
            isOpen
              ? "bg-gray-700 text-white"
              : "text-gray-400 hover:bg-gray-700 hover:text-white"
          }`}
        >
          <MoreVertical size={16} />
        </button>

        {/* DROPDOWN */}
        {isOpen && (
          <div className="absolute right-0 top-10 w-44 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-20 overflow-hidden animate-fadeIn">
            
            {/* VIEW PROFILE */}
            <button
              onClick={handleViewProfile}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 transition"
            >
              <Eye size={14} className="text-blue-400" />
              View Profile
            </button>

            {/* DELETE */}
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition"
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