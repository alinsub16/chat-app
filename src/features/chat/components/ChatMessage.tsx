import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";
import { Attachment, Reaction } from "@/features/chat/types/messageTypes";
import Avatar from "@/components/ui/Avatar";

interface LinkPreview {
  title: string;
  url: string;
  description?: string;
}

interface ChatMessageProps {
  name: string;
  avatar: string | null;
  message: string;
  sender: "user" | "other";
  timestamp?: string;
  linkPreview?: LinkPreview;
  attachments?: Attachment[];
  reactions?: Reaction[];
  onReact?: (emoji: string) => void;
  onImageClick?: (imageUrl: string) => void;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
}

const reactionsEmjoi = ["👍", "❤️", "😂", "😮", "😢"]

const ChatMessage: React.FC<ChatMessageProps> = ({
  name,
  avatar,
  message,
  sender,
  timestamp,
  linkPreview,
  attachments = [],
  reactions = [],
  onReact,
  onImageClick,
  onEditClick,
  onDeleteClick,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  const pressTimer = useRef<NodeJS.Timeout | null>(null);

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

  // Long press (mobile)
  const handlePressStart = () => {
    pressTimer.current = setTimeout(() => {
      setShowReactions(true);
    }, 500); // hold 500ms
  };

  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  // Close reactions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowReactions(false);
    };

    if (showReactions) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showReactions]);

  // Group reactions
  const groupedReactions = reactions.reduce<Record<string, number>>(
    (acc, r) => {
      acc[r.emoji] = (acc[r.emoji] || 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <div
      className={`flex ${
        sender === "user" ? "justify-end" : "justify-start"
      } my-2 relative`}
    > 
      {sender === "other" && (
          <Avatar avatar={avatar || null} name={name} className="w-8 h-8 flex-shrink-0 mt-5" />
        )}
      <div className="ml-2"> 
        <span className="text-xs text-gray-400 mb-1 block">{name}</span>
        <div className="max-w-xs relative group w-fit ">
          {/* Timestamp */}
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
                ? "bg-[#1553ea] text-white"
                : "bg-gray-800 text-gray-200"
            }`}
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
          >
            <span className="block text-s">{message}</span>

            {/* Attachments */}
            {attachments.length > 0 && (
              <div className="mt-2 flex flex-col gap-2 w-50">
                {attachments.map((att, index) => {
                  if (att.fileType === "image") {
                    return (
                      <img
                        key={index}
                        src={att.url}
                        alt={att.fileName || "attachment"}
                        className="rounded-md max-w-xs cursor-pointer"
                        onClick={() => onImageClick?.(att.url)}
                      />
                    );
                  } else if (att.fileType === "video") {
                    return (
                      <video
                        key={index}
                        controls
                        className="rounded-md max-w-xs"
                      >
                        <source src={att.url} type="video/mp4" />
                      </video>
                    );
                  } else {
                    return (
                      <a
                        key={index}
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-blue-400"
                      >
                        {att.fileName || "Download file"}
                      </a>
                    );
                  }
                })}
              </div>
            )}

            {/* Link Preview */}
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

            {/* Menu */}
            <div
              className={`absolute top-0 right-1 opacity-0 ${
                sender === "user" ? "group-hover:opacity-100" : ""
              } transition`}
            >
              <button onClick={toggleMenu} className="rounded text-gray-300">
                <MoreHorizontal size={16} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-6 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-20">
                  <button
                    onClick={handleEdit}
                    className={`block w-full text-left px-4 py-2 text-sm text-yellow-400 hover:bg-gray-800 ${
                      sender === "user" ? "" : "hidden"
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className={`block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 ${
                      sender === "user" ? "" : "hidden"
                    }`}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Show Existing Reactions */}
          {Object.keys(groupedReactions).length > 0 && (
            <div
              className={`flex gap-2 mt-1 ${
                sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {Object.entries(groupedReactions).map(([emoji, count]) => (
                <span
                  key={emoji}
                  className="bg-gray-700 text-xs px-2 py-1 rounded-full"
                >
                  {emoji} {count}
                </span>
              ))}
            </div>
          )}

          {/* Reaction Picker */}
          <div
            className={`flex gap-1 mt-1 transition ${
              showReactions
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            } ${sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {reactionsEmjoi.map((emoji) => (
              <button
                key={emoji}
                onClick={() => onReact?.(emoji)}
                className="text-sm hover:scale-110 transition"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;