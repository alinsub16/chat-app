import React, { createContext, useContext, useEffect, useState, useCallback, } from "react";
import { sendMessage, getChatMessages, deleteChatMessage, updateChatMessage, } from "@/features/chat/api/messageApi";
import { Message, SendMessageData, UpdateMessageData,SendMessageWithTemp,UIMessage } from "@/features/chat/types/messageTypes";
import { useSocket } from "@/features/chat/hooks/useSocket";

/** ---------------------------
 *  Context Interface
 * --------------------------- */
export interface MessageContextType {
  messages: UIMessage[];
  loading: boolean;
  activeChatId: string;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendNewMessage: (
    payload: SendMessageData,
    tempMsg?: UIMessage
  ) => Promise<void>;
  updateMessage: (messageId: string, data: UpdateMessageData) => Promise<void>;
  deleteMessage: ( messageId: string) => Promise<void>;
  setActiveChat: (conversationId: string) => void;
  refreshMessages: () => Promise<void>;
}

export const MessageContext = createContext<MessageContextType | undefined>( undefined );

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children, }) => {
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [loading, setLoading] = useState(false);
 const [activeChatId, setActiveChatId] = useState<string>("");
 const { socket, isConnected, sendSocketMessage } = useSocket();

 /** FETCH messages for a conversation */
const fetchMessages = useCallback(
  async (conversationId: string) => {
    if (!conversationId) return;
    setLoading(true);

    try {
      // Fetch messages from backend
      const data = await getChatMessages(conversationId);
      const safeData = Array.isArray(data) ? data : [data];

      // Update UI
      setMessages(safeData);
      setActiveChatId(conversationId);

      // Emit join chat to socket (similar to emitting deleteMessage)
      if (socket && isConnected) {
        socket.emit("joinChat", conversationId);
      }

      // Remove previous listeners to prevent duplicates
      socket?.off("receiveMessage");
      socket?.off("messageUpdated");
      socket?.off("messageDeleted");

      // Setup listeners
      const handleReceiveMessage = (message: UIMessage) => {
        if (message.conversationId === conversationId) {
          setMessages((prev) => [...prev, message]);
        }
      };

      const handleUpdateMessage = (updated: UIMessage) => {
        if (updated.conversationId === conversationId) {
          setMessages((prev) =>
            prev.map((msg) => (msg._id === updated._id ? updated : msg))
          );
        }
      };

      const handleDeleteMessage = (deleted: { messageId: string; conversationId: string }) => {
        if (deleted.conversationId === conversationId) {
          setMessages((prev) =>
            prev.filter((msg) => msg._id !== deleted.messageId)
          );
        }
      };

      socket?.on("receiveMessage", handleReceiveMessage);
      socket?.on("messageUpdated", handleUpdateMessage);
      socket?.on("messageDeleted", handleDeleteMessage);

      // ⚠️ No cleanup returned — cleanup handled in useEffect or other logic

    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  },
  [socket, isConnected]
);


  /** Send message */
const sendNewMessage = useCallback( async (payload: SendMessageData, tempMsg?: UIMessage): Promise<void> => {
    try {
      if (tempMsg) {
        setMessages((prev) => [...prev, tempMsg]);
      }

      const newMsg: Message = await sendMessage(payload);

      if (tempMsg) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.sender._id === tempMsg._id ? newMsg : msg
          )
        );
      } else {
        setMessages((prev) => [...prev, newMsg]);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  },
  []
);


  /** Update message */
  const updateMessage = useCallback(
  async (messageId: string, data: UpdateMessageData) => {
    if (!messageId) return;

    try {
      //  Optimistic UI update
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? { ...msg, ...data, updatedAt: new Date().toISOString() }
            : msg
        )
      );

      // Emit update via socket (realtime sync)
      if (socket && isConnected) {
        socket.emit("updateMessage", {
          messageId,
          ...data,
        });
      }

      // Persist change to backend
      const updated = await updateChatMessage(messageId, data);

      // Replace with server truth (ensures consistency)
      setMessages((prev) =>
        prev.map((msg) => (msg._id === updated._id ? updated : msg))
      );
    } catch (error) {
      console.error("Failed to update message:", error);
      throw error;
    }
    },
    [socket, isConnected]
  );


  const deleteMessage = useCallback(
    async (messageId: string | undefined, isTemp = false) => {
      if (!messageId) return;
      try {
        // Optimistic UI
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
        
        if (isTemp) return;

        // Emit deletion via socket
        if (socket && isConnected) {
          socket.emit("deleteMessage", { messageId });
        }
        // Persist deletion
        await deleteChatMessage(messageId);
      } catch (error) {
        console.error("Failed to delete message:", error);
        throw error;
      }
    },
    [socket, isConnected]
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
        deleteMessage,
        setActiveChat: setActiveChatId,
        refreshMessages,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

