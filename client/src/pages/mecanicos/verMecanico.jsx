import { useForm } from "react-hook-form"
import { useMecanicos } from "../../context/MecanicosContext"
import { Link } from "react-router-dom"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect , useState} from "react"
import { NombreRequired, CedulaRequired, TelefonoRequired } from "../../utils/validations"

export default function DetalleMecanico() {
    const { getMecanico, errors: MecanicoErrors } = useMecanicos();
    const params = useParams();
  
    const [mecanico, setMecanico] = useState(null);
  
    useEffect(() => {
      (async () => {
        if (params.id) {
          const mecanicoData = await getMecanico(params.id);
          console.log("mecánico por params", mecanicoData);
          setMecanico(mecanicoData);
        }
      })();
    }, [params.id]);
  
    if (!mecanico) {
      return <div>Cargando...</div>;
    }
  
    return (
      <div className='flex h-[calc(100vh-100px)] items-center justify-center'>
        <div className='bg-slate-700 max-w-md w-full p-10 shadow-lg shadow-blue-600/40'>
          {MecanicoErrors.map((error, i) => (
            <div className="bg-red-500 p-2 text-white" key={i}>
              {error}
            </div>
          ))}
         
          <h1 className="text-2xl flex justify-center">Detalles del mecánico</h1>
          <div className="mt-10">
            
            <p className='text-white'>Cedula : {mecanico.cedula_mecanico}</p>
            
            <p className='text-white'>Nombre Mecanico : {mecanico.nombre_mecanico}</p>
  
            <p className='text-white'>Telefono Mecanico : {mecanico.telefono_mecanico}</p>
  
            <p className='text-white'>Direccion : {mecanico.direccion_mecanico}</p>
  
            <p className='text-white'>Estado : {mecanico.estado}</p>
          </div>
          <br />
          <button className='px-5 py-1 text-sm text-withe font-semibold rounded-full border border-red-500 hover:text-white hover:bg-red-500 hover:border-transparent shadow-lg shadow-zinc-300/30 ml-3'>
            <Link to="/mecanicos">Cancelar</Link>
          </button>
        </div>
      </div>
    );
  }
  