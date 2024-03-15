import { useForm } from "react-hook-form";
import { useMarcas } from "../../context/MarcasContext";
import { Link, useNavigate, useParams, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { NombreMaRequired } from "../../utils/validations";
import Swal from "sweetalert2";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function FormMecanico() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const {
    createMarca,
    getMarca,
    updateMarca,
    errors: marcasErrors,
  } = useMarcas();
  const navigate = useNavigate();
  const params = useParams();
  const [formTitle, setFormTitle] = useState("Agregar marca");
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      if (params.id) {
        setFormTitle("Editar marca");
        const marca = await getMarca(params.id);
        setValue("nombre_marca", marca.nombre_marca);
        setValue("estado", marca.estado);
      } else {
        setValue("estado", "Activo");
      }
    })();
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    const lowercaseData = {
      ...data,
      nombre_marca: data.nombre_marca.toUpperCase(),
    };

    if (params.id) {
      const res = await updateMarca(params.id, lowercaseData);
      handleApiResponse(res, "Actualizado correctamente");
    } else {
      const res = await createMarca(lowercaseData);
      handleApiResponse(res, "Agregado correctamente");
    }
  });

  const handleApiResponse = (res, successMessage) => {
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

    if (res && !res.error) {
      Toast.fire({
        icon: "success",
        title: successMessage,
      });
      navigate("/marcas");
    } else {
      Toast.fire({
        icon: "error",
        title: "La marca ya existe.",
      });
    }
  };

  const permissions = user?.rol?.permissions || [];

  return (
    <>
      {permissions.includes("Marcas") ? (
        <div className="flex items-center justify-center pt-20">
          <div className="bg-slate-700 max-w-md w-full p-10 shadow-lg shadow-blue-600/40">
            {marcasErrors.map((error, i) => (
              <div className="bg-red-500 p-2 text-white" key={i}>
                {error}
              </div>
            ))}
            <h1 className="text-2xl flex justify-center">{formTitle}</h1>
            <form className="mt-10" onSubmit={onSubmit}>
              <label>
                Nombre de la Marca<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nombre Marca"
                {...register("nombre_marca", NombreMaRequired)}
                className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
                autoFocus
              />
              {errors.nombre_marca && (
                <p className="text-red-500">{errors.nombre_marca.message}</p>
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
                className="px-5 py-1 text-sm text-withe font-semibold  rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500 hover:border-transparent shadow-lg shadow-zinc-300/30 "
                type="submit"
              >
                Guardar
              </button>
              <button>
                <Link
                  className="px-5 py-1 ml-3 text-sm text-withe font-semibold  rounded-full border border-red-500 hover:text-white hover:bg-red-500 hover:border-transparent shadow-lg shadow-zinc-300/30"
                  to="/marcas"
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