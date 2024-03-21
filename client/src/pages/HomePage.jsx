import React from "react";
import Carousel from "../components/Carousel";
import Imagen1 from './images/carouselImg1.jpg'
import Imagen2 from './images/carouselImg2.jpg'
import Imagen3 from './images/carouselImg3.jpg'
import CardImg from "./images/ImgLandingCard.png";


export default function HomePage() {
  let slides = [
      Imagen1,Imagen2,Imagen3,
  ];
  return (
    <div className="mt-24">
      <div className="grid grid-cols-1 md:grid-cols-2 mt-10 items-center">
        <div className="mb-10 mx-10">
          <p className="text-white text-[30px] font-bold">MOTO RACER LA 36</p>
          <p className="text-white text-[30px] font-bold">Bienvenidos</p>
          <p className="text-blue-500 text-[30px] font-bold">
            Ofrecemos servicios de venta de repuestos, reparación y
            mantenimiento de motos
          </p>
        </div>
        <div className="flex justify-center">
          <div className="h-[500px] w-[750px] pt-16 rounded-[20px]">
          <Carousel slides={slides}/>
          </div>
        </div>
      </div>     
      <footer className="bg-gray-900 text-white text-center py-4 fixed bottom-0 inset-x-0 ">
        <p>Derechos de autor &copy; 2024 MotorBike</p>
      </footer>
    </div>
  );
}
