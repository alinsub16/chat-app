  import React, { useState, useRef, useEffect,useLayoutEffect } from "react";
  import ChatMessage from "@features/chat/components/ChatMessage";
  import { useMessages } from "@features/chat/hooks/useMessage";
  import { UIMessage } from "@/features/chat/types/messageTypes";
  import { useProfile } from "@/features/userProfile/hooks/useProfile";
  import { useConversation } from "@/features/chat/hooks/useConversation";
  import { Input } from "@/components/ui/Input";
  import { Button } from "@/components/ui/Button";
  import ProfileHeader from "@/features/chat/layout/ProfileHeader";
  import { Paperclip, X } from "lucide-react";
  import MessageSkeleton from "@/features/chat/components/MessageSkeleton";
  import ChatFilesView from "@/features/chat/components/ChatFilesView";
  import ImageViewer from "@/features/chat/components/ImageViewer";
  import EmptyChatState from "@/features/chat/components/EmptyChatState";


  const Chat: React.FC = () => {
    const [input, setInput] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);
    const [activeTab, setActiveTab] = useState("chat");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const { messages, typingUsers, sendNewMessage, activeChatId, deleteMessage, updateMessage, reactToMessage, emitTypingEvent, } = useMessages();

    const { conversations } = useConversation();
    const { user } = useProfile();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeout = useRef<NodeJS.Timeout | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // -------------------------
    // Scroll to bottom
    // -------------------------
    useLayoutEffect(() => {
    if (activeTab !== "chat") return;

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeChatId, activeTab]);

    // -------------------------
    // Active conversation info
    // -------------------------
    const activeConversation = conversations.find( (convo) => convo._id === activeChatId );

    const otherParticipant = activeConversation?.participants?.find(
      (p) => String(p._id) !== String(user?._id)
    );

    const headerName = otherParticipant ? `${otherParticipant.firstName} ${otherParticipant.lastName}` : "Unknown User";
    const profilePicture = otherParticipant?.profilePicture ?? "/avatar.jpg";

    // -------------------------
    // File select
    // -------------------------
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      setFiles(Array.from(e.target.files));
    };

    const removeFile = (index: number) => {
      setFiles((prev) => prev.filter((_, i) => i !== index));
    };

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
      if ((!input.trim() && files.length === 0) || !user || !activeChatId) return;

      if (editingMessageId) {
        updateMessage(editingMessageId, input);
        setEditingMessageId(null);
        setInput("");
        return;
      }

      try {
        setIsSending(true);
        const currentInput = input;
        const currentFiles = files;

        setInput("");
        setFiles([]);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        await sendNewMessage({
          sender: user,
          conversationId: activeChatId,
          content: input,
          messageType: files.length > 0 ? "file" : "text",
          files,
        });

      } finally {
        setIsSending(false);
      }
    };

    // -------------------------
    // Input handlers
    // -------------------------
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") handleSubmit();
      if (e.key === "Escape" && editingMessageId) cancelEditing();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInput(value);

      if (!activeChatId || !user) return;

      emitTypingEvent(value.length > 0);

      if (typingTimeout.current) clearTimeout(typingTimeout.current);

      typingTimeout.current = setTimeout(() => {
        emitTypingEvent(false);
      }, 1500);
    };

    // -------------------------
    // Messages filter
    // -------------------------
    const messagesForActiveChat = messages.filter(
      (msg) => msg.conversationId === activeChatId
    );
    if (!activeChatId) {
  return (
    <div className="flex flex-1 bg-gray-900">
      <EmptyChatState />
    </div>
  );
}

    return (
      <div className="flex flex-col flex-1 bg-gray-900 overflow-hidden">
        <ProfileHeader
          name={headerName}
          avatarUrl={profilePicture}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="flex flex-col flex-1 overflow-hidden px-40">
          {/* Messages */}
          {activeTab === "chat" ? (
            <div className="flex-1 overflow-y-auto p-6 space-y-4 chat-scroll">
              {messagesForActiveChat.map((msg) => {
                const isOwnMessage = msg.sender?._id === user?._id;

                const name = !isOwnMessage
                  ? `${msg.sender.firstName} ${msg.sender.lastName}`
                  : "";

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
                    attachments={msg.attachments}
                    reactions={msg.reactions}
                    onImageClick={(url) => setSelectedImage(url)}
                    onReact={(emoji) => reactToMessage(msg._id, emoji)}
                    onDeleteClick={() => deleteMessage(msg._id!)}
                    onEditClick={() => startEditing(msg)}
                  />
                );
              })}

              {isSending && <MessageSkeleton />}
              {selectedImage && (
                <ImageViewer
                  imageUrl={selectedImage}
                  onClose={() => setSelectedImage(null)}
                />
              )}

              <div ref={messagesEndRef} />
            </div>
          ) : (
            <ChatFilesView messages={messagesForActiveChat} />
          )}
          {activeTab === "chat" && (
          <>
          {/* Typing indicator */}
          <div className="text-xs text-gray-400 h-5 px-2">
            {Object.entries(typingUsers)
              .filter(([userId, isTyping]) => isTyping && userId !== user?._id)
              .map(([userId]) => {
                const typingUser = activeConversation?.participants.find(
                  (p) => String(p._id) === String(userId)
                );

                return typingUser ? (
                  <div key={userId}>{typingUser.firstName} is typing...</div>
                ) : null;
              })}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-700 p-4 flex flex-col gap-2 bg-gray-900">

            {/* Selected Files Preview */}
            {files.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="text-xs bg-gray-800 px-2 py-1 rounded flex items-center gap-2"
                  >
                    {file.name}
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-400"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input Row */}
            <div className="flex gap-2 items-center">

              {/* File Upload */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Attach Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
            >
              <Paperclip size={18} className="text-gray-300" />
            </button>

              <Input
                type="text"
                variant="type_input"
                placeholder={
                  editingMessageId
                    ? "Edit your message..."
                    : "Type a message..."
                }
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
              />

              {editingMessageId && (
                <button
                  onClick={cancelEditing}
                  className="text-xs text-gray-400 hover:text-gray-200"
                >
                  Cancel
                </button>
              )}

              <Button
                text={editingMessageId ? "Save" : "Send"}
                className="bg-[#1553ea] px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                onClick={handleSubmit}
              />
            </div>
          </div>
          </>
          )}
        </div>
      </div>
    );
  };

  export default Chat;