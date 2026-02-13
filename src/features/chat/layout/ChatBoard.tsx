import React, { useState, useRef, useEffect } from "react"; 
import ChatMessage from "@features/chat/components/ChatMessage";
import { useMessages } from "@features/chat/hooks/useMessage";
import { SendMessageData, UIMessage } from "@/features/chat/types/messageTypes";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useConversation } from "@/features/chat/hooks/useConversation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import ProfileHeader from "@/features/chat/layout/ProfileHeader";

const Chat: React.FC = () => {
  const [input, setInput] = useState("");
  const { messages, sendNewMessage, activeChatId } = useMessages();
  const { conversations }  = useConversation();
  const { user } = useAuth();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // AUTO SCROLL TO BOTTOM WHEN MESSAGES CHANGE
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ACTIVE CONVERSATION
  const activeConversation = conversations.find(
    (convo) => convo._id === activeChatId
  );
  const otherParticipant = activeConversation?.participants?.find(
    (p) => String(p._id) !== String(user?._id)
  );
  const headerName = otherParticipant
    ? `${otherParticipant.firstName} ${otherParticipant.lastName}`
    : "Unknown User";
  const profilePicture = otherParticipant?.profilePicture ?? "/avatar.jpg";
  // END OF ACTIVE CONVERSATION

  // SEND MESSAGE
  const sendMessage = async () => {
    if (!input.trim() || !user) return;

    const payload: SendMessageData = {
      conversationId: activeChatId,
      content: input,
      messageType: "text",
      attachments: [],
    };

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
      status: "sending",
    };

    sendNewMessage(payload, tempMsg);
    setInput("");
  };
  // END OF SEND MESSAGE

  // INPUT HANDLER
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };
  // END OF INPUT HANDLER

  return (
    <div className="flex flex-col flex-1 bg-gray-900 overflow-hidden">
      {/* Header */}
      <ProfileHeader
        name={headerName}
        avatarUrl={profilePicture}
        onTabChange={() => {}}
      />

      {/* Body */}
      <div className="flex flex-col flex-1 overflow-hidden px-40">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 chat-scroll">
          {messages.map((msg) => {
            const name =
              msg.sender._id !== user?._id
                ? `${msg.sender.firstName} ${msg.sender.lastName}`
                : "";
            return (
              <ChatMessage
                key={msg._id}
                name={name}
                message={msg.content}
                sender={msg.sender._id === user?._id ? "user" : "other"}
                timestamp={new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                onDeleteClick={()=> {console.log("Delete", msg._id)}}
                onEditClick={()=> {}}
              />
            );
          })}

          {/* Dummy div for auto-scroll */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-700 p-4 flex gap-2 bg-gray-900">
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
  );
};

export default Chat;
