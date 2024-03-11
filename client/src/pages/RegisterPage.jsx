import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@material-tailwind/react";
import {
  EmailRequired,
  EstadoRequired,
  PasswordRequire,
  NombreMaRequired
} from "../utils/validations";
import { useSpring, animated } from "react-spring";
import Swal from "sweetalert2";
import backgroundImage from "./images/yamaha.jpg"; // Importa la imagen de fondo

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function registerPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signup, isAuthenticated, errors: registerErrors, userFound  } = useAuth(); // todo hace parte del contexto y el errors es para que en el response data de la consola me muestre el error que tira desde el backend
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = handleSubmit(async (values) => {
    if (!userFound) {
      const res = await signup(values);
      handleApiResponse(res, "Registrado correctamente");
    } else {
      handleApiResponse(res, "Error al registrar");
    }
  });

  const handleApiResponse = (res, successMessage) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
  
    if (res && !res.error) {
      Toast.fire({
        icon: "success",
        title: successMessage,
      });
      navigate("/login");
    } else {
      Toast.fire({
        icon: "error",
        title: "Error al crear el usuario",
      });
    }
  };

  const formAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(-50px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <img
        src={backgroundImage}
        alt="Background"
        className="absolute inset-0 object-cover w-full h-full z-0"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0f172a] via-[#082f49] to-[#0f172a] opacity-30 z-10"></div>{" "}
      {/* Fondo azul semi-transparente */}
      <div className="flex h-[calc(100vh-100px)] items-center justify-center pt-20">
        <animated.div style={formAnimation} className="relative z-20">
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
                {...register("username", NombreMaRequired)}
                className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-4 py-2 rounded2 my-2 border-0 border-b-2 border-sky-500   "
                placeholder="Nombre de usuario"
              />
              {errors.username && (
                <p className="text-red-500">Nombre de usuario es requerido</p> // Corregido "Username" a "Username"
              )}
              <input
                type="text"
                {...register("email", EmailRequired)}
                className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-4 py-2 rounded2 my-2 border-0 border-b-2 border-sky-500 "
                placeholder="Correo electrónico"
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", PasswordRequire)}
                  className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 border-0 border-b-2 border-sky-500 text-white px-4 py-2 rounded2 my-2"
                  placeholder="Contraseña"
                />
                <button
                  type="button"
                  className="absolute right-4 top-4"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  ) : (
                    <FontAwesomeIcon icon={faEye} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
              <input
                type={showPassword ? "text" : "password"}
                {...register("confirmPassword", PasswordRequire)}
                className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 border-0 border-b-2 border-sky-500 text-white px-4 py-2 rounded2 my-2"
                placeholder="Confirmar Contraseña"
              />
              {errors.confirmPassword && (
                <p className="text-red-500">{errors.confirmPassword.message}</p>
              )}
              <select
                {...register("estado")}
                className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2 hidden"
              >
                <option value={"Activo"}>Activo</option>
                <option value={"Inactivo"}>Inactivo</option>
              </select>

              <div className="flex justify-center">
                <button
                  className="px-5 py-1 text-sm m-2 text-withe font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent"
                  type="submit"
                >
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
