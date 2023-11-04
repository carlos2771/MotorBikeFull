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
      <div className='flex h-[calc(100vh-100px)] items-center justify-center'>
      <div className='bg-zinc-800 max-w-md w-full p-10 rounded-md'>
      {
      signinErrors.map((error, i ) => (
        <Alert className="bg-red-500 p-2 text-white" key={i}>
          {error}
        </Alert>
      ))
      }
        <h1 className='text-3xl font-bold my-2'>Login</h1>

      <form
        onSubmit={onSubmit}
      >
        <input
          type="email"
          {...register("email", EmailRequired )}
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded2 my-2"
          placeholder="Email"
        />
        {
          errors.email && (
          <p className="text-red-500">{errors.email.message}</p>
        )}
       <input
          type="password"
          {...register("password", PasswordRequire)}
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded2 my-2"
          placeholder="Password"
        />
        {
          errors.password &&( <p className="text-red-500">{errors.password.message}</p>)
        }
        <button 
        className="px-5 py-1 text-sm text-withe font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent"
        type="submit">Login</button>
      </form>
      <p className='flex gap-x-2 justify-between'>
        No tienes cuenta ? <Link to='/register' className='text-sky-500'>Registrate</Link>
      </p>
      </div>
    </div>
    </div>
    
  )
}
