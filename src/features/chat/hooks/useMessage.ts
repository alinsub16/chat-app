import { useContext } from "react";
import {MessageContext,MessageContextType } from "@/features/chat/context/MessageContext"

export const useMessages = (): MessageContextType => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessages must be used within a MessageProvider");
  }
  return context;
};