import React from "react";

export function Tabla({children }) {
  return (
    <td className="border px-4 py-2 border-blue-700 shadow-lg sm:text-lg table-cell  min-w-full ">
      {children}
    </td>
  );
}

export function Titulo({children}){
    return(
        <td
        colSpan="2"
        className=" border px-4 py-2 text-center text-2xl border-blue-700 shadow-lg rounded-t-lg bg-blue-600 bg-opacity-40"
      >
        {children}
    </td>  
    )
}