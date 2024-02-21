import React, { useEffect } from "react";
import { useCartCliente } from "../../context/CartClienteContext";
import { useClientes } from "../../context/ClientContext";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tabla, Titulo } from "../../components/Tabla";
import Detalle from "../../components/Detalle";
import Swal from "sweetalert2";
import MUIDataTable from "mui-datatables";

import {
  faIdCard,
  faTools,
  faPlus,
  faBan,
  faInfoCircle,
  faDollarSign,
  faScrewdriverWrench,
  faShoppingCart,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

export default function PageCartClient() {
  const { getCartClient, cartClientes, getCartCliente, updateCartCliente } =
    useCartCliente();

  useEffect(() => {
    try {
      getCartClient();
    } catch (error) {
      console.error("Error al obtener compras:", error);
    }
  }, []);
  useEffect(() => {
    try {
      getCartCliente(id);
    } catch (error) {
      console.error("Error al obtener compras:", error);
    }
  }, []);

  const mostrarAlerta = (id, anulado) => {
    const title = anulado ? "Anulado" : "Anular";
    const text = anulado
      ? "Esta venta ya ha sido anulada."
      : "¿Estás seguro de anular la venta?";
    const buttonText = anulado ? "Entendido" : "Sí";

    if (!anulado) {
      Swal.fire({
        title: title,
        text: text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: buttonText,
        cancelButtonText: "No",
        background: "#334155",
        color: "white",
        iconColor: "#2563eb",
        buttonsStyling: false,
        customClass: {
          confirmButton:
            "px-5 py-1 m-1 text-lg text-white font-semibold rounded-full border-2 border-blue-600 hover:text-white hover:bg-blue-600",
          cancelButton:
            "px-4 py-1 m-1 text-lg text-white font-semibold rounded-full border-2 border-red-500 hover:text-white hover:bg-red-500",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          cambiarEstado(id, anulado);
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            },
          });
          Toast.fire({
            icon: "success",
            title: "Se ha modificado",
          });
        } else {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            },
          });
          Toast.fire({
            icon: "warning",
            title: "No se ha modificado",
          });
        }
      });
    } else {
      // Si la venta está anulada, solo mostrar un mensaje indicando que no se puede realizar ninguna acción
      Swal.fire({
        title: "Acción no permitida",
        text: "Esta venta ya ha sido anulada y no se puede modificar.",
        icon: "info",
        background: "#334155",
        color: "white",
        iconColor: "#2563eb",
        buttonsStyling: false,
        customClass: {
          confirmButton:
            "px-5 py-1 m-1 text-lg text-white font-semibold rounded-full border-2 border-blue-600 hover:text-white hover:bg-blue-600",
        },
      });
    }
  };

  const cambiarEstado = (id, anulado) => {
    const nuevoEstado = anulado ? "Activo" : "Inactivo";
    updateCartCliente(id, { estado: nuevoEstado }).then(() => {
      getCartClient();
    });
  };

  const columnas2 = [
    {
      name: "repuesto",
      label: "Repuesto",
      options: { filter: true, sort: true },
    },
    {
      name: "cantidad",
      label: "Cantidad",
      options: { filter: true, sort: false },
    },
    {
      name: "precioUnitarios",
      label: "Precio Unitario",
      options: { filter: true, sort: false },
    },
    {
      name: "precioTotal",
      label: "Precio Total",
      options: { filter: true, sort: false },
    },
  ];

  const columns = [
    {
      field: "codigo",
      headerName: "codigo",
      width: 170,
      headerClassName: "custom-header",
    },
    {
      field: "cart",
      headerName: "Repuestos",
      width: 250,
      headerClassName: "custom-header",
      renderCell: (params) => (
        <>
          {params.row.cart.map((repuesto, index) => (
            <span key={index}>
              {repuesto.name}
              {index < params.row.cart.length - 1 && ", "}
            </span>
          ))}
        </>
      ),
    },
    {
      field: "nombre_cliente",
      headerName: "Cliente",
      width: 170,
      headerClassName: "custom-header",
      valueGetter: (params) => params.row.cliente.nombre_cliente,
    },
    {
      field: "total",
      headerName: "Total_Venta",
      width: 170,
      headerClassName: "custom-header",
      
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 170,
      headerClassName: "custom-header",
      renderCell: (params) => {
        const estado = params.row.estado;
        return (
          <div>
            <button
              className={
                params.row.anulado
                  ? "px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-orange-500 hover:text-white hover:bg-orange-500"
                  : "px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-blue-600 hover:text-white hover:bg-blue-600"
              }
              onClick={() => mostrarAlerta(params.row._id, params.row.anulado)}
            >
              {params.row.anulado ? (
                <FontAwesomeIcon icon={faLock} />
              ) : (
                <FontAwesomeIcon icon={faBan} />
              )}
            </button>
            <button>
              <Detalle
                metodo={() => {
                  console.log("params.row._id:", params.row._id);
                  getCartCliente(params.row._id);
                }}
                id={params.row._id}
              >
                <div
                  style={{
                    maxWidth: "100%",
                    overflowX: "auto",
                    marginBottom: "10px",
                  }}
                >
                  <MUIDataTable
                    className="miTablaPersonalizada"
                    title={"Detalle Compras"}
                    data={
                      cartClientes
                        .find((cart) => cart._id === params.row._id)
                        ?.cart?.map((repuesto, index) => ({
                          id: index,
                          repuesto: repuesto.name,
                          cantidad: repuesto.amount,
                          precioUnitarios: repuesto.price,
                          precioTotal: repuesto.price * repuesto.amount
                         
                        })) || []
                    } // Manejar el caso en que cartClientes.find(...) no encuentra nada
                    columns={columnas2}
                    options={{
                      sort: false,
                      responsive: "standard",
                      rowsPerPage: 3,
                      rowsPerPageOptions: [3], // Debes proporcionar un array, no solo un número
                      selectableRows: false,
                      print: false,
                      download: false,
                      viewColumns: false,
                      textLabels: {
                        toolbar: {
                          search: "Buscar",
                          filterTable: "Filtrar tabla",
                        },
                        pagination: {
                          displayRows: "de",
                          rowsPerPage: "Filas por página:",
                        },
                        filter: {
                          all: "Todos",
                          title: "Filtros",
                          reset: "Reiniciar",
                        },
                      },
                    }}
                    style={{ width: "100%" }} // Ajusta el ancho de la tabla al 100%
                  />
                </div>

                
                <style>{
                  `

                // .tss-ynxllk-MUIDataTableFilter-root{
                //   background-color: #1e293b;
                // }
                .miTablaPersonalizada .tss-11quiee-MUIDataTable-paper{
                  background-color: #1e293b;
                }


                .miTablaPersonalizada .tss-1qtl85h-MUIDataTableBodyCell-root{
                  background-color: #1e293b;
                  color: white;
                }

                .miTablaPersonalizada .tss-gm6zfk-MUIDataTableHeadCell-fixedHeader{
                  background-color: #1e293b;
                  color: white; 
                  
                  
                  
}

                .miTablaPersonalizada .css-rqglhn-MuiTable-root{
                  margin-top: 10px;
                  


                }

                // PRIMER CAJA DE LA TABLA
                .miTablaPersonalizada .tss-gm6zfk-MUIDataTableHeadCell-fixedHeaderr{
                  background-color: red; 
                  color: red;
                  
                }

                // ULTIMA CAJA DE LA TABLA
                .miTablaPersonalizada .tss-1ork7hi-MUIDataTablePagination-tableCellContainer{
                   background-color: red
                
                }


                .miTablaPersonalizada .tss-1ork7hi-MUIDataTablePagination-tableCellContainer{
                 
                  
                  padding: 10px;
                  background-color: #1e293b; 
                }

                .miTablaPersonalizada .MuiToolbar-gutters{
                  
                  // background-color: #93c5fd;
                   background-color: #1e293b;
                  color: white; 
                  
                }

                .miTablaPersonalizada .css-i4bv87-MuiSvgIcon-root{
                  color: white;
                }

                .miTablaPersonalizada .css-1x51dt5-MuiInputBase-input-MuiInput-input{
                  color: white;
                }



            

                // .miTablaPersonalizada .MuiToolbar-root{
                
                //   color: white;
                // }
                

                .miTablaPersonalizada .tss-1qjwhn0-MUIDataTableBody-emptyTitle{
                  color: white; 
                }

                .miTablaPersonalizada .tss-1cdcmys-MUIDataTable-responsiveBase{
                  background-color: #1e293b;
                }


                


                // NO HAY REPUESTOS AÚN
                .miTablaPersonalizada .MuiTypography-body1{
                  color: red;
                  
                }

                .miTablaPersonalizada {
                  background-color: #1e293b;
                  margin-top
                  border: 1px solid #2563eb
                  
              }

                
                `}
                
                </style>
                
                <table>
                  <tbody>
                    <tr>
                    <Tabla>
                        <FontAwesomeIcon icon={faIdCard} className="mr-2" />
                        Codigo
                      </Tabla>
                      <Tabla>
                        <FontAwesomeIcon icon={faIdCard} className="mr-2" />
                        Nombre
                      </Tabla>
                      <Tabla>
                        <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                        Total de la venta
                      </Tabla>
                    </tr>
                    <tr>
                      
                      <Tabla>
                        {
                          cartClientes.find(
                            (codigo) => codigo._id === params.row._id
                          )?.codigo
                        }
                      </Tabla>
                    
                    
                      <Tabla>
                        {
                          cartClientes.find(
                            (cliente) => cliente._id === params.row._id
                          )?.cliente.nombre_cliente
                        }
                      </Tabla>
                    
                      <Tabla>
                        {
                          cartClientes.find(
                            (total) => total._id === params.row._id
                          )?.total
                        }
                      </Tabla>
                    </tr>
                   
                  </tbody>
                </table>
              </Detalle>
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="mt-16 ">
      <div className="flex justify-between">
        <h1 className="text-2xl text-start ml-16">
          <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
          Gestión de ventas repuestos
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