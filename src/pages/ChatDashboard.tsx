import React from 'react'
import Sidebar from '@/components/layout/Sidebar'
import ChatList from '@/features/chat/layout/ChatList'
import ChatBoard from '@features/chat/layout/ChatBoard'

const ChatDashboard = () => {
  return (
    <div className='h-screen w-full bg-primary-dark'>
      <div className='float-left'>
        <Sidebar/>
      </div>
      <div className='flex justify-start'>
          <ChatList/>
          <ChatBoard />
      </div>
    </div>
  )
}

export default ChatDashboard