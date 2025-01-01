import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';

import { useState } from 'react';
function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // navigate
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    // Here you would typically send the email and password to your backend for authentication
    // console.log('Email:', email, 'Password:', password);

    // -------------------------------------------------------------------------------------
    // await axios.post('http://localhost:8000/user/login', {email, password} )
    // .then((res)=>{
    //   console.log("Logged in successfully")
    //   navigate('/groups')
    // })
    // -------------------------------------------------------------------------------------
    try {
      const response = await fetch(import.meta.env.VITE_REACT_APP_SERVER_BASE_URL+`user/login`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({
          email: email,
          password: password
        })
      })
      // console.log(response);
      const responseData = await response.json()
      // console.log(responseData)
      setError('');
      if (response.status === 200) {
        navigate(`/groups`);
      }
      else {
        setError(responseData.message)
        swal({
          text: responseData.message,
          icon: 'warning',
          button: 'Try again!',
          dangerMode: true
        })
      }
    }
    catch (err) {
      console.log("An error occured :- ", err)
      setError(err);
      swal({
        text: err,
        icon: 'warning',
        button: 'Try again!',
        dangerMode: true
      })
    }
  };

  return (
    <form onSubmit={handleSubmit} className="h-screen w-full flex items-center justify-center bg-gradient-to-r from-gray-600 to-gray-800">
      <div className='p-5 flex flex-col gap-8 w-[600px] h-[400px] justify-center items-center bg-gray-800 border-2 rounded-xl shadow-lg border-none outline-none shadow-gray-500 m-auto'>

        <div className="flex items-center">
          <label htmlFor="email" className="text-sm font-medium text-white mr-4">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="block w-[400px] h-[2rem] rounded-md border-gray-700 bg-slate-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-4"
            placeholder='Enter e-mail'
          />
        </div>
        <div className="flex items-center">
          <label htmlFor="password" className="text-sm font-medium text-white mr-4">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="block w-[400px] h-[2rem] rounded-md border-gray-700 bg-slate-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-4"
            placeholder='Enter password'
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="mt-4 w-[150px] bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700">Login</button>
        <h3 className='text-white'>Don't have account yet? <Link to='/signup' className='text-white underline'>Create new one</Link></h3>
      </div>
    </form>
  );
}

export default LoginPage;

