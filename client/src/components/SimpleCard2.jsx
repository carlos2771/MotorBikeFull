import React from "react";

export default function SimpleCard2({ totalMostrado }) {
  const formattedTotal = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(totalMostrado);

  return (
    <div className="bg-slate-700 shadow-lg shadow-blue-600/40 max-w-sm w-full p-5 rounded-md mt-9">
      <h1 className="text-white text-2xl font-bold mb-2">Mano de obra:</h1>
      <p className="text-blue-300 text-5xl font-bold">{formattedTotal}</p>
    </div>
  );
}
