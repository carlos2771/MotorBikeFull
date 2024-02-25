import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { EmailRequired, PasswordRequire } from '../utils/validations';
import { Link, useNavigate } from 'react-router-dom';
import { Alert } from '@material-tailwind/react';
import { useSpring, animated } from 'react-spring';
import Swal from "sweetalert2";
import backgroundImage from './images/yamaha.jpg'; // Importa la imagen de fondo


export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signin, isAuthenticated, errors: signinErrors } = useAuth();
  const navigate = useNavigate();

  const onSubmit = handleSubmit((values) => {
    signin(values);
  });

  useEffect(() => {
    if (isAuthenticated) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        background: "linear-gradient(to right, #0f172a, #082f49, #0f172a)",
        color: "white",
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: "Bienvenid@",
      });
      navigate('/graficos');
    }
  }, [isAuthenticated]);

  // Define a spring animation for the form
  const formAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(-50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  });

  return (
    <div>
      <img src={backgroundImage} alt="Background" className="absolute inset-0 object-cover w-full h-full z-0" />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0f172a] via-[#082f49] to-[#0f172a] opacity-30 z-10"></div> {/* Fondo azul semi-transparente */}
      <div className="relative min-h-screen flex items-center justify-center">
      <animated.div style={formAnimation} className="relative z-20"> {/* Asegura que el formulario esté por encima de la imagen de fondo */}
      <div className='bg-gradient-to-tr from-[#0f172a] via-[#082f49] to-[#0f172a] max-w-md w-full p-10 rounded-md  '>
      {
      signinErrors && Array.isArray(signinErrors) && signinErrors.map((error, i ) => (
        <Alert className="bg-red-500  p-2 text-white" key={i}>
          {error}
        </Alert>
      ))
      }
        <h1 className='text-3xl font-bold my-2 text-center'>Iniciar sesión</h1>

      <form
        onSubmit={onSubmit}
      >
        <input
          type="email"
          {...register("email", EmailRequired )}
          className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 border-0 border-b-2 border-sky-500 text-white px-4 py-2 rounded2 my-2"
          placeholder="Correo electrónico"
        />
        {
          errors.email && (
          <p className="text-red-500">{errors.email.message}</p>
        )}
       <input
          type="password"
          {...register("password", PasswordRequire)}
          className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 border-0 border-b-2 border-sky-500 text-white px-4 py-2 rounded2 my-2"
          placeholder="Contraseña"
        />
        {
          errors.password &&( <p className="text-red-500">{errors.password.message}</p>)
        }
        <div className='flex justify-center'>
          <button 
          className="px-5 py-1 m-2 text-sm text-withe font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent"
          type="submit">Iniciar sesión</button>
          </div>
      </form>
      <p className='flex gap-x-2 justify-center'>
        ¿Olvidaste tu contraseña? <Link to='/reestablecer' className='text-sky-500 hover:text-yellow-200'>Recuperala aqui!</Link>
      </p>
      <p className='flex gap-x-2 justify-center'>
        ¿No tienes cuenta? <Link to='/register' className='text-sky-500 hover:text-yellow-200'>Registrate</Link>
      </p>
      </div>
      </animated.div>
    </div>
    </div>
  );
}