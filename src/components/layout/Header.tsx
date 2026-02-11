import React from 'react'
import UserSearch from '@/features/search/components/SearchComponent'


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
            <p>User Profile</p>
        </div>
    </header>
  )
}

export default Header