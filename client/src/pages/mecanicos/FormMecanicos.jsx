import { useForm } from "react-hook-form"
import { useMecanicos } from "../../context/MecanicosContext"
import { Link } from "react-router-dom"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react"
import { NombreRequired, CedulaRequired, TelefonoRequired } from "../../utils/validations"


export default function FormMecanico() {
  const {register, handleSubmit, setValue, formState: {errors}} = useForm()
  const {createMecanico, getMecanico, updateMecanico, errors: MecanicoErrors} = useMecanicos()
  const navigate = useNavigate()  
  const params = useParams()

  useEffect(() => {
    (async () => {
      if (params.id) {
        const mecanico = await getMecanico(params.id);
        console.log("mecánico por params", mecanico);
        setValue("cedula_mecanico", mecanico.cedula_mecanico);
        setValue("nombre_mecanico", mecanico.nombre_mecanico);
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
    <div className='bg-slate-700 max-w-md w-full p-10 shadow-lg shadow-blue-600/40'>
    {MecanicoErrors.map((error, i) => (
          <div className="bg-red-500 p-2 text-white" key={i}>
            {error}
          </div>
        ))}
           <br />
           <br />
           <br />
          <h1 className="text-2xl flex justify-center ">Agregar mecánico</h1>
        <form className="mt-10"  onSubmit={onSubmit}>
            <label >Cedula</label>
            <input 
            placeholder='Cedula'
            {...register("cedula_mecanico", CedulaRequired)}
            className='w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2'
            autoFocus
            />
            {errors.cedula_mecanico && <p className="text-red-500">{errors.cedula_mecanico.message}</p>}
            <label>Nombre Mecanico</label>
            <input 
            type="text" 
            placeholder='Nombre Mecanico' 
            {...register("nombre_mecanico", NombreRequired)}
            className='w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2'
            autoFocus
            />
            {errors.nombre_mecanico && <p className="text-red-500">{errors.nombre_mecanico.message}</p>}
            
            <label>Telefono Mecanico</label>
            <input 
            placeholder='Telefono Mecanico'
            {...register("telefono_mecanico", TelefonoRequired)}
            className='w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2'
            />
            {errors.telefono_mecanico && <p className="text-red-500">{errors.telefono_mecanico.message}</p>}
            <label>Direccion</label>
            <input 
            placeholder='Direccion'
            {...register("direccion_mecanico", NombreRequired)}
            className='w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2'
            autoFocus
            />
            {errors.direccion_mecanico && <p className="text-red-500">{errors.direccion_mecanico.message}</p>}
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
            <Link to="/mecanicos">Cancelar</Link>
            </button>
        </form>
    </div>
    </div>
  )
}