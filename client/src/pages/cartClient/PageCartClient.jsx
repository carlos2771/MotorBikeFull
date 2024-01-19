import React, { useEffect } from "react";
import { useCartCliente } from "../../context/CartClienteContext";
import { useClientes } from "../../context/ClientContext";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faDownload,
  faIdCard,
  faUser,
  faPhone,
  faPen,
  faTools,
  faPlus,
  faPencil,
  faBan,
  faCheck,
  faInfoCircle,
  faAddressCard,
  faRegistered,
  faDollarSign,
  faHashtag,
} from "@fortawesome/free-solid-svg-icons";

export default function PageCartClient() {
  const { getCartClient, cartClientes } = useCartCliente();

  useEffect(() => {
    try {
      getCartClient();
    } catch (error) {
      console.error("Error al obtener compras:", error);
    }
  }, []);
  const columns = [

    {
      field: "codigo",
      headerName: "codigo",
      width: 170,
      headerClassName: 'custom-header',
      
    },
    {
      field: "nombre_cliente",
      headerName: "Cliente",
      width: 170,
      headerClassName: 'custom-header',
      valueGetter: (params) => params.row.cliente.nombre_cliente,
    },
    {
      field: "total",
      headerName: "Total_Venta",
      width: 170,
      headerClassName: 'custom-header',
      
    },
  ];

  return (
    <div className="mt-16 ">
      <div className="flex justify-between">
        <h1 className="text-2xl text-start ml-16">
          <FontAwesomeIcon icon={faTools} className="mr-2" />
          Gestión de Repuestos
        </h1>
        <div className="mx-16 justify-end">
          <Link to="/home">
            <button
              className="px-4 py-2 text-sm text-withe font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent"
              title="Agregar"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </Link>
        </div>
      </div>

      <Box sx={{ width: "100%" }}>
        <DataGrid
          className="bg-slate-700 shadow-lg shadow-blue-600/40 mx-16 my-4"
          rows={cartClientes}
          columns={columns}
          columnHeader
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
              fontSize: "15px",
            },
          }}
          slots={{ toolbar: GridToolbar }}
        />
      </Box>
    </div>
  );
}
