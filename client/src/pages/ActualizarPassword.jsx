import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { PasswordRequire, PasswordRequired } from '../utils/validations';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Alert } from '@material-tailwind/react';
import { useSpring, animated } from 'react-spring';
import Swal from "sweetalert2";

import backgroundImage from './images/yamaha.jpg'; // Importa la imagen de fondo
import video from './Videos/air_bubbles.mp4'

import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function ActualizarPassword () {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const { actualizarPassword, errors: updateErrors } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    
  }, []);

  

  const onSubmit = async (values) => {
    // Validar que las contraseñas coincidan
    if (values.password !== values.confirmPassword) {
      // setPasswordError('Las contraseñas no coinciden');
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        background: "linear-gradient(to right, #0f172a, #082f49, #0f172a)",
        color: "white",
        timer: 4000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "error",
        title: "Contraseñas no coinciden",
      });
      return;
    }

    try {
      await actualizarPassword(params.code, values.password, values.confirmPassword);
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        background: "linear-gradient(to right, #0f172a, #082f49, #0f172a)",
        color: "white",
        timer: 4000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: "Contraseña actualizada correctamente",
      });
      navigate(`/login`);
    } catch (error) {
      console.error(error);
      navigate(`/login`)
    }
  };

  // Define a spring animation for the form
  const formAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(-50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
      <div className="bubbles ">
      {generateSpans(50)}
      </div>
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0f172a] via-[#082f49] to-[#0f172a] opacity-30 z-10"></div> {/* Fondo azul semi-transparente */}
      <div className='flex h-[calc(100vh-100px)] items-center justify-center'>
        <animated.div style={formAnimation} className="relative z-20" >
        <div className='bg-gradient-to-tr from-[#0f172a] via-[#082f49] to-[#0f172a] max-w-md w-full p-10 rounded-md shadow-md shadow-blue-500'>
          {/* Mostrar errores de actualización */}
          {updateErrors.map((error, i) => (
            <Alert className="bg-red-500 p-2 text-white" key={i}>
              {error}
            </Alert>
          ))}

          <h1 className='text-3xl font-bold my-2 text-center'>Recuperar Contraseña</h1>
          <p className="text-white text-center mb-4">Ingresa tu nueva contraseña</p>
          <form onSubmit={handleSubmit(onSubmit)} method="POST"> {/* Agrega method="POST" aquí */}
          <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", PasswordRequired)}
                  className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 border-0 border-b-2 border-sky-500 text-white px-4 py-2 rounded2 my-2"
                  placeholder="Contraseña"
                />
                <button
                  type="button"
                  className="absolute right-4 top-4"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <FontAwesomeIcon icon={faEyeSlash} title="Ocultar"/>
                  ) : (
                    <FontAwesomeIcon icon={faEye} title="Mostrar"/>
                  )}
                </button>
              </div>
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}

            <input
              type={showPassword ? "text" : "password"}
              {...register('confirmPassword', PasswordRequire)}
              className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 border-0 border-b-2 border-sky-500 text-white px-4 py-2 rounded2 my-2"
              placeholder="Confirmar Contraseña"
            />
            {errors.confirmPassword && (
              <p className="text-red-500">{errors.confirmPassword.message}</p>
            )}
            {passwordError && (
              <p className="text-red-500">{passwordError}</p>
            )}

            <div className='flex justify-center'>
              <button
                className="px-5 py-1 m-2 text-sm text-withe font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent"
                type="submit"
              >
                Actualizar
              </button>
            </div>
          </form>
        </div>
        </animated.div>
      </div>
    </div>
  );
};

