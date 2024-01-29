import React from "react";
import { useVentasServicios } from "../context/VentasServicioContex";

export default function SimpleCard2() {
  const { getTotalServiciosActivosPorMecanico } = useVentasServicios();
  const totalServiciosActivosPorMecanico = getTotalServiciosActivosPorMecanico();

  // Calcular el total general sumando los totales por mecánico
  const totalGeneral = Object.values(totalServiciosActivosPorMecanico).reduce((total, amount) => total + amount, 0);

  // Formatear el número con separadores de miles y decimales
  const formattedTotal = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(totalGeneral);

  return (
    <div className="bg-slate-700 shadow-lg shadow-blue-600/40 max-w-sm w-full p-5 rounded-md mt-9">
      <h1 className="text-white text-2xl font-bold mb-2">Total en servicios:</h1>
      <p className="text-green-500 text-5xl font-bold">{formattedTotal}</p>
    </div>
  );
}

//ESTA CARD TIENE EL TOTAL DE DINERO OBTENIDO EN SERVICIOS
