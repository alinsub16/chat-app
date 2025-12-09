import React, { useState, useEffect } from "react";
import ChatMessage from "@features/chat/components/ChatMessage";
import { useMessages } from "@features/chat/hooks/useMessage";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { console } from "inspector";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { send } from "process";

interface Message {
  _id?: string;
  message: string;
  sender: "user" | "other";
  timestamp?: string;
}

const Chat: React.FC = () => {
  const [input, setInput] = useState("");
  const {messages} = useMessages(); // assuming your hook returns addMessage
  const {user} = useAuth();

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      message: input,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // sendNewMessage(newMessage); // add to hook state
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="w-full bg-gray-900">
      <div className="messages-wrapper ">
      <div className="min-h-screen flex flex-col p-6"> 
      

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg) => {
          const fullName = msg.sender._id !== user?._id ? `${msg.sender.firstName} ${msg.sender.lastName} ` : "";
          
          return (
          <ChatMessage
            key={msg._id}
            name={fullName}
            message={msg.content}
            sender={msg.sender._id === user?._id ? "user" : "other"}
            timestamp={new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", })}
          />
          )
        })}
      </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <Input 
          type="text"
          variant="Send"
          placeholder="Type a message..."
          />
          <Button
           text="Send"
           className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 transition"
           />
        </div>
        </div>  
      </div>
    </div>
  );
};

export default Chat;
