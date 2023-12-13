import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { EstadoRequired } from '../utils/validations';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Alert } from '@material-tailwind/react';
import { useSpring, animated } from 'react-spring';
import Swal from "sweetalert2";

const ValidarCodePage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { validarToken, errors: verificationErrors } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  

  useEffect(() => {
    const userEmail = params.email;
    setEmail(userEmail);
  }, [params]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const isValidCode = await validarToken(values.code);

      if (isValidCode) {
        console.log('El código es válido. Redirigiendo a la página de restablecimiento de contraseña.');
        navigate(`/reestablecer-password/${values.code}`);
      } else {
        console.log('El código no es válido.');
        setError('El código no es válido. Por favor, verifica e intenta nuevamente.');
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

  return (
    <div>
      <div className='flex h-[calc(100vh-100px)] items-center justify-center '>
       <animated.div style={formAnimation} >
        <div className='bg-gradient-to-tr from-[#0f172a] via-[#082f49] to-[#0f172a] max-w-md w-full p-10 rounded-md  '>
          {error && <div><Alert className="bg-red-500 p-2 text-white">{error}</Alert></div>}
          <h1 className='text-3xl font-bold my-2 text-center'>Recuperar Contraseña</h1>
          <p className="text-white text-center mb-4">Hemos enviado un codigo de verificacion a tu correo electronico. Ingresa el codigo de verificación</p>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              {...register("code", EstadoRequired)}
              className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-4 py-2 rounded2 my-2 border-0 border-b-2 border-sky-500"
              placeholder="Ingresa el codigo"
            />
            {errors.code && (
              <p className="text-red-500">{errors.code.message}</p>
            )}

            <div className='flex justify-center'>
              <button
                className="px-5 py-1 m-2 text-sm text-withe font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent"
                type="submit"
              >
                Siguiente
              </button>
            </div>
          </form>
        </div>
       </animated.div>
      </div>
    </div>
  );
}

export default ValidarCodePage;
