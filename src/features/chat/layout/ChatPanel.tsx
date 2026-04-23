import React from 'react';
import ChatList from '@/features/chat/layout/ChatList';
import ChatBoard from '@/features/chat/layout/ChatBoard';

const ChatPanel: React.FC = () => {
  return (
    <div className="flex flex-1 overflow-hidden">
      <ChatList />
      <ChatBoard />
    </div>
  );
};

export default ChatPanel;