import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";



export default function registerPage() {
  const { register, handleSubmit, formState:{errors} } = useForm();
  const {signup, isAuthenticated, errors: registerErrors} = useAuth() // todo hace parte del contexto y el errors es para que en el response data de la consola me muestre el error que tira desde el backend
  const navigate = useNavigate()
  useEffect(()=> { // para acuatilizar el estado del componente
    if (isAuthenticated) navigate("/tasks") // si esta authenticado que lo envie a   las tareas
    
    console.log('entro')
  }, [isAuthenticated])
  
  const onSubmit = handleSubmit((values) => {
    signup(values)
    console.log(values); // para que me  muestre los valores ingresados del formulario
  })
  console.log(registerErrors);


  return (
    <div className="bg-zinc-800 max-w-md p-10 rounded-md">
      {
      registerErrors.map((error, i ) => (
        <div className="bg-red-500 p-2 text-white" key={i}>
          {error}
        </div>
      ))
      }
      <form
        onSubmit={onSubmit}
      >
        <input
          type="text"
          {...register("username", { required: true })}
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded2 my-2"
          placeholder="Nombre de usuario"
        />
        {errors.username && (
          <p className="text-red-500">Username es requerido</p> // Corregido "Username" a "Username"
        )}
        <input
          type="email"
          {...register("email", { required: true })}
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded2 my-2"
          placeholder="Email"
        />
        {
          errors.email && (
          <p className="text-red-500">Email es requerido</p>
        )}
        <input
          type="password"
          {...register("password", { required: true })}
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded2 my-2"
          placeholder="Password"
        />
        {
          errors.password &&( <p className="text-red-500">Password es requerido</p>)
        }
        <button type="submit">Register</button>
      </form>
      <p className='flex gap-x-2 justify-between'>
         tienes cuenta ? <Link to='/login' className='text-sky-500'>Login</Link>
      </p>
    </div>
  );
}
