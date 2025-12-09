import React from "react";

interface LinkPreview {
  title: string;
  url: string;
  description?: string;
}

interface ChatMessageProps {
  name:string;
  message: string;
  sender: "user" | "other";
  timestamp?: string;
  linkPreview?: LinkPreview;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ name, message, sender, timestamp, linkPreview }) => {
  return (
    <div className={`flex ${sender === "user" ? "justify-end" : "justify-start"} mb-4`}>
      <div className="max-w-xs " >
        <p className="text-gray-400 text-sm">{name}</p>
        <div className={`p-3 rounded-lg ${sender === "user" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-200"}`}>
        {timestamp && <span className="text-xs text-gray-400 mb-1">{timestamp}</span>}
        <span className="block">{message}</span>
        </div>
        
      </div>
    </div> 
  );
};

export default ChatMessage;
