import { useContext, useState, createContext, useEffect } from "react";
import {
    getMecanicosRequest,
    getMecanicoRequest,
    createMecanicosRequest,
    updateMecanicosRequest,
    deleteMecanicosRequest
} from "../api/mecanicos";


const MecanicoContext = createContext();

export const useMecanicos = () => {
  const context = useContext(MecanicoContext);
  if (!context) throw new Error("useMecanico debe ser usado en MecanicoProvider");
  return context;
};

export function MecanicoProvider({ children }) {
  const [mecanicos, setMecanicos] = useState([]);
  // const [cliente, setCliente] = useState(null)
  const [errors, setErrors] = useState([]);

  const getMecanicos = async () => {
    try {
      const res = await getMecanicosRequest();
      setMecanicos(res)
    } catch (error) {
      console.error(error);
    }
  };

  const createMecanico = async (mecanico) => {
      try {
        return await createMecanicosRequest(mecanico);
        // return response
      } catch (error) {
        setErrors(error.response.data.message);
      }
    
  }

  const getMecanico = async (id) => {
    try {
      const res = await getMecanicoRequest(id);
      return res;
    } catch (error) {
      console.error(error);
    }
  };

  const updateMecanico = async (id, mecanico) => {
    try {
      return await updateMecanicosRequest(id, mecanico);
    } catch (error) {
      console.error(error);
      setErrors(error.response.data.message)
    }
  };

  const deleteMecanico = async (id) => {
    try {
      const res = await deleteMecanicosRequest(id);
      if (res.status === 204) setMecanicos(mecanicos.filter((mecanico) => mecanico._id !== id));
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
    <MecanicoContext.Provider
      value={{
        mecanicos,
        // cliente,
        errors,
        getMecanicos,
        createMecanico,
        updateMecanico,
        deleteMecanico,
        getMecanico,
      }}
    >
      {children}
    </MecanicoContext.Provider>
  );
}