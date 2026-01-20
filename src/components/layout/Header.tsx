import React from 'react'
import SearchComponent from '@/components/ui/SearchComponent'

const handleSearch = (query: string): void => {
  console.log("Search query:", query);
};

const Header = () => {
  return (
    <header className='p-3 flex justify-between align-center'>
        <div>
            <p>Online Users</p>
        </div>
        <div>
            <SearchComponent onSearch={handleSearch}/>
        </div>
        <div>
            <p>User Profile</p>
        </div>
    </header>
  )
}

export default Header