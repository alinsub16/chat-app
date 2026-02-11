import React, { useState } from "react";
import { MoreHorizontal, MoreVertical } from "lucide-react";

interface LinkPreview {
  title: string;
  url: string;
  description?: string;
}

interface ChatMessageProps {
  name: string;
  message: string;
  sender: "user" | "other";
  timestamp?: string;
  linkPreview?: LinkPreview;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  name,
  message,
  sender,
  timestamp,
  linkPreview,
  onEditClick,
  onDeleteClick,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onEditClick?.();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onDeleteClick?.();
  };

  return (
    <div className={`flex ${sender === "user" ? "justify-end" : "justify-start"} mb-4 relative group`}>
      <div className="max-w-xs relative">
        {/* Name */}
        <p className="text-gray-400 text-sm">{name}</p>

        {/* Timestamp above the message, visible on hover */}
        {timestamp && (
          <span className={`absolute text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition ${sender === "user" ? "top-4 -left-16" : "top-4 -right-16"} `}>
            {timestamp}
          </span>
        )}

        {/* Message Bubble with relative positioning for menu */}
        <div className={`relative p-3 rounded-lg ${sender === "user" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-200"}`}>
          <span className="block">{message}</span>

          {linkPreview && (
            <div className="mt-2 p-2 border border-gray-700 rounded-lg bg-gray-900">
              <a href={linkPreview.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                {linkPreview.title}
              </a>
              {linkPreview.description && <p className="text-gray-400 text-sm">{linkPreview.description}</p>}
            </div>
          )}

          {/* Three dots menu inside the bubble */}
          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition">
            <button
              onClick={toggleMenu}
              className="p-1 rounded hover:bg-gray-700 text-gray-300"
            >
              <MoreHorizontal size={16} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-6 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-20">
                <button
                  onClick={handleEdit}
                  className="block w-full text-left px-4 py-2 text-sm text-yellow-400 hover:bg-gray-800"
                >
                  Edit
                </button>
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
      </div>
    </div>
  );
};

export default ChatMessage;
