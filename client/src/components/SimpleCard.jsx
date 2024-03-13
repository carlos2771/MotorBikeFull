import React, { useEffect, useState } from "react";
import { useVentasServicios } from "../context/VentasServicioContex";

export default function SimpleCard() {
  // #################### DIARIA ##############
  // const { getVentasServiciosDelDia } = useVentasServicios();
  // const ventasDelDia = getVentasServiciosDelDia();

  // ################### SEMANAL #########################

  // const { getTotalVentasActivasSemana, getVentasServicios } = useVentasServicios();
  // const ventasDeSemana = getTotalVentasActivasSemana();

  // useEffect(() => {
  //   getVentasServicios();
  // }, []);

  // ################### MENSUAL ###################
  const { getTotalVentasActivasMes, getVentasServicios } = useVentasServicios();
  const ventasMes = getTotalVentasActivasMes()

  useEffect(() => {
    getVentasServicios();
  }, []);


  return (
    <div className="bg-slate-700 shadow-lg shadow-blue-600/40 max-w-sm w-full p-5 rounded-md mt-9 md:max-w-md md:mx-auto lg:max-w-lg lg:mx-auto xl:max-w-xl xl:mx-auto">
      <h1 className="text-white text-2xl md:text-3xl lg:text-2xl font-bold mb-2">Servicios realizados:</h1>
      {/* <p className="text-blue-300 text-4xl font-bold">{ventasDelDia}</p> */}
      {/* <p className="text-blue-300 text-4xl font-bold">{ventasDeSemana}</p> */}
      <p className="text-blue-300 text-4xl font-bold">{ventasMes}</p>
    </div>
  );
}

//ESTA CARD TIENE EL CONTEO DE SERVICIOS REALIZADOS ACTIVOS