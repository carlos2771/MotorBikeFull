import React from "react";
import { useVentasServicios } from "../context/VentasServicioContex";

export default function SimpleCard() {
  const { getVentasServiciosDelDia } = useVentasServicios();
  const ventasDelDia = getVentasServiciosDelDia();

  return (
    <div className="bg-slate-700 shadow-lg shadow-blue-600/40 max-w-sm w-full p-5 rounded-md mt-9">
      <h1 className="text-white text-2xl font-bold mb-2">Servicios :</h1>
      <p className="text-blue-300 text-5xl font-bold">{ventasDelDia}</p>
    </div>
  );
}

//ESTA CARD TIENE EL CONTEO DE SERVICIOS REALIZADOS ACTIVOS