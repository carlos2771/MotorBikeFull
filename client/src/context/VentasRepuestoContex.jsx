import { useContext, useState, createContext, useEffect } from "react";
import {
  createVentasRepuestosRequest,
  deleteVentasRepuestosRequest,
  getVentaRepuestoRequest,
  updateVentasRepuestosRequest,
  getVentasRepuestosRequest
} from "../api/ventas_repuestos";

const VentaRepuestoContext = createContext();

export const useVentasRepuestos = () => {
  const context = useContext(VentaRepuestoContext);
  if (!context)
    throw new Error(
      "useVentasRepuestos debe ser usado en VentaRepuestoProvider"
    );
  return context;
};

export function VentasRepuestoProvider({ children }) {
  const [ventasRepuestos, setVentasRepuestos] = useState([]);
  const [errors, setErrors] = useState([]);

  const getVentasRepuestos = async () => {
    try {
      const res = await getVentasRepuestosRequest();
      console.log(res);
      setVentasRepuestos(res);
    } catch (error) {
      console.error(error);
    }
  };

  const createVentaRepuesto = async (venta) => {
    try {
      return  await createVentasRepuestosRequest(venta);
      // console.log("ventas:", response);
    } catch (error) {
      setErrors(error.response.data.message);
      console.log(error);
    }
  };

  const getVentaRepuesto = async (id) => {
    try {
      const res = await getVentaRepuestoRequest(id);
      return res;
    } catch (error) {
      console.error(error);
    }
  };

  const updateVentaRepuesto = async (id, venta) => {
    try {
      return await updateVentasRepuestosRequest(id, venta);
    } catch (error) {
      console.error(error);
      setErrors(error.response.data.message);
    }
  };
  
  const deleteVentaRepuesto = async (id) => {
    try {
      const res = await deleteVentasRepuestosRequest(id);
      console.log(res);
      if (res.status === 204) {
        setVentasRepuestos(ventasRepuestos.filter((venta) => venta._id !== id));
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
    <VentaRepuestoContext.Provider
      value={{
        ventasRepuestos,
        errors,
        getVentasRepuestos,
        createVentaRepuesto,
        getVentaRepuesto,
        updateVentaRepuesto,
        deleteVentaRepuesto
      }}
    >
      {children}
    </VentaRepuestoContext.Provider>
  );
}
