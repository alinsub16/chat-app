import React, { useState } from "react";
import ChatMessage from "@features/chat/components/ChatMessage";
import { useMessages } from "@features/chat/hooks/useMessage";
import { SendMessageData,UIMessage } from "@/features/chat/types/messageTypes";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useConversation } from "@/features/chat/hooks/useConversation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import ProfileHeader from "@/components/ui/ProfileHeader";



const Chat: React.FC = () => {
  const [ input, setInput ] = useState("");
  const { messages, sendNewMessage, activeChatId } = useMessages();
  const { conversations } = useConversation();
  const { user } = useAuth();

  const sendMessage = async () => {
    if (!input.trim() || !user) return;

    const payload: SendMessageData = {
      conversationId: activeChatId,
      content: input,
      messageType: "text",
      attachments: []
    };

    // Optimistic message: shows immediately in UI
    const tempMsg: UIMessage = {
      _id: Date.now().toString(),
      sender: user,
      content: input,
      conversationId: activeChatId,
      messageType: "text",
      attachments: [],
      readBy: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
      status: "sending"
      };
    // Add temporary message to state immediately
    sendNewMessage( payload,tempMsg); 
    console.log('Send message', tempMsg)
    // Clear input
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };
  const handleTabChange = (tab: string) => {
    console.log("Selected tab:", tab);
  };
  const otherUser = messages.find( (msg) => msg.sender._id !== user?._id )?.sender;
  const fullName = otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : "Unknown User";

  console.log('clicked name', otherUser)


  return (
    <div className="w-full">
      <div className="">
          <ProfileHeader
              name={fullName}
              avatarUrl="/avatar.jpg"
              onTabChange={handleTabChange}
            />
      </div>
    
      <div className="w-full bg-gray-900">
        <div className="messages-wrapper">
          <div className="min-h-screen flex flex-col p-6">
            {/* Messages List */}
            <div className="flex-1 overflow-y-auto mb-4">
              {messages.map((msg) => {
                const fullName = msg.sender._id !== user?._id ? `${msg.sender.firstName} ${msg.sender.lastName}` : "";

                return (
                  <ChatMessage
                    key={msg._id}
                    name={fullName}
                    message={msg.content}
                    sender={msg.sender._id === user?._id ? "user" : "other"}
                    timestamp={new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  />
                );
              })}
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
              <Input
                type="text"
                variant="type_input"
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
    </div>
  );
};

export default Chat;
