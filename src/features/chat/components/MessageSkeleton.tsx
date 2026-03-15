import React from 'react'

const MessageSkeleton = () => {
  return (
    <div className="flex justify-end my-2 relative">
      <div className="bg-purple-600/40 animate-pulse rounded-lg px-4 py-3 w-50 h-12">
        <div className='bg-purple-400/80 w-full h-2 animate-pulse rounded-lg'></div>
        <div className='bg-purple-400/80 w-30 h-2 animate-pulse rounded-lg mt-2'></div>
      </div>
      <span className='absolute text-xs text-gray-400 -bottom-4'>sending</span>
    </div>
  )
}

export default MessageSkeleton