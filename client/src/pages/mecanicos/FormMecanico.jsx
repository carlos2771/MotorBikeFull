import { useForm } from "react-hook-form"
import { useMecanicos } from "../../context/MecanicoContext"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react"
import { NombreRequired , TelefonoRequired, CedulaRequired } from "../../utils/validations"


export default function FormMecanico() {
  const {register, handleSubmit, setValue, formState: {errors}} = useForm()
  const {createMecanico, getMecanico, updateMecanico} = useMecanicos()
  const navigate = useNavigate()  
  const params = useParams()

  useEffect(() => {
    (async () => {
      if (params.id) {
        const mecanico = await getMecanico(params.id);
        console.log("Mecanico por params", mecanico);
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
        navigate("/mecanicos");
    }else{
       const res = await createMecanico(data)
        if(res) navigate('/mecanicos')

    }
    
  })


  return (
    <div className='flex h-[calc(100vh-100px)] items-center justify-center'>
    <div className='bg-zinc-800 max-w-md w-full p-10 rounded-md'>
      <form onSubmit={onSubmit}>
        <label>Nombre Mecánico</label>
        <input 
        type="text" 
        placeholder='Nombre Mecánico'  
        {...register("nombre_mecanico", NombreRequired)}
        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
        autoFocus
        />
        {errors.nombre_mecanico && <p className="text-red-500">{errors.nombre_mecanico.message}</p>}
        <label>Cedula Mecánico</label>
        <input 
        placeholder='Cedula Mecánico'
        {...register("cedula_mecanico", CedulaRequired)}
        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
        />
        {errors.cedula_mecanico && <p className="text-red-500">{errors.cedula_mecanico.message}</p>}
        <label>Telefono Mecánico</label>
        <input 
        placeholder='Telefono Mecánico'
        {...register("telefono_mecanico", TelefonoRequired)}
        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
        />
        {errors.telefono_mecanico && <p className="text-red-500">{errors.telefono_mecanico.message}</p>}
        <label >Direccion Mecánico</label>
        <input 
        placeholder='Direccion Mecánico'
        type="text" 
        {...register("direccion_mecanico")}
        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
        />
        {errors.direccion_mecanico && <p className="text-red-500">{errors.direccion_mecanico.message}</p>}
        
        <button className='px-5 py-1 text-sm text-withe font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500 hover:border-transparent shadow-lg shadow-zinc-300/30 ' type="submit">
          Guardar
        </button>
      </form>
    </div>
    </div>
  )
}
