import { useForm } from "react-hook-form"
import { useClientes } from "../../context/ClientContext"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react"
import { NombreRequired ,EmailRequired, TelefonoRequired, CedulaRequired } from "../../utils/validations"

export default function FormCliente() {
  const {register, handleSubmit, setValue, formState: {errors}} = useForm()
  const {createCliente, getCliente, updateCliente, errors: clientesErrors} = useClientes()
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
        setValue("sexo", cliente.sexo);
      }
    })();
  }, []);
  
  const onSubmit = handleSubmit(async(data) => {
    if(params.id){
       updateCliente(params.id, data)
       navigate("/clientes")
    }else{
      const res = await createCliente(data)
      if(res) navigate('/clientes')
    }
    
  })


  return (
    <div className='flex items-center justify-center pt-20 '>
      
    <div className='bg-slate-700 max-w-xl w-full p-10 shadow-lg shadow-blue-600/40 '>
    {clientesErrors.map((error, i) => (
      <div className="bg-red-500 p-2 text-white" key={i}>
            {error}
          </div>
        ))}
        <h1 className="text-2xl flex justify-center ">Agregar cliente </h1>
      <form className="mt-10" onSubmit={onSubmit}>
      <div className="grid xl:grid-cols-2 md:grid-cols-2 gap-4">
      <div>
      <label>Cedula</label>
        <input 
        placeholder='Cedula'
        {...register("cedula", CedulaRequired)}
        className='w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2'
        />
        {errors.cedula && <p className="text-red-500">{errors.cedula.message}</p>}
      </div>
        <div>
        <label>Nombre Completo</label>
        <input 
        type="text" 
        placeholder='Nombre Cliente' 
        {...register("nombre_cliente", NombreRequired)}
        className='w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2'
        autoFocus
        />
        {errors.nombre_cliente && <p className="text-red-500">{errors.nombre_cliente.message}</p>}
        </div>
      <div>
      <label >Sexo</label>
          <select
        {...register("sexo")}
        className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
        >
          <option value={"Masculino"} >
            Masculino
          </option>
          <option value={"Femenino"} >
            Femenino
          </option>

        </select>
      </div>
      <div>
      <label >Email Cliente</label>
        <input 
        placeholder='Email Cliente'
        type="email"
        {...register("email_cliente", EmailRequired)}
        className='w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2'
        />
        {errors.email_cliente && <p className="text-red-500">{errors.email_cliente.message}</p>}
      </div>
      <div>
      <label>Telefono Cliente</label>
        <input 
        placeholder='Telefono Cliente'
        {...register("telefono_cliente", TelefonoRequired)}
        className='w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2'
        />
        {errors.telefono_cliente && <p className="text-red-500">{errors.telefono_cliente.message}</p>}
      </div>
      
      <div>
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
      </div>
        <div className="flex justify-center xl:ps-60">
        <button className='px-5 p-1 text-sm text-withe font-semibold  rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500 hover:border-transparent shadow-lg shadow-zinc-300/30 ' type="submit">
          Guardar
        </button>
        <button>
          <Link className="px-5 py-1 text-sm text-withe font-semibold  rounded-full border border-red-500 hover:text-white hover:bg-red-500 hover:border-transparent shadow-lg shadow-zinc-300/30 ml-3" to="/clientes">Cancelar</Link>
        </button>
        </div>
        </div>
        
        
      </form>
    </div>
    </div>
  )
}
