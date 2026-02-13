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

const ChatMessage: React.FC<ChatMessageProps> = ({ name, message, sender, timestamp, linkPreview, onEditClick, onDeleteClick, }) => {
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
    <div
      className={`flex ${
        sender === "user" ? "justify-end" : "justify-start"
      } my-2 relative`}
    >
      {/* group moved here + w-fit to limit hover area to bubble only */}
      <div className="max-w-xs relative group w-fit">
        {/* Timestamp visible only when hovering the bubble */}
        {timestamp && (
          <span
            className={`absolute text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition ${
              sender === "user" ? "top-4 -left-16" : "top-4 -right-16"
            }`}
          >
            {timestamp}
          </span>
        )}

        {/* Message Bubble */}
        <div
          className={`relative py-3 px-2 rounded-lg w-full ${
            sender === "user"
              ? "bg-purple-600 text-white"
              : "bg-gray-800 text-gray-200"
          }`}
        >
          <span className="block text-s">{message}</span>

          {linkPreview && (
            <div className="mt-2 p-2 border border-gray-700 rounded-lg bg-gray-900">
              <a
                href={linkPreview.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                {linkPreview.title}
              </a>
              {linkPreview.description && (
                <p className="text-gray-400 text-sm">
                  {linkPreview.description}
                </p>
              )}
            </div>
          )}

          {/* Three dots menu */}
          <div className="absolute top-0 right-1 opacity-0 group-hover:opacity-100 transition">
            <button onClick={toggleMenu} className="rounded text-gray-300">
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
