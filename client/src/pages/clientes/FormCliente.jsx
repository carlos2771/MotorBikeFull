import { useForm } from "react-hook-form"
import { useClientes } from "../../context/ClientContext"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react"
import { NombreRequired ,EmailRequired, CedulaExtRequired,TelefonoRequired, CedulaRequired, NombreMeRequired} from "../../utils/validations"
import Swal from "sweetalert2";
import { useState } from "react";

export default function FormCliente() {
  const {register, unregister,handleSubmit, setValue, formState: {errors}} = useForm()
  const {createCliente, getCliente, updateCliente, errors: clientesErrors} = useClientes()
  const navigate = useNavigate()  
  const params = useParams()
  const [formTitle, setFormTitle] = useState("Agregar cliente");

  useEffect(() => {
    (async () => {
      if (params.id) {
        setFormTitle("Editar cliente");
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
    if (selectedTipo === "Cédula de extranjería") {
      
      register("cedula", CedulaExtRequired);
    } else {
      register("cedula", CedulaRequired);
    }
  };

  // Función para capitalizar la primera letra de cada palabra en un nombre
  // const capitalizeName = (name) => {
  //   return name
  //     .toLowerCase()
  //     .split(" ")
  //     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  //     .join(" ");
  // };
  

  const onSubmit = handleSubmit(async(data) => {
    // Capitalizar la primera letra de cada palabra en el nombre completo
    // data.nombre_cliente = capitalizeName(data.nombre_cliente);

    if(params.id){
      const res = await updateCliente(params.id, data)
       const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        background: "linear-gradient(to right, #0f172a, #082f49, #0f172a)",
        color: "white",
        timer: 4000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      if (res.error) {
        Toast.fire({
          icon: "error",
          title: "Error al actualizar",
        });
      } else {
        // Si la actualización se realizó con éxito, mostrar un mensaje de éxito
        Toast.fire({
          icon: "success",
          title: "Actualizado correctamente",
        });
        navigate("/clientes");
      }
    }else{
      const res = await createCliente(data)
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        background: "linear-gradient(to right, #0f172a, #082f49, #0f172a)",
        color: "white",
        timer: 4000,
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
          background: "linear-gradient(to right, #0f172a, #082f49, #0f172a)",
          color: "white",
          timer: 4000,
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
        <h1 className="text-2xl flex justify-center max-sm:text-base ">{formTitle}</h1>
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
          <option value={"Cédula de ciudadanía"} >
            Cédula de ciudadanía
          </option>
          <option value={"Cédula de extranjería"} >
            Cédula de extranjería
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
      <label >Correo Electrónico<span className="text-red-500">*</span></label>
        <input 
        placeholder='Correo Electrónico'
        type="text"
        {...register("email_cliente", EmailRequired)}
        className='w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2'
        />
        {errors.email_cliente && <p className="text-red-500">{errors.email_cliente.message}</p>}
      
      <label>Teléfono<span className="text-red-500">*</span></label>
        <input 
        placeholder='Teléfono'
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
