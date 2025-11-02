import React from 'react'
import Sidebar from '@/components/layout/Sidebar'
import ChatList from '@/features/chat/components/ChatList'

const ChatDashboard = () => {
  return (
    <div className='h-screen w-full bg-primary-dark'>
      <div className='float-left'>
        <Sidebar/>
      </div>
      <div>
          <ChatList/>
      </div>
    </div>
  )
}

export default ChatDashboard