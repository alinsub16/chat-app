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
  activeConversation: Conversation | null;
  setActiveConversation: (conv: Conversation) => void;
  loading: boolean;
  createNewConversation: (data: CreateConversationData) => Promise<Conversation>;
  removeConversation: (id: string) => Promise<void>;
  refreshConversations: () => Promise<void>;
  markConversationAsRead: (id: string) => void;
  handleExternalMessageUpdate: (message: any, isUnread?: boolean) => void;
}

export const ConversationContext = createContext<ConversationContextProps | undefined>(undefined);

export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { socket, setupMessageHandlers, joinChat } = useSocket();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
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
              updatedAt: new Date().toISOString(),
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
    return newConv; // 🔥 Return the conversation so caller can use it
  };

  const removeConversation = async (id: string) => {
    await deleteConversation(id);
    setConversations(prev => prev.filter(c => c._id !== id));
    if (socket?.connected) socket.emit("conversation:delete", id);
    if (activeConversation?._id === id) setActiveConversation(null);
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
        // receiveMessage ONLY
        (msg) => {
          if (!msg?.conversationId || !msg?.sender) return;

          mergeMessageIntoConversations(
            msg,
            msg.sender?._id !== user._id
          );
        },

        () => {}, // messageSent
        () => {}, // typing
        (err) => console.error(err),
        () => {}, // messageUpdated
        () => {}, // messageDeleted
        () => {}, // reaction (IGNORE)
        () => {}, // conversationCreated
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
        activeConversation,
        setActiveConversation,
        loading,
        createNewConversation,
        removeConversation,
        refreshConversations,
        markConversationAsRead,
        handleExternalMessageUpdate: mergeMessageIntoConversations,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};