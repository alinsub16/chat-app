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

        {linkPreview && (
          <a
            href={linkPreview.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block border rounded-lg overflow-hidden"
          >
            <div className="flex items-center p-2 gap-2 bg-gray-900">
              <img
                src={`https://www.google.com/s2/favicons?domain=${new URL(linkPreview.url).hostname}`}
                alt="favicon"
                className="w-5 h-5"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{linkPreview.title}</span>
                <span className="text-xs text-gray-400 truncate">{linkPreview.url}</span>
              </div>
            </div>
          </a>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
