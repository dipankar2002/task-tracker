import React, { useEffect, useState } from 'react'
import Select from "react-select";
import { useAuthStore } from '../store/authStore';

const Navbar = () => {
  const { authUser, userList, logout } = useAuthStore();
  const [ options, setOptions ] = useState([]);

  const userName = (selectedOption) => {
    console.log(selectedOption.value);
    window.location.href = `/user/${selectedOption.value}`;
  }

  useEffect(() => {
    setOptions(userList.filter((user) => user._id !== authUser._id).map((user) => ({
      value: user.username,
      label: user.username,
    })));
  }, [userList]);
  
  return (
    <nav className="bg-gray-600 px-8 md:px-[4.5rem] lg:px-[16rem] py-8">
      <div className="container mx-auto flex justify-between items-center">
        <h1 
          className="text-white text-4xl font-bold"
          onClick={() => window.location.href = '/'}
          style={{ cursor: 'pointer' }}
        >Task Manager</h1>
        <div className='flex items-center gap-6'>
          <Select
            options={options}
            onChange={userName}
            placeholder="Search User"
            isSearchable
            className='w-60 text-center'
          />
          <button
            className='bg-red-500 text-white px-4 py-2 rounded' 
            onClick={() => {logout()}}
          >Logout</button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
