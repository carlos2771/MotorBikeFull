import { useForm } from "react-hook-form"
import { useMarcas } from "../../context/MarcasContext";
import { Link, useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react"
import { NombreRequired } from "../../utils/validations"

export default function FormMecanico() {
  const {register, handleSubmit, setValue, formState: {errors}} = useForm()
  const {createMarca, getMarca, updateMarca, errors: marcasErrors} = useMarcas()
  const navigate = useNavigate()  
  const params = useParams()

  useEffect(() => {
    (async () => {
      if (params.id) {
        const marca = await getMarca(params.id);
        console.log("marca por params", marca);
        setValue("nombre_marca", marca.nombre_marca);
      }
    })();
  }, []);
  
  const onSubmit = handleSubmit(async(data) => {
    if(params.id){
        updateMarca(params.id, data)
       navigate("/marcas")
    }else{
      const res = await createMarca(data)
      if(res) navigate('/marcas')
    }
    
  })


  return (
    <div className='flex h-[calc(100vh-100px)] items-center justify-center'>
    <div className='bg-slate-700 max-w-md w-full p-10 shadow-lg shadow-blue-600/40'>
    {marcasErrors.map((error, i) => (
      <div className="bg-red-500 p-2 text-white" key={i}>
            {error}
          </div>
        ))}
        <h1 className="text-2xl flex justify-center ">Agregar Marca </h1>
      <form className="mt-10" onSubmit={onSubmit}>
        <label>Nombre de la Marca</label>
        <input 
        type="text" 
        placeholder='Nombre Marca' 
        {...register("nombre_marca", NombreRequired)}
        className='w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2'
        autoFocus
        />
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
        <button className='px-5 py-1 text-sm text-withe font-semibold  rounded-full border border-red-500 hover:text-white hover:bg-red-500 hover:border-transparent shadow-lg shadow-zinc-300/30 ml-3  '>
          <Link to="/marcas">Cancelar</Link>
        </button>
      </form>
    </div>
    </div>
  )
}
