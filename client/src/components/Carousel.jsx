import { useState } from "react";
import {
  BsFillArrowRightCircleFill,
  BsFillArrowLeftCircleFill,
} from "react-icons/bs";
export default function Carousel({ slides }) {
  let [current, setCurrent] = useState(0);

  let previousSlide = () => {
    if (current === 0) setCurrent(slides.length - 1);
    else setCurrent(current - 1);
  };

  let nextSlide = () => {
    if (current === slides.length - 1) setCurrent(0);
    else setCurrent(current + 1);
  };


  return (
    <div className="z-10">
        <div className="overflow-hidden relative">
            <div
                className={`flex transition ease-out duration-1000 `}
                style={{
                transform: `translateX(-${current * 100}%)`,
                }}
            >
                {slides.map((s) => {
                return <img src={s} className="opacity-20 duration-75"/>;
                })}
            </div>

      

            <div className="absolute top-0 h-full w-full justify-between items-center flex text-white px-10 text-3xl">
                <button onClick={previousSlide}>
                <BsFillArrowLeftCircleFill className="opacity-10 hover:opacity-40" />
                </button>
                <button onClick={nextSlide}>
                <BsFillArrowRightCircleFill className="opacity-10 hover:opacity-40" />
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
                        i == current ? "bg-white" : "bg-gray-500"
                    }`}
                    ></div>
                );
                })}
            </div>
        </div>
    </div>
    
  );
}