import React from 'react'
import Carousel from "../components/Carousel";



export default function HomePage() {
  let slides = [
    "https://wallpapercave.com/wp/wp9343809.jpg",
    "https://wallpapercave.com/wp/wp9638466.jpg", 
    "https://wallpapercave.com/wp/wp9638428.jpg",
  ];
  return (
    <div>
      <div className="w-[100%] pt-9">
        <Carousel slides={slides} />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 mt-10 items-center'>
            <div className='mb-10 mx-10'>
            <p className='text-white text-[30px] font-bold'>MOTO RACER LA 36</p>
                <p className='text-white text-[30px] font-bold'>Bienvenidos</p>
                <p className='text-blue-500 text-[30px] font-bold'>Ofrecemos servicios de venta de repuestos, reparación y mantenimiento de motos</p>
            </div>
            <div className='flex justify-center '>
            <div className='h-[500px] w-[750px] p-2 rounded-[20px] bg-gradient-to-b from-blue-500  to-blue-300'>
                <img src="https://www.motorrad.com.co/wp-content/uploads/2017/01/mantenimientopreventivo.jpg"
                className='h-full w-[850px] object-cover rounded-[20px]'
                />
            </div>
          </div> 
      </div>
    </div>

    
  )
}
