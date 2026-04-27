import React, { useState } from 'react';
import ChatList from '@/features/chat/layout/ChatList';
import ChatBoard from '@/features/chat/layout/ChatBoard';
import { useMessages } from "@features/chat/hooks/useMessage";

const ChatPanel: React.FC = () => {
  const [showChat, setShowChat] = useState(false);

  const { clearActiveChat } = useMessages();

  const handleBack = () => {
    clearActiveChat();
    setShowChat(false);
  };

  return (
    <div className="flex flex-1 justify-center overflow-hidden">
      
      {/* LEFT: Conversation List — hidden on mobile when chat is open */}
      <div className={` md:flex flex-shrink-0 ${showChat ? "hidden" : "flex"} w-full md:w-[330px] `}>
        <ChatList onConversationSelect={() => setShowChat(true)} />
      </div>

      {/* RIGHT: Chat Board — hidden on mobile when list is showing */}
      <div className={` md:flex flex-1 flex-col ${showChat ? "flex" : "hidden"}`}>
        <ChatBoard onBack={handleBack} />
      </div>

    </div>
  );
};

export default ChatPanel;