import React, { useEffect} from 'react'
import { useForm } from "react-hook-form";
import { useAuth } from '../hooks/useAuth';
import { EmailRequired, PasswordRequire } from '../utils/validations';
import { Link,  useNavigate } from 'react-router-dom';
import { Alert } from "@material-tailwind/react";



export default function loginPage() {

  const {register, handleSubmit, formState: {errors}} = useForm()
  const {signin, isAuthenticated, errors: signinErrors} = useAuth()
  const navigate = useNavigate()

  const onSubmit = handleSubmit((values) =>{
    signin(values)
  })

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/tasks");
    }
  }, [isAuthenticated]);


  return (
    <div>
      <div className='flex h-[calc(100vh-100px)] items-center justify-center '>
      <div className='bg-gradient-to-tr from-[#0f172a] via-[#082f49] to-[#0f172a] max-w-md w-full p-10 rounded-md  '>
      {
      signinErrors.map((error, i ) => (
        <Alert className="bg-red-500 p-2 text-white" key={i}>
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
          placeholder="Email"
        />
        {
          errors.email && (
          <p className="text-red-500">{errors.email.message}</p>
        )}
       <input
          type="password"
          {...register("password", PasswordRequire)}
          className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 border-0 border-b-2 border-sky-500 text-white px-4 py-2 rounded2 my-2"
          placeholder="Password"
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
        ¿No tienes cuenta? <Link to='/register' className='text-sky-500 hover:text-yellow-200'>Registrate</Link>
      </p>
      </div>
    </div>
    </div>
    
  )
}
