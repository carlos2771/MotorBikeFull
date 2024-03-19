import React, { useEffect, useContext, useState } from "react";
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

import { useAuth } from "../../hooks/useAuth";

import {
  faIdCard,
  faTools,
  faPlus,
  faBan,
  faDownload,
  faInfoCircle,
  faDollarSign,
  faScrewdriverWrench,
  faShoppingCart,
  faLock,
  faChevronLeft,
  faChevronRight,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

export default function PageCartClient() {
  const { getCartClient, cartClientes, getCartCliente, updateCartCliente } =
    useCartCliente();
  const [dataForExcel, setDataForExcel] = useState([]);

  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 862);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
      console.error("Error al obtener compras:", error);
    }
  }, []);
  useEffect(() => {
    try {
      getCartCliente(id);
    } catch (error) {
      // console.error("Error al obtener todo:", error);
    }
  }, []);

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
        Marca: repuesto.marca,
      })),
    }));
    setDataForExcel(newDataForExcel);
  }, [cartClientes]);

  const exportarAExcel = () => {
    // Define una función para combinar los repuestos de cada venta en una cadena de texto
    const obtenerRepuestos = (repuestos) => {
      return repuestos
        .map((r) => `Repuesto: ${r.Nombre}\n Cantidad: ${r.Cantidad}`)
        .join("\n");
    };

    // Calcula el total de todas las ventas
    const totalVentas = dataForExcel.reduce(
      (total, venta) => total + venta["Total Venta"],
      0
    );

    // Transforma los datos en un formato adecuado para el archivo Excel
    const data = dataForExcel.map((venta) => ({
      Codigo: venta.Codigo,
      Cliente: venta.Cliente,
      Descuento: venta.Descuento,
      Repuestos: obtenerRepuestos(venta.Repuestos),
      "Total Venta": venta["Total Venta"],
    }));

    // Agrega una fila con el total de ventas al final del array de datos
    data.push({
      Codigo: "",
      Cliente: "",
      Descuento: "",
      Repuestos: "TOTAL DE TODAS LAS VENTAS",
      "Total Venta": totalVentas,
    });

    // Crea una hoja de cálculo en formato de libro de trabajo de Excel
    const ws = XLSX.utils.json_to_sheet(data);

    // Crea un nuevo libro de trabajo de Excel y agrega la hoja de cálculo
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ventas");

    // Guarda el libro de trabajo de Excel como un archivo
    XLSX.writeFile(wb, "Ventas_Repuestos.xlsx");
  };

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
      valueFormatter: (params) => (params.value ? `%${params.value}` : "%0"),
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
          <div className="flex">
            <div
              className={params.row.anulado ? "" : ""}
              onClick={() => mostrarAlerta(params.row._id, params.row.anulado)}
            >
              {params.row.anulado ? (
                <FontAwesomeIcon
                  icon={faLock}
                  className="w-10 p-2 mr-1 text-sm text-white font-semibold rounded-full border border-orange-500 hover:text-white hover:bg-orange-500"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faBan}
                  className="w-10 p-2 mr-1 text-sm text-white font-semibold rounded-full border border-red-500 hover:text-white hover:bg-red-500"
                />
              )}
            </div>
            <div>
              <Detalle
                metodo={() => {
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
                        Nombre
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
                    title={"Detalle Venta"}
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
                      selectableRows: 'none',
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
            </div>
          </div>
        );
      },
    },
  ];

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const filteredVentasRepuestos = cartClientes.filter((venta) =>
  venta.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
  venta.cliente.nombre_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
  venta.total.toString().includes(searchTerm) ||
  venta.cart.some((repuesto) =>
    repuesto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repuesto.amount.toString().includes(searchTerm) ||
    repuesto.amount.toString().includes(searchTerm) ||
    repuesto.price.toString().includes(searchTerm)
  )
);

  const totalPages = Math.ceil(filteredVentasRepuestos.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(
    startIndex + itemsPerPage,
    filteredVentasRepuestos.length
  );
  const ventasRepuestosToShow = filteredVentasRepuestos.slice(
    startIndex,
    endIndex
  );

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const permissions = user?.rol?.permissions || [];

  return (
    <>
      {permissions.includes("Venta Repuesto") ? (
        <>
          {!isMobile ? (
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
                    className="px-4 py-2 mx-2 text-sm text-withe font-semibold rounded-full border border-green-600 hover:text-white hover:bg-green-600 hover:border-transparent"
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
                  autoHeight
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
                    '& .MuiDataGrid-overlay': {
                      background: 'linear-gradient(to right, #0f172a, #082f49, #0f172a)',
                      fontSize: '20px'
                    }
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
                    noResultsOverlayLabel:
                      "No se ha encontrado ningún resultado",
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
            <>
              <div className="mt-16">
                <h1 className="text-2xl text-start sm:text-center ml-4 sm:ml-0 mb-4 sm:mb-0">
                  <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                  Gestión de ventas repuestos
                </h1>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center mx-16 sm:mx-4 md:mx-16 mt-2">
                <div className="">
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 text-black"
                  />
                </div>
                <div className="mx-4 sm:mx-0 justify-end flex mt-2">
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
                    className="px-4 py-2 mx-2 text-sm text-withe font-semibold rounded-full border border-green-600 hover:text-white hover:bg-green-600 hover:border-transparent"
                    title="Descargar excel"
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </button>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mx-4 md:mx-16">
                {ventasRepuestosToShow.map((venta) => (
                  <div
                    key={venta._id}
                    className={`col ${
                      venta.anulado === true
                        ? "shadow-red-600"
                        : "shadow-blue-800"
                    } rounded-lg p-4 shadow-md bg-slate-700`}
                  >
                    <h2 className="text-lg font-bold mb-2">{venta.codigo}</h2>
                    <p>Cliente: {venta.cliente.nombre_cliente}</p>
                    <p>
                      Total:{" "}
                      {formatCurrency(
                        cartClientes.find((total) => total._id === venta._id)
                          ?.total
                      )}
                    </p>
                    <div className="flex flex-wrap justify-center items-center mt-4">
                      <div
                        className={venta.anulado ? "" : ""}
                        onClick={() =>
                          mostrarAlerta(venta._id, venta.anulado)
                        }
                      >
                        {venta.anulado ? (
                          <FontAwesomeIcon
                            icon={faLock}
                            className="w-10 p-2 mr-1 text-sm text-white font-semibold rounded-full border border-orange-500 hover:text-white hover:bg-orange-500"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faBan}
                            className="w-10 p-2 mr-1 text-sm text-white font-semibold rounded-full border border-red-500 hover:text-white hover:bg-red-500"
                          />
                        )}
                      </div>
                      <div>
                        <Detalle
                          metodo={() => {
                            getCartCliente(venta._id);
                          }}
                          id={venta._id}
                        >
                          <table className="min-w-full">
                            <tbody>
                              <tr>
                                <Tabla>
                                  <FontAwesomeIcon
                                    icon={faIdCard}
                                    className="mr-2"
                                  />
                                  Codigo
                                </Tabla>
                                <Tabla>
                                  <FontAwesomeIcon
                                    icon={faIdCard}
                                    className="mr-2"
                                  />
                                  Nombre
                                </Tabla>
                                <Tabla>
                                  <FontAwesomeIcon
                                    icon={faDollarSign}
                                    className="mr-2"
                                  />
                                  Total de la venta
                                </Tabla>
                                <Tabla>
                                  <FontAwesomeIcon
                                    icon={faDollarSign}
                                    className="mr-2"
                                  />
                                  Descuento
                                </Tabla>
                              </tr>
                              <tr>
                                <Tabla>{venta.codigo}</Tabla>

                                <Tabla>{venta.cliente.nombre_cliente}</Tabla>

                                <Tabla>{formatCurrency(venta.total)}</Tabla>
                                <Tabla>
                                  {(cartClientes.find(
                                    (descuento) => descuento._id === venta._id
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
                              title={"Detalle Venta"}
                              data={
                                cartClientes
                                  .find((cart) => cart._id === venta._id)
                                  ?.cart?.map((repuesto, index) => ({
                                    id: index,
                                    repuesto: repuesto.name,
                                    cantidad: repuesto.amount,
                                    precioUnitarios: repuesto.price,
                                    precioTotal:
                                      repuesto.price * repuesto.amount,
                                  })) || []
                              } // Manejar el caso en que cartClientes.find(...) no encuentra nada
                              columns={columnas2}
                              options={{
                                sort: false,
                                responsive: "standard",
                                rowsPerPage: 3,
                                rowsPerPageOptions: [3], // Debes proporcionar un array, no solo un número
                                selectableRows: 'none',
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center mt-4 mx-auto">
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm shadow-sky-100 -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    className={`relative inline-flex items-center px-4 py-2 rounded-l-lg text-white ${
                      page === 1
                        ? "cursor-not-allowed opacity-50 bg-slate-800 text-white"
                        : "bg-blue-500"
                    }`}
                    disabled={page === 1}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 ${
                        index + 1 === page
                          ? "z-10 font-bold bg-blue-600"
                          : "text-gray-500"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    className={`relative inline-flex items-center px-4 py-2 rounded-r-lg shadow   ${
                      page === totalPages
                        ? "cursor-not-allowed opacity-50 bg-slate-800"
                        : "bg-blue-500"
                    }`}
                    disabled={page === totalPages}
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </nav>
              </div>
            </>
          )}
        </>
      ) : (
        <Navigate to="/tasks" />
      )}
    </>
  );
}
