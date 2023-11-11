import React from 'react'

export default function Render({children}) {
  
  return (
    <div className='text-center
     text-white text-xl
      hover:bg-zinc-400 hover:bg-opacity-90 mb-2 '>
        {children}
    </div>
  )
}
