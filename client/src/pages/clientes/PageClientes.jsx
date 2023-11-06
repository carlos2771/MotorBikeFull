import React, { useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { useClientes } from "../../context/ClientContext";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function PageClientes() {
  const { clientes, getClientes, deleteCliente } = useClientes();

  useEffect(() => {
    try {
      getClientes();
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  }, []);

  const mostrarAlerta = (id) => {
    Swal.fire({
      title: "Eliminar",
      text: "¿Estás seguro de eliminar el cliente?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
      confirmButtonColor: "#3085d6", 
    cancelButtonColor: "#d33", 
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCliente(id); 
        Swal.fire("Eliminado", "El cliente ha sido eliminado.", "success");
      }
    });
  };

  const columns = [
    {
      field: "nombre_cliente",
      headerName: "Nombre",
      width: 190,
      editable: true,
    },
    {
      field: "email_cliente",
      headerName: "Email",
      width: 240,
      editable: true,
    },
    {
      field: "telefono_cliente",
      headerName: "Telefono",
      width: 200,
      editable: true,
    },
    {
      field: "cedula",
      headerName: "Cedula",
      width: 200,
      editable: true,
    },
    {
      field: "createdAt",
      headerName: "Fecha Creacion",
      width: 240,
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
      width: 200,
      renderCell: (params) => {
        return (
          <div>
            <button
              className="px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-green-500 hover:text-white hover:bg-green-600"
            >
              <Link to={`/cliente/${params.row._id}`}>Editar</Link>
            </button>
            <button
              className="px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-red-500 hover:text-white hover:bg-red-500"
              onClick={() => mostrarAlerta(params.row._id)}
            >
              Eliminar
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="mt-16">
      <h1 className="text-2xl text-center mx-auto">Clientes</h1>
      <div className="mx-10 justify-end flex">
        <Link to="/add-cliente">
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mx-8">
            Agregar Cliente
          </button>
        </Link>
      </div>
      <Box sx={{ width: "100%" }}>
        <DataGrid
          className="bg-slate-700 shadow-lg shadow-blue-600/40 mx-16 my-4"
          rows={clientes}
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
              fontSize: '18px',
            },
          }}
          slots={{ toolbar: GridToolbar }}
        />
      </Box>
    </div>
  );
}
