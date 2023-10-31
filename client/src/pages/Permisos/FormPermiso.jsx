import { useForm } from "react-hook-form"
import { usePermisos } from "../../context/PermisosContext"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react"
import { NombreRequired , EstadoRequired } from "../../utils/validations"


export default function FormPermisos() {
  const {register, handleSubmit, setValue, formState: {errors}} = useForm()
  const {createPermiso, getPermiso, updatePermiso, errors: permisosErrors} = usePermisos()
  const navigate = useNavigate()  
  const params = useParams()

  useEffect(() => {
    (async () => {
      if (params.id) {
        const permiso = await getPermiso(params.id);
        console.log("Permiso por params", permiso);
        setValue("nombre_permiso", permiso.nombre_permiso);
        setValue("estado", permiso.estado);
      }
    })();
  }, []);
  
  const onSubmit = handleSubmit(async(data) => {
    if(params.id){
      updatePermiso(params.id, data)
      navigate("/permisos")
    }else{
      const res = await createPermiso(data)
      if(res) navigate('/permisos')
    }
  })


  return (
    <div className='flex h-[calc(100vh-100px)] items-center justify-center'>
    <div className='bg-zinc-800 max-w-md w-full p-10 rounded-md'>
    {permisosErrors.map((error, i) => (
          <div className="bg-red-500 p-2 text-white" key={i}>
            {error}
          </div>
        ))}
      <form onSubmit={onSubmit}>
        <label>Nombre Permiso</label>
        <input 
        type="text" 
        placeholder='Nombre Permiso' 
        {...register("nombre_permiso", NombreRequired)}
        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
        autoFocus
        />
        {errors.nombre_permiso && <p className="text-red-500">{errors.nombre_permiso.message}</p>}
        
        <label>Estado</label>
        <input 
        placeholder='Estado'
        {...register("estado", EstadoRequired)}
        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
        />
        {errors.estado && <p className="text-red-500">{errors.estado.message}</p>}
        <button className='px-5 py-1 text-sm text-withe font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500 hover:border-transparent shadow-lg shadow-zinc-300/30 ' type="submit">
          Guardar
        </button>
      </form>
    </div>
    </div>
  )
}
