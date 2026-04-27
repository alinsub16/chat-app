import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import ViewUserProfileModal from '@/features/userProfile/components/ViewUserProfileModal';
import CalendarPanel from '@/features/calendar/layouts/CalendarPanel';
import NotificationPanel from '@/features/notifications/layouts/NotificationPanel';
import ChatPanel from '@/features/chat/layout/ChatPanel';

import { ActiveView } from '@/types/sidebarTypes';


const ChatDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('Chat');

  const renderMainContent = (): React.ReactNode => {
    switch (activeView) {
      case 'Calendar':
        return <CalendarPanel />;
      case 'Notify':
        return <NotificationPanel />;
      case 'Chat':
      default:
        return (
          <>
            <ChatPanel />
          </>
        );
    }
  };

  return (
    <div className="h-dvh w-full flex flex-col-reverse md:flex-row bg-primary-dark overflow-hidden">
      {/* Sidebar */}
      <Sidebar activeView={activeView} onNavigate={setActiveView} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex flex-1 overflow-hidden">
          {renderMainContent()}
        </main>
      </div>

      {/* GLOBAL MODAL */}
      <ViewUserProfileModal />
    </div>
  );
};

export default ChatDashboard;