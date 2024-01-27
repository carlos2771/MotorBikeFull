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
      setVentasServicios(res);
    } catch (error) {
      console.error(error);
    }
  };

  //AQUI VOY A OBTENER LOS SERVICIOS ACTIVOS DE LOS MECANICOS PARA PODER MOSTRAR EN LAS SIMPLECARDS
  const getTotalServiciosActivosPorMecanico = () => {
    const totalPorMecanico = {};
    ventasServicios.forEach((venta) => {
      if (venta.estado === 'Activo') {
        const mecanicoId = venta.mecanico._id;
        const precioServicio = venta.precio_servicio;
        totalPorMecanico[mecanicoId] = (totalPorMecanico[mecanicoId] || 0) + precioServicio;
      }
    });
    return totalPorMecanico;
  };

  const createVentaServicio = async (venta) => {
    try {
      return await createVentasServiciosRequest(venta);
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
      if (res.status === 204) {
        setVentasServicios((prevVentas) =>
          prevVentas.map((venta) =>
            venta._id === id ? { ...venta, estado: 'Inactivo' } : venta
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getVentasServiciosDelDia = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    // Filtra las ventas activas del día
    const ventasActivasDelDia = ventasServicios.filter((venta) => {
      const ventaDate = new Date(venta.createdAt);
      ventaDate.setHours(0, 0, 0, 0);
      return ventaDate.getTime() === today.getTime() && venta.estado === 'Activo';
    });
  
    return ventasActivasDelDia.length;
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
        deleteVentaServicio,
        getVentasServiciosDelDia,
        getTotalServiciosActivosPorMecanico
      }}
    >
      {children}
    </VentaServicioContext.Provider>
  );
}
