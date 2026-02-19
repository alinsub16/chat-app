// @refresh reset
import React, { createContext, useEffect, useState, useCallback } from "react";
import {
  createConversation,
  getConversations,
  deleteConversation,
} from "@/features/chat/api/conversationApi";
import { Conversation, CreateConversationData, } from "@/features/chat/types/conversationTypes";
import { useAuth } from "@features/auth/hooks/useAuth";
import { useSocket } from "@/features/chat/context/SocketContext";

export interface ConversationContextProps {
  conversations: Conversation[];
  loading: boolean;
  createNewConversation: (data: CreateConversationData) => Promise<void>;
  removeConversation: (id: string) => Promise<void>;
  refreshConversations: () => Promise<void>;
  markConversationAsRead: (id: string) => void;
}

export const ConversationContext = createContext<
  ConversationContextProps | undefined
>(undefined);

export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const { socket, setupMessageHandlers, joinChat } = useSocket();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  /** -------------------------------
   *  Fetch conversations from REST API
   * ------------------------------- */
  const refreshConversations = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getConversations();
      const allConversations = data.chats || [];
      setConversations(allConversations);
      setHasFetched(true);
    } catch (error) {
      console.error("Failed to refresh conversations:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  /** -------------------------------
   *  Create new conversation
   * ------------------------------- */
  const createNewConversation = async (data: CreateConversationData) => {
    try {
      const newConv = await createConversation(data);
      setConversations((prev) => [newConv, ...prev]);

      if (socket?.connected) {
        socket.emit("conversation:create", newConv);
        joinChat(newConv._id); // auto join room for real-time messages
      }
    } catch (error) {
      console.error("Failed to create conversation:", error);
      throw error;
    }
  };

  /** -------------------------------
   *  Delete conversation
   * ------------------------------- */
  const removeConversation = async (id: string) => {
    try {
      await deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c._id !== id));

      if (socket?.connected) {
        socket.emit("conversation:delete", id);
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      throw error;
    }
  };

  /** -------------------------------
   *  Mark conversation as read
   * ------------------------------- */
  const markConversationAsRead = (id: string) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv._id === id ? { ...conv, unreadCount: 0 } : conv
      )
    );
  };

  /** -------------------------------
   *  Setup socket listeners
   * ------------------------------- */
  useEffect(() => {
    if (!user || !socket) return;

    // Connect user to socket
    socket.emit("user:connected", user._id);

    // Fetch initial conversations if not fetched
    if (!hasFetched) refreshConversations();

    // Setup all socket event handlers
    const cleanup = setupMessageHandlers(
      // 1. receiveMessage
      (message) => {
        const convId = message.conversationId?._id || message.chat?._id;
        if (!convId) return;

        setConversations((prev) => {
          const existing = [...prev];
          const index = existing.findIndex((c) => c._id === convId);
          if (index !== -1) {
            const target = existing.splice(index, 1)[0];
            const unread = target.unreadCount ? target.unreadCount + 1 : 1;
            existing.unshift({
              ...target,
              latestMessage: message.content,
              updatedAt: new Date().toISOString(),
              unreadCount: unread,
            });
          }
          return existing;
        });
      },
      // 2. messageSent
      (message) => {
        const convId = message.conversationId?._id || message.chat?._id;
        if (!convId) return;

        setConversations((prev) => {
          const existing = [...prev];
          const index = existing.findIndex((c) => c._id === convId);
          if (index !== -1) {
            const target = existing.splice(index, 1)[0];
            existing.unshift({
              ...target,
              latestMessage: message.content,
              updatedAt: new Date().toISOString(),
            });
          }
          return existing;
        });
      },
      // 3. typing
      (typing) => {
        console.log("⌨️ Typing event:", typing);
      },
      // 4. error
      (error) => {
        console.error("Socket error:", error);
      },
      // 5. messageUpdated
      (updatedMessage) => {
        const convId = updatedMessage.conversationId?._id || updatedMessage.chat?._id;
        if (!convId) return;
        setConversations((prev) =>
          prev.map((c) =>
            c._id === convId
              ? { ...c, latestMessage: updatedMessage.content }
              : c
          )
        );
      },
      // 6. messageDeleted
      (deletedMessage) => {
        const convId = deletedMessage.conversationId?._id || deletedMessage.chat?._id;
        if (!convId) return;
        setConversations((prev) => {
          const existing = [...prev];
          const index = existing.findIndex((c) => c._id === convId);
          if (index !== -1) {
            const target = existing.splice(index, 1)[0];
            existing.unshift({
              ...target,
              latestMessage: "[Deleted]",
              updatedAt: new Date().toISOString(),
            });
          }
          return existing;
        });
      },
      // 7. conversation:created
      (newConv) => {
        setConversations((prev) => {
          if (prev.some((c) => c._id === newConv._id)) return prev;
          return [newConv, ...prev];
        });
        joinChat(newConv._id); // auto join new conversation
      },
      // 8. conversation:deleted
      (convId) => {
        setConversations((prev) => prev.filter((c) => c._id !== convId));
      }
    );

    return () => {
      cleanup();
      socket.emit("user:disconnected", user._id);
    };
  }, [user, socket, hasFetched, setupMessageHandlers, refreshConversations, joinChat]);

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        loading,
        createNewConversation,
        removeConversation,
        refreshConversations,
        markConversationAsRead,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};
