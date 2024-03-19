import React, { useEffect, useCallback, useState } from "react";
import { useCompras } from "../../context/ComprasContext";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Link, Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import * as XLSX from "xlsx";
import {
  faLock,
  faBan,
  faDownload,
  faShoppingBag,
  faPlus,
  faDollar,
  faUser,
  faBarcode,
  faCalendarDays,
  faInfoCircle,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import createTheme from "@mui/material/styles/createTheme";
import MUIDataTable from "mui-datatables";
import { Tabla, Titulo } from "../../components/Tabla";
import Detalle from "../../components/Detalle";

import { useAuth } from "../../hooks/useAuth";

dayjs.locale("es");
dayjs.extend(utc);

function formatCurrency(value) {
  const formattedValue = `${value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  return formattedValue;
}


function formatCurrency2(value) {
  const formattedValue = value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return formattedValue;
}

function formatCurrency3(value) {
  if (value === undefined || value === null) {
    return ''; // o el valor predeterminado que desees
  }
  return value.toFixed(0); // o el formato deseado
}

const totalCompra = (compra) => {
  return formatCurrency3(
    compra.repuestos.reduce((total, repuesto) => {
      return total + repuesto.precio_total;
    }, 0)
  );
};

const calcularPrecioTotalCompra = (compra) => {
  return formatCurrency(
    compra.repuestos.reduce((total, repuesto) => {
      return total + repuesto.precio_total;
    }, 0)
  );
};

export default function PageCompras() {
  const { compras, getCompras, deleteCompra, updateCompra } = useCompras();

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

  useEffect(() => {
    try {
      getCompras();
    } catch (error) {
      console.error("Error al obtener compras:", error);
    }
  }, []);

  const mostrarAlerta = (id, anulado) => {
    const title = anulado ? "Anulado" : "Anular";
    const text = anulado
      ? "Esta compra ya ha sido anulada."
      : "¿Estás seguro de anular la compra?";
    const buttonText = anulado ? "Entendido" : "Sí";

    if (!anulado) {
      Swal.fire({
        title: title,
        text: text,
        icon: anulado ? "info" : "warning",
        showCancelButton: !anulado,
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
      // Si la compra está anulada, solo mostrar un mensaje indicando que no se puede realizar ninguna acción
      Swal.fire({
        title: "Acción no permitida",
        text: "Esta compra ya ha sido anulada y no se puede modificar.",
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
    updateCompra(id, { estado: nuevoEstado }).then(() => {
      getCompras();
    });
  };

  const exportarAExcel = useCallback(() => {
    const datos = compras.map((compra) => ({
      Nombre: compra.repuestos
        .map((repuesto) => repuesto.repuesto.name)
        .join(", "),
      Cantidad: compra.repuestos
        .map((repuesto) => repuesto.cantidad_repuesto)
        .join(", "),
      "Precio unitario": compra.repuestos
        .map((repuesto) => repuesto.precio_unitario)
        .join(", "),
      "Precio total": compra.repuestos
        .map((repuesto) => repuesto.precio_total)
        .join(", "),
      "Total compra": compra.repuestos.reduce(
        (total, repuesto) => total + repuesto.precio_total,
        0
      ),
      "Fecha de compra": dayjs
        .utc(compra.fecha)
        .locale("es")
        .format("DD [de] MMMM [de] YYYY"),
    }));

    const theme = createTheme();
    const ws = XLSX.utils.json_to_sheet(datos);

    for (let i = 1; i <= compras.length + 1; i++) {
      for (let j = 0; j < Object.keys(datos[0]).length; j++) {
        const col = String.fromCharCode(65 + j);
        const cell = `${col}${i}`;
        ws[cell].s = {
          border: {
            left: { style: "thin", color: { rgb: "#000000" } },
            right: { style: "thin", color: { rgb: "#000000" } },
            top: { style: "thin", color: { rgb: "#000000" } },
            bottom: { style: "thin", color: { rgb: "#000000" } },
          },
        };
      }
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "compras");
    XLSX.writeFile(wb, "compras.xlsx");
  }, [compras]);

  const currentDate = new Date();
  const options = { day: "numeric", month: "long", year: "numeric" };
  const formattedDate = new Intl.DateTimeFormat("es-ES", options).format(
    currentDate
  );

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
      name: "precioUnitario",
      label: "Precio Unitario",
      options: { filter: true, sort: false },
    },
    {
      name: "precioTotal",
      label: "Precio Total",
      options: { filter: true, sort: false },
    },
  ];

  // ESTE ES EL DEFINITIVO..

  const opcion = { filterType: "checkbox" };

  const columns = [
    {
      field: "codigo",
      headerName: "Código Compra", // Cambia el encabezado según lo que desees mostrar
      width: 200, // Ajusta el ancho según tus necesidades
      headerClassName: "custom-header",
      valueGetter: (params) => params.row.codigo, // Obtén el código de la compra
    },
    {
      field: "proveedor",
      headerName: "Proveedor", // Cambia el encabezado según lo que desees mostrar
      width: 200, // Ajusta el ancho según tus necesidades
      headerClassName: "custom-header",
      valueGetter: (params) => params.row.proveedor, // Obtén el código de la compra
    },
    {
      field: "totalCompra",
      headerName: "Total Compra",
      width: 200,
      headerClassName: "custom-header",
      valueGetter: (params) => calcularPrecioTotalCompra(params.row),
    },
    {
      field: "createdAt",
      headerName: "Fecha Compra",
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
            <button style={{ borderRadius: "150px" }}>
              <Detalle
                metodo={() => getCompras(params.row._id)}
                id={params.row._id}
                repuestos={params.row.repuestos}
              >
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
                <table className="min-w-full">
                  <tbody className="min-w-full ">
                    <tr>
                      <td
                        colSpan="4"
                        style={{
                          border: "1px solid #2e4f91",
                          padding: "5px",
                          backgroundColor: "#2e4f91",
                          fontSize: "25px",
                          textAlign: "center",
                        }}
                      >
                        <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                        Datos de la compra
                      </td>
                    </tr>

                    <tr>
                      <Tabla>
                        <FontAwesomeIcon icon={faDollar} /> Total
                      </Tabla>
                      <Tabla>
                        <FontAwesomeIcon icon={faUser} /> Proveedor
                      </Tabla>
                      <Tabla>
                        <FontAwesomeIcon icon={faBarcode} /> Código
                      </Tabla>
                      <Tabla>
                        <FontAwesomeIcon icon={faCalendarDays} /> Fecha
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla>{calcularPrecioTotalCompra(params.row)}</Tabla>
                      <Tabla>{params.row.proveedor}</Tabla>
                      <Tabla>{params.row.codigo}</Tabla>
                      <Tabla>
                        {dayjs.utc(params.row.fecha).format("DD/MM/YYYY")}
                      </Tabla>
                    </tr>
                  </tbody>
                </table>
                <br />

                <div className="min-w-full">
                  <MUIDataTable
                    className="miTablaPersonalizada"
                    title={"Detalle Compras"}
                    data={params.row.repuestos.map((repuesto) => ({
                      nombre: repuesto.repuesto.name,
                      marca: repuesto.marca_repuesto,
                      cantidad: repuesto.cantidad_repuesto,
                      precioUnitario: formatCurrency2(repuesto.precio_unitario),
                      precioTotal: formatCurrency(repuesto.precio_total),
                    }))}
                    columns={[
                      {
                        name: "nombre",
                        label: "Nombre",
                        options: { filter: true, sort: true },
                      },
                      {
                        name: "marca",
                        label: "Marca",
                        options: { filter: true, sort: true },
                      },
                      {
                        name: "cantidad",
                        label: "Cantidad",
                        options: { filter: true, sort: false },
                      },
                      {
                        name: "precioUnitario",
                        label: "Precio Unitario",
                        options: { filter: true, sort: false },
                      },
                      {
                        name: "precioTotal",
                        label: "Precio Total",
                        options: { filter: true, sort: false },
                      },
                    ]}
                    options={{
                      sort: false,
                      responsive: "standard",
                      rowsPerPage: 2,
                      rowsPerPageOptions: 3,
                      selectableRows: 'none',
                      print: false,
                      download: false,
                      viewColumns: false,
                      textLabels: {
                        body: {
                          noMatch: "No se encontraron los repuestos", // Aquí cambias el mensaje
                        },
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
                    style={{ width: "100%" }}
                  />
                </div>
              </Detalle>
            </button>
          </div>
        );
      },
    },
  ];

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const filteredCompras = compras.filter(
    (compra) =>
      compra.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      compra.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      totalCompra(compra).includes(searchTerm) ||
      compra.repuestos.some((repuesto) =>
        repuesto.nombre_repuesto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repuesto.marca_repuesto.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const totalPages = Math.ceil(filteredCompras.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredCompras.length);
  const comprasToShow = filteredCompras.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const permissions = user?.rol?.permissions || [];

  return (
    <>
      {permissions.includes("Compras") ? (
        <>
          {!isMobile ? (
            <div className="mt-16">
              <div className="flex flex-col sm:flex-row justify-between items-center mx-16">
                <h1 className="text-2xl text-start sm:text-center ml-4 sm:ml-0 mb-4 sm:mb-0">
                  <FontAwesomeIcon icon={faShoppingBag} className="mr-2" />
                  Gestión de compras
                </h1>
                <div className="mx-4 sm:mx-0 justify-end flex">
                  <Link to="/add-compra">
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
                  className="bg-slate-700 shadow-lg shadow-blue-600/40 mx-16 my-4 "
                  rows={compras}
                  columns={columns}
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
                  <FontAwesomeIcon icon={faShoppingBag} className="mr-2" />
                  Gestión de compras
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
                  <Link to="/add-compra">
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

              <div>
                {comprasToShow.length === 0 ? (
                  <div className="flex justify-center items-center h-full">
                  <p className="text-center text-red-500 mt-10">No se encontraron resultados</p>
                </div>
                ) : (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mx-4 md:mx-16">
                {comprasToShow.map((compra) => (
                  <div
                    key={compra._id}
                    className={`col ${
                      compra.anulado === true
                        ? "shadow-red-600"
                        : "shadow-blue-800"
                    } rounded-lg p-4 shadow-md bg-slate-700`}
                  >
                    <h2 className="text-lg font-bold mb-2">{compra.codigo}</h2>
                    <p>Proveedor: {compra.proveedor}</p>
                    <p>
                      Total: {calcularPrecioTotalCompra(compra)}
                    </p>
                    <div className="flex flex-wrap justify-center items-center mt-4">
                      <div
                        className={compra.anulado ? "" : ""}
                        onClick={() => mostrarAlerta(compra._id, compra.anulado)}
                      >
                        {compra.anulado ? (
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
                      <button style={{ borderRadius: "150px" }}>
                        <Detalle
                          metodo={() => getCompras(compra._id)}
                          id={compra._id}
                          repuestos={compra.repuestos}
                        >
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
                          <table className="min-w-full">
                            <tbody className="min-w-full ">
                              <tr>
                                <td
                                  colSpan="4"
                                  style={{
                                    border: "1px solid #2e4f91",
                                    padding: "5px",
                                    backgroundColor: "#2e4f91",
                                    fontSize: "25px",
                                    textAlign: "center",
                                  }}
                                >
                                  <FontAwesomeIcon
                                    icon={faInfoCircle}
                                    className="mr-2"
                                  />
                                  Datos de la compra
                                </td>
                              </tr>

                              <tr>
                                <Tabla>
                                  <FontAwesomeIcon icon={faDollar} /> Total
                                </Tabla>
                                <Tabla>
                                  <FontAwesomeIcon icon={faUser} /> Proveedor
                                </Tabla>
                                <Tabla>
                                  <FontAwesomeIcon icon={faBarcode} /> Código
                                </Tabla>
                                <Tabla>
                                  <FontAwesomeIcon icon={faCalendarDays} />{" "}
                                  Fecha
                                </Tabla>
                              </tr>
                              <tr>
                                <Tabla>
                                  {calcularPrecioTotalCompra(compra)}
                                </Tabla>
                                <Tabla>{compra.proveedor}</Tabla>
                                <Tabla>{compra.codigo}</Tabla>
                                <Tabla>
                                  {dayjs
                                    .utc(compra.fecha)
                                    .format("DD/MM/YYYY")}
                                </Tabla>
                              </tr>
                            </tbody>
                          </table>
                          <br />

                          <div className="min-w-full">
                            <MUIDataTable
                              className="miTablaPersonalizada"
                              title={"Detalle Compras"}
                              data={compra.repuestos.map((repuesto) => ({
                                nombre: repuesto.repuesto.name,
                                marca: repuesto.marca_repuesto,
                                cantidad: repuesto.cantidad_repuesto,
                                precioUnitario: formatCurrency2(
                                  repuesto.precio_unitario
                                ),
                                precioTotal: formatCurrency(
                                  repuesto.precio_total
                                ),
                              }))}
                              columns={[
                                {
                                  name: "nombre",
                                  label: "Nombre",
                                  options: { filter: true, sort: true },
                                },
                                {
                                  name: "marca",
                                  label: "Marca",
                                  options: { filter: true, sort: true },
                                },
                                {
                                  name: "cantidad",
                                  label: "Cantidad",
                                  options: { filter: true, sort: false },
                                },
                                {
                                  name: "precioUnitario",
                                  label: "Precio Unitario",
                                  options: { filter: true, sort: false },
                                },
                                {
                                  name: "precioTotal",
                                  label: "Precio Total",
                                  options: { filter: true, sort: false },
                                },
                              ]}
                              options={{
                                sort: false,
                                responsive: "standard",
                                rowsPerPage: 2,
                                rowsPerPageOptions: [3],
                                selectableRows: "none",
                                print: false,
                                download: false,
                                viewColumns: false,
                                textLabels: {
                                  body: {
                                    noMatch: "No se encontraron los repuestos", // Aquí cambias el mensaje
                                  },
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
                              style={{ width: "100%" }}
                            />
                          </div>
                        </Detalle>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
                )}
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
