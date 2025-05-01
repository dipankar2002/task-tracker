import React  from 'react'
import { useAuthStore } from '../store/authStore';

const UserSec = ({ children }) => {
  const { authUser } = useAuthStore();
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 justify-start space-x-20 items-center pb-10'>
      <div className='flex flex-col space-y-1'>
        <div className='text-4xl font-bold'>{authUser.name}</div>
        <div className='flex items-center space-x-2'>
          <div className='text-xl text-gray-500'>{authUser.username}</div>
          <div className='text-sm text-gray-500'>{authUser.country}</div>
        </div>
      </div>
      {children}
    </div>
  )
}

export default UserSec
