import { MoreVertical } from "lucide-react";
import { useState } from "react";
import {ChatListItemProps} from "@features/chat/types/conversationTypes";


const ChatListItem: React.FC<ChatListItemProps> = ({ avatar, alt, initialName, name, message, time, unread = false, onClick, onDeleteClick, onMenuToggle, }) => {
  const [open, setOpen] = useState(false);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !open;
    setOpen(next);
    onMenuToggle?.(next);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(false);
    onMenuToggle?.(false);
    onDeleteClick?.();
  };

  return (
    <div
      className="flex items-center justify-between px-3 py-2 hover:bg-gray-800 transition cursor-pointer rounded-lg"
      onClick={onClick}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        {avatar ? (
          <img
            src={avatar}
            alt={alt ?? name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-lg">
            {initialName}
          </div>
        )}

        <div className="flex flex-col">
          <span className="text-white font-medium">{name}</span>
          <span className="text-gray-400 text-sm truncate w-[160px]">
            {message}
          </span>
        </div>
      </div>

      {/* Right */}
      <div className="relative flex flex-col items-end gap-1">
        <span className="text-gray-400 text-xs">{time}</span>

        {unread && <span className="w-2 h-2 bg-blue-500 rounded-full" />}

        <button
          onClick={toggleMenu}
          className="p-1 rounded hover:bg-gray-700 text-gray-400"
        >
          <MoreVertical size={16} />
        </button>

        {open && (
          <div className="absolute right-0 top-8 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-20">
            <button
              onClick={handleDelete}
              className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatListItem;