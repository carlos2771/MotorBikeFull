import React, {useEffect} from "react";
import { useCartCliente } from "../context/CartClienteContext"; // Asegúrate de que la ruta sea correcta


const SimpleCard3 = () => {
  const { cartClientes,getCartClient } = useCartCliente();

  useEffect(() => {
    // Llamamos a la función para obtener los datos de las ventas
    getCartClient();
  }, []);


  // Filtrar solo las ventas activas que no están anuladas
  const ventasActivas = cartClientes.filter((venta) => !venta.anulado);

  // Calcular el total general sumando los totales de las ventas activas
  const totalVentas = ventasActivas.reduce((total, venta) => total + venta.total, 0);

  // Formatear el número con separadores de miles y decimales
  const formattedTotalVentas = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(totalVentas);

  // Renderizar la tarjeta con el total de ventas formateado
  return (
    <div className="bg-slate-700 shadow-lg shadow-blue-600/40 max-w-sm w-full p-5 rounded-md mt-9 md:max-w-md md:mx-auto lg:max-w-lg lg:mx-auto xl:max-w-xl xl:mx-auto">
      <h1 className="text-white text-2xl font-bold mb-2">Ventas:</h1>
      <p className="text-blue-300 text-4xl font-bold">{formattedTotalVentas}</p>
    </div>
  );
};

export default SimpleCard3;
