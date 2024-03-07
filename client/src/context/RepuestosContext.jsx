import { useContext, useState, createContext, useEffect } from "react";
import {
  createRepuestosRequest,
  deleteRepuestosRequest,
  getRepuestosRequest,
  updateRepuestosRequest,
  getRepuestoRequest
} from "../api/repuestos";

const RepuestoContext = createContext();

export const useRepuestos = () => {
  const context = useContext(RepuestoContext);
  if (!context)
    throw new Error(
      "useRepuestos debe ser usado en RepuestoProvider"
    );
  return context;
};

export function RepuestoProvider({ children }) {
  const [repuestos, setRepuestos] = useState([]);
  const [errors, setErrors] = useState([]);

  const getRepuestos = async () => {
    try {
      const res = await getRepuestosRequest();
      setRepuestos(res);
    } catch (error) {
      console.error(error);
    }
  };

  const createRepuesto = async (repuesto) => {
    try {
      return await createRepuestosRequest(repuesto);
    } catch (error) {
      setErrors(error.response.data.message);
    }
  };

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
      return await updateRepuestosRequest(id, repuesto);
    } catch (error) {
      console.error(error);
      setErrors(error.response.data.message);
    }
  };

  const deleteRepuesto = async (id) => {
    try {
      const res = await deleteRepuestosRequest(id);
      if (res.status === 204) {
        setRepuestos(repuestos.filter((repuesto) => repuesto._id !== id));
      }
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
        errors,
        getRepuestos,
        createRepuesto,
        getRepuesto,
        updateRepuesto,
        deleteRepuesto
      }}
    >
      {children}
    </RepuestoContext.Provider>
  );
}