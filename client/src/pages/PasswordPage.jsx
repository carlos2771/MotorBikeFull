import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useAuth } from '../hooks/useAuth';
import { EmailRequired } from '../utils/validations';
import { Alert } from "@material-tailwind/react";
import { useSpring, animated } from 'react-spring';
import Swal from "sweetalert2";
import backgroundImage from './images/yamaha.jpg'; // Importa la imagen de fondo
import video from './Videos/air_bubbles.mp4'
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";
import { Navigate, useNavigate } from 'react-router-dom';
import './Css/HomePage.css'

export default function PasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { enviarToken } = useAuth();
  const [shouldNavigate , setShouldNavigate] = useState(false);
  const navigate = useNavigate();
  const [emailValue, setEmailValue] = useState('');
  const [buttonHidden, setButtonHidden] = useState(false);
  const [error, setError] = useState('');


  useEffect(() => {
    if (buttonHidden) {
      const timeoutId = setTimeout(() => {
        setButtonHidden(false);
        navigate(`/login`);
      }, 4000);
      
  
      // Limpia el temporizador al desmontar el componente
      return () => clearTimeout(timeoutId);
    }
  }, [buttonHidden]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const isEmailRegistered = await enviarToken(values.email);

      if (isEmailRegistered) {
        setButtonHidden(true)
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          background: "linear-gradient(to right, #0f172a, #082f49, #0f172a)",
          color: "white",
          timer: 5000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: "Correo enviado correctamente Revisa tu correo electrónico"
        });

        setShouldNavigate(true);
        setEmailValue(values.email);
           
      } else {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          background: "linear-gradient(to right, #0f172a, #082f49, #0f172a)",
          color: "white",
          timer: 5000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "error",
          title: "¡Lo sentimos! Correo no registrado",
        });
        // Manejo del error aquí
        setError(`El correo electrónico ${values.email} no está registrado.`);
        // Limpiar el estado de error después de tres segundos
        setTimeout(() => {
          setError('');
        }, 3000);
      }
    } catch (error) {
      console.error(error);
    }
  });
  
  

  // Define a spring animation for the form
  const formAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(-50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  });

  const generateRandomNumber = () => {
    return Math.floor(Math.random() * (29 - 10 + 1)) + 10;
  };

  const generateSpans = (count) => {
    const spans = [];
    for (let i = 0; i < count; i++) {
      spans.push(<span key={i} style={{ '--i': generateRandomNumber() }}></span>);
    }
    return spans;
  };


  return (
    <div className='contenedor'>
      {/* <video src={video} autoPlay loop muted className="absolute inset-0 object-cover w-full h-full z-0" preload></video> */}
      {/* <img src={backgroundImage} alt="Background" className="absolute inset-0 object-cover w-full h-full z-0" /> */}

      <div className="bubbles">
      {generateSpans(50)}
      </div>
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0f172a] via-[#082f49] to-[#0f172a] opacity-30 z-10"></div> {/* Fondo azul semi-transparente */}
      <div className='flex h-[calc(100vh-100px)] items-center justify-center '>
      <animated.div style={formAnimation}  className="relative z-20">
        <div className='bg-gradient-to-tr from-[#0f172a] via-[#082f49] to-[#0f172a] max-w-md w-full p-10 rounded-md shadow-md shadow-blue-500 '>
          {error && <div><Alert className="bg-red-500 p-2 text-white">{error}</Alert></div>}
          <h1 className='text-3xl font-bold my-2 text-center'>Recuperar Contraseña</h1>
          <p className="text-white text-center mb-4">Ingresa tu correo electrónico. Te enviaremos un enlace para que recuperes el acceso a tu cuenta.</p>

          <form onSubmit={onSubmit}>
            <input
              type="text"
              {...register("email", EmailRequired)}
              className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 border-0 border-b-2 border-sky-500 text-white px-4 py-2 rounded2 my-2"
              placeholder="Correo electrónico"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
            <div className='flex justify-center'>
              {!buttonHidden ?(<button
                className="px-5 py-1 m-2 text-sm text-withe font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent"
                type="submit">Siguiente</button>): (
                  <div className="flex justify-center items-center">
                    <ClipLoader
                      css={css`
                        display: block;
                        margin: 0 auto;
                        border-color: red;
                      `}
                      size={35}
                      color={"#123abc"}
                      loading={buttonHidden}
                    />
                    <p className="ml-2 text-white">Enviando...</p>
                  </div>
                ) }
            </div>
          </form>
        </div>
      </animated.div>
      </div>
    </div>
  );
}