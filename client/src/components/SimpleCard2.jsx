import React, { useEffect } from "react";
import { useVentasServicios } from "../context/VentasServicioContex";

export default function SimpleCard2() {
  const { getTotalServiciosActivosDelDia, getVentasServicios } = useVentasServicios();

  useEffect(() => {
    // Llamamos a la función para obtener los datos de ventas de servicios
    getVentasServicios();
  }, []);

  // Obtenemos el total de servicios activos del día
  const totalServiciosActivosDelDia = getTotalServiciosActivosDelDia();

  // Formatear el número con separadores de miles y decimales
  const formattedTotal = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(totalServiciosActivosDelDia);

  return (
    <div className="bg-slate-700 shadow-lg shadow-blue-600/40 max-w-sm w-full p-5 rounded-md mt-9 md:max-w-md md:mx-auto lg:max-w-lg lg:mx-auto xl:max-w-xl xl:mx-auto">
    <h1 className="text-white text-2xl font-bold mb-2">Costo de servicios:</h1>
    <p className="text-blue-300 text-4xl font-bold">{formattedTotal}</p>
  </div>
  );
}
