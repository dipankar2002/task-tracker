import React, { useEffect, useState } from 'react'
import Select from "react-select";
import { useAuthStore } from '../store/authStore';

const Navbar = () => {
  const { authUser, userList, logout } = useAuthStore();
  const [ options, setOptions ] = useState([]);
  const [ openMore, setOpenMore ] = useState(false);

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
    <nav className="bg-gray-600 px-10 sm:px-16 md:px-[4.5rem] lg:px-[10rem] xl:px-[20rem] py-4 sm:py-6">
      <div className="container mx-auto flex justify-between items-center">
        <h1 
          className="text-white text-xl sm:text-2xl font-bold"
          onClick={() => window.location.href = '/'}
          style={{ cursor: 'pointer' }}
        >Task Manager</h1>
        {authUser && (
          <div className=' hidden md:flex items-center gap-6'>
            {/* <Select
              options={options}
              onChange={userName}
              placeholder="Search User"
              isSearchable
              className='w-60 text-center'
            /> */}
            <button
              className='bg-red-500 text-white px-4 py-2 rounded' 
              onClick={() => {logout()}}
            >Logout</button>
          </div>
        )}
        {authUser && (
          <button 
            className=' md:hidden text-white font-bold text-4xl'
            onClick={() => {setOpenMore((prev) => !prev)}}
          >{openMore ? `x` : `=`}</button>
        )}
      </div>
      {openMore && authUser && (
        <div className='flex md:hidden space-x-4 justify-center mt-6'>
          {/* <Select
            options={options}
            onChange={userName}
            placeholder="Search User"
            isSearchable
            className='w-60 text-center'
          /> */}
          <button
            className='bg-red-500 text-white px-4 py-2 rounded' 
            onClick={() => {logout()}}
          >Logout</button>
        </div>
      )}
    </nav>
  )
}

export default Navbar
