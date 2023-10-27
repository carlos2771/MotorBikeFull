import { useForm } from "react-hook-form"
import { useClientes } from "../../context/ClientContext"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react"


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
        <label htmlFor="nombreCliente">Nombre Cliente</label>
        <input 
        type="text" 
        placeholder='Nombre Cliente' 
        {...register("nombre_cliente")}
        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
        autoFocus
        />
        <label htmlFor="emailCliente">Email Cliente</label>
        <input 
        placeholder='Email Cliente'
        {...register("email_cliente")}
        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
        />
        <label htmlFor="telefonoCliente">Telefono Cliente</label>
        <input 
        placeholder='Telefono Cliente'
        {...register("telefono_cliente")}
        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
        />
        <label htmlFor="cedula">Cedula</label>
        <input 
        placeholder='Cedula'
        {...register("cedula")}
        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
        />
        <button className='bg-indigo-500 px-3 py-2 rounded-md'>
          Guardar
        </button>
      </form>
    </div>
    </div>
  )
}
