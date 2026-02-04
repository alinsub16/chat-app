import React from 'react'
import Sidebar from '@/components/layout/Sidebar'
import ChatList from '@/features/chat/layout/ChatList'
import ChatBoard from '@features/chat/layout/ChatBoard'
import Header from '@/components/layout/Header'

const ChatDashboard = () => {
  return (
    <div className='h-dvh w-full bg-primary-dark relative pb-10 overflow-hidden'>
      <div className='float-left'>
        <Sidebar/>
      </div>
      <div className='flex flex-col'>
        <div>
            <Header />
        </div> 
        <div className='flex overflow-hidden'>
            <ChatList/>
            <ChatBoard />
        </div>
      </div>
    </div>
  )
}

export default ChatDashboard