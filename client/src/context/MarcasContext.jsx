import { useContext, useState, createContext, useEffect } from "react";
import {
    getMarcasRequest,
    getMarcaRequest,
    createMarcasRequest,
    updateMarcasRequest,
    deleteMarcasRequest
} from "../api/marcas";


const MarcaContext = createContext();

export const useMarcas = () => {
  const context = useContext(MarcaContext);
  if (!context) throw new Error("useMarcas debe ser usado en MarcaProvider");
  return context;
};

export function MarcaProvider({ children }) {
  const [marcas, setMarcas] = useState([]);
  // const [cliente, setCliente] = useState(null)
  const [errors, setErrors] = useState([]);

  const getMarcas = async () => {
    try {
      const res = await getMarcasRequest();
      setMarcas(res)
    } catch (error) {
      console.error(error);
    }
  };

  const createMarca = async (marca) => {
      try {
        return await createMarcasRequest(marca);
        // return response
      } catch (error) {
        setErrors(error.response.data.message);
      }
    
  }

  const getMarca = async (id) => {
    try {
      const res = await getMarcaRequest(id);
      return res;
    } catch (error) {
      console.error(error);
    }
  };

  const updateMarca = async (id, marca) => {
    try {
      return await updateMarcasRequest(id, marca);
    } catch (error) {
      console.error(error);
      setErrors(error.response.data.message)
    }
  };

  const deleteMarca = async (id) => {
    try {
      const res = await deleteMarcasRequest(id);
      if (res.status === 204) setClientes(marcas.filter((marca) => marca._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (errors?.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errors]);


  

  return (
    <MarcaContext.Provider
        value={{
            marcas,
            // cliente,
            errors,
            getMarcas,
            createMarca,
            updateMarca,
            deleteMarca,
            getMarca,
        }}
    >
      {children}
    </MarcaContext.Provider>
  );
}