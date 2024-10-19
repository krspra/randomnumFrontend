import React from 'react';
import SignupButton from './components/SignupButton';
import LoginButton from './components/LoginButton';

function Header() {
  return (
    <header className='px-5 h-20 flex justify-between items-center border-b-2 border-red-400'>
        <div className=' text-lg text-purple-700 font-semibold'>Random Number Dashboard</div>
        <div className='flex'>
            <LoginButton/>
            <SignupButton/>
        </div>        
    </header>
  )
}

export default Header;