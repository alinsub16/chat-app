import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  sendMessage,
  getChatMessages,
  deleteChatMessage,
  updateChatMessage,
} from "@/features/chat/api/messageApi";
import { Message, UIMessage, SendMessageData, UpdateMessageData } from "@/features/chat/types/messageTypes";
import { useSocket } from "@/features/chat/hooks/useSocket";
import { ConversationContext } from "@/features/chat/context/ConversationContext";

export interface MessageContextType {
  messages: UIMessage[];
  loading: boolean;
  activeChatId: string;
  typingUsers: Record<string, boolean>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendNewMessage: (payload: SendMessageData, tempMsg?: UIMessage) => Promise<void>;
  updateMessage: (messageId: string, data: UpdateMessageData) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  setActiveChat: (conversationId: string) => void;
  refreshMessages: () => Promise<void>;
}

export const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string>("");
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const { socket, isConnected } = useSocket();
  const conversationContext = useContext(ConversationContext);

  // -------------------------
  // Fetch messages for a conversation
  // -------------------------
  const fetchMessages = useCallback(
    async (conversationId: string) => {
      if (!conversationId) return;

      setLoading(true);
      try {
        const data = await getChatMessages(conversationId);
        setMessages(Array.isArray(data) ? data : [data]);
        setActiveChatId(conversationId);

        // Join the socket room
        socket?.emit("joinChat", conversationId);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoading(false);
      }
    },
    [socket]
  );

  // -------------------------
  // Send a new message
  // -------------------------
  const sendNewMessage = useCallback(
    async (payload: SendMessageData, tempMsg?: UIMessage) => {
      try {
        if (tempMsg) {
          setMessages((prev) => [...prev, tempMsg]);
        }

        const newMsg: Message = await sendMessage(payload);

        setMessages((prev) =>
          tempMsg ? prev.map((msg) => (msg._id === tempMsg._id ? newMsg : msg)) : [...prev, newMsg]
        );

        conversationContext?.handleExternalMessageUpdate(newMsg, false);
      } catch (error) {
        console.error("Failed to send message:", error);
        throw error;
      }
    },
    [conversationContext]
  );

  // -------------------------
  // Update a message
  // -------------------------
  const updateMessage = useCallback(
    async (messageId: string, data: UpdateMessageData) => {
      try {
        setMessages((prev) =>
          prev.map((msg) => (msg._id === messageId ? { ...msg, ...data, updatedAt: new Date().toISOString() } : msg))
        );

        if (socket && isConnected) {
          socket.emit("updateMessage", { messageId, ...data });
        }

        const updated = await updateChatMessage(messageId, data);

        setMessages((prev) => prev.map((msg) => (msg._id === updated._id ? updated : msg)));

        conversationContext?.handleExternalMessageUpdate(updated, false);
      } catch (error) {
        console.error("Failed to update message:", error);
        throw error;
      }
    },
    [socket, isConnected, conversationContext]
  );

  // -------------------------
  // Delete a message
  // -------------------------
  const deleteMessage = useCallback(
    async (messageId: string) => {
      try {
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));

        if (socket && isConnected) {
          socket.emit("deleteMessage", { messageId });
        }

        await deleteChatMessage(messageId);
      } catch (error) {
        console.error("Failed to delete message:", error);
        throw error;
      }
    },
    [socket, isConnected]
  );

  // -------------------------
  // Global socket listeners
  // -------------------------
  useEffect(() => {
    if (!socket) return;

    // --- Receive messages for all conversations ---
    const handleReceiveMessage = (msg: UIMessage) => {
      setMessages((prev) => {
        if (!prev.some((m) => m._id === msg._id)) {
          return [...prev, msg];
        }
        return prev;
      });

      conversationContext?.handleExternalMessageUpdate(msg, true);
    };

    // --- Handle typing ---
    const handleTyping = (data: { conversationId: string; userId: string; isTyping: boolean }) => {
      setTypingUsers((prev) => ({
        ...prev,
        [data.userId]: data.isTyping,
      }));

      if (data.isTyping) {
        setTimeout(() => {
          setTypingUsers((prev) => ({ ...prev, [data.userId]: false }));
        }, 3000);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("userTyping", handleTyping);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("userTyping", handleTyping);
    };
  }, [socket, conversationContext]);

  const refreshMessages = useCallback(async () => {
    if (activeChatId) await fetchMessages(activeChatId);
  }, [activeChatId, fetchMessages]);

  return (
    <MessageContext.Provider
      value={{
        messages,
        loading,
        activeChatId,
        typingUsers,
        fetchMessages,
        sendNewMessage,
        updateMessage,
        deleteMessage,
        setActiveChat: setActiveChatId,
        refreshMessages,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};