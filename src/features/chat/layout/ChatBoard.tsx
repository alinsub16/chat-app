import React, { useState } from "react";
import ChatMessage from "@features/chat/components/ChatMessage";

interface Message {
  message: string;
  sender: "user" | "other";
  timestamp?: string;
  linkPreview?: {
    title: string;
    url: string;
  };
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      message: input,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Check if input is a URL and create a link preview
    const urlRegex = /(https?:\/\/[^\s]+)/;
    if (urlRegex.test(input)) {
      newMessage.linkPreview = {
        title: input,
        url: input,
      };
    }

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="w-full bg-gray-900">
      <div className="messages-wrapper">
        <div className="min-h-screen flex flex-col p-6">
          
            <div className="flex-1 overflow-y-auto mb-4">
              {messages.map((msg, idx) => (
                <ChatMessage key={idx} {...msg} />
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 p-2 rounded-lg bg-gray-800 text-white focus:outline-none"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <button
                onClick={sendMessage}
                className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 transition" 
              >
                Send
              </button>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Chat;
