import { useContext, useState, createContext, useEffect } from "react";
import {
  getMecanicosRequest,
  getMecanicoRequest,
  createMecanicosRequest,
  updateMecanicosRequest,
  deleteMecanicosRequest
} from "../api/mecanicos";
import axios from "axios";

//Se crea un contexto para compartir datos y funciones relacionadas con los mecanicos
const MecanicoContext = createContext();

//Se crea un hook personalizado para acceder al contexto de mecanicos.
export const useMecanicos = () => {
  const context = useContext(MecanicoContext);
  if (!context) throw new Error("useMecanicos debe ser usado en MecanicoProvider");
  return context;
};

// Este componente proporciona el contexto de mecanicos a la aplicación.
export function MecanicoProvider({ children }) {
  const [mecanicos, setMecanicos] = useState([]);
  // const [cliente, setCliente] = useState(null)
  const [errors, setErrors] = useState([]);

  // Función para obtener la lista de clientes.
  const getMecanicos = async () => {
    try {
      const res = await getMecanicosRequest();
      console.log(res);
      setMecanicos(res)
    } catch (error) {
      console.error(error);
    }
  };
  // Función para crear un nuevo cliente.
  const createMecanico = async (mecanico) => {
      try {
        return await createMecanicosRequest(mecanico);
        // return response
        console.log("mecanicos:",response)
      } catch (error) {
        console.log(error);
        setErrors(error.response.data.message);
      }
    
  }
  // Función para obtener un cliente específico por su ID.
  const getMecanico = async (id) => {
    try {
      const res = await getMecanicoRequest(id);
      return res;
    } catch (error) {
      console.error(error);
    }
  };

  // Función para actualizar un cliente existente.
  const updateMecanico = async (id, mecanico) => {
    try {
      await updateMecanicosRequest(id, mecanico);
    } catch (error) {
      console.error(error);
      setErrors(error.response.data.message)
    }
  };

  // Función para eliminar un cliente por su ID.
  const deleteMecanico = async (id) => {
    try {
      const res = await deleteMecanicosRequest(id);
      console.log(res);
      if (res.status === 204) setMecanicos(mecanicos.filter((mecanico) => mecanico._id !== id));
    } catch (error) {
      console.error(error);
    }
  };
  // Utiliza useEffect para limpiar los errores después de un tiempo.
  // useEffect(() => {
  //   if (errors.length > 0) {
  //     const timer = setTimeout(() => {
  //       setErrors([]);
  //     }, 3000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [errors]);


  
  // Proporciona el contexto de clientes y las funciones relacionadas a los componentes hijos.
  return (
    <MecanicoContext.Provider
      value={{
        mecanicos,
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
