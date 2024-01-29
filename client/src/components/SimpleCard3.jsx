import React from "react";
import { useCartCliente } from "../context/CartClienteContext";

export default function SimpleCard3() {
  // Obtener la información de ventas desde el contexto
  const { cartClientes } = useCartCliente();

  // Calcular el total general sumando los totales de las ventas
  const totalVentas = cartClientes.reduce((total, venta) => total + venta.total, 0);

  // Formatear el número con separadores de miles y decimales
  const formattedTotalVentas = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(totalVentas);

  // Renderizar la tarjeta con el total de ventas formateado
  return (
    <div className="bg-slate-700 shadow-lg shadow-blue-600/40 max-w-sm w-full p-5 rounded-md mt-9">
      <h1 className="text-white text-2xl font-bold mb-2">Ventas de repuestos:</h1>
      <p className="text-green-500 text-5xl font-bold">{formattedTotalVentas}</p>
    </div>
  );
}
