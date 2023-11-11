import { useForm } from "react-hook-form"
import { useRepuestos } from "../../context/RepuestosContext"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react"
import { NombreRequired, NegativeRequired} from "../../utils/validations"


export default function FormRepuesto() {
  const {register, handleSubmit, setValue, formState: {errors}} = useForm()
  const {createRepuesto, getRepuesto, updateRepuesto, errors: repuestosErrors} = useRepuestos()
  const navigate = useNavigate()  
  const params = useParams()

  useEffect(() => {
    (async () => {
      if (params.id) {
        const repuesto = await getRepuesto(params.id);
        console.log("repuesto por params", repuesto);
        setValue("nombre_repuesto", repuesto.nombre_repuesto);
        setValue("cantidad", repuesto.cantidad);
        setValue("precio", repuesto.precio);
        
      }
    })();
  }, []);
  
  const onSubmit = handleSubmit(async(data) => {
    if(params.id){
       updateRepuesto(params.id, data)
       navigate("/repuestos")
    }else{
      const res = await createRepuesto(data)
      if(res) navigate('/repuestos')
    }
    
  })


  return (
    <div className='flex h-[calc(100vh-100px)] items-center justify-center'>
    <div className='bg-zinc-800 max-w-md w-full p-10 rounded-md'>
    {repuestosErrors.map((error, i) => (
          <div className="bg-red-500 p-2 text-white" key={i}>
            {error}
          </div>
        ))}
      <form onSubmit={onSubmit}>
        <label>Nombre Repuesto</label>
        <input 
        type="text" 
        placeholder='Nombre Repuesto' 
        {...register("nombre_repuesto", NombreRequired)}
        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
        autoFocus
        />
        {errors.nombre_repuesto && <p className="text-red-500">{errors.nombre_repuesto.message}</p>}
        <label >Cantidad</label>
        <input 
        placeholder='Cantidad'
        type="number"
        {...register("cantidad", NegativeRequired)}
        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
        />
        {errors.cantidad && <p className="text-red-500">{errors.cantidad.message}</p>}
        <label>Precio</label>
        <input 
        placeholder='precio'
        type="number"
        {...register("precio", NegativeRequired)}
        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
        />
        {errors.precio && <p className="text-red-500">{errors.precio.message}</p>}

           
        <label >Estado</label>
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
        



        <button className='px-5 py-1 text-sm text-withe font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500 hover:border-transparent shadow-lg shadow-zinc-300/30 ' type="submit">
          Guardar
        </button>
      </form>
    </div>
    </div>
  )
}
