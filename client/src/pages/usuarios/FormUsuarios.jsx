import { useForm } from "react-hook-form";
import { useUsuario } from "../../context/usuariosContext";
import { useRoles } from "../../context/RolsContext";
import { Link, useNavigate, useParams, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  EmailRequired,
  EstadoRequired,
  NombreRequired,
  PasswordRequire,
  NombreUsuarioRequired,
} from "../../utils/validations";
import Swal from "sweetalert2";
import { useAuth } from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function FormUsuarios() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const {
    createUsuario,
    getUsuario,
    updateUsuario,
    errors: ErroresUsuarios,
  } = useUsuario();
  const navigate = useNavigate();
  const params = useParams();
  const { roles, getRoles } = useRoles();
  const [formTitle, setFormTitle] = useState("Agregar usuario");
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const [usuarioErrors, setUsuarioErrors] = useState([]);
  
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    try {
      getRoles();
    } catch (error) {
      console.error("Error al obtener roles:", error);
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (params.id) {
        setIsEditing(true);
        setFormTitle("Editar usuario");
        const usuario = await getUsuario(params.id);
        setValue("username", usuario.username);
        setValue("email", usuario.email);
        setValue("password", usuario.password);
        setValue("estado", usuario.estado);
        setValue("rol", usuario.rol);
      } else {
        setValue("estado", "Activo");
      }
    })();
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    if (params.id) {
      const res = await updateUsuario(params.id, data);
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        background: "linear-gradient(to right, #0f172a, #082f49, #0f172a)",
        color: "white",
        timer: 4000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      if (res.error) {
        Toast.fire({
          icon: "error",
          title: "Error al actualizar",
        });
      } else {
        // Si la actualización se realizó con éxito, mostrar un mensaje de éxito
        Toast.fire({
          icon: "success",
          title: "Actualizado correctamente",
        });
        navigate("/usuarios");
      }
    } else {
      const res = await createUsuario(data);
      console.log("entrooo");
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        background: "linear-gradient(to right, #0f172a, #082f49, #0f172a)",
        color: "white",
        timer: 4000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: "Agregado correctamente",
      });
      if (res) {
        navigate("/usuarios");
      } else {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          background: "linear-gradient(to right, #0f172a, #082f49, #0f172a)",
          color: "white",
          timer: 4000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "error",
          title: "No se ha agregado",
        });
      }
    }
  });

  const permissions = user?.rol?.permissions || [];

  return (
    <>
      {permissions.includes("Usuarios") ? (
        <div className="flex items-center justify-center pt-20">
          <div className="bg-slate-700 max-w-md w-full p-10 shadow-lg shadow-blue-600/40">
          {Array.isArray(ErroresUsuarios) && ErroresUsuarios.map((error, i) => (
              <div className="bg-red-500 p-2 text-white" key={i}>
                {ErroresUsuarios}
              </div>
            ))}
            <h1 className="text-2xl flex justify-center">{formTitle} </h1>
            <form className="mt-10" onSubmit={onSubmit}>
              <label>
                Nombre de Usuario<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nombre de usuario"
                {...register("username", NombreUsuarioRequired)}
                className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
                autoFocus
              />
              {errors.username && errors.username.message && (
                <p className="text-red-500">{errors.username.message}</p>
              )}
              <label>
                Correo Electrónico<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="email"
                {...register("email", EmailRequired)}
                className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
              {!isEditing && ( // Renderiza el campo de contraseña solo si no estamos editando
                <>
                 <label>
                    Password<span className="text-red-500">*</span>
                  </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="password"
                    {...register("password", PasswordRequire)}
                    className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
                  />
                  <button
                  type="button"
                  className="absolute right-4 top-4"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <FontAwesomeIcon icon={faEyeSlash} title="Ocultar"/>
                  ) : (
                    <FontAwesomeIcon icon={faEye} title="Mostrar"/>
                  )}
                </button>
                </div>
                  {errors.password && (
                    <p className="text-red-500">{errors.password.message}</p>
                  )}
                </>
              )}
              <label className="hidden">Estado</label>
              <select
                {...register("estado")}
                className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2 hidden"
              >
                <option value={"Activo"}>Activo</option>
                <option value={"Inactivo"}>Inactivo</option>
              </select>
              <label>Rol</label>
              <select
                {...register("rol", NombreRequired)}
                className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
              >
                <option value="">Seleccionar rol</option>
                {roles.map((rol) => {
                  if (rol.name !== "administrador") {
                    return (
                      <option key={rol._id} value={rol._id}>
                        {rol.name}
                      </option>
                    );
                  }
                  return null; // Si es Administrador, retornamos null para no renderizar nada
                })}
              </select>
              {errors.rol && (
                <p className="text-red-500">{errors.rol.message}</p>
              )}
              <div className="flex items-center justify-center mt-2">
              <button
                className="px-5 py-1 text-sm text-withe font-semibold  rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500 hover:border-transparent shadow-lg shadow-zinc-300/30 "
                type="submit"
              >
                Guardar
              </button>
              <button>
                <Link
                  className="px-5 py-1 ml-3 text-sm text-withe font-semibold  rounded-full border border-red-500 hover:text-white hover:bg-red-500 hover:border-transparent shadow-lg shadow-zinc-300/30"
                  to="/usuarios"
                >
                  Cancelar
                </Link>
              </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <Navigate to="/tasks" />
      )}
    </>
  );
}
