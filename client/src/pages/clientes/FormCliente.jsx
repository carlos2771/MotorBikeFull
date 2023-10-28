import { useForm } from "react-hook-form"
import { useClientes } from "../../context/ClientContext"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react"
import { NombreRequired ,EmailRequired, TelefonoRequired, CedulaRequired } from "../../utils/validations"


export default function FormCliente() {
  const {register, handleSubmit, setValue} = useForm()
  const {createCliente, getCliente, updateCliente, errors: clientesErrors} = useClientes()
  const navigate = useNavigate()
  const params = useParams()

  useEffect(()=>{
    (async () => {
      if(params.id){
        const cliente = await getCliente(params.id)
        console.log("cliente por params", cliente);
        setValue("nombre_cliente", cliente.nombre_cliente)
        setValue("email_cliente", cliente.email_cliente)
        setValue("telefono_cliente", cliente.telefono_cliente)
        setValue("cedula", cliente.cedula)
      }
    })
    ()
  },[])

  const onSubmit = handleSubmit((data) => {
    if(params.id){
      updateCliente(params.id, data)
    }else{
      createCliente(data)
    }
    navigate("/clientes")
  })
  console.log(clientesErrors);

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
        <label >Email Cliente</label>
        <input 
        placeholder='Email Cliente'
        type="email"
        {...register("email_cliente", EmailRequired)}
        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
        />
        <label>Telefono Cliente</label>
        <input 
        placeholder='Telefono Cliente'
        {...register("telefono_cliente", TelefonoRequired)}
        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
        />
        <label>Cedula</label>
        <input 
        placeholder='Cedula'
        {...register("cedula", CedulaRequired)}
        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
        />
        <button className='bg-indigo-500 px-3 py-2 rounded-md' type="submit">
          Guardar
        </button>
      </form>
    </div>
    </div>
  )
}
