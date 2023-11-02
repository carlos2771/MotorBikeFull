import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import MuiDataTable from "mui-datatables";
import { useMarcas } from "../../context/MarcasContext";

export default function MarcasPage() {
  // Obtiene los datos y funciones relacionados con los marca desde el contexto.
  const { marcas, getMarcas, deleteMarca } = useMarcas();
  
  // Utiliza useEffect para cargar la lista de marcas al cargar la página.
  useEffect(() => {
    try {
      getMarcas();
    } catch (error) {
      console.error("Error al obtener marcas:", error);
    }
  }, []);

  // Función para generar colores aleatorios en formato hexadecimal
//   function getRandomColor() {
//     const letters = "0123456789ABCDEF";
//     let color = "#";
//     for (let i = 0; i < 6; i++) {
//       color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
//   }

  const columns = [
    {
      name: "contador",
      label: "ID",
      options: {
        customBodyRender: (value, tableMeta) => {
          return tableMeta.rowIndex + 1; // Comenzar el conteo en 1 en lugar de 0
        },
      },
      
    },
    // {
    //   name: "nombre_cliente",
    //   label: "Avatar",
    //   options: {
    //     customBodyRender: (value, tableMeta) => {
    //       // Genera un color aleatorio
    //       const randomColor = getRandomColor();
    //       const firstLetter = value.charAt(0).toUpperCase();
    //       return (
    //         <div
    //           style={{
    //             width: "40px",
    //             height: "40px",
    //             display: "flex",
    //             justifyContent: "center",
    //             alignItems: "center",
    //             backgroundColor: randomColor, // Color de fondo del avatar aleatorio
    //             color: "#fff", // Color del texto en el avatar
    //             borderRadius: "50%",
    //           }}
    //         >
    //           {firstLetter}
    //         </div>
    //       );
    //     },
    //   },
    // },
    {
      name: "nombre_marca",
      label: "Nombre Marca",
    },
    {
      name: "createdAt",
      label: "Fecha Creacion",
      options: {
        customBodyRender: (value) => {
          const date = new Date(value);
          return date.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        },
      },
    },
    {
      name: "Acciones",
      options: {
        customBodyRender: (value, tableMeta) => {
          return (
            <div>
              <button
                className="px-4 py-1 text-sm text-black font-semibold rounded-full border border-red-500 hover:text-white hover:bg-red-500 hover:border-transparent shadow-lg shadow-zinc-950/30 "
                onClick={() => {
                    deleteMarca(marcas[tableMeta.rowIndex]._id);
                }}
              >
                Eliminar
              </button>
              <button className="px-4 py-1 m-1 text-sm text-black font-semibold rounded-full border border-green-500  hover:text-white hover:bg-green-600 focus:outline-none focus:ring-2  focus:ring-offset-2 shadow-lg shadow-zinc-950/30">
                <Link to={`/marca/${marcas[tableMeta.rowIndex]._id}`}>
                  Editar
                </Link>
              </button>
            </div>
          );
        },
      },
    },
  ];

  return (
    <div>
      <button className="px-5 py-1 m-2 text-sm text-white font-semibold rounded-full border border-blue-500 hover:text-white hover:bg-blue-500 hover:border-transparent shadow-lg shadow-zinc-300/30">
        <Link to={"/add-marca"}>Añadir Marcas</Link>
      </button>
      <MuiDataTable
        title={"Marcas"}
        data={marcas}
        columns={columns}
        options={{ selectableRows: "none" }}
      />
    </div>
  );
}
