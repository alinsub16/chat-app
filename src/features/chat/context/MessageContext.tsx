import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { sendMessage, getChatMessages, deleteChatMessages, updateChatMessage, } from "@/features/chat/api/messageApi";
import { Message, SendMessageData, UpdateMessageData, } from "@/features/chat/types/messageTypes";

/** ---------------------------
 *  Context Interface
 * --------------------------- */
export interface MessageContextType {
  messages: Message[];
  loading: boolean;
  activeChatId: string | null;
  fetchMessages: (chatId: string) => Promise<void>;
  sendNewMessage: (data: SendMessageData) => Promise<void>;
  updateMessage: (messageId: string, data: UpdateMessageData) => Promise<void>;
  clearMessages: (chatId: string) => Promise<void>;
  setActiveChat: (chatId: string | null) => void;
  refreshMessages: () => Promise<void>;
}

//  Create Context
export const MessageContext = createContext<MessageContextType | undefined>(undefined);

//  Provider
export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  /** Fetch all messages for a given chat */
  const fetchMessages = useCallback(async (chatId: string) => {
    if (!chatId) return;
    setLoading(true);
    try {
      const data = await getChatMessages(chatId);
      setMessages(data);
      setActiveChatId(chatId);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  /** Send a new message */
  const sendNewMessage = useCallback(async (data: SendMessageData) => {
    try {
      const newMsg = await sendMessage(data);
      // Append new message only if it's for the current chat
      if (activeChatId === newMsg.chat) {
        setMessages((prev) => [...prev, newMsg]);
      }
    } catch (error) {
      console.error(" Failed to send message:", error);
      throw error;
    }
  }, [activeChatId]);

  /** Update a message (edit or mark as read) */
  const updateMessage = useCallback(async (messageId: string, data: UpdateMessageData) => {
    try {
      const updatedMsg = await updateChatMessage(messageId, data);
      setMessages((prev) =>
        prev.map((msg) => (msg._id === updatedMsg._id ? updatedMsg : msg))
      );
    } catch (error) {
      console.error(" Failed to update message:", error);
      throw error;
    }
  }, []);

  /** Delete all messages in a chat */
  const clearMessages = useCallback(async (chatId: string) => {
    try {
      await deleteChatMessages(chatId);
      if (chatId === activeChatId) setMessages([]);
    } catch (error) {
      console.error("Failed to delete chat messages:", error);
    }
  }, [activeChatId]);

  /** Refresh current chat messages */
  const refreshMessages = useCallback(async () => {
    if (activeChatId) await fetchMessages(activeChatId);
  }, [activeChatId, fetchMessages]);

  /** Auto-fetch messages when chatId changes */
  useEffect(() => {
    if (activeChatId) fetchMessages(activeChatId);
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



