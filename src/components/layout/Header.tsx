import React from 'react'
import UserSearch from '@/features/search/components/SearchComponent'
import UserProfileMenu from '@/features/userProfile/components/UserProfileMenu'
import DebugSocket from '@/features/chat/components/DebugSocket'



const Header = () => {
  return (
    <header className='p-3 flex justify-between items-center'>
        <div>
            <p>Chat</p>
            {/* <DebugSocket /> */}
        </div>
        <div>
            <UserSearch />
        </div>
        <div>
            <UserProfileMenu />
        </div>
    </header>
  )
}

export default Header