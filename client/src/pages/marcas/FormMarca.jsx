<<<<<<< HEAD
import { useForm } from "react-hook-form"
<<<<<<< HEAD
import { useMarcas } from "../../context/MarcasContext"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react"
import { NombreRequired } from "../../utils/validations"


export default function FormMarca() {
  const {register, handleSubmit, setValue, formState: {errors}} = useForm()
  const {createMarcas, getMarca, updateMarca, errors: marcasErrors} = useMarcas()
=======
=======
import { useForm } from "react-hook-form";
>>>>>>> 87e6daf1e9b99f1c14c9d1307f3e9686739172b0
import { useMarcas } from "../../context/MarcasContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { NombreMaRequired } from "../../utils/validations";
import Swal from "sweetalert2";

export default function FormMecanico() {
<<<<<<< HEAD
  const {register, handleSubmit, setValue, formState: {errors}} = useForm()
  const {createMarca, getMarca, updateMarca, errors: marcasErrors} = useMarcas()
>>>>>>> 60306eb967723c91bfbcf96a43887b3680169091
  const navigate = useNavigate()  
  const params = useParams()
=======
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { createMarca, getMarca, updateMarca, errors: marcasErrors } = useMarcas();
  const navigate = useNavigate();
  const params = useParams();
>>>>>>> 87e6daf1e9b99f1c14c9d1307f3e9686739172b0

  useEffect(() => {
    (async () => {
      if (params.id) {
        const marca = await getMarca(params.id);
<<<<<<< HEAD
        console.log("marca por params", marca);
<<<<<<< HEAD
        setValue("nombre_marca",marca.nombre_marca);
=======
        setValue("nombre_marca", marca.nombre_marca);
>>>>>>> 60306eb967723c91bfbcf96a43887b3680169091
      }
    })();
  }, []);
  
  const onSubmit = handleSubmit(async(data) => {
    if(params.id){
<<<<<<< HEAD
      updateMarca(params.id, data)
      navigate("/marcas");
    }else{
      const res = await createMarcas(data)
=======
        updateMarca(params.id, data)
       navigate("/marcas")
    }else{
      const res = await createMarca(data)
>>>>>>> 60306eb967723c91bfbcf96a43887b3680169091
      if(res) navigate('/marcas')
    }
    
  })
=======
        setValue("nombre_marca", marca.nombre_marca);
        setValue("estado", marca.estado);
      } else {
        setValue("estado", "Activo");
      }
    })();
  }, []);
>>>>>>> 87e6daf1e9b99f1c14c9d1307f3e9686739172b0

  const onSubmit = handleSubmit(async (data) => {
    const lowercaseData = {
      ...data,
      nombre_marca: data.nombre_marca.toLowerCase(),
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
      navigate('/marcas');
    } else {
      // Toast.fire({
      //   icon: "error",
      //   title: "La marca ya existe . Verifica los errores.",
      // }); 
      console.log("no se agrego, la marca ya existe")
    }
  };

  return (
<<<<<<< HEAD
    <div className='flex h-[calc(100vh-100px)] items-center justify-center'>
    <div className='bg-zinc-800 max-w-md w-full p-10 rounded-md'>
    {marcasErrors.map((error, i) => (
          <div className="bg-red-500 p-2 text-white" key={i}>
            {error}
          </div>
        ))}
      <form onSubmit={onSubmit}>
        <label>Nombre Marca</label>
=======
    <div className='flex items-center justify-center pt-20'>
      <div className='bg-slate-700 max-w-md w-full p-10 shadow-lg shadow-blue-600/40'>
        {marcasErrors.map((error, i) => (
          <div className="bg-red-500 p-2 text-white" key={i}>
            {error}
          </div>
        ))}
<<<<<<< HEAD
        <h1 className="text-2xl flex justify-center ">Agregar Marca </h1>
      <form className="mt-10" onSubmit={onSubmit}>
        <label>Nombre de la Marca<span className="text-red-500">*</span></label>
>>>>>>> 60306eb967723c91bfbcf96a43887b3680169091
        <input 
        type="text" 
        placeholder='Nombre Marca' 
        {...register("nombre_marca", NombreRequired)}
<<<<<<< HEAD
        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
        autoFocus
        />
        {errors.nombre_marca && <p className="text-red-500">{errors.nombre_marca.message}</p>}
        
        <button className='px-5 py-1 text-sm text-withe font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500 hover:border-transparent shadow-lg shadow-zinc-300/30 ' type="submit">
          Guardar
        </button>
=======
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
>>>>>>> 60306eb967723c91bfbcf96a43887b3680169091
      </form>
=======
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
>>>>>>> 87e6daf1e9b99f1c14c9d1307f3e9686739172b0
    </div>
  );
}
