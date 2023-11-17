import React, { useEffect } from 'react'
import { useForm } from "react-hook-form";
import { useAuth } from '../hooks/useAuth';
import { EmailRequired, PasswordRequire } from '../utils/validations';
import { Link,  useNavigate, useParams } from 'react-router-dom';
import { Alert } from "@material-tailwind/react";

const PasswordPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { enviarToken ,  isAuthenticated, errors: signinErrors} = useAuth();
    const navigate = useNavigate();
    const params = useParams();
    // const onSubmit = handleSubmit(async (values) => {
    //     try {
    //         await enviarToken(values.email);
    //         navigate(`/restablecer-password/${values.email}`);
    //       } catch (error) {
    //         console.error(error);
    //       }
    // });

    const onSubmit = handleSubmit((values) =>{
      enviarToken(values.email)
    })
  
    useEffect(() => {
      if (isAuthenticated) {
        navigate(`/restablecer-password/${values.email}`);
      }
    }, [isAuthenticated]);

  return (
    <div>
      <div className='flex h-[calc(100vh-100px)] items-center justify-center '>
      <div className='bg-gradient-to-tr from-[#0f172a] via-[#082f49] to-[#0f172a] max-w-md w-full p-10 rounded-md  '>
      {
      signinErrors && Array.isArray(signinErrors) && signinErrors.map((error, i ) => (
        <Alert className="bg-red-500 p-2 text-white" key={i}>
          {error}
        </Alert>
      ))
      }
        <h1 className='text-3xl font-bold my-2 text-center'>Recuperar Contraseña</h1>
        <p className="text-white text-center mb-4">Por razones de seguridad ingresa tu correo electronico, para verificar que seas tu:</p>

      <form
        onSubmit={onSubmit}
      >
        <input
          type="email"
          {...register("email", EmailRequired )}
          className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 border-0 border-b-2 border-sky-500 text-white px-4 py-2 rounded2 my-2"
          placeholder="Email"
        />
        {
          errors.email && (
          <p className="text-red-500">{errors.email.message}</p>
        )}
        <div className='flex justify-center'>
          <button 
          className="px-5 py-1 m-2 text-sm text-withe font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent"
          type="submit">Siguiente</button>
          </div>
      </form>
    
      </div>
    </div>
    </div>
    
  )
}

export default PasswordPage;