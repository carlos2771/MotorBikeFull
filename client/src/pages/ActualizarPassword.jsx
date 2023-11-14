import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { PasswordRequire } from '../utils/validations';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Alert } from '@material-tailwind/react';

const ActualizarPassword = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const { actualizarPassword, errors: updateErrors } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    
  }, []);

  const onSubmit = async (values) => {
    // Validar que las contraseñas coincidan
    if (values.password !== values.confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    try {
      console.log("Código:", params.code); 
      await actualizarPassword(params.code, values.password, values.confirmPassword);
      console.log("Contraseña actualizada correctamente");
      navigate(`/login`);
    } catch (error) {
      console.error(error);
      console.log("Algo salió mal");
      navigate(`/login`)
    }
  };

  return (
    <div className='flex h-[calc(100vh-100px)] items-center justify-center'>
      <div className='bg-gradient-to-tr from-[#0f172a] via-[#082f49] to-[#0f172a] max-w-md w-full p-10 rounded-md'>
        {/* Mostrar errores de actualización */}
        {updateErrors.map((error, i) => (
          <Alert className="bg-red-500 p-2 text-white" key={i}>
            {error}
          </Alert>
        ))}

        <h1 className='text-3xl font-bold my-2 text-center'>Recuperar Contraseña</h1>
        <p className="text-white text-center mb-4">Ingresa tu nueva contraseña</p>
        <form onSubmit={handleSubmit(onSubmit)} method="POST"> {/* Agrega method="POST" aquí */}
          <input
            type="password"
            {...register("password", PasswordRequire)}
            className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 border-0 border-b-2 border-sky-500 text-white px-4 py-2 rounded2 my-2"
            placeholder="Nueva contraseña"
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}

          <input
            type="password"
            {...register('confirmPassword', { required: 'Confirmar Contraseña es requerido' })}
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
    </div>
  );
};

export default ActualizarPassword;
