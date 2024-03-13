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
  

  const getTotalServiciosActivosDelDia = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filtra las ventas activas del día
    const ventasActivasDelDia = ventasServicios.filter((venta) => {
      const ventaDate = new Date(venta.createdAt);
      ventaDate.setHours(0, 0, 0, 0);
      return ventaDate.getTime() === today.getTime() && venta.estado === 'Finalizada';
    });

    // Calcula el total en dinero de los servicios activos del día
    const totalDelDia = ventasActivasDelDia.reduce((total, venta) => {
      return total + venta.precio_servicio;
    }, 0);

    return totalDelDia;
  };

  const createVentaServicio = async (venta) => {
    try {
      return await createVentasServiciosRequest(venta);
    } catch (error) {
      setErrors(error.response.data.message);
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
      return ventaDate.getTime() === today.getTime() && venta.estado === 'Finalizada';
    });
  
    return ventasActivasDelDia.length;
  };


  //
  // Ventas semana
  //
  const getVentasServiciosDeLaSemana = () => {
    const today = new Date();
    const firstDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const lastDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay()));
    
    // Filtra las ventas activas de la semana
    const ventasActivasDeLaSemana = ventasServicios.filter((venta) => {
      const ventaDate = new Date(venta.createdAt);
      return ventaDate >= firstDayOfWeek && ventaDate <= lastDayOfWeek && venta.estado === 'Finalizada';
    });
    
    return ventasActivasDeLaSemana && ventasActivasDeLaSemana.length;
  };

  const getTotalVentasActivasSemana = () => {
    const today = new Date();
    const firstDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const lastDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay()));
    
    // Filtra las ventas activas de la semana
    const ventasActivasDeLaSemana = ventasServicios.filter((venta) => {
      const ventaDate = new Date(venta.createdAt);
      return ventaDate >= firstDayOfWeek && ventaDate <= lastDayOfWeek && venta.estado === 'Finalizada';
    });
    
    return ventasActivasDeLaSemana.length;
  };
  
  const getTotalServiciosActivosDeLaSemana = () => {
    const ventasActivasDeLaSemana = getVentasServiciosDeLaSemana();
    
    // Calcula el total en dinero de los servicios activos de la semana
    const totalDeLaSemana = ventasActivasDeLaSemana.reduce((total, venta) => {
      return total + venta.precio_servicio;
    }, 0);
    
    return totalDeLaSemana;
  };


  //
  // Ventas Mes
  //
  const getVentasServiciosDelMes = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    // Filtra las ventas activas del mes
    const ventasActivasDelMes = ventasServicios.filter((venta) => {
      const ventaDate = new Date(venta.createdAt);
      return ventaDate >= firstDayOfMonth && ventaDate <= lastDayOfMonth && venta.estado === 'Finalizada';
    });
    
    return ventasActivasDelMes;
  };

  const getTotalVentasActivasMes = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    // Filtra las ventas activas del mes
    const ventasActivasDelMes = ventasServicios.filter((venta) => {
      const ventaDate = new Date(venta.createdAt);
      return ventaDate >= firstDayOfMonth && ventaDate <= lastDayOfMonth && venta.estado === 'Finalizada';
    });
    
    return ventasActivasDelMes.length;
  }

  const getTotalServiciosActivosDelMes = () => {
    const ventasActivasDelMes = getVentasServiciosDelMes();
    
    // Calcula el total en dinero de los servicios activos del mes
    const totalDelMes = ventasActivasDelMes.reduce((total, venta) => {
      return total + venta.precio_servicio;
    }, 0);
    
    return totalDelMes;
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
        getTotalServiciosActivosDelDia,
        getVentasServiciosDeLaSemana,
        getTotalServiciosActivosDeLaSemana,
        getTotalVentasActivasSemana,
        getVentasServiciosDelMes,
        getTotalServiciosActivosDelMes,
        getTotalVentasActivasMes
      }}
    >
      {children}
    </VentaServicioContext.Provider>
  );
}
