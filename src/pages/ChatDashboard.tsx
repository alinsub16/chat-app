import React from 'react'
import Sidebar from '@/components/layout/Sidebar'
import ChatList from '@/features/chat/layout/ChatList'
import ChatBoard from '@features/chat/layout/ChatBoard'
import Header from '@/components/layout/Header'

const ChatDashboard = () => {
  return (
    <div className="h-dvh w-full flex bg-primary-dark overflow-hidden">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        {/* Chat Area */}
        <div className="flex flex-1 overflow-hidden">
          <ChatList />
          <ChatBoard />
        </div>
      </div>
    </div>
  );
};

export default ChatDashboard