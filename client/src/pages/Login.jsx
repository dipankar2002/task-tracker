import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore.js';
import { Link } from 'react-router-dom';

export default function Login() {
  const { login, isLoggingIn } = useAuthStore();
  const [form, setForm] = useState({ 
    email: '', 
    password: '' 
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(form);
  };

  return (
    <div className=' flex justify-center items-center w-[100vw] h-[90vh] lg:h-[100vh]'>
      <form
        className="p-4 space-y-3 max-w-md mx-auto bg-white shadow-lg rounded-lg"
        onSubmit={handleSubmit}
      > 
        <header className='text-center pb-2 px-10'>
          <h1 className=' text-3xl font-bold pb-2'>Sign Up</h1>
          <div className='text-xl text-gray-600'>Enter your information to create an account</div>
        </header>
        <input 
          name="email" 
          type="email" 
          onChange={handleChange} 
          placeholder="Email" 
          className="border p-2 w-full" 
          required 
        />
        <input 
          name="password" 
          type="password" 
          onChange={handleChange} 
          placeholder="Password" 
          className="border p-2 w-full" 
          required 
        />

        <button className="bg-blue-500 w-[100%] py-2 text-white font-bold rounded-md mt-6">Login</button>

        <footer className='text-center pt-2'>
          Already have an account?
          <Link
            to="/signup"
            className='text-blue-500 mx-2'
          > Sign Up</Link>
        </footer>
      </form>
    </div>
  );
}
