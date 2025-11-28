import React from "react";

interface LinkPreview {
  title: string;
  url: string;
  description?: string;
}

interface ChatMessageProps {
  message: string;
  sender: "user" | "other";
  timestamp?: string;
  linkPreview?: LinkPreview;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, sender, timestamp, linkPreview }) => {
  return (
    <div className={`flex ${sender === "user" ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-xs p-3 rounded-lg break-words
        ${sender === "user" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-200"}`}>
        
        {timestamp && <div className="text-xs text-gray-400 mb-1">{timestamp}</div>}
        <div>{message}</div>
      </div>
    </div>
  );
};

export default ChatMessage;
