import { useForm } from "react-hook-form";
import { useMecanicos } from "../../context/MecanicosContext";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  NombreRequired,
  CedulaRequired,
  TelefonoRequired,
  DireccionRequired,
  NombreMeRequired,
  PasaporteRequired,
} from "../../utils/validations";
import Swal from "sweetalert2"

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

  useEffect(() => {
    (async () => {
      if (params.id) {
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
    if (selectedTipo === "Pasaporte") {
      
      register("cedula_mecanico", PasaporteRequired);
    } else {
      register("cedula_mecanico", CedulaRequired);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    if (params.id) {
      updateMecanico(params.id, data);
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
      Toast.fire({
        icon: "success",
        title: "Actualizado correctamente",
      });
      navigate("/mecanicos");
    } else {
      const res = await createMecanico(data);
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
      Toast.fire({
        icon: "success",
        title: "Agregado correctamente",
      });
      if (res) navigate("/mecanicos");
      else{
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
        Toast.fire({
          icon: "error",
          title: "No se ha agregado",
        });
      }
    }
  });

  return (
    <div className="flex items-center justify-center pt-20">
      <div className="bg-slate-700 max-w-md w-full p-10 shadow-lg shadow-blue-600/40">
        {MecanicoErrors.map((error, i) => (
          <div className="bg-red-500 p-2 text-white" key={i}>
            {error}
          </div>
        ))}
        <h1 className="text-2xl flex justify-center">Agregar mecánico</h1>
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
            <option value={"Cedula"}>Cédula</option>
            <option value={"Tarjeta Identidad"}>Tarjeta Identidad</option>
            <option value={"Pasaporte"}>Pasaporte</option>
            <option value={"Otro"}>Otro</option>
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
            <p className="text-red-500">{errors.telefono_mecanico.message}</p>
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
            <p className="text-red-500">{errors.direccion_mecanico.message}</p>
          )}

          <label>Estado</label>
          <select
            {...register("estado")}
            className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
          >
            <option value={"Activo"}>Activo</option>
            <option value={"Inactivo"}>Inactivo</option>
          </select>

          <button
            className="px-5 py-1 mt-4 text-sm text-withe font-semibold  rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500 hover:border-transparent shadow-lg shadow-zinc-300/30 "
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
        </form>
      </div>
    </div>
  );
}