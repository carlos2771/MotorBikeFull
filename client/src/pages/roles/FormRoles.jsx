import { useForm } from "react-hook-form";
import { useRoles } from "../../context/RolsContext";
import { Link, useNavigate, useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { NombreMaRequired, NombreRolRequired } from "../../utils/validations";
import Swal from "sweetalert2";
import { useAuth } from "../../hooks/useAuth";

export default function FormRoles() {
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const { createRol, getRol, updateRol, errors: rolesErrors } = useRoles();
  const navigate = useNavigate();
  const params = useParams();
  const [formTitle, setFormTitle] = useState("Agregar rol");

  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      if (params.id) {
        setFormTitle("Editar rol");
        const rol = await getRol(params.id);
        setValue("name", rol.name);
        setValue("status", rol.status);
        setSelectedPermissions(rol.permissions); // Establecer los permisos seleccionados
      } else {
        setValue("status", "Activo");
      }
    })();
  }, [params.id]);

//   const onSubmit = handleSubmit(async (data) => {
//     const lowercaseData = {
//       name: data.name.toLowerCase(),
//       status: data.status,
//       permissions: selectedPermissions,
//     };

// })

const onSubmit = handleSubmit(async (data) => {
  const lowercaseData = {
    ...data,
    name: data.name.toLowerCase(),
    status: data.status,
    permissions: selectedPermissions,
  };

  if (params.id) {
    const res = await updateRol(params.id, lowercaseData);
    handleApiResponse(res, "Actualizado correctamente");
  } else {
    const res = await createRol(lowercaseData);
    handleApiResponse(res, "Agregado correctamente");
  }
});

  const handlePermissionChange = (event) => {
    const { value, checked } = event.target;
    let updatedPermissions = [...selectedPermissions];
    if (checked) {
      updatedPermissions.push(value);
    } else {
      updatedPermissions = updatedPermissions.filter(
        (permission) => permission !== value
      );
    }
    setSelectedPermissions(updatedPermissions);
  };

  // Check if there are no permissions selected, then set default to "usuario"
  if (selectedPermissions.length === 0) {
    setSelectedPermissions(["Tareas"]);
  }

  const handleApiResponse = (res, successMessage) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
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
      navigate("/rol");
    } else {
      Toast.fire({
        icon: "error",
        title: "Ese rol ya existe",
      });
    }
  };

  const permissions = user?.rol?.permissions || [];

  return (
    <>
      {permissions.includes("Roles") ? (
        <div className="flex items-center justify-center pt-20">
          <div className="bg-slate-700 max-w-lg w-full p-10 shadow-lg shadow-blue-600/40">
            {rolesErrors.map((error, i) => (
              <div className="bg-red-500 p-2 text-white" key={i}>
                {error}
              </div>
            ))}
            <h1 className="text-2xl flex justify-center">{formTitle}</h1>
            <form className="mt-10" onSubmit={onSubmit}>
              <label>
                Nombre del rol<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nombre de rol"
                {...register("name", NombreRolRequired)}
                className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
                autoFocus
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
              <label>Permisos</label>
              <div className="flex flex-wrap">
                {[
                  "Dashboard",
                  "Usuarios",
                  "Roles",
                  "Clientes",
                  "Mecánicos",
                  "Repuestos",
                  "Marcas",
                  "Compras",
                  "Ventas Servicio",
                  "Venta Repuesto",
                ].map((permiso) => (
                  <div key={permiso} className="flex items-center m-2 ">
                    <input
                      type="checkbox"
                      value={permiso}
                      checked={selectedPermissions.includes(permiso)}
                      onChange={handlePermissionChange}
                      className="hidden"
                      id={permiso} // Añadimos un id al input
                    />
                    <label
                      htmlFor={permiso}
                      className={`px-4 py-2 rounded-full cursor-pointer ${
                        selectedPermissions.includes(permiso)
                          ? "bg-blue-600/40 shadow-sky-300/40 text-white shadow-md hover:shadow-md hover:shadow-red-500 hover:bg-red-500"
                          : "border border-blue-600/40 hover:bg-blue-600/40 text-white hover:shadow-md hover:shadow-sky-300/40"
                      }`}
                    >
                      {permiso}
                    </label>
                  </div>
                ))}
              </div>
              <label className="hidden">Estado</label>
              <select
                {...register("status")}
                className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2 hidden"
              >
                <option value={"Activo"}>Activo</option>
                <option value={"Inactivo"}>Inactivo</option>
              </select>
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
                  to="/rol"
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
