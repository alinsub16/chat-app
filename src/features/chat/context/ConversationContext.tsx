import React, { createContext, useEffect, useState, useCallback } from "react";
import {
  createConversation,
  getConversations,
  deleteConversation,
} from "@/features/chat/api/conversationApi";
import { Conversation, CreateConversationData } from "@/features/chat/types/conversationTypes";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useSocket } from "@/features/chat/context/SocketContext";

export interface ConversationContextProps {
  conversations: Conversation[];
  loading: boolean;
  createNewConversation: (data: CreateConversationData) => Promise<void>;
  removeConversation: (id: string) => Promise<void>;
  refreshConversations: () => Promise<void>;
  markConversationAsRead: (id: string) => void;

  // 🔥 New: used by MessageProvider
  handleExternalMessageUpdate: (message: any, isUnread?: boolean) => void;
}

export const ConversationContext = createContext<ConversationContextProps | undefined>(undefined);

export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { socket, setupMessageHandlers, joinChat } = useSocket();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  const resolveConversationId = (message: any): string | null => {
    if (!message) return null;
    return (
      message.conversationId?._id ||
      message.conversationId ||
      message.chat?._id ||
      null
    );
  };

  // 🔥 Core move-to-top logic
  const mergeMessageIntoConversations = useCallback(
    (message: any, isUnread: boolean = false) => {
      const convId = resolveConversationId(message);
      if (!convId) return;

      setConversations(prev => {
        const existing = prev.find(c => c._id === convId);

        const updated: Conversation = existing
          ? {
              ...existing,
              latestMessage: message,
              updatedAt: new Date().toISOString(), // force new timestamp
              unreadCount: isUnread
                ? (existing.unreadCount || 0) + 1
                : existing.unreadCount || 0,
            }
          : {
              _id: convId,
              chatName: "Unknown Chat",
              participants: [],
              latestMessage: message,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              unreadCount: isUnread ? 1 : 0,
              conversations: [],
            };

        const filtered = prev.filter(c => c._id !== convId);

        // 🚀 Always force top
        return [updated, ...filtered];
      });
    },
    []
  );

  const refreshConversations = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getConversations();
      const list: Conversation[] = data.chats || [];
      setConversations(list);

      if (socket?.connected) {
        list.forEach(conv => joinChat(conv._id));
      }
    } catch (err) {
      console.error("Failed to refresh conversations:", err);
    } finally {
      setLoading(false);
    }
  }, [user, socket, joinChat]);

  const createNewConversation = async (data: CreateConversationData) => {
    const newConv = await createConversation(data);
    setConversations(prev => [newConv, ...prev]);
    if (socket?.connected) {
      socket.emit("conversation:create", newConv);
      joinChat(newConv._id);
    }
  };

  const removeConversation = async (id: string) => {
    await deleteConversation(id);
    setConversations(prev => prev.filter(c => c._id !== id));
    if (socket?.connected) socket.emit("conversation:delete", id);
  };

  const markConversationAsRead = (id: string) => {
    setConversations(prev =>
      prev.map(c => (c._id === id ? { ...c, unreadCount: 0 } : c))
    );
  };

  useEffect(() => {
    if (!user || !socket) return;

    socket.emit("user:connected", user._id);
    refreshConversations();

    const cleanup = setupMessageHandlers(
      (msg) => mergeMessageIntoConversations(msg, msg.sender?._id !== user._id),
      (msg) => mergeMessageIntoConversations(msg, false),
      () => {},
      (err) => console.error(err),
      (msg) => mergeMessageIntoConversations(msg, false),
      (msg) => mergeMessageIntoConversations(msg, false),
      (conv) => setConversations(prev => [conv, ...prev]),
      (id) => setConversations(prev => prev.filter(c => c._id !== id))
    );

    return () => {
      cleanup();
      socket.emit("user:disconnected", user._id);
    };
  }, [user, socket, refreshConversations, mergeMessageIntoConversations, setupMessageHandlers]);

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        loading,
        createNewConversation,
        removeConversation,
        refreshConversations,
        markConversationAsRead,
        handleExternalMessageUpdate: mergeMessageIntoConversations, // 🔥 exposed
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};