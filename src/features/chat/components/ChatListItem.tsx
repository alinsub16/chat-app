import { MoreVertical, Eye, Trash2 } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { ChatListItemProps } from "@features/chat/types/conversationTypes";


const ChatListItem: React.FC<ChatListItemProps> = ({  avatar, alt, name, message, time, unread = false, isOpen, onClick, onDeleteClick, onViewProfile, onMenuToggle, }) => {
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
      className="flex items-center justify-between px-3 py-2 hover:bg-gray-800 transition cursor-pointer rounded-lg relative"
    >
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <Avatar avatar={avatar || null} name={name} className="w-10 h-10" />

        <div className="flex flex-col">
          <span className="text-white font-medium">{name}</span>
          <span className="text-gray-400 text-sm truncate max-w-[160px]">
            {message}
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col items-end gap-1 relative">
        <span className="text-gray-400 text-xs">{time}</span>

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