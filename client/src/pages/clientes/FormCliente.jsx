import { useForm } from "react-hook-form"
import { useClientes } from "../../context/ClientContext"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react"
import { NombreRequired ,EmailRequired, CedulaExtRequired,TelefonoRequired, CedulaRequired, NombreMeRequired} from "../../utils/validations"
import Swal from "sweetalert2";

export default function FormCliente() {
  const {register, unregister,handleSubmit, setValue, formState: {errors}} = useForm()
  const {createCliente, getCliente, updateCliente, errors: clientesErrors} = useClientes()
  const navigate = useNavigate()  
  const params = useParams()

  useEffect(() => {
    (async () => {
      if (params.id) {
        const cliente = await getCliente(params.id);
        console.log("cliente por params", cliente);
        setValue("nombre_cliente", cliente.nombre_cliente);
        setValue("tipo", cliente.tipo);
        setValue("email_cliente", cliente.email_cliente);
        setValue("telefono_cliente", cliente.telefono_cliente);
        setValue("cedula", cliente.cedula);
        setValue("sexo", cliente.sexo);
      }
    })();
  }, []);

  const handleTipoChange = (selectedTipo) => {
    // Desregistrando el campo antes de volver a registrarlo
    unregister("cedula");
    // Actualiza la validación según el tipo seleccionado
    if (selectedTipo === "Cedula Extranjera") {
      
      register("cedula", CedulaExtRequired);
    } else {
      register("cedula", CedulaRequired);
    }
  };
  


  const onSubmit = handleSubmit(async(data) => {
    if(params.id){
       updateCliente(params.id, data)
       const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: "Actualizado correctamente",
      });
       navigate("/clientes")
    }else{
      const res = await createCliente(data)
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: "Agregado correctamente",
      });
      if(res){navigate('/clientes')}
      else{
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "error",
          title: "No se ha agregado",
        });
      }
    }
    
  })


  return (
    <div className='flex items-center justify-center  lg:pt-10  max-lg:w-45 max-md:w-41 max-lg:pt-6 max-sm:text-xs'>
      
    <div className='bg-slate-700  max-w-lg w-full p-10 shadow-lg shadow-blue-600/40 '>
    {clientesErrors.map((error, i) => (
      <div className="bg-red-500 p-2 text-white" key={i}>
            {error}
          </div>
        ))} 
        <h1 className="text-2xl flex justify-center max-sm:text-base ">Agregar cliente</h1>
      <form className="mt-10" onSubmit={onSubmit}>
      <label>
            Tipo Documento<span className="text-red-500">*</span>
          </label>
          <select
        {...register("tipo", NombreRequired)}
        onChange={(e) => handleTipoChange(e.target.value)}
        className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2 my-2 " autoFocus
        >
          <option value={""}>Selecciona el tipo de documento</option>
          <option value={"Cedula"} >
            Cédula de Ciudadania
          </option>
          <option value={"Cedula Extranjera"} >
            Cédula Extranjera
          </option>
        </select>
        {errors.tipo && <p className="text-red-500">{errors.tipo.message}</p>}
      <label>Documento<span className="text-red-500">*</span></label>
        <input 
        placeholder='Documento'
        {...register("cedula")}
        className='w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2' 
        />
        {errors.cedula && <p className="text-red-500">{errors.cedula.message}</p>}
        <label>Nombre Completo<span className="text-red-500">*</span></label>
        <input 
        type="text" 
        placeholder='Nombre Completo' 
        {...register("nombre_cliente", NombreMeRequired)}
        className='w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2'
        />
        {errors.nombre_cliente && <p className="text-red-500">{errors.nombre_cliente.message}</p>}
        
      <label >Género<span className="text-red-500">*</span></label>
          <select
        {...register("sexo" , NombreRequired)}
        className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2"
        >
          <option value={""}>Selecciona el género</option>
          <option value={"Masculino"} >
            Masculino
          </option>
          <option value={"Femenino"} >
            Femenino
          </option>
          <option value={"Otro"} >
            Otro
          </option>

        </select>
        {errors.sexo && <p className="text-red-500">{errors.sexo.message}</p>}
      <label >Email</label>
        <input 
        placeholder='Email'
        type="text"
        {...register("email_cliente", EmailRequired)}
        className='w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2'
        />
        {errors.email_cliente && <p className="text-red-500">{errors.email_cliente.message}</p>}
      
      <label>Teléfono<span className="text-red-500">*</span></label>
        <input 
        placeholder='Telefono'
        {...register("telefono_cliente", TelefonoRequired)}
        className='w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2'
        />
        {errors.telefono_cliente && <p className="text-red-500">{errors.telefono_cliente.message}</p>}
      
      <label className="hidden">Estado<span className="text-red-500 ">*</span></label>
        <select
        {...register("estado")}
        className="w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2 hidden"
        > 
          <option value={"Activo"} >
            Activo
          </option>
          <option value={"Inactivo"} >
            Inactivo
          </option>

        </select>
      
        <div>
        <button className=' max-sm:text-xs px-5 py-1 mt-4 text-sm text-withe font-semibold  rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500 hover:border-transparent shadow-lg shadow-zinc-300/30 ' type="submit">
          Guardar
        </button>
        <button>
          <Link className=" max-sm:text-xs px-5 py-1 ml-3 text-sm text-withe font-semibold  rounded-full border border-red-500 hover:text-white hover:bg-red-500 hover:border-transparent shadow-lg shadow-zinc-300/30" to="/clientes">Cancelar</Link>
        </button>
        </div>
        
        
        
      </form>
    </div>
    </div>
  )
}
