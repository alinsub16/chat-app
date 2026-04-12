import React from "react";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { ConversationProvider } from "@/features/chat/context/ConversationContext";
import { MessageProvider} from "@/features/chat/context/MessageContext"
import { SocketProvider } from "@/features/chat/context/SocketContext"
import { ProfileProvider } from "@/features/userProfile/context/profileContext"
import { ProfileViewProvider } from "@/features/userProfile/context/userProfileViewContext"

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      <ProfileProvider>
        <ProfileViewProvider>
          <SocketProvider>
           <ConversationProvider>
              <MessageProvider>
                {children}
              </MessageProvider>
           </ConversationProvider>
          </SocketProvider>
        </ProfileViewProvider>
      </ProfileProvider>
    </AuthProvider>
  );
};
