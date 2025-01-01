import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo2.png';

function HomePage() {
  return (
    <div className='flex flex-col md:flex-row justify-start items-center h-screen bg-gradient-to-r from-gray-900 to-gray-600'>
      <div className='hidden md:flex items-center justify-center w-full md:w-1/2'>
        <img src={logo} alt="logo" className='w-2/3' />
      </div>
      <div className='bg-gray-800 w-full md:w-1/2 lg:w-1/3 rounded-lg shadow-lg flex flex-col gap-6 justify-center items-center p-8 mb-8 md:mb-0'>
        <div className='text-gray-100 text-4xl font-bold mb-4 text-center'>
          Split the bill, not the friendship
        </div>
        <Link to="/login" className='flex justify-center items-center mb-4'>
          <button className='bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-full transition duration-300 w-[200px]'>
            Get started
          </button>
        </Link>
        <p className="text-gray-300 text-lg text-center">
          Make bill splitting among friends, colleagues, and family super easy.
        </p>
      </div>
    </div>
  );
}

export default HomePage;
