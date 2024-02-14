import React, { useContext, useEffect, useState } from "react";
import { useCompras } from "../context/ComprasContext";

const SimpleCard4 = () => {
  // Obtenemos el contexto de compras
  const { compras, getCompras } = useCompras();
  const [totalCompras, setTotalCompras] = useState(0);

  useEffect(() => {
    // Llamamos a la función para obtener las compras
    getCompras();
  }, []);

  useEffect(() => {
    // Filtramos las compras que no están anuladas
    const comprasNoAnuladas = compras.filter(compra => !compra.anulado);
    // Calculamos el total de todas las compras no anuladas
    let total = 0;
    comprasNoAnuladas.forEach(compra => {
      total += calcularPrecioTotalCompra(compra);
    });
    setTotalCompras(total);
  }, [compras]);

  // Función para calcular el precio total de una compra
  const calcularPrecioTotalCompra = (compra) => {
    return compra.repuestos.reduce((total, repuesto) => {
      return total + repuesto.precio_total;
    }, 0);
  };

  // Formatear el número con separadores de miles y decimales
  const formattedTotalCompras = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(totalCompras);

  return (
    <div className="bg-slate-700 shadow-lg shadow-blue-600/40 max-w-sm w-full p-5 rounded-md mt-9">
      <h1 className="text-white text-2xl font-bold mb-2">Compras:</h1>
      <p className="text-blue-300 text-5xl font-bold">{formattedTotalCompras}</p>
    </div>
  );
};

export default SimpleCard4;
