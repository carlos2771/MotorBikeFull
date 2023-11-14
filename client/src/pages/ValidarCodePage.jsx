// Importa las dependencias necesarias
import React , { useEffect, useState }from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { EstadoRequired } from '../utils/validations';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Alert } from '@material-tailwind/react';

const ValidarCodePage = () => {
  // Utiliza useForm y useAuth
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { validarToken, errors: verificationErrors } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const [email, setEmail] = useState('');

  useEffect(() => {
    const userEmail = params.email;
    setEmail(userEmail);
  }, [params]);
  
  
 
  // Configura la lógica de envío del código al backend
  const onSubmit = handleSubmit(async (values) => {
    try {
      console.log(email);
      const user = await validarToken(values.code);
      const userEmail = params.email
      
      
      // Redirige a la página de actualización de contraseña con el código
      navigate(`/reestablecer-password/${values.code}`);
      
    } catch (error) {
      console.error(error);
      // Maneja el error, por ejemplo, muestra un mensaje al usuario
    }
  });

  return (
    <div>
      <div className='flex h-[calc(100vh-100px)] items-center justify-center '>
        <div className='bg-gradient-to-tr from-[#0f172a] via-[#082f49] to-[#0f172a] max-w-md w-full p-10 rounded-md  '>
          {/* Muestra errores de autenticación */}
          {verificationErrors.map((error, i) => (
            <Alert className="bg-red-500 p-2 text-white" key={i}>
              {error}
            </Alert>
          ))}

          <h1 className='text-3xl font-bold my-2 text-center'>Recuperar Contraseña</h1>
            {/* Mostrar el correo electrónico en el mensaje */}
          <p className="text-white text-center mb-4">Hemos enviado un codigo de verificacion a tu correo electronico. Ingresa el codigo de verificación</p>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              {...register("code", EstadoRequired)}
              className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-4 py-2 rounded2 my-2 border-0 border-b-2 border-sky-500"
              placeholder="Ingresa el codigo"
            />
            {errors.code && (
              <p className="text-red-500">{errors.code.message}</p>
            )}

            <div className='flex justify-center'>
              <button
                className="px-5 py-1 m-2 text-sm text-withe font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent"
                type="submit"
              >
                Siguiente
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}

export default ValidarCodePage;
