// @refresh reset
import React, { createContext, useEffect, useState } from "react";
import {
  createConversation,
  getConversations,
  deleteConversation,
} from "@/features/chat/api/conversationApi";
import {
  Conversation,
  CreateConversationData,
} from "@/features/chat/types/conversationTypes";
import { useAuth } from "@features/auth/hooks/useAuth";
import { getSocket, disconnectSocket } from "@/lib/socket";

export interface ConversationContextProps {
  conversations: Conversation[];
  loading: boolean;
  createNewConversation: (data: CreateConversationData) => Promise<void>;
  removeConversation: (id: string) => Promise<void>;
  refreshConversations: () => Promise<void>;
  markConversationAsRead: (id: string) => void;
}

export const ConversationContext = createContext< ConversationContextProps | undefined >(undefined);
export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  //  Fetch via REST API (initial load)
  const refreshConversations = async () => {
  if (!user) return;
  setLoading(true);
  try {
    const data = await getConversations();

    console.groupCollapsed("🪲 [Conversation Debug] refreshConversations");
    console.log("User ID:", user?._id);
    console.log("Raw response from getConversations():", data);
    console.groupEnd();

    //  Extract the arrays from the response
    const allConversations = data.chats || [];

    console.log(" Combined conversations count:", allConversations.length);

    //  Safely update state
    setConversations(allConversations);

    setHasFetched(true);
  } catch (error) {
    console.error("Failed to load conversations:", error);
  } finally {
    setLoading(false);
  }
};

  //  Create new conversation (REST + Socket)
  const createNewConversation = async (data: CreateConversationData) => {
    try {
      const newConv = await createConversation(data);
      setConversations((prev) => [newConv, ...prev]);

      const socket = getSocket();
      socket.emit("conversation:create", newConv);
    } catch (error) {
      console.error("Failed to create conversation:", error);
      throw error;
    }
  };

  //  Delete conversation (REST + Socket)
  const removeConversation = async (id: string) => {
    try {
      await deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c._id !== id));

      const socket = getSocket();
      socket.emit("conversation:delete", id);
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      throw error;
    }
  };

  //  Mark as read (UI-only)
  const markConversationAsRead = (id: string) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv._id === id ? { ...conv, unreadCount: 0 } : conv
      )
    );
  };

  // Socket setup + listeners
  useEffect(() => {
    if (!user) return;

    const socket = getSocket();
    socket.emit("user:connected", user._id);

    // --- 1. Fetch conversations after connecting ---
    if (!hasFetched) {
      refreshConversations();
    }

    // --- 2. Listen for real-time conversation events ---
    socket.on("conversation:created", (newConv) => {
      setConversations((prev) => {
        if (prev.some((c) => c._id === newConv._id)) return prev;
        return [newConv, ...prev];
      });
    });

    socket.on("conversation:deleted", (convId) => {
      setConversations((prev) => prev.filter((c) => c._id !== convId));
    });

    // --- 3. Listen for messages ---
    socket.on("receiveMessage", (message) => {
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
    });

    // --- 4. Sent messages (self) ---
    socket.on("messageSent", (message) => {
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
    });

    // --- 5. Cleanup ---
    return () => {
      socket.off("conversation:created");
      socket.off("conversation:deleted");
      socket.off("receiveMessage");
      socket.off("messageSent");
      socket.emit("user:disconnected", user._id);
      disconnectSocket();
    };
  }, [user, hasFetched]);

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
