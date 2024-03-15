import { useForm } from "react-hook-form";
import { useMecanicos } from "../../context/MecanicosContext";
import { Link } from "react-router-dom";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { useEffect } from "react";
import {
  NombreRequired,
  CedulaRequired,
  TelefonoRequired,
  DireccionRequired,
  NombreMeRequired,
  CedulaExtRequired,
} from "../../utils/validations";
import Swal from "sweetalert2";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function FormMecanico() {
  const {
    register,
    unregister,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const {
    createMecanico,
    getMecanico,
    updateMecanico,
    errors: MecanicoErrors,
  } = useMecanicos();
  const navigate = useNavigate();
  const params = useParams();
  const [formTitle, setFormTitle] = useState("Agregar mecánico");
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      if (params.id) {
        setFormTitle("Editar mecánico");
        const mecanico = await getMecanico(params.id);
        setValue("tipo", mecanico.tipo);
        setValue("cedula_mecanico", mecanico.cedula_mecanico);
        setValue("nombre_mecanico", mecanico.nombre_mecanico);
        setValue("telefono_mecanico", mecanico.telefono_mecanico);
        setValue("direccion_mecanico", mecanico.direccion_mecanico);
      }
    })();
  }, []);

  const handleTipoChange = (selectedTipo) => {
    // Desregistrando el campo antes de volver a registrarlo
    unregister("cedula_mecanico");
    // Actualiza la validación según el tipo seleccionado
    if(selectedTipo === "Cédula de extranjería") {

      register("cedula_mecanico", CedulaExtRequired);
    } else {
      register("cedula_mecanico", CedulaRequired);
    }
  };

  // Función para capitalizar la primera letra de cada palabra en un nombre
  const capitalizeName = (name) => {
    return name
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const onSubmit = handleSubmit(async (data) => {
    // Capitalizar la primera letra de cada palabra en el nombre completo
    data.nombre_mecanico = capitalizeName(data.nombre_mecanico);

    if (params.id) {
      try {
        const res = await updateMecanico(params.id, data);
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
          navigate("/mecanicos");
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      const res = await createMecanico(data);
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
      if (res) {
        Toast.fire({
          icon: "success",
          title: "Agregado correctamente",
        });
        navigate("/mecanicos");
      } else {
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
      {permissions.includes("Mecánicos") ? (
        <div className="flex items-center justify-center pt-20">
          <div className="bg-slate-700 max-w-md w-full p-10 shadow-lg shadow-blue-600/40">
            {MecanicoErrors.map((error, i) => (
              <div className="bg-red-500 p-2 text-white" key={i}>
                {error}
              </div>
            ))}
            <h1 className="text-2xl flex justify-center">{formTitle}</h1>
            <form className="mt-10" onSubmit={onSubmit}>
              <label>
                Tipo Documento<span className="text-red-500">*</span>
              </label>
              <select
                {...register("tipo", NombreRequired)}
                onChange={(e) => handleTipoChange(e.target.value)}
                className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
              >
                <option value={""}>Selecciona el tipo de documento</option>
                <option value={"Cédula de ciudadanía"}>
                  Cédula de ciudadanía
                </option>
                <option value={"Cédula de extranjería"}>
                  Cédula de extranjería
                </option>
              </select>
              {errors.tipo && (
                <p className="text-red-500">{errors.tipo.message}</p>
              )}
              <label>
                Documento<span className="text-red-500">*</span>
              </label>
              <input
                placeholder="Documento"
                {...register("cedula_mecanico")}
                className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
                autoFocus
              />
              {errors.cedula_mecanico && (
                <p className="text-red-500">{errors.cedula_mecanico.message}</p>
              )}
              <label>
                Nombre Completo<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nombre Completo"
                {...register("nombre_mecanico", NombreMeRequired)}
                className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
                autoFocus
              />
              {errors.nombre_mecanico && (
                <p className="text-red-500">{errors.nombre_mecanico.message}</p>
              )}

              <label>
                Teléfono<span className="text-red-500">*</span>
              </label>
              <input
                placeholder="Teléfono Mecánico"
                {...register("telefono_mecanico", TelefonoRequired)}
                className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
              />
              {errors.telefono_mecanico && (
                <p className="text-red-500">
                  {errors.telefono_mecanico.message}
                </p>
              )}

              <label>
                Dirección<span className="text-red-500">*</span>
              </label>
              <input
                placeholder="Dirección"
                {...register("direccion_mecanico", DireccionRequired)}
                className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
                autoFocus
              />
              {errors.direccion_mecanico && (
                <p className="text-red-500">
                  {errors.direccion_mecanico.message}
                </p>
              )}

              <label className="hidden">Estado</label>
              <select
                {...register("estado")}
                className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2 hidden"
              >
                <option value={"Activo"}>Activo</option>
                <option value={"Inactivo"}>Inactivo</option>
              </select>
              <div className="flex items-center justify-center mt-2">
              <button
                className="px-5 py-1  text-sm text-withe font-semibold  rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500 hover:border-transparent shadow-lg shadow-zinc-300/30 "
                type="submit"
              >
                Guardar
              </button>
              <button>
                <Link
                  className="px-5 py-1 ml-3 text-sm text-withe font-semibold  rounded-full border border-red-500 hover:text-white hover:bg-red-500 hover:border-transparent shadow-lg shadow-zinc-300/30"
                  to="/mecanicos"
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
