import React from "react";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { ConversationProvider } from "@/features/chat/context/ConversationContext";
import { MessageProvider} from "@/features/chat/context/MessageContext"
import { SocketProvider } from "@/features/chat/context/SocketContext"

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      <ConversationProvider>
        <SocketProvider>
          <MessageProvider>
            {children}
          </MessageProvider>
        </SocketProvider>
      </ConversationProvider>
    </AuthProvider>
  );
};
