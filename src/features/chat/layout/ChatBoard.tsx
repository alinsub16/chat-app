import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "@features/chat/components/ChatMessage";
import { useMessages } from "@features/chat/hooks/useMessage";
import { SendMessageData, UIMessage } from "@/features/chat/types/messageTypes";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useConversation } from "@/features/chat/hooks/useConversation";
import { useSocket } from "@/features/chat/hooks/useSocket";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import ProfileHeader from "@/features/chat/layout/ProfileHeader";

const Chat: React.FC = () => {
  const [input, setInput] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  const { messages, typingUsers, sendNewMessage, activeChatId, deleteMessage, updateMessage } =
    useMessages();
  const { conversations } = useConversation();
  const { user } = useAuth();
  const { emitTyping } = useSocket();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // -------------------------
  // Scroll to bottom on new messages
  // -------------------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeChatId]);

  // -------------------------
  // Active conversation info
  // -------------------------
  const activeConversation = conversations.find((convo) => convo._id === activeChatId);

  const otherParticipant = activeConversation?.participants?.find(
    (p) => String(p._id) !== String(user?._id)
  );

  const headerName = otherParticipant
    ? `${otherParticipant.firstName} ${otherParticipant.lastName}`
    : "Unknown User";

  const profilePicture = otherParticipant?.profilePicture ?? "/avatar.jpg";

  // -------------------------
  // Message edit
  // -------------------------
  const startEditing = (msg: UIMessage) => {
    if (!msg._id) return;
    setEditingMessageId(msg._id);
    setInput(msg.content);
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setInput("");
  };

  // -------------------------
  // Send or save message
  // -------------------------
  const handleSubmit = async () => {
    if (!input.trim() || !user || !activeChatId) return;

    if (editingMessageId) {
      await updateMessage(editingMessageId, { content: input });
      setEditingMessageId(null);
      setInput("");
      return;
    }

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

  // -------------------------
  // Input handlers
  // -------------------------
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape" && editingMessageId) cancelEditing();
  };

  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (!activeChatId || !user) return;

    emitTyping(activeChatId, value.length > 0);

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      emitTyping(activeChatId, false);
    }, 1500);
  };

  // -------------------------
  // Filter messages for active conversation
  // -------------------------
  const messagesForActiveChat = messages.filter((msg) => msg.conversationId === activeChatId);

  return (
    <div className="flex flex-col flex-1 bg-gray-900 overflow-hidden">
      {/* Header */}
      <ProfileHeader name={headerName} avatarUrl={profilePicture} onTabChange={() => {}} />

      {/* Body */}
      <div className="flex flex-col flex-1 overflow-hidden px-40">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 chat-scroll">
          {messagesForActiveChat.map((msg) => {
            const isOwnMessage = msg.sender._id === user?._id;
            const name = !isOwnMessage ? `${msg.sender.firstName} ${msg.sender.lastName}` : "";

            return (
              <ChatMessage
                key={msg._id}
                name={name}
                message={msg.content}
                sender={isOwnMessage ? "user" : "other"}
                timestamp={new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                onDeleteClick={() => deleteMessage(msg._id!)}
                onEditClick={() => startEditing(msg)}
              />
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Typing indicator */}
        <div className="text-xs text-gray-400 h-5 px-2">
          {Object.entries(typingUsers)
            .filter(([userId, isTyping]) => isTyping && userId !== user?._id)
            .map(([userId]) => {
              const typingUser = activeConversation?.participants.find(
                (p) => String(p._id) === String(userId)
              );
              return typingUser ? `${typingUser.firstName} is typing...` : null;
            })}
        </div>

        {/* Input */}
        <div className="border-t border-gray-700 p-4 flex gap-2 bg-gray-900 items-center">
          {editingMessageId && (
            <span className="text-xs text-gray-400 mr-2">Editing message</span>
          )}

          <Input
            type="text"
            variant="type_input"
            placeholder={editingMessageId ? "Edit your message..." : "Type a message..."}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
          />

          {editingMessageId && (
            <button
              onClick={cancelEditing}
              className="text-xs text-gray-400 hover:text-gray-200 transition"
            >
              Cancel
            </button>
          )}

          <Button
            text={editingMessageId ? "Save" : "Send"}
            className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;