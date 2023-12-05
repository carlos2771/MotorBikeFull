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
        setValue("tipo", mecanico.tipo);
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
    <div className='flex items-center justify-center pt-20'>
    <div className='bg-slate-700 max-w-md w-full p-10 shadow-lg shadow-blue-600/40'>
    {MecanicoErrors.map((error, i) => (
          <div className="bg-red-500 p-2 text-white" key={i}>
            {error}
          </div>
        ))}
          <h1 className="text-2xl flex justify-center ">Agregar mecánico</h1>
        <form className="mt-10"  onSubmit={onSubmit}>
          <label >Tipo Documento<span className="text-red-500">*</span></label>
            <select
          {...register("tipo", NombreRequired)}
          className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2" 
          >
            <option value={""}>Selecciona el tipo de documento</option>
            <option value={"Cedula"} >
              Cédula
            </option>
            <option value={"Tarjeta Identidad"} >
              Tarjeta Identidad
            </option>
            <option value={"Otro"} >
              Otro
            </option>
          </select>
          {errors.tipo && <p className="text-red-500">{errors.tipo.message}</p>}
            <label >Cedula<span className="text-red-500">*</span></label>
            <input 
            placeholder='Cedula'
            {...register("cedula_mecanico", CedulaRequired)}
            className='w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2'
            autoFocus
            />
            {errors.cedula_mecanico && <p className="text-red-500">{errors.cedula_mecanico.message}</p>}
            <label>Nombre Mecanico<span className="text-red-500">*</span></label>
            <input 
            type="text" 
            placeholder='Nombre Mecanico' 
            {...register("nombre_mecanico", NombreRequired)}
            className='w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2'
            autoFocus
            />
            {errors.nombre_mecanico && <p className="text-red-500">{errors.nombre_mecanico.message}</p>}
            
            <label>Telefono Mecanico<span className="text-red-500">*</span></label>
            <input 
            placeholder='Telefono Mecanico'
            {...register("telefono_mecanico", TelefonoRequired)}
            className='w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2'
            />
            {errors.telefono_mecanico && <p className="text-red-500">{errors.telefono_mecanico.message}</p>}
            <label>Direccion<span className="text-red-500">*</span></label>
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
            <button>
            <Link className="px-5 py-1 ml-3 text-sm text-withe font-semibold  rounded-full border border-red-500 hover:text-white hover:bg-red-500 hover:border-transparent shadow-lg shadow-zinc-300/30" to="/mecanicos">Cancelar</Link>
            </button>
        </form>
    </div>
    </div>
  )
}