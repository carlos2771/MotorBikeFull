import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


export default function registerPage() {
  const { register, handleSubmit } = useForm();
  const {signup, isAuthenticated} = useAuth()
  const navigate = useNavigate()
  useEffect(()=> { // para acuatilizar el estado del componente
    if (isAuthenticated) navigate("/tasks") // si esta authenticado que lo envie a las tareas
    
    console.log('entro')
  }, [isAuthenticated])

  const onSubmit = handleSubmit((values) => {
    signup(values)
    console.log(values); // para que me  muestre los valores ingresados del formulario
    
  })

  return (
    <div className="bg-zinc-800 max-w-md p-10 rounded-md">
      <form
        onSubmit={onSubmit}
      >
        <input
          type="text"
          {...register("username", { required: true })}
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded2 my-2"
          placeholder="Nombre de usuario"
        />
        <input
          type="email"
          {...register("email", { required: true })}
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded2 my-2"
          placeholder="Email"
        />
        <input
          type="password"
          {...register("password", { required: true })}
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded2 my-2"
          placeholder="Password"
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
