import React, { useEffect } from "react";
import { useCompras } from "../../context/ComprasContext";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function PageCompras() {
  const { compras, getCompras, deleteCompras, updateCompras } =
    useCompras();

  useEffect(() => {
    try {
      getCompras();
    } catch (error) {
      console.error("Error al obtener compras:", error);
    }
  }, []);

  const mostrarAlerta = (id, estado) => {
    const title = estado === "Activo" ? "Inhabilitar" : "Habilitar";
    const text = estado === "Activo" ? "¿Estás seguro de inhabilitar la venta ?" : "¿Estás seguro de habilitar la venta ?";
    const texto = estado === "Activo" ? "Inhabilitado" : "Habilitado";

    Swal.fire({
      title: title,
      text: text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        cambiarEstado(id, estado);
        Swal.fire(`${texto}`, `la venta  ha sido ${texto} `, "success");
      }
    });
  };

  const cambiarEstado = (id, estado) => {
    const nuevoEstado = estado === "Activo" ? "Inactivo" : "Activo";
    updateCompras(id, { estado: nuevoEstado }).then(() => {
      getCompras();
    });
  };

  const columns = [
    {
      field: "repuesto",
      headerName: "Repuesto",
      width: 160,
      headerClassName: "custom-header",
      valueGetter: (params) => params.row.repuesto.nombre_repuesto,
    },
    {
      field: "cantidad_repuesto",
      headerName: "Cantidad Repuesto",
      width: 185,
      headerClassName: "custom-header",
    },
    {
      field: "precio_unitario",
      headerName: "Precio Unitario",
      width: 170,
      headerClassName: "custom-header",
    },
    {
      field: "precio_total",
      headerName: "Precio Total",
      width: 170,
      headerClassName: "custom-header",
    },
    {
      field: "fecha",
      headerName: "fecha",
      width: 170,
      headerClassName: "custom-header",
    },
    {
      field: "estado",
      headerName: "Estado",
      width: 100,

    },
    {
      field: "createdAt",
      headerName: "Fecha Creacion",
      width: 300,
      headerClassName: "custom-header",
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
      headerClassName: "custom-header",
      renderCell: (params) => {
        const estado = params.row.estado;
        return (
          <div>
            <button
              className={estado === "Activo" ? "px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-green-500 hover:text-white hover:bg-green-500" : "hidden"}
            >
              <Link to={`/compras/${params.row._id}`}>Editar</Link>
            </button>

            {/* <button
              className="px-4 py-1 text-sm text-white font-semibold rounded-full border border-red-500 hover:text-white hover:bg-red-500"
              onClick={() => {
                deleteVentaRepuesto(params.row._id);
              }}
            >
              Eliminar
            </button> */}
            <button
              className={
                estado === "Activo"
                  ? "px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-red-500 hover:text-white hover:bg-red-500"
                  : "px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-yellow-500 hover:text-white hover:bg-yellow-500"
              }
              onClick={() => mostrarAlerta(params.row._id, estado)}
            >
              {estado === "Activo" ? "Inhabilitar" : "Habilitar"}
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="mt-16 ">
      <h1 className="text-2xl text-center mx-auto">Compras</h1>
      <div className="mx-10 justify-end flex ">
        <Link to="/add-compra">
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mx-8">
            Agregar Compra
          </button>
        </Link>
      </div>
      <Box sx={{ width: "100%" }}>
        <DataGrid
          className="bg-slate-700 shadow-lg shadow-blue-600/40 mx-16 my-4"
          rows={compras}
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
          disableRowSelectionOnClick
          sx={{
            color: "white",
            "& .MuiDataGrid-cell": {
              fontSize: "18px", // Cambia el tamaño de fuente aquí
            },
          }}
          slots={{ toolbar: GridToolbar }}
        />
      </Box>
    </div>
  );
}
