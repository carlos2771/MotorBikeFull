import React, { useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { useMarcas } from "../../context/MarcasContext";
import { Link } from "react-router-dom";

export default function PageClientes() {
  const { marcas, getMarcas, deleteMarca } = useMarcas();

  useEffect(() => {
    try {
        getMarcas();
    } catch (error) {
      console.error("Error al obtener las marcas:", error);
    }
  }, []);

  const columns = [
    {
      field: "nombre_marca",
      headerName: "Nombre Marca",
      width: 300,
      editable: true,
    },
    {
      field: "createdAt",
      headerName: "Fecha Creacion",
      width: 300,
      editable: true,
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
      width: 300,
      renderCell: (params) => {
        return (
          <div>
            <button
              className="px-4 py-1 text-sm text-white font-semibold rounded-full border border-red-500 hover:text-white hover:bg-red-500"
              onClick={() => {
                deleteMarca(params.row._id); // Suponiendo que params.row contiene la información del cliente
              }}
            >
              Eliminar
            </button>
            <button
              className="px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-green-500 hover:text-white hover:bg-green-600"
            >
              <Link to={`/marcas/${params.row._id}`}>Editar</Link>
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="mt-16 ">
      <h1 className="text-2xl text-center mx-auto">Marcas</h1>
      <div className="mx-10 justify-end flex ">
        <Link to="/add-marca">
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mx-8">
            Agregar Marca
          </button>
        </Link>
      </div>
      <Box sx={{ width: "100%" }}>
        <DataGrid
          className="bg-neutral-700 mx-16 my-4"
          rows={marcas}
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
          }}
          slots={{ toolbar: GridToolbar }}
        />
      </Box>
    </div>
  );
}
