import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';

function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    // Here you would typically send the name, email, and password to your backend for registration
    await axios.post(import.meta.env.VITE_REACT_APP_SERVER_BASE_URL+'user/register', { name, email, password })
      .then(() => {
        // console.log("SuccessFully user creted")
        swal('You have registered to BillBuddy successfully.')
        navigate('/login')
      }).catch((error) => {
        if (error.response && error.response.data) {
          setError(error.response.data.message || 'An error occurred');
          swal({
            text: error.response.data.message,
            icon: 'warning',
            button: 'Try again!',
            dangerMode: true
          })
        } else {
          setError('An error occurred');
          swal({
            text: 'An error occurred',
            icon: 'warning',
            button: 'Try again!',
            dangerMode: true
          })
        }
      })
    // console.log('Name:', name, 'Email:', email, 'Password:', password);
  };

  return (
    <form onSubmit={handleSubmit} className="h-screen w-full flex items-center justify-center bg-gradient-to-r from-gray-600 to-gray-800">
      <div className='p-5 flex flex-col gap-8 w-[600px] h-[600px] justify-center items-center bg-gray-800 border-2 rounded-xl shadow-lg border-none outline-none shadow-gray-500 m-auto'>
        <div className="flex items-center w-full justify-around">
          <label htmlFor="name" className="text-sm font-medium text-white mr-4">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="block w-[400px] h-[2rem] rounded-md border-gray-700 bg-slate-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-4"
            placeholder='Enter name'
          />
        </div>
        <div className="flex items-center w-full justify-around">
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
        <div className="flex items-center w-full justify-around">
          <label htmlFor="password" className="text-sm font-medium text-white mr-4">Set Password:</label>
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
        <div className="flex items-center w-full justify-around">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-white mr-4">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="block w-[400px] h-[2rem] rounded-md border-gray-700 bg-slate-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-4"
            placeholder='Confirm password'
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="mt-4 w-[150px] bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700">Sign Up</button>
        <h3 className='text-white'>Already have an account? <Link to='/login' className='text-white underline'>Log in</Link></h3>
      </div>
    </form>
  );
}

export default SignUpPage;
