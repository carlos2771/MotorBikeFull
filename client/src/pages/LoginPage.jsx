import React from 'react'
import { useForm } from "react-hook-form";
import { useAuth } from '../hooks/useAuth';
import { EmailRequired, PasswordRequire } from '../utils/validations';
import { Link } from 'react-router-dom';



export default function loginPage() {

  const {register, handleSubmit, formState: {errors}} = useForm()
  const {signin, errors: signinErrors} = useAuth()

  const onSubmit = handleSubmit((values) =>{
    console.log(values);
    signin(values)
  })

  console.log(errors)


  return (
    <div className='flex h-[calc(100vh-100px)] items-center justify-center'>
      <div className='bg-zinc-800 max-w-md w-full p-10 rounded-md'>
      {
      signinErrors.map((error, i ) => (
        <div className="bg-red-500 p-2 text-white" key={i}>
          {error}
        </div>
      ))
      }
        <h1 className='text-2xl font-bold'>Login</h1>

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
        <button type="submit">Login</button>
      </form>
      <p className='flex gap-x-2 justify-between'>
        No tienes cuenta ? <Link to='/register' className='text-sky-500'>Registrate</Link>
      </p>
      </div>
    </div>
  )
}
