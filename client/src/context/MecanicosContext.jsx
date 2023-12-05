import { useContext, useState, createContext, useEffect } from "react";
import {
<<<<<<< HEAD
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
=======
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

>>>>>>> 60306eb967723c91bfbcf96a43887b3680169091
export function MecanicoProvider({ children }) {
  const [mecanicos, setMecanicos] = useState([]);
  // const [cliente, setCliente] = useState(null)
  const [errors, setErrors] = useState([]);

<<<<<<< HEAD
  // Función para obtener la lista de clientes.
=======
>>>>>>> 60306eb967723c91bfbcf96a43887b3680169091
  const getMecanicos = async () => {
    try {
      const res = await getMecanicosRequest();
      console.log(res);
      setMecanicos(res)
    } catch (error) {
      console.error(error);
    }
  };
<<<<<<< HEAD
  // Función para crear un nuevo cliente.
=======

>>>>>>> 60306eb967723c91bfbcf96a43887b3680169091
  const createMecanico = async (mecanico) => {
      try {
        return await createMecanicosRequest(mecanico);
        // return response
<<<<<<< HEAD
        console.log("mecanicos:",response)
=======
        console.log("mecanico:",response)
>>>>>>> 60306eb967723c91bfbcf96a43887b3680169091
      } catch (error) {
        console.log(error);
        setErrors(error.response.data.message);
      }
    
  }
<<<<<<< HEAD
  // Función para obtener un cliente específico por su ID.
=======

>>>>>>> 60306eb967723c91bfbcf96a43887b3680169091
  const getMecanico = async (id) => {
    try {
      const res = await getMecanicoRequest(id);
      return res;
    } catch (error) {
      console.error(error);
    }
  };

<<<<<<< HEAD
  // Función para actualizar un cliente existente.
  const updateMecanico = async (id, mecanico) => {
    try {
      await updateMecanicosRequest(id, mecanico);
=======
  const updateMecanico = async (id, mecanico) => {
    try {
      return await updateMecanicosRequest(id, mecanico);
>>>>>>> 60306eb967723c91bfbcf96a43887b3680169091
    } catch (error) {
      console.error(error);
      setErrors(error.response.data.message)
    }
  };

<<<<<<< HEAD
  // Función para eliminar un cliente por su ID.
=======
>>>>>>> 60306eb967723c91bfbcf96a43887b3680169091
  const deleteMecanico = async (id) => {
    try {
      const res = await deleteMecanicosRequest(id);
      console.log(res);
      if (res.status === 204) setMecanicos(mecanicos.filter((mecanico) => mecanico._id !== id));
    } catch (error) {
      console.error(error);
    }
  };
<<<<<<< HEAD
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
=======

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errors]);


  

>>>>>>> 60306eb967723c91bfbcf96a43887b3680169091
  return (
    <MecanicoContext.Provider
      value={{
        mecanicos,
<<<<<<< HEAD
=======
        // cliente,
>>>>>>> 60306eb967723c91bfbcf96a43887b3680169091
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
