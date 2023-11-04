import React from 'react'

export default function Render({children}) {
  return (
    <div className='text-center
     text-white text-xl
      hover:bg-orange-400 cursor-pointer py-3 mb-2'>
        {children}
    </div>
  )
}
