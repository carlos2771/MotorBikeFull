import { useForm } from "react-hook-form";
import { useRoles } from "../../context/RolsContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { NombreMaRequired } from "../../utils/validations";
import Swal from "sweetalert2";


export default function FormRoles() {
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const { createRol, getRol, updateRol, errors: rolesErrors } = useRoles();
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        (async () => {
          if (params.id) {
            const rol = await getRol(params.id);
            setValue("name", rol.name);
            setValue("status", rol.status);
            setSelectedPermissions(rol.permissions); // Establecer los permisos seleccionados
          } else {
            setValue("status", "Activo");
          }
        })();
      }, [params.id]);
  
      const onSubmit = handleSubmit(async (data) => {
        const camelCaseData = {
          name: toCamelCase(data.name),
          status: data.status,
          permissions: selectedPermissions, // Agregar permisos seleccionados
        };
      
        if (params.id) {
          const res = await updateRol(params.id, camelCaseData);
          handleApiResponse(res, "Actualizado correctamente");
        } else {
          const res = await createRol(camelCaseData);
          handleApiResponse(res, "Agregado correctamente");
        }
      });
      
      // Función para convertir texto de lowerCamelCase a camelCase
      function toCamelCase(text) {
        return text.replace(/^([A-Z])|[\s-_]+(\w)/g, function(match, p1, p2, offset) {
          if (p2) return p2.toUpperCase();
          return p1.toLowerCase();        
        });
      }

    const handlePermissionChange = (e) => {
        const { value } = e.target;
        if (selectedPermissions.includes(value)) {
          setSelectedPermissions(selectedPermissions.filter((perm) => perm !== value));
        } else {
          setSelectedPermissions([...selectedPermissions, value]);
        }
      };
  
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
        navigate('/rol');
      } else {
        // Toast.fire({
        //   icon: "error",
        //   title: "La marca ya existe . Verifica los errores.",
        // }); 
        console.log("no se agrego, el rol ya existe")
      }
    };
  
    return (
      <div className='flex items-center justify-center pt-20'>
        <div className='bg-slate-700 max-w-md w-full p-10 shadow-lg shadow-blue-600/40'>
          {rolesErrors.map((error, i) => (
            <div className="bg-red-500 p-2 text-white" key={i}>
              {error}
            </div>
          ))}
          <h1 className="text-2xl flex justify-center">Agregar Rol </h1>
          <form className="mt-10" onSubmit={onSubmit}>
            <label>Nombre del Rol<span className="text-red-500">*</span></label>
            <input
              type="text"
              placeholder='Nombre rol'
              {...register("name", NombreMaRequired)}
              className='w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2'
              autoFocus
            />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            <label>Permisos</label>
            <div className="flex flex-wrap">
            {["dashboard", "usuarios", "roles", "clientes", "mecanicos", "repuestos", "marcas", "compras", "ventas-servicio", "venta-repuesto", "tareas"].map((permiso) => (
                <div key={permiso} className="flex items-center mr-4 mb-2">
                <input
                    type="checkbox"
                    value={permiso}
                    checked={selectedPermissions.includes(permiso)}
                    onChange={handlePermissionChange}
                    className="mr-2"
                />
                <label>{permiso}</label>
                </div>
            ))}
            </div>
            <label className="hidden">Estado</label>
            <select
              {...register("status")}
              className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2 hidden"
            >
              <option value={"Activo"} >
                Activo
              </option>
              <option value={"Inactivo"} >
                Inactivo
              </option>
            </select>
  
            <button className='px-5 py-1 mt-4 text-sm text-withe font-semibold  rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500 hover:border-transparent shadow-lg shadow-zinc-300/30 ' type="submit">
              Guardar
            </button>
            <button>
              <Link className="px-5 py-1 ml-3 text-sm text-withe font-semibold  rounded-full border border-red-500 hover:text-white hover:bg-red-500 hover:border-transparent shadow-lg shadow-zinc-300/30" to="/rol">Cancelar</Link>
            </button>
          </form>
        </div>
      </div>
    );
  }
  