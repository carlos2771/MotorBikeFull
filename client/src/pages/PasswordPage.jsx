import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useAuth } from '../hooks/useAuth';
import { EmailRequired } from '../utils/validations';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Alert } from "@material-tailwind/react";
import { useSpring, animated } from 'react-spring';
import Swal from "sweetalert2";
import backgroundImage from './images/yamaha.jpg'; // Importa la imagen de fondo


export default function PasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { enviarToken, isAuthenticated, errors: signinErrors } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [emailValue, setEmailValue] = useState('');

  const onSubmit = handleSubmit(async (values) => {
    try {
      const isEmailRegistered = await enviarToken(values.email);

      if (isEmailRegistered) {
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
          title: "El correo no existe",
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

  // useEffect(() => {
  //   if (shouldNavigate) {
  //     navigate(`/restablecer-password/${emailValue}`);
  //   }
  // }, [shouldNavigate, emailValue]);

  const [error, setError] = useState('');

  // Define a spring animation for the form
  const formAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(-50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  });

  return (
    <div>
      <img src={backgroundImage} alt="Background" className="absolute inset-0 object-cover w-full h-full z-0" />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0f172a] via-[#082f49] to-[#0f172a] opacity-30 z-10"></div> {/* Fondo azul semi-transparente */}
      <div className='flex h-[calc(100vh-100px)] items-center justify-center '>
      <animated.div style={formAnimation}  className="relative z-20">
        <div className='bg-gradient-to-tr from-[#0f172a] via-[#082f49] to-[#0f172a] max-w-md w-full p-10 rounded-md  '>
          {error && <div><Alert className="bg-red-500 p-2 text-white">{error}</Alert></div>}
          <h1 className='text-3xl font-bold my-2 text-center'>Recuperar Contraseña</h1>
          <p className="text-white text-center mb-4">Por razones de seguridad ingresa tu correo electrónico, para verificar que seas tu:</p>

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
              <button
                className="px-5 py-1 m-2 text-sm text-withe font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent"
                type="submit">Siguiente</button>
            </div>
          </form>
        </div>
      </animated.div>
      </div>
    </div>
  );
}

