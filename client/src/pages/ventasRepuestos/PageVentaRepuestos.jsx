import React, { useEffect } from "react";
import { useVentasRepuestos } from "../../context/VentasRepuestoContex";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function PageVentaRepuestos() {
  const { ventasRepuestos, getVentasRepuestos, deleteVentaRepuesto ,updateVentaRepuesto} =
    useVentasRepuestos();

  useEffect(() => {
    try {
      getVentasRepuestos();
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  }, []);

  const mostrarAlerta = (id, estado) => {
    const title = estado === "Activo" ? "Inhabilitar" : "Habilitar";
    const text =estado === "Activo"? "¿Estás seguro de inhabilitar la venta ?": "¿Estás seguro de habilitar la venta ?";
    const texto = estado === "Activo" ? "Inhabilitado" : "Habilitado";

    Swal.fire({
      title: title,
      text: text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
      background: "#334155",
      color: "white",
      iconColor: "red",
      buttonsStyling: false,
      customClass: {
        confirmButton: "px-4 py-1 m-1 text-lg text-white font-semibold rounded-full border-2 border-indigo-500 hover:text-white hover:bg-indigo-500",
        cancelButton: "px-4 py-1 m-1 text-lg text-white font-semibold rounded-full border-2 border-red-500 hover:text-white hover:bg-red-500"
      }
    }).then((result) => {
      if (result.isConfirmed) {
        cambiarEstado(id, estado);
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Se ha modificado"
        });
      }else {
        const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "error",
        title: "No se ha modificado"
      });
    }}
    );
    
  };

  const cambiarEstado = (id, estado) => {
    const nuevoEstado = estado === "Activo" ? "Inactivo" : "Activo";
    updateVentaRepuesto(id, { estado: nuevoEstado }).then(() => {
      getVentasRepuestos();
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
      field: "nombre_cliente",
      headerName: "Cliente",
      width: 170,
      headerClassName: "custom-header",
      valueGetter: (params) => params.row.cliente.nombre_cliente,
    },
    {
      field: "estado",
      headerName: "Estado",
      width: 100,
      headerClassName: "custom-header",
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
            <Link to={`/venta-repuesto/${params.row._id}`}>Editar</Link>
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
      <h1 className="text-2xl text-center mx-auto">Ventas Repuestos</h1>
      <div className="mx-10 justify-end flex ">
        <Link to="/add-venta-repuesto">
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mx-8">
            Agregar Repuesto
          </button>
        </Link>
      </div>
      <Box sx={{ width: "100%" }}>
        <DataGrid
          className="bg-slate-700 shadow-lg shadow-blue-600/40 mx-16 my-4"
          rows={ventasRepuestos}
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
