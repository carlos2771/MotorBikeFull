import { useForm } from "react-hook-form"
import { useMarcas } from "../../context/MarcasContext"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react"
import { NombreRequired } from "../../utils/validations"


export default function FormMarca() {
  const {register, handleSubmit, setValue, formState: {errors}} = useForm()
  const {createMarcas, getMarca, updateMarca, errors: marcasErrors} = useMarcas()
  const navigate = useNavigate()  
  const params = useParams()

  useEffect(() => {
    (async () => {
      if (params.id) {
        const marca = await getMarca(params.id);
        console.log("marca por params", marca);
        setValue("nombre_marca",marca.nombre_marca);
      }
    })();
  }, []);
  
  const onSubmit = handleSubmit(async(data) => {
    if(params.id){
      updateMarca(params.id, data)
      navigate("/marcas");
    }else{
      const res = await createMarcas(data)
      if(res) navigate('/marcas')
    }
    
  })


  return (
    <div className='flex h-[calc(100vh-100px)] items-center justify-center'>
    <div className='bg-zinc-800 max-w-md w-full p-10 rounded-md'>
    {marcasErrors.map((error, i) => (
          <div className="bg-red-500 p-2 text-white" key={i}>
            {error}
          </div>
        ))}
      <form onSubmit={onSubmit}>
        <label>Nombre Marca</label>
        <input 
        type="text" 
        placeholder='Nombre Marca' 
        {...register("nombre_marca", NombreRequired)}
        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
        autoFocus
        />
        {errors.nombre_marca && <p className="text-red-500">{errors.nombre_marca.message}</p>}
        
        <button className='px-5 py-1 text-sm text-withe font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500 hover:border-transparent shadow-lg shadow-zinc-300/30 ' type="submit">
          Guardar
        </button>
      </form>
    </div>
    </div>
  )
}
