import React, { useEffect, useCallback, useState } from "react";
import { useRepuestos } from "../../context/RepuestosContext";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Link, Navigate } from "react-router-dom";
import Swal from "sweetalert2";
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
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";

import Detalle from "../../components/Detalle";
import { Tabla, Titulo } from "../../components/Tabla";
import { useAuth } from "../../hooks/useAuth";

function formatCurrency(value) {
  // Agrega el signo de peso
  const formattedValue = `$${value
    .toFixed(0)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  return formattedValue;
}

import * as XLSX from "xlsx";

function formatCurrency2(value) {
  // Solo separa los miles sin agregar el signo de pesos
  const formattedValue = value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return formattedValue;
}

export default function PageRepuestos() {
  const {
    repuestos,
    getRepuestos,
    getRepuesto,
    deleteRepuesto,
    updateRepuesto,
  } = useRepuestos();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  useEffect(() => {
    try {
      getRepuestos();
      // getRepuesto(id)
    } catch (error) {
      console.error("Error al obtener los repuestos:", error);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 862);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const mostrarAlerta = (id, estado) => {
    const title = estado === "Activo" ? "Inhabilitar" : "Habilitar";
    const text =
      estado === "Activo"
        ? "¿Estás seguro de inhabilitar la venta ?"
        : "¿Estás seguro de habilitar la venta ?";
    const texto = estado === "Activo" ? "Inhabilitado" : "Habilitado";

    Swal.fire({
      title: title,
      text: text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
      background: "linear-gradient(to right, #0f172a, #082f49, #0f172a)",
      color: "white",
      iconColor: "#2563eb",
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "px-5 py-1 m-1 text-lg text-white font-semibold rounded-full border-2 border-indigo-500 hover:text-white hover:bg-indigo-500",
        cancelButton:
          "px-4 py-1 m-1 text-lg text-white font-semibold rounded-full border-2 border-red-500 hover:text-white hover:bg-red-500",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        cambiarEstado(id, estado);
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
          icon: "error",
          title: "No se ha modificado",
        });
      }
    });
  };

  const cambiarEstado = (id, estado) => {
    const nuevoEstado = estado === "Activo" ? "Inactivo" : "Activo";
    updateRepuesto(id, { estado: nuevoEstado }).then(() => {
      getRepuestos();
    });
  };

  const exportarAExcel = useCallback(() => {
    const datos = repuestos.map((repuesto) => ({
      Nombre: repuesto.name,
      Marca: repuesto.marca.nombre_marca,
      Cantidad: repuesto.amount,
      Precio: repuesto.price,
      Estado: repuesto.estado,
    }));

    const ws = XLSX.utils.json_to_sheet(datos);

    // Agregar formato a los títulos (encabezados) y establecer autoFilter
    ws["!cols"] = [
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 30 },
      { wch: 15 },
    ];
    ws["!rows"] = [{ hpx: 20, outlineLevel: 0, hidden: false }];

    // Establecer el formato de fondo y negrita para los títulos
    for (let i = 0; i < 5; i++) {
      const col = String.fromCharCode(65 + i); // Convertir número a letra (A, B, C, ...)
      ws[`${col}1`].s = {
        font: { bold: true },
        fill: { patternType: "solid", fgColor: { rgb: "#66FFCC" } },
      };
    }

    // Agregar formato a las celdas de datos y bordes
    for (let i = 2; i <= repuestos.length + 1; i++) {
      for (let j = 0; j < 5; j++) {
        const col = String.fromCharCode(65 + j);
        const cell = `${col}${i}`;
        ws[cell].s = {
          fill: { patternType: "solid", fgColor: { rgb: "#FFFFFF" } },
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
    XLSX.utils.book_append_sheet(wb, ws, "Repuestos");
    XLSX.writeFile(wb, "repuestos.xlsx");
  }, [repuestos]);

  const columns = [
    {
      field: "name",
      headerName: "Repuesto",
      width: 250,
      headerClassName: "custom-header",
    },
    {
      field: "marca",
      headerName: "Marca",
      width: 170,
      headerClassName: "custom-header",
      valueGetter: (params) => params.row.marca.nombre_marca,
    },
    {
      field: "amount",
      headerName: "Cantidad",
      width: 150,
      headerClassName: "custom-header",
    },

    {
      field: "price",
      headerName: "Precio",
      width: 170,
      headerClassName: "custom-header",
      valueFormatter: (params) => formatCurrency(params.value),
    },
    {
      field: "estado",
      headerName: "Estado",
      width: 120,
      headerClassName: "custom-header",
    },
    // {
    //   field: "createdAt",
    //   headerName: "Fecha Creacion",
    //   width: 300,
    //   editable: true,
    //   headerClassName: 'custom-header',
    //   renderCell: (params) => {
    //     const date = new Date(params.value);
    //     const formattedDate = date.toLocaleDateString("es-ES", {
    //       year: "numeric",
    //       month: "long",
    //       day: "numeric",
    //     });
    //     return <div>{formattedDate}</div>;
    //   },
    // },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 200,
      headerClassName: "custom-header",
      renderCell: (params) => {
        const estado = params.row.estado;
        return (
          <div className="flex">
            <div
              className={estado === "Activo" ? "mt-1" : "hidden"}
              title="Editar"
            >
              <Link to={`/repuestos/${params.row._id}`}>
                <button className="m-1">
                  <FontAwesomeIcon
                    icon={faPencil}
                    className="border border-indigo-500 w-10 p-2 rounded-full hover:text-white hover:bg-indigo-500"
                  />
                </button>
              </Link>
            </div>

            {/* <button
            className="px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-red-500 hover:text-white hover-bg-red-500"
            onClick={() => mostrarAlerta(params.row._id)}
            >
            Eliminar
          </button> */}
            <button
              title="Activar/Inactivar"
              className={estado === "Activo" ? "mt-1" : ""}
              onClick={() => mostrarAlerta(params.row._id, estado)}
            >
              {estado === "Activo" ? (
                <FontAwesomeIcon
                  icon={faBan}
                  className={`border border-red-500 rounded-full p-2 w-10 text-white ${
                    estado === "Activo"
                      ? "border-red-500 hover:bg-red-500"
                      : "border-indigo-500 hover:bg-indigo-500"
                  }`}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faCheck}
                  className={`border border-indigo-500 rounded-full p-2 w-10 text-white ${
                    estado === "Activo"
                      ? "border-red-500 hover:bg-red-500"
                      : "border-indigo-500 hover:bg-indigo-500"
                  }`}
                />
              )}
            </button>
            <div
              className={estado === "Activo" ? "ml-1 mt-2" : "hidden"}
              title="Ver detalle"
            >
              <Detalle
                metodo={() => getRepuestos(params.row._id)}
                id={params.row._id}
              >
                <table className="min-w-full">
                  <tbody>
                    <tr>
                      <td
                        colSpan="3"
                        style={{
                          border: "1px solid #2e4f91",
                          padding: "10px",
                          backgroundColor: "#2e4f91",
                          fontSize: "25px",
                          textAlign: "center",
                        }}
                      >
                        <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                        Detalles del Repuesto
                      </td>
                    </tr>
                    <tr>
                      <Tabla>
                        <FontAwesomeIcon icon={faIdCard} className="mr-2" />
                        Nombre
                      </Tabla>
                      <Tabla>
                        {
                          repuestos.find(
                            (repuesto) => repuesto._id === params.row._id
                          )?.name
                        }
                      </Tabla>
                      <td
                        className=""
                        rowSpan={4}
                        style={{
                          border: "1px solid #2e4f91",
                          // width: "30%",
                          // minWidth: "170px",
                        }}
                      >
                        <div className="flex justify-center items-center ">
                          <img
                            className="min-h-20 max-h-40"
                            src={
                              repuestos.find(
                                (repuesto) => repuesto._id === params.row._id
                              )?.img
                            }
                            alt="Imagen de repuesto"
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <Tabla>
                        <FontAwesomeIcon icon={faRegistered} className="mr-2" />
                        Marca
                      </Tabla>
                      <Tabla>
                        {
                          repuestos.find(
                            (marca) => marca._id === params.row._id
                          )?.marca.nombre_marca
                        }
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla>
                        <FontAwesomeIcon icon={faHashtag} className="mr-2" />
                        Cantidad
                      </Tabla>
                      <Tabla>
                        {parseInt(
                          repuestos.find(
                            (repuesto) => repuesto._id === params.row._id
                          )?.amount,
                          10
                        ).toLocaleString()}{" "}
                        {/* Convertir a número y aplicar separadores de miles */}
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla>
                        <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                        Precio
                      </Tabla>
                      <Tabla>
                        {formatCurrency(
                          repuestos.find(
                            (repuesto) => repuesto._id === params.row._id
                          )?.price
                        )}
                      </Tabla>
                    </tr>
                  </tbody>
                </table>
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

  const filteredRepuestos = repuestos.filter(
    (repuesto) =>
      repuesto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repuesto.marca.nombre_marca
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      repuesto.amount.toString().includes(searchTerm) ||
      repuesto.price.toString().includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredRepuestos.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(
    startIndex + itemsPerPage,
    filteredRepuestos.length
  );
  const repuestosToShow = filteredRepuestos.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const permissions = user?.rol?.permissions || [];

  return (
    <>
      {permissions.includes("Repuestos") ? (
        <>
          {!isMobile ? (
            <div className="mt-16 ">
              <div className="flex flex-col sm:flex-row justify-between items-center mx-16">
                <h1 className="text-2xl text-start sm:text-center ml-4 sm:ml-0 mb-4 sm:mb-0">
                  <FontAwesomeIcon icon={faTools} className="mr-2" />
                  Gestión de repuestos
                </h1>
                <div className="mx-4 sm:mx-0 justify-end flex">
                  <Link to="/add-repuesto">
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

              {/* <div className="flex justify-between">
      <h1 className="text-2xl text-start ml-16"><FontAwesomeIcon icon={faBuilding} className="mr-2" />Gestión de Marcas</h1>
      <div className="mx-10 justify-end">
        <Link to="/add-marca">
        <button  className="px-4 py-2 mr-8 text-sm text-withe font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent" title="Agregar">
        <FontAwesomeIcon icon={faPlus} />
          </button>
        </Link>
      </div>
      </div> */}

              <Box sx={{ width: "100%" }}>
                <DataGrid
                  className="bg-slate-700 shadow-lg shadow-blue-600/40 mx-16 my-4"
                  rows={repuestos}
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
              <div className="mt-16 ">
                <h1 className="text-2xl text-start sm:text-center ml-4 sm:ml-0 mb-4 sm:mb-0">
                  <FontAwesomeIcon icon={faTools} className="mr-2" />
                  Gestión de repuestos
                </h1>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center mx-16">
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
                  <Link to="/add-repuesto" title="Agregar">
                    <FontAwesomeIcon
                      icon={faPlus}
                      className="px-4 py-2 text-sm text-withe font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent"
                    />
                  </Link>
                  <button onClick={exportarAExcel} title="Descargar excel">
                    <FontAwesomeIcon
                      icon={faDownload}
                      className="px-4 py-2 mx-2 text-sm text-withe font-semibold rounded-full border border-green-600 hover:text-white hover:bg-green-600 hover:border-transparent"
                    />
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mx-4 md:mx-16">
                {repuestosToShow.map((repuesto) => (
                  <div
                    key={repuesto._id}
                    className={`col ${
                      repuesto.estado === "Activo"
                        ? "shadow-blue-600"
                        : "shadow-red-500"
                    } rounded-lg p-4 shadow-md bg-slate-700`}
                  >
                    <h2 className="text-lg font-bold mb-2">{repuesto.name}</h2>
                    <p>Cantidad: {repuesto.amount}</p>
                    <p>Precio: {repuesto.price}</p>
                    <div className="flex justify-center mt-4">
                      <Link
                        className={`${
                          repuesto.estado === "Activo" ? "mr-2" : "hidden"
                        } text-white`}
                        title="Editar"
                        to={`/repuestos/${repuesto._id}`}
                      >
                        <FontAwesomeIcon
                          icon={faPencil}
                          className="border border-indigo-500 w-10 p-2 rounded-full"
                        />
                      </Link>

                      <button
                        className={``}
                        onClick={() =>
                          mostrarAlerta(repuesto._id, repuesto.estado)
                        }
                        title="Activar/Inactivar"
                      >
                        {repuesto.estado === "Activo" ? (
                          <FontAwesomeIcon
                            icon={faBan}
                            className="border border-red-500 rounded-full p-2 w-10 text-white"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faCheck}
                            className="border border-indigo-500 rounded-full p-2 w-10 text-white"
                          />
                        )}
                      </button>
                      <div title="Ver detalle" className="ml-2">
                        <Detalle
                          metodo={() => getRepuesto(repuesto._id)}
                          id={repuesto._id}
                        >
                          <table className="min-w-full">
                            <tbody>
                              <tr>
                                <td
                                  colSpan="3"
                                  style={{
                                    border: "1px solid #2e4f91",
                                    padding: "10px",
                                    backgroundColor: "#2e4f91",
                                    fontSize: "25px",
                                    textAlign: "center",
                                  }}
                                >
                                  <FontAwesomeIcon
                                    icon={faInfoCircle}
                                    className="mr-2"
                                  />
                                  Detalles del Repuesto
                                </td>
                              </tr>
                              <tr>
                                <Tabla>
                                  <FontAwesomeIcon
                                    icon={faIdCard}
                                    className="mr-2"
                                  />
                                  Nombre
                                </Tabla>
                                <Tabla>{repuesto.name}</Tabla>
                              </tr>
                              <tr>
                                <Tabla>
                                  <FontAwesomeIcon
                                    icon={faRegistered}
                                    className="mr-2"
                                  />
                                  Marca
                                </Tabla>
                                <Tabla>{repuesto.marca.nombre_marca}</Tabla>
                              </tr>
                              <tr>
                                <Tabla>
                                  <FontAwesomeIcon
                                    icon={faHashtag}
                                    className="mr-2"
                                  />
                                  Cantidad
                                </Tabla>
                                <Tabla>
                                  {parseInt(
                                    repuesto.amount,
                                    10
                                  ).toLocaleString()}{" "}
                                  {/* Convertir a número y aplicar separadores de miles */}
                                </Tabla>
                              </tr>
                              <tr>
                                <Tabla>
                                  <FontAwesomeIcon
                                    icon={faDollarSign}
                                    className="mr-2"
                                  />
                                  Precio
                                </Tabla>
                                <Tabla>{formatCurrency(repuesto.price)}</Tabla>
                              </tr> 
                            </tbody>
                          </table>
                          <div className="flex justify-center items-center p-2 border  border-blue-600 min-w-full">
                                  <img
                                    className="min-h-20 max-h-40"
                                    src={repuesto.img}
                                    alt="Imagen de repuesto"
                                  />
                                </div>
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
