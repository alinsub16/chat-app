import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { getChatMessages,uploadMessageAttachments } from "@/features/chat/api/messageApi";
import { UIMessage,SendMessagePayload, Attachment  } from "@/features/chat/types/messageTypes";
import { useSocket } from "@/features/chat/hooks/useSocket";
import { ConversationContext } from "@/features/chat/context/ConversationContext";




export interface MessageContextType {
  messages: UIMessage[];
  loading: boolean;
  activeChatId: string | null;
  typingUsers: Record<string, boolean>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendNewMessage: (payload: SendMessagePayload) => void;
  updateMessage: (messageId: string, content: string) => void;
  deleteMessage: (messageId: string) => void;
  reactToMessage: (messageId: string,emoji: string) => void;
  setActiveChat: (conversationId: string) => void;
  refreshMessages: () => Promise<void>;
  emitTypingEvent: (isTyping: boolean) => void;
  clearActiveChat: () => void;
}

export const MessageContext = createContext<MessageContextType | undefined>(
  undefined
);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});

  const { joinChat, leaveChat, setupMessageHandlers, sendSocketMessage, emitTyping, deleteMessageSocket, updateMessageSocket, reactMessageSocket, } = useSocket();

  const conversationContext = useContext(ConversationContext);

  const prevChatRef = useRef<string | null>(null);
  const typingTimeouts = useRef<Record<string, NodeJS.Timeout>>({});

  // -----------------------------
  // Join / Leave Chat Room
  // -----------------------------
  useEffect(() => {
    if (!activeChatId) return;

    if (prevChatRef.current) leaveChat(prevChatRef.current);
    joinChat(activeChatId);
    prevChatRef.current = activeChatId;

    return () => {
      if (activeChatId) leaveChat(activeChatId);
    };
  }, [activeChatId, joinChat, leaveChat]);

  // -----------------------------
  // Fetch Messages
  // -----------------------------
  const fetchMessages = useCallback(async (conversationId: string) => {
    if (!conversationId) return;
    setLoading(true);
    try {
      const data: UIMessage[] = await getChatMessages(conversationId);
      setMessages(data);
      setActiveChatId(conversationId);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // -----------------------------
  // Refresh Messages
  // -----------------------------
  const refreshMessages = useCallback(async () => {
    if (activeChatId) await fetchMessages(activeChatId);
  }, [activeChatId, fetchMessages]);

  // -----------------------------
  // Send Message
  // -----------------------------
  const sendNewMessage = useCallback(
  async (payload: SendMessagePayload) => {
    if (!activeChatId) return;

    try {
      let attachments:Attachment[] = [];

      if (payload.files && payload.files.length > 0) {
        attachments = await uploadMessageAttachments(payload.files);
      }

      sendSocketMessage({
        sender: payload.sender,
        conversationId: payload.conversationId,
        content: payload.content,
        messageType: attachments.length ? "file" : "text",
        attachments, 
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  },
  [sendSocketMessage, activeChatId]
);

  // -----------------------------
  // Update Message
  // -----------------------------
  const updateMessage = useCallback(
    (messageId: string, content: string) => {
      
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? { ...msg, content, updatedAt: new Date().toISOString() }
            : msg
        )
      );
      updateMessageSocket({ messageId, content });
    },
    [updateMessageSocket]
  );

  // -----------------------------
  // Delete Message
  // -----------------------------
  const deleteMessage = useCallback(
    (messageId: string) => {
      if (!activeChatId) return;

      // Optimistic UI update
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));

      deleteMessageSocket({
        roomId: activeChatId,
        messageId,
      });
    },
    [deleteMessageSocket, activeChatId]
  );
  // -----------------------------
  // Reaction on Message
  // -----------------------------

  const reactToMessage = useCallback(
  (messageId: string, emoji: string) => {
    reactMessageSocket({ messageId, emoji });
  },
  [reactMessageSocket,activeChatId]
);

  // -----------------------------
  // Typing Emit
  // -----------------------------
  const emitTypingEvent = useCallback(
    (isTyping: boolean) => {
      if (!activeChatId) return;
      emitTyping(activeChatId, isTyping);
    },
    [activeChatId, emitTyping]
  );

  // -----------------------------
  // Clear activeChatID
  // -----------------------------

 const clearActiveChat = useCallback(async () => {
    try {
      setLoading(true);
      setMessages([]);
      setActiveChatId(null);
    } catch (error) {
      console.error("Failed to clear active chat:", error);
    } finally {
      setLoading(false);
    }
  }, []);


  // -----------------------------
  // Setup Socket Handlers
  // -----------------------------
  useEffect(() => {
    const cleanup = setupMessageHandlers(
      // receiveMessage
      (msg: UIMessage) => {
        // console.log("RECEIVE EVENT:", msg);

        if (!msg.content || !msg?.sender) return;

        // Only update conversation preview if it's the active one
        if (msg.conversationId === activeChatId) {
          conversationContext?.handleExternalMessageUpdate(msg, true);

          setMessages((prev) => {
            if (!prev.some((m) => m._id === msg._id)) {
              return [...prev, msg];
            }
            return prev;
          });
        }
      },

      // messageSent (unused)
      () => {},

      //  typing
      (data: {
        conversationId: string;
        userId: string;
        isTyping: boolean;
      }) => {
        if (data.conversationId !== activeChatId) return;

        setTypingUsers((prev) => ({
          ...prev,
          [data.userId]: data.isTyping,
        }));

        if (typingTimeouts.current[data.userId]) {
          clearTimeout(typingTimeouts.current[data.userId]);
        }

        if (data.isTyping) {
          typingTimeouts.current[data.userId] = setTimeout(() => {
            setTypingUsers((prev) => ({
              ...prev,
              [data.userId]: false,
            }));
          }, 3000);
        }
      },

      // error
      (error) => console.error("Socket error:", error),

      // onMessageUpdate
      (updated: UIMessage) => {
        setMessages((prev) =>
          prev.map((msg) => (msg._id === updated._id ? updated : msg))
        );
      },

      // onMessageDelete
      ({ messageId }: { messageId: string }) => {
        setMessages((prev) =>
          prev.filter((msg) => msg._id !== messageId)
        );
      },
       // ✅ reactionUpdate
      ({ messageId, reactions }: { messageId: string; reactions: any[] }) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId
              ? { ...msg, reactions }
              : msg
          )
        );
      }
    );

    return cleanup;
  }, [setupMessageHandlers, activeChatId, conversationContext]);

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
        reactToMessage,
        setActiveChat: setActiveChatId,
        refreshMessages,
        emitTypingEvent,
        clearActiveChat
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};