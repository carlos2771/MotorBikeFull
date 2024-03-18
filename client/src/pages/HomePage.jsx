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
    <div>
      <div className="w-[100%] pt-9">
        <Carousel slides={slides} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-10 items-center">
        <div className="mb-10 mx-10">
          <p className="text-white text-[30px] font-bold">MOTO RACER LA 36</p>
          <p className="text-white text-[30px] font-bold">Bienvenidos</p>
          <p className="text-blue-500 text-[30px] font-bold">
            Ofrecemos servicios de venta de repuestos, reparación y
            mantenimiento de motos
          </p>
        </div>
        <div className="flex justify-center mb-20">
          <div className="h-[500px] w-[750px] p-2 rounded-[20px] bg-gradient-to-b from-blue-500  to-blue-300">
            <img
              src={CardImg}
              className="h-full w-[850px] object-cover rounded-[20px]"
            />
          </div>
        </div>
      </div>
      
      <footer className="bg-gray-900 text-white text-center py-6 fixed bottom-0 inset-x-0 ">
        <p>Derechos de autor &copy; 2024 Moto Racer LA 36</p>
      </footer>
    </div>
  );
}
