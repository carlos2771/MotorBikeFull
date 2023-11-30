import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { EstadoRequired } from '../utils/validations';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Alert } from '@material-tailwind/react';
import Swal from 'sweetalert2';

const ValidarCodePage = () => {
  const { register, handleSubmit, setValue, formState: { errors, values } } = useForm();
  const { validarToken, errors: verificationErrors } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const [email, setEmail] = useState('');
  const [backendErrors, setBackendErrors] = useState([]);

  useEffect(() => {
    const userEmail = params.email;
    setEmail(userEmail);

    // Verifica si no hay errores y realiza la redirección
    if (values && values.code && backendErrors.length === 0) {
      navigate(`/reestablecer-password/${values.code}`);
    }
  }, [backendErrors, values, navigate, params]);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const user = await validarToken(formData.code);

      // Verifica si el código es válido
      if (!user) {
        // Actualiza el estado con el mensaje de error
        setBackendErrors(['Código incorrecto, inténtalo de nuevo']);
        return;
      }

      // Establece el valor del código en el estado
      setValue("code", values.code);

      // Redirige a la página de actualización de contraseña con el código
      navigate(`/reestablecer-password/${values.code}`);
    } catch (error) {
      console.error(error);
      // Actualiza el estado con el mensaje de error del backend
      setBackendErrors(['Error en el servidor, inténtalo de nuevo']);
    }
  });

  return (
    <div>
      <div className='flex h-[calc(100vh-100px)] items-center justify-center '>
        <div className='bg-gradient-to-tr from-[#0f172a] via-[#082f49] to-[#0f172a] max-w-md w-full p-10 rounded-md  '>
          {/* Muestra errores de autenticación */}
          {backendErrors.map((error, i) => (
            <Alert className="bg-red-500 p-2 text-white" key={i}>
              {error}
            </Alert>
          ))}
          <h1 className='text-3xl font-bold my-2 text-center'>Recuperar Contraseña</h1>
          {/* Mostrar el correo electrónico en el mensaje */}
          <p className="text-white text-center mb-4">Hemos enviado un código de verificación a tu correo electrónico. Ingresa el código de verificación</p>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              {...register("code", EstadoRequired)}
              className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-4 py-2 rounded2 my-2 border-0 border-b-2 border-sky-500"
              placeholder="Ingresa el código"
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
      </div>
    </div>
  );
}

export default ValidarCodePage;
