import { useState, useEffect  } from "react";
import {
  BsFillArrowRightCircleFill,
  BsFillArrowLeftCircleFill,
} from "react-icons/bs";
export default function Carousel({ slides }) {

  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const previousSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Función para cambiar de slide automáticamente
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); // Cambia la imagen cada 5 segundos (5000 milisegundos)

    return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonta
  }, [slides.length]);


  return (
    <div className="z-10">
      <div className="overflow-hidden relative rounded-md border border-blue-500 shadow-lg shadow-blue-500 ">
        <div
          className={`flex transition ease-out duration-100 `}
          style={{
            transform: `translateX(-${current * 100}%)`,
          }}
        >
          {slides.map((s, index) => {
            return <img key={index} src={s} className="opacity-20 duration-75" />;
          })}
        </div>

        <div className="absolute top-0 h-full w-full justify-between items-center flex text-white px-10 text-3xl">
          <button onClick={previousSlide}>
            <BsFillArrowLeftCircleFill className="opacity-10 hover:opacity-40 hidden" />
          </button>
          <button onClick={nextSlide}>
            <BsFillArrowRightCircleFill className="opacity-10 hover:opacity-40 hidden" />
          </button>
        </div>

        <div className="absolute bottom-0 py-4 flex justify-center gap-3 w-full">
          {slides.map((s, i) => {
            return (
              <div
                onClick={() => {
                  setCurrent(i);
                }}
                key={"circle" + i}
                className={`rounded-full w-10 h-1 cursor-pointer opacity-10 ${
                  i === current ? "bg-white" : "bg-gray-500"
                }`}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
    
  );
}