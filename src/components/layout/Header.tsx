import React from 'react'
import UserSearch from '@/features/search/components/SearchComponent'
import UserProfileMenu from '@/features/userProfile/components/UserProfileMenu'


const Header = () => {
  return (
    <header className='p-3 flex justify-between items-center'>
        <div>
            <p>Online Users</p>
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