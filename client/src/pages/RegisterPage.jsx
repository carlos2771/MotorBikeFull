import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@material-tailwind/react";
import { EmailRequired, EstadoRequired ,PasswordRequire } from "../utils/validations";
import { useSpring, animated } from 'react-spring';

export default function registerPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signup, isAuthenticated, errors: registerErrors } = useAuth(); // todo hace parte del contexto y el errors es para que en el response data de la consola me muestre el error que tira desde el backend
  const navigate = useNavigate();

  console.log("authh", isAuthenticated);
  useEffect(() => {
    // para acuatilizar el estado del componente
    if (isAuthenticated) navigate("/tasks"); // si esta authenticado que lo envie a   las tareas

    console.log("entro");
  }, [isAuthenticated]);

  const onSubmit = handleSubmit((values) => {
    signup(values);
    console.log(values); // para que me  muestre los valores ingresados del formulario
  });
  console.log(registerErrors);

  const formAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(-50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  });

  return (
    <div>
      
      <div className="flex h-[calc(100vh-100px)] items-center justify-center ">
      <animated.div style={formAnimation} >
      <div className="bg-gradient-to-tr from-[#0f172a] via-[#082f49] to-[#0f172a] w-full max-w-md p-10 rounded-md ">
        {registerErrors.map((error, i) => (
          <div className="bg-red-500 p-2 text-white" key={i}>
            {error}
          </div>
        ))}
        <h1 className="text-3xl font-bold my-2 text-center">Registrarse</h1>
        <form onSubmit={onSubmit}>
        
          <input
            type="text"
            {...register("username",EstadoRequired )}
            className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-4 py-2 rounded2 my-2 border-0 border-b-2 border-sky-500   "
            placeholder="Nombre de usuario"
          />
          {errors.username && (
            <p className="text-red-500">Nombre de usuario es requerido</p> // Corregido "Username" a "Username"
          )}
          <input
            type="email"
            {...register("email", EmailRequired)}
            className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-4 py-2 rounded2 my-2 border-0 border-b-2 border-sky-500 "
            placeholder="Email"
          />
          {
          errors.email && (
          <p className="text-red-500">{errors.email.message}</p>
        )}
          <input
            type="password"
            {...register("password", PasswordRequire)}
            className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-4 py-2 rounded2 my-2 border-0 border-b-2 border-sky-500 "
            placeholder="Contraseña"
          />
          {errors.password && (
            <p className="text-red-500">Contraseña es requerida</p>
          )}
          <div className="flex justify-center">
            <button
              className="px-5 py-1 text-sm m-2 text-withe font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent"
              type="submit">
              Registrar
            </button>
          </div>
        </form>
        <p className="flex gap-x-2 justify-center">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="text-sky-500 hover:text-yellow-200">
            Iniciar sesión
          </Link>
        </p>
      </div>
      </animated.div>
    </div>
    </div>
  );
}
