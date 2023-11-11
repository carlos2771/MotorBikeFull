import React, { useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { useRepuestos } from "../../context/RepuestosContext";
import { Link } from "react-router-dom";

export default function PageRepuestos() {
  const { repuestos, getRepuestos, deleteRepuesto } = useRepuestos();

  useEffect(() => {
    try {
      getRepuestos();
    } catch (error) {
      console.error("Error al obtener repuestos:", error);
    }
  }, []);

  const columns = [
    {
      field: "nombre_repuesto",
      headerName: "Nombre",
      width: 190,
      editable: true,
      headerClassName: 'custom-header',
    },
    {
      field: "cantidad",
      headerName: "cantidad",
      width: 240,
      editable: true,
      headerClassName: 'custom-header',
    },
    {
      field: "precio",
      headerName: "precio",
      width: 200,
      editable: true,
      headerClassName: 'custom-header',
    },
    {
      field: "createdAt",
      headerName: "Fecha Creacion",
      width: 240,
      editable: true,
      headerClassName: 'custom-header',
      renderCell: (params) => {
        const date = new Date(params.value);
        const formattedDate = date.toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        return <div>{formattedDate}</div>;
      },
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 200,
      headerClassName: 'custom-header',
      renderCell: (params) => {
        return (
          <div>
            <button
              className="px-4 py-1 text-sm text-white font-semibold rounded-full border border-red-500 hover:text-white hover:bg-red-500"
              onClick={() => {
                deleteRepuesto(params.row._id); // Suponiendo que params.row contiene la información del cliente
              }}
            >
              Eliminar
            </button>
            <button
              className="px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-green-500 hover:text-white hover:bg-green-600"
            >
              <Link to={`/repuestos/${params.row._id}`}>Editar</Link>
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="mt-16 ">
      <h1 className="text-2xl text-center mx-auto">Repuestos</h1>
      <div className="mx-10 justify-end flex ">
        <Link to="/add-repuesto">
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mx-8">
            Agregar Repuesto
          </button>
        </Link>
      </div>
      <Box sx={{ width: "100%" }}>
        <DataGrid
          className="bg-slate-700 shadow-lg shadow-blue-600/40 mx-16 my-4"
          rows={repuestos}
          columns={columns}
          getRowId={(row) => row._id}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
          sx={{
            color: "white",
            '& .MuiDataGrid-cell': {
              fontSize: '18px', // Cambia el tamaño de fuente aquí
            },
          }}
          slots={{ toolbar: GridToolbar }}
        />
      </Box>
    </div>
  );
}
