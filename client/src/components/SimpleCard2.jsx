import React from "react";
import { useVentasServicios } from "../context/VentasServicioContex";

export default function SimpleCard2() {
  const { getTotalServiciosActivosDelDia } = useVentasServicios();
  const totalServiciosActivosDelDia = getTotalServiciosActivosDelDia();

  // Formatear el número con separadores de miles y decimales
  const formattedTotal = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(totalServiciosActivosDelDia);

  return (
    <div className="bg-slate-700 shadow-lg shadow-blue-600/40 max-w-sm w-full p-5 rounded-md mt-9">
      <h1 className="text-white text-2xl font-bold mb-2">Mano de obra:</h1>
      <p className="text-blue-300 text-5xl font-bold">{formattedTotal}</p>
    </div>
  );
}
