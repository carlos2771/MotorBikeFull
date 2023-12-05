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
import { useMarcas } from "../../context/MarcasContext";
import { Link, useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react"
import { NombreRequired } from "../../utils/validations"

export default function FormMecanico() {
  const {register, handleSubmit, setValue, formState: {errors}} = useForm()
  const {createMarca, getMarca, updateMarca, errors: marcasErrors} = useMarcas()
>>>>>>> 60306eb967723c91bfbcf96a43887b3680169091
  const navigate = useNavigate()  
  const params = useParams()

  useEffect(() => {
    (async () => {
      if (params.id) {
        const marca = await getMarca(params.id);
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
    </div>
    </div>
  )
}
