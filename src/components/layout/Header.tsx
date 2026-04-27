import React from 'react'
import UserSearch from '@/features/search/components/SearchComponent'
import UserProfileMenu from '@/features/userProfile/components/UserProfileMenu'
import logo from '@/assets/logo.png';




const Header = () => {
  return (
    <header className='p-3 flex justify-between items-center'>
        <div>
            <p className='md:block hidden'>Chat</p>
            <img src={logo} alt="Logo" className="md:hidden w-20 h-14 block" />
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