import { useContext, useState, createContext, useEffect } from "react";
import {
  createVentasServiciosRequest,
  deleteVentasServiciosRequest,
  getVentaServicioRequest,
  updateVentasServiciosRequest,
  getVentasServiciosRequest
} from "../api/ventas_servicios";

const VentaServicioContext = createContext();

export const useVentasServicios = () => {
  const context = useContext(VentaServicioContext);
  if (!context)
    throw new Error(
      "useVentasServicios debe ser usado en VentasServicioProvider"
    );
  return context;
};

export function VentasServicioProvider({ children }) {
  const [ventasServicios, setVentasServicios] = useState([]);
  const [errors, setErrors] = useState([]);

  const getVentasServicios = async () => {
    try {
      const res = await getVentasServiciosRequest();
      console.log(res);
      setVentasServicios(res);
    } catch (error) {
      console.error(error);
    }
  };

  const createVentaServicio = async (venta) => {
    try {
      return  await createVentasServiciosRequest(venta);
    } catch (error) {
      setErrors(error.response.data.message);
      console.log(error);
    }
  };

  const getVentaServicio = async (id) => {
    try {
      const res = await getVentaServicioRequest(id);
      return res;
    } catch (error) {
      console.error(error);
      
    }
  };

  const updateVentaServicio = async (id, venta) => {
    try {
      return await updateVentasServiciosRequest(id, venta);
    } catch (error) {
      console.error(error);
      setErrors(error.response.data.message);
    }
  };
  
  const deleteVentaServicio = async (id) => {
    try {
      const res = await deleteVentasServiciosRequest(id);
      console.log(res);
      if (res.status === 204) {
        setVentasServicios(ventasServicios.filter((venta) => venta._id !== id));
      }
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
    <VentaServicioContext.Provider
      value={{
        ventasServicios,
        errors,
        getVentasServicios,
        createVentaServicio,
        getVentaServicio,
        updateVentaServicio,
        deleteVentaServicio
      }}
    >
      {children}
    </VentaServicioContext.Provider>
  );
}