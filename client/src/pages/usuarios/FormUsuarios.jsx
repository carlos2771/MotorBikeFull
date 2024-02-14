import { useForm } from "react-hook-form";
import { useUsuario } from "../../context/usuariosContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { NombreMaRequired } from "../../utils/validations";
import Swal from "sweetalert2";

export default function FormUsuarios() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { createUsuario, getUsuario, updateUsuario, errors: usuarioErrors } = useUsuario();
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    (async () => {
      if (params.id) {
        const usuario = await getUsuario(params.id);
        setValue("username", usuario.username);
        setValue("email", usuario.email);
        setValue("password", usuario.password);
        setValue("estado", usuario.estado);
      } else {
        setValue("estado", "Activo");
      }
    })();
  }, []);

  const onSubmit = handleSubmit(async(data) => {
    if(params.id){
        updateUsuario(params.id, data)
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
       navigate("/usuarios")
    }else{
      const res = await createUsuario(data)

            console.log(data)
            console.log("se creo")
        navigate("/usuarios")
  
    //   const Toast = Swal.mixin({
    //     toast: true,
    //     position: "top-end",
    //     showConfirmButton: false,
    //     timer: 3000,
    //     timerProgressBar: true,
    //     didOpen: (toast) => {
    //       toast.onmouseenter = Swal.stopTimer;
    //       toast.onmouseleave = Swal.resumeTimer;
    //     },
    //   });
    //   Toast.fire({
    //     icon: "success",
    //     title: "Agregado correctamente",
    //   });
    //   if(res){navigate('/usuarios')}
    //   else{
    //     const Toast = Swal.mixin({
    //       toast: true,
    //       position: "top-end",
    //       showConfirmButton: false,
    //       timer: 3000,
    //       timerProgressBar: true,
    //       didOpen: (toast) => {
    //         toast.onmouseenter = Swal.stopTimer;
    //         toast.onmouseleave = Swal.resumeTimer;
    //       },
    //     });
    //     Toast.fire({
    //       icon: "error",
    //       title: "No se ha agregado",
    //     });
    //   }
    }
    
  })

  return (
    <div className='flex items-center justify-center pt-20'>
      <div className='bg-slate-700 max-w-md w-full p-10 shadow-lg shadow-blue-600/40'>
        {usuarioErrors.map((error, i) => (
          <div className="bg-red-500 p-2 text-white" key={i}>
            {error}
          </div>
        ))}
        <h1 className="text-2xl flex justify-center">Agregar Usuario </h1>
        <form className="mt-10" onSubmit={onSubmit}>
          <label>Nombre de Usuario<span className="text-red-500">*</span></label>
          <input
            type="text"
            placeholder='Nombre de usuario'
            {...register("username")}
            className='w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2'
            autoFocus
          />
          {errors.username && <p className="text-red-500">{errors.username.message}</p>}
          <label>email<span className="text-red-500">*</span></label>
          <input
            type="text"
            placeholder='email'
            {...register("email")}
            className='w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2'
            
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          <label>Password<span className="text-red-500">*</span></label>
          <input
            type="password"
            placeholder='password'
            {...register("password")}
            className='w-full bg-slate-700 border-0 border-b-2 border-blue-600 text-white px-4 py-2  my-2'
            
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
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
          {errors.password && (
            <p className="text-red-500">{errors.estado.message}</p>
          )}

          <button className='px-5 py-1 mt-4 text-sm text-withe font-semibold  rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500 hover:border-transparent shadow-lg shadow-zinc-300/30 ' type="submit">
            Guardar
          </button>
          <button>
            <Link className="px-5 py-1 ml-3 text-sm text-withe font-semibold  rounded-full border border-red-500 hover:text-white hover:bg-red-500 hover:border-transparent shadow-lg shadow-zinc-300/30" to="/usuarios">Cancelar</Link>
          </button>
        </form>
      </div>
    </div>
  );
}
