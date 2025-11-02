import { useContext } from "react";
import { ConversationContext, ConversationContextProps } from "@/features/chat/context/ConversationContext";

// ✅ Custom hook for accessing the ConversationContext
export const useConversation = (): ConversationContextProps => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error("useConversation must be used within a ConversationProvider");
  }
  return context;
};