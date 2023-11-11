import { useContext, useState, createContext, useEffect } from "react";
import {
  getRepuestosRequest,
  getRepuestoRequest,
  createRepuestoRequest,
  updateRepuestoRequest,
  deleteRepuestoRequest
} from "../api/repuestos";


const RepuestoContext = createContext();

export const useRepuestos = () => {
  const context = useContext(RepuestoContext);
  if (!context) throw new Error("useClientes debe ser usado en ClienteProvider");
  return context;
};

export function RepuestoProvider({ children }) {
  const [repuestos, setRepuestos] = useState([]);
  // const [cliente, setCliente] = useState(null)
  const [errors, setErrors] = useState([]);

  const getRepuestos = async () => {
    try {
      const res = await getRepuestosRequest();
      console.log(res);
      setRepuestos(res)
    } catch (error) {
      console.error(error);
    }
  };

  const createRepuesto = async (repuesto) => {
      try {
        return await createRepuestoRequest(repuesto);
        // return response
        console.log("repuestos:",response)
      } catch (error) {
        console.log(error);
        setErrors(error.response.data.message);
      }
    
  }

  const getRepuesto = async (id) => {
    try {
      const res = await getRepuestoRequest(id);
      return res;
    } catch (error) {
      console.error(error);
    }
  };

  const updateRepuesto = async (id, repuesto) => {
    try {
      return await updateRepuestoRequest(id, repuesto);
    } catch (error) {
      console.error(error);
      setErrors(error.response.data.message)
    }
  };

  const deleteRepuesto = async (id) => {
    try {
      const res = await deleteRepuestoRequest(id);
      console.log(res);
      if (res.status === 204) setRepuestos(repuestos.filter((repuesto) => repuesto._id !== id));
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
    <RepuestoContext.Provider
      value={{
        repuestos,
        // cliente,
        errors,
        getRepuestos,
        getRepuesto,
        createRepuesto,
        updateRepuesto,
        deleteRepuesto,
      }}
    >
      {children}
    </RepuestoContext.Provider>
  );
}