import { useForm } from "react-hook-form"
import { useMecanicos } from "../../context/MecanicoContext"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react"
import { NombreRequired ,EmailRequired, TelefonoRequired, CedulaRequired } from "../../utils/validations"


export default function FormMecanico() {
  const {register, handleSubmit, setValue, formState: {errors}} = useForm()
  const {createCliente, getCliente, updateCliente, errors: clientesErrors} = useMecanicos()
  const navigate = useNavigate()  
  const params = useParams()

  useEffect(() => {
    (async () => {
      if (params.id) {
        const cliente = await getCliente(params.id);
        console.log("cliente por params", cliente);
        setValue("nombre_cliente", cliente.nombre_cliente);
        setValue("email_cliente", cliente.email_cliente);
        setValue("telefono_cliente", cliente.telefono_cliente);
        setValue("cedula", cliente.cedula);
      }
    })();
  }, []);
  
  const onSubmit = handleSubmit(async(data) => {
    if(params.id){
      updateCliente(params.id, data)
    }else{
      const res = await createCliente(data)
      if(res) navigate('/clientes')
    }
    
  })


  return (
    <div className='flex h-[calc(100vh-100px)] items-center justify-center'>
    <div className='bg-zinc-800 max-w-md w-full p-10 rounded-md'>
    {clientesErrors.map((error, i) => (
          <div className="bg-red-500 p-2 text-white" key={i}>
            {error}
          </div>
        ))}
      <form onSubmit={onSubmit}>
        <label>Nombre Cliente</label>
        <input 
        type="text" 
        placeholder='Nombre Cliente' 
        {...register("nombre_cliente", NombreRequired)}
        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
        autoFocus
        />
        {errors.nombre_cliente && <p className="text-red-500">{errors.nombre_cliente.message}</p>}
        <label >Email Cliente</label>
        <input 
        placeholder='Email Cliente'
        type="email"
        {...register("email_cliente", EmailRequired)}
        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
        />
        {errors.email_cliente && <p className="text-red-500">{errors.email_cliente.message}</p>}
        <label>Telefono Cliente</label>
        <input 
        placeholder='Telefono Cliente'
        {...register("telefono_cliente", TelefonoRequired)}
        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
        />
        {errors.telefono_cliente && <p className="text-red-500">{errors.telefono_cliente.message}</p>}
        <label>Cedula</label>
        <input 
        placeholder='Cedula'
        {...register("cedula", CedulaRequired)}
        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
        />
        {errors.cedula && <p className="text-red-500">{errors.cedula.message}</p>}
        <button className='px-5 py-1 text-sm text-withe font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500 hover:border-transparent shadow-lg shadow-zinc-300/30 ' type="submit">
          Guardar
        </button>
      </form>
    </div>
    </div>
  )
}
