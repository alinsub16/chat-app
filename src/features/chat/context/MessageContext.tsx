import React, { createContext, useContext, useEffect, useState, useCallback, } from "react";
import { sendMessage, getChatMessages, deleteChatMessages, updateChatMessage, } from "@/features/chat/api/messageApi";
import { Message, SendMessageData, UpdateMessageData, } from "@/features/chat/types/messageTypes";

/** ---------------------------
 *  Context Interface
 * --------------------------- */
export interface MessageContextType {
  messages: Message[];
  loading: boolean;
  activeChatId: string | null;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendNewMessage: (data: SendMessageData) => Promise<void>;
  updateMessage: (messageId: string, data: UpdateMessageData) => Promise<void>;
  clearMessages: (conversationId: string) => Promise<void>;
  setActiveChat: (conversationId: string | null) => void;
  refreshMessages: () => Promise<void>;
}

export const MessageContext = createContext<MessageContextType | undefined>( undefined );

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children, }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

 /** FETCH messages for a conversation */
  const fetchMessages = async (conversationId: string) => {
    if (!conversationId) return;
    setLoading(true);
    try {
      const data = await getChatMessages(conversationId);
      // Important: backend returns object, convert to array
      const safeData = Array.isArray(data) ? data : [data];
      setMessages(safeData);
      setActiveChatId(conversationId);

    } catch (error) {
      console.error("❌ Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  /** Send message */
  const sendNewMessage = useCallback(
    async (data: SendMessageData) => {
      try {
        const newMsg = await sendMessage(data);

        // Backend returns: conversationId
        if (newMsg.conversationId === activeChatId) {
          setMessages((prev) => [...prev, newMsg]);
        }
      } catch (error) {
        console.error("Failed to send message:", error);
        throw error;
      }
    },
    [activeChatId]
  );

  /** Update message */
  const updateMessage = useCallback(
    async (messageId: string, data: UpdateMessageData) => {
      try {
        const updated = await updateChatMessage(messageId, data);
        setMessages((prev) =>
          prev.map((msg) => (msg._id === updated._id ? updated : msg))
        );
      } catch (error) {
        console.error("Failed to update message:", error);
        throw error;
      }
    },
    []
  );

  /** Clear all messages */
  const clearMessages = useCallback(
    async (conversationId: string) => {
      try {
        await deleteChatMessages(conversationId);
        if (activeChatId === conversationId) setMessages([]);
      } catch (error) {
        console.error("Failed to delete chat messages:", error);
      }
    },
    [activeChatId]
  );

  /** Refresh current chat */
  const refreshMessages = useCallback(async () => {
    if (activeChatId) await fetchMessages(activeChatId);
  }, [activeChatId, fetchMessages]);

  return (
    <MessageContext.Provider
      value={{
        messages,
        loading,
        activeChatId,
        fetchMessages,
        sendNewMessage,
        updateMessage,
        clearMessages,
        setActiveChat: setActiveChatId,
        refreshMessages,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

/** Custom hook */
export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessages must be used inside MessageProvider");
  }
  return context;
};
