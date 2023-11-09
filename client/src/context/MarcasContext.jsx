import { useContext, useState, createContext, useEffect } from "react";
import {
    getMarcasRequest,
    getMarcaRequest,
    createMarcaRequest,
    updateMarcaRequest,
    deleteMarcaRequest
} from "../api/marca.js";


const MarcasContext = createContext();

export const useMarcas = () => {
  const context = useContext(MarcasContext);
  if (!context) throw new Error("useMarcas debe ser usado en MarcasProvider");
  return context;
};

export function MarcasProvider({ children }) {
  const [marcas, setMarcas] = useState([]);

  const [errors, setErrors] = useState([]);

  const getMarcas = async () => {
    try {
      const res = await getMarcasRequest();
      console.log(res);
      setMarcas(res)
    } catch (error) {
      console.error(error);
    }
  };

  const createMarcas = async (marcas) => {
      try {
        return await createMarcaRequest(marcas);
        // return response
        console.log("Marcas:",response)
      } catch (error) {
        console.log(error);
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

  const updateMarca = async (id, marcas) => {
    try {
      await updateMarcaRequest(id, marcas);
    } catch (error) {
      console.error(error);
      setErrors(error.response.data.message)
    }
  };

  const deleteMarca = async (id) => {
    try {
      const res = await deleteMarcaRequest(id);
      console.log(res);
      if (res.status === 204) setMarcas(clientes.filter((marca) => marca._id !== id));
  } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errors]);


  

  return (
    <MarcasContext.Provider
      value={{
        marcas,
        // cliente,
        errors,
        getMarcas,
        createMarcas,
        updateMarca,
        deleteMarca,
        getMarca,
      }}
    >
      {children}
    </MarcasContext.Provider>
  );
}
