import React from "react";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { ConversationProvider } from "@/features/chat/context/ConversationContext";
import { MessageProvider} from "@/features/chat/context/MessageContext"

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      <ConversationProvider>
        <MessageProvider>
          {children}
        </MessageProvider>
      </ConversationProvider>
    </AuthProvider>
  );
};
