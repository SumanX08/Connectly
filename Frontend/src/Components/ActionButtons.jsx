import React from 'react'
import { FaHeart,FaTimes } from 'react-icons/fa'

const ActionButtons = ({onConnect,onSkip}) => {
  return (
    <div className='p-5 flex gap-4 justify center text-white'>
        <button onClick={onSkip} className='bg-red-500 hover:bg-red-600 px-8 py-3 cursor-pointer flex items-center gap-2 rounded-2xl transition-easeOut duration-300'>
            <FaTimes/>Skip
        </button>
        <button onClick={onConnect} className='bg-green-500 hover:bg-green-600 px-8 py-3 cursor-pointer flex items-center gap-2 rounded-2xl transition-easeOut duration-300'>
            <FaHeart/>Connect
        </button>
    </div>
  )
}

export default ActionButtons