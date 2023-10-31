import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import MuiDataTable from "mui-datatables";
import { usePermisos } from "../../context/PermisosContext";

export default function PermisosPage() {
  const { Permisos, getPermisos, deletePermiso } = usePermisos();

  useEffect(() => {
    try {
      getPermisos();
    } catch (error) {
      console.error("Error al obtener el permiso:", error);
    }
  }, []);

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
    {
      name: "nombre_permiso",
      label: "Nombre",
    },
    {
      name: "estado",
      label: "estado"
    },
    {
      name: "updatedAt",
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
                  deletePermiso(Permisos[tableMeta.rowIndex]._id);
                }}
              >
                Eliminar
              </button>
              <button className="px-4 py-1 m-1 text-sm text-black font-semibold rounded-full border border-green-500  hover:text-white hover:bg-green-600 focus:outline-none focus:ring-2  focus:ring-offset-2 shadow-lg shadow-zinc-950/30">
                <Link to={`/permiso/${Permisos[tableMeta.rowIndex]._id}`}>
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
        <Link to={"/add-permiso"}>Añadir Permiso</Link>
      </button>
      <MuiDataTable
        title={"Permisos"}
        data={Permisos}
        columns={columns}
        options={{ selectableRows: "none" }}
      />
    </div>
  );
}
