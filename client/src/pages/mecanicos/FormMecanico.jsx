import { useForm } from "react-hook-form"
import { useMecanicos} from "../../context/MecanicosContext"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react"
import { NombreRequired ,EmailRequired, TelefonoRequired, CedulaRequired } from "../../utils/validations"


export default function FormMecanico() {
  const {register, handleSubmit, setValue, formState: {errors}} = useForm()
  const {createMecanico, getMecanico, updateMecanico, errors: mecanicosErrors} = useMecanicos()
  const navigate = useNavigate()  
  const params = useParams()

  useEffect(() => {
    (async () => {
      if (params.id) {
        const mecanico = await getMecanico(params.id);
        console.log("mecanico por params", mecanico);
        setValue("nombre_mecanico", mecanico.nombre_mecanico);
        setValue("cedula_mecanico", mecanico.cedula_mecanico);
        setValue("telefono_mecanico", mecanico.telefono_mecanico);
        setValue("direccion_mecanico", mecanico.direccion_mecanico);
      }
    })();
  }, []);
  
  const onSubmit = handleSubmit(async(data) => {
    if(params.id){
       updateMecanico(params.id, data)
       navigate("/mecanicos")
    }else{
      const res = await createMecanico(data)
      if(res) navigate('/mecanicos')
    }
    
  })


  return (
    <div className='flex h-[calc(100vh-100px)] items-center justify-center'>
    <div className='bg-zinc-800 max-w-md w-full p-10 rounded-md'>
    {mecanicosErrors.map((error, i) => (
          <div className="bg-red-500 p-2 text-white" key={i}>
            {error}
          </div>
        ))}
      <form onSubmit={onSubmit}>
        <label>Nombre Mecanico</label>
        <input 
        type="text" 
        placeholder='Nombre mecanico' 
        {...register("nombre_mecanico", NombreRequired)}
        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
        autoFocus
        />
        {errors.nombre_mecanico && <p className="text-red-500">{errors.nombre_cliente.message}</p>}
        <label >Cedula mecanico</label>
        <input 
        placeholder='Cedula mecanico'
        type="text"
        {...register("cedula_mecanico", CedulaRequired)}
        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
        />
        {errors.cedula && <p className="text-red-500">{errors.cedula.message}</p>}

        <label>Telefono mecanico</label>
        <input 
        placeholder='Telefono mecanico'
        {...register("telefono_mecanico", TelefonoRequired)}
        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
        />
        {errors.telefono_mecanico && <p className="text-red-500">{errors.telefono_mecanico.message}</p>}
        <label>Direccion</label>
        <input 
        placeholder='Direccion'
        {...register("direccion_mecanico",NombreRequired)}
        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
        />
        {/* {errors.cedula && <p className="text-red-500">{errors.cedula.message}</p>} */}
        <select
        {...register("estado")}
        className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
        >
          <option value={"Activo"} >
            Activo
          </option>
          <option value={"Inactivo"} >
            Inactivo
          </option>

        </select>
        
        <button className='px-5 py-1 text-sm text-withe font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500 hover:border-transparent shadow-lg shadow-zinc-300/30 ' type="submit">
          Guardar
        </button>
      </form>
    </div>
    </div>
  )
}
