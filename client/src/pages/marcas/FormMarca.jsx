import { useForm } from "react-hook-form";
import { useMarcas } from "../../context/MarcasContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { NombreMaRequired } from "../../utils/validations";
import Swal from "sweetalert2"

export default function FormMecanico() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { createMarca, getMarca, updateMarca, errors: marcasErrors } = useMarcas();
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    (async () => {
      if (params.id) {
        const marca = await getMarca(params.id);
        console.log("marca por params", marca);
        setValue("nombre_marca", marca.nombre_marca);
      }
      // Establecer el valor predeterminado para "estado" como "Activo" al crear una nueva marca
      else {
        setValue("estado", "Activo");
      }
    })();
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    // Convertir los campos a minúsculas
    const lowercaseData = {
      ...data,
      nombre_marca: data.nombre_marca.toLowerCase(),
    };

    if (params.id) {
      updateMarca(params.id, lowercaseData);
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
      navigate("/marcas");
    } else {
      const res = await createMarca(lowercaseData);
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
      if (res) navigate('/marcas');
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
    <div className='flex items-center justify-center pt-20'>
      <div className='bg-slate-700 max-w-md w-full p-10 shadow-lg shadow-blue-600/40'>
        {marcasErrors.map((error, i) => (
          <div className="bg-red-500 p-2 text-white" key={i}>
            {error}
          </div>
        ))}
        <h1 className="text-2xl flex justify-center">Agregar Marca </h1>
        <form className="mt-10" onSubmit={onSubmit}>
          <label>Nombre de la Marca<span className="text-red-500">*</span></label>
          <input
            type="text"
            placeholder='Nombre Marca'
            {...register("nombre_marca", NombreMaRequired)}
            className='w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2'
            autoFocus
          />
          {errors.nombre_marca && <p className="text-red-500">{errors.nombre_marca.message}</p>}
          <label>Estado</label>
          <select
            {...register("estado")}
            className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
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
            <Link className="px-5 py-1 ml-3 text-sm text-withe font-semibold  rounded-full border border-red-500 hover:text-white hover:bg-red-500 hover:border-transparent shadow-lg shadow-zinc-300/30" to="/marcas">Cancelar</Link>
          </button>
        </form>
      </div>
    </div>
  );
}
