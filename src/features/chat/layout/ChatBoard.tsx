import React, { useState, useEffect } from "react";
import ChatMessage from "@features/chat/components/ChatMessage";
import { useConversation } from "@/features/chat/hooks/useConversation";
import { useMessages } from "@features/chat/hooks/useMessage";
import { SendMessageData } from "@/features/chat/types/messageTypes";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";



interface Message {
  _id?: string;
  message: string;
  sender: "user" | "other";
  timestamp?: string;
}

const Chat: React.FC = () => {
  const [input, setInput] = useState("");
  const {messages, sendNewMessage, activeChatId} = useMessages(); // assuming your hook returns addMessage
  const {user} = useAuth();

  const sendMessage = () => {
  if (!input.trim()) return;

  const payload: SendMessageData  = {
    conversationId: activeChatId,  // IMPORTANT: must come from context or props
    content: input,
    messageType: "text",
    attachments: []
  };
  console.log(payload)

  sendNewMessage(payload);
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
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          />
          <Button
           text="Send"
           className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 transition"
           onClick={sendMessage}
           />
        </div>
        </div>  
      </div>
    </div>
  );
};

export default Chat;
