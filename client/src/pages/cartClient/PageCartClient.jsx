import React, { useEffect, useContext, useState} from "react";
import { useCartCliente } from "../../context/CartClienteContext";
import { useClientes } from "../../context/ClientContext";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Link, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tabla, Titulo } from "../../components/Tabla";
import Detalle from "../../components/Detalle";
import Swal from "sweetalert2";
import MUIDataTable from "mui-datatables";
import * as XLSX from "xlsx";
import { faDownload } from "@fortawesome/free-solid-svg-icons";


import { useAuth } from "../../hooks/useAuth";

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

    const { user } = useAuth();
    const [dataForExcel, setDataForExcel] = useState([]);

    useEffect(() => {
      // Transforma los datos en el formato adecuado para el archivo Excel
      const newDataForExcel = cartClientes.map((venta) => ({
        Codigo: venta.codigo,
        Cliente: venta.cliente.nombre_cliente,
        Descuento: venta.descuento,
        "Total Venta": venta.total,
        Repuestos: venta.cart.map((repuesto) => ({
          Nombre: repuesto.name,
          Cantidad: repuesto.amount,
        })),
      }));
      setDataForExcel(newDataForExcel);
    }, [cartClientes]);
  
    const exportarAExcel = () => {
      // Define una función para combinar los repuestos de cada venta en una cadena de texto
      const obtenerRepuestos = (repuestos) => {
        return repuestos.map((r) => `Repuesto: ${r.Nombre} - Cantidad: ${r.Cantidad}`).join("\n");
      };
  
      // Calcula el total de todas las ventas
      const totalVentas = dataForExcel.reduce((total, venta) => total + venta["Total Venta"], 0);
  
      // Transforma los datos en un formato adecuado para el archivo Excel
      const data = dataForExcel.map((venta) => ({
        Codigo: venta.Codigo,
        Cliente: venta.Cliente,
        Descuento: venta.Descuento,
        "Total Venta": venta["Total Venta"],
        Repuestos: obtenerRepuestos(venta.Repuestos),
      }));
  
      // Agrega una fila con el total de ventas al final del array de datos
      data.push({
        Codigo: "",
        Cliente: "",
        Descuento: "",
        "Total Venta": totalVentas,
        Repuestos: "Total de todas las ventas",
      });
  
      // Crea una hoja de cálculo en formato de libro de trabajo de Excel
      const ws = XLSX.utils.json_to_sheet(data);
  
      // Crea un nuevo libro de trabajo de Excel y agrega la hoja de cálculo
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Ventas");
  
      // Guarda el libro de trabajo de Excel como un archivo
      XLSX.writeFile(wb, "ventas.xlsx");
    };

  function formatCurrency(value) {
    // Verificar si value es null o undefined
    if (value == null) {
      return ""; // o cualquier otro valor predeterminado que desees
    }

    // Agregar el signo de peso
    const formattedValue = `$${value
      .toFixed(0)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
    return formattedValue;
  }

  useEffect(() => {
    try {
      getCartClient();
    } catch (error) {
      console.error("Error al obtener ventas:", error);
    }
  }, []);
  useEffect(() => {
    try {
      getCartCliente(id);
    } catch (error) {
      console.error("Error al obtener todo:", error);
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
        background: "linear-gradient(to right, #0f172a, #082f49, #0f172a)",
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
            background: "linear-gradient(to right, #0f172a, #082f49, #0f172a)",
            color: "white",
            timer: 4000,
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
            background: "linear-gradient(to right, #0f172a, #082f49, #0f172a)",
            color: "white",
            timer: 4000,
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
        background: "linear-gradient(to right, #0f172a, #082f49, #0f172a)",
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
      headerName: "Código",
      width: 170,
      headerClassName: "custom-header",
    },
    // {
    //   field: "cart",
    //   headerName: "Repuestos",
    //   width: 250,
    //   headerClassName: "custom-header",
    //   renderCell: (params) => (
    //     <>
    //       {params.row.cart.map((repuesto, index) => (
    //         <span key={index}>
    //           {repuesto.name}
    //           {index < params.row.cart.length - 1 && ", "}
    //         </span>
    //       ))}
    //     </>
    //   ),
    // },
    {
      field: "nombre_cliente",
      headerName: "Cliente",
      width: 170,
      headerClassName: "custom-header",
      valueGetter: (params) => params.row.cliente.nombre_cliente,
    },
    {
      field: "descuento",
      headerName: "Descuento",
      width: 170,
      headerClassName: "custom-header",
      valueFormatter: (params) => params.value ? `%${params.value}` : "%0",
    },
    
    {
      field: "total",
      headerName: "Total Venta",
      width: 170,
      headerClassName: "custom-header",
      valueFormatter: (params) => formatCurrency(params.value),
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
                <table className="min-w-full">
                  <tbody>
                    <tr>
                      <Tabla>
                        <FontAwesomeIcon icon={faIdCard} className="mr-2" />
                        Codigo
                      </Tabla>
                      <Tabla>
                        <FontAwesomeIcon icon={faIdCard} className="mr-2" />
                        Cliente
                      </Tabla>
                      <Tabla>
                        <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                        Total de la venta
                      </Tabla>
                      <Tabla>
                        <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                        Descuento
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
                        {formatCurrency(
                          cartClientes.find(
                            (total) => total._id === params.row._id
                          )?.total
                        )}
                      </Tabla>
                      <Tabla>
                        {(cartClientes.find(
                          (descuento) => descuento._id === params.row._id
                        )?.descuento || 0) + "%"}
                      </Tabla>
                    </tr>
                  </tbody>
                </table>

                <div
                  style={{
                    maxWidth: "100%",
                    overflowX: "auto",
                    marginTop: "10px",
                  }}
                  className="min-w-full"
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
                          precioTotal: repuesto.price * repuesto.amount,
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

                <style>
                  {`

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
              </Detalle>
            </button>
          </div>
        );
      },
    },
  ];

  const permissions = user?.rol?.permissions || [];

  return (
    <>
      {permissions.includes("Venta Repuesto") ? (
        <div className="mt-16 ">
          <div className="flex flex-col sm:flex-row justify-between items-center mx-16">
            <h1 className="text-2xl text-start sm:text-center ml-4 sm:ml-0 mb-4 sm:mb-0">
              <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
              Gestión de ventas repuestos
            </h1>
            <div className="mx-4 sm:mx-0 justify-end flex">
              <Link to="/home">
                <button
                  className="px-4 py-2 text-sm text-withe font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent"
                  title="Agregar"
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </Link>
              <button
                  onClick={exportarAExcel}
                  className="px-4 py-2 ml-2 text-sm text-white font-semibold rounded-full border border-green-600 hover:text-white hover:bg-green-600 hover:border-transparent max-w-full max-h-10"
                  title="Descargar excel"
                >
                  <FontAwesomeIcon icon={faDownload} />
                </button>
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
                background:
                  "linear-gradient(to right, #0f172a, #082f49, #0f172a)",
                color: "white",
                "& .MuiDataGrid-cell": {
                  fontSize: "15px",
                },
              }}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  printOptions: { disableToolbarButton: true },
                  csvOptions: { disableToolbarButton: true },
                },
              }}
              //Traducir a español
              localeText={{
                noRowsLabel: "No se ha encontrado datos.",
                noResultsOverlayLabel: "No se ha encontrado ningún resultado",
                toolbarColumns: "Columnas",
                toolbarColumnsLabel: "Seleccionar columnas",
                toolbarFilters: "Filtros",
                toolbarFiltersLabel: "Ver filtros",
                toolbarFiltersTooltipHide: "Quitar filtros",
                toolbarFiltersTooltipShow: "Ver filtros",
                toolbarDensity: "Densidad",
                toolbarDensityCompact: "Compacta",
                toolbarDensityStandard: "Estandar",
                toolbarDensityComfortable: "Confortable",
                toolbarExport: "Exportar",
                toolbarExportCSV: "Descargar CSV",
                toolbarExportPrint: "Imprimir",
                columnsPanelTextFieldLabel: "Buscar",
                columnsPanelHideAllButton: "Ocultar todo",
                columnsPanelShowAllButton: "Mostrar todo",
                filterPanelColumns: "Columna",
                filterPanelOperator: "Operador",
                filterOperatorContains: "Contiene",
                filterOperatorEquals: "Es igual",
                filterOperatorStartsWith: "Comienza con",
                filterOperatorEndsWith: "Termina con",
                filterOperatorIsEmpty: "Esta vacía",
                filterOperatorIsNotEmpty: "No esta vacía",
                filterOperatorIsAnyOf: "Es alguna de",
                filterPanelInputLabel: "Valor",
                filterPanelInputPlaceholder: "Filtrar valor",
                columnMenuSortAsc: "Ordenar en ASC",
                columnMenuSortDesc: "Ordenar en DESC",
                columnMenuUnsort: "Desordenar",
                columnMenuFilter: "Filtrar",
                columnMenuHideColumn: "Ocultar columna",
                columnMenuManageColumns: "Manejar columnas",
              }}
            />
          </Box>
        </div>
      ) : (
        <Navigate to="/tasks" />
      )}
    </>
  );
}
