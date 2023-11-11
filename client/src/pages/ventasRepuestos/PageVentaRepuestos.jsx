import React, { useEffect } from 'react'
import { useVentasRepuestos } from '../../context/VentasRepuestoContex'
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Link } from 'react-router-dom';

export default function PageVentaRepuestos() {
    const {ventasRepuestos, getVentasRepuestos, deleteVentaRepuesto} = useVentasRepuestos()
    useEffect(() => {
        try {
            getVentasRepuestos();
            
        } catch (error) {
          console.error("Error al obtener clientes:", error);
        }
      }, []);
    
      
      const columns = [
        {
          field: "repuesto",
          headerName: "Repuesto",
          width: 160,   
          editable: true,
          headerClassName: 'custom-header',
          valueGetter: (params) => params.row.repuesto.nombre_repuesto,
         
        },
        {
          field: "cantidad_repuesto",
          headerName: "Cantidad Repuesto",
          width: 185,
          editable: true,
          headerClassName: 'custom-header',
        },
        {
          field: "precio_unitario",
          headerName: "Precio Unitario",
          width: 170,
          editable: true,
          headerClassName: 'custom-header',
        },
        {
          field: "precio_total",
          headerName: "Precio Total",
          width: 170,
          editable: true,
          headerClassName: 'custom-header',
        },
        {
          field: "nombre_cliente",
          headerName: "Cliente",
          width: 170,
          editable: true,
          headerClassName: 'custom-header',
          valueGetter: (params) => params.row.cliente.nombre_cliente,
        },
        {
          field: "createdAt",
          headerName: "Fecha Creacion",
          width: 300,
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
                    deleteVentaRepuesto(params.row._id);
                  }}
                >
                  Eliminar
                </button>
                <button
                  className="px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-green-500 hover:text-white hover:bg-green-600"
                >
                  <Link to={`/venta-respuesto/${params.row._id}`}>Editar</Link>
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
            <Link to="/add-venta-respuesto">
              <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mx-8">
                Agregar Repuesto
              </button>
            </Link>
          </div>
          <Box sx={{ width: "100%" }}>
            <DataGrid
              className="bg-neutral-700 mx-16 my-4"
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
