import React, { useEffect, useCallback, useState } from "react";
import { useVentasServicios } from "../../context/VentasServicioContex";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Link, Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import Detalle from "../../components/Detalle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faLock,
  faUser,
  faPen,
  faDownload,
  faPencil,
  faBan,
  faCalendarDay,
  faInfoCircle,
  faDollarSign,
  faCheck,
  faHandshake,
  faChevronLeft,
  faChevronRight,
  faPhone,
  faEnvelope,
  faMars,
  faAddressCard,
} from "@fortawesome/free-solid-svg-icons";
import { Tabla, Titulo } from "../../components/Tabla";
import { useAuth } from "../../hooks/useAuth";

function formatCurrency(value) {
  // Agrega el signo de peso
  const formattedValue = `$${value
    .toFixed(0)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  return formattedValue;
}

export default function PageVentaServicios() {
  const {
    ventasServicios,
    getVentasServicios,
    deleteVentaServicio,
    updateVentaServicio,
  } = useVentasServicios();

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
      getVentasServicios();
    } catch (error) {
      console.error("Error al obtener las ventas:", error);
    }
  }, []);

  const mostrarAlerta = (id, estado) => {
    const title = estado === "En proceso" ? "Inhabilitar venta" : "Habilitar";
    const text =
      estado === "En proceso"
        ? "¿Estás seguro de inhabilitar la venta?"
        : "¿Estás seguro de habilitar la venta ?";
    const texto = estado === "En proceso" ? "Inhabilitado" : "Habilitado";

    if (estado === "En proceso") {
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
          inactivarVenta(id, estado); // Cambiar estado a "Inactivo"
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
            title: "Se ha modificado la venta servicio",
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
            title: "No se ha modificado la venta servicio",
          });
        }
      });
    } else {
      Swal.fire({
        title: "Acción no permitida",
        text: "Esta venta ya está desactivada y no se puede modificar.",
        icon: "info",
        background: "linear-gradient(to right, #0f172a, #082f49, #0f172a)",
        color: "white",
        iconColor: "#2563eb",
        buttonsStyling: false,
        customClass: {
          confirmButton:
            "px-5 py-1 m-1 text-lg text-white font-semibold rounded-full border-2 border-indigo-500 hover:text-white hover:bg-indigo-500",
        },
      });
    }
  };

  const cambiarEstado = (id, estado) => {
    const nuevoEstado = "Finalizada"; // Cambiar el estado a "Finalizada"
    updateVentaServicio(id, { estado: nuevoEstado }).then(() => {
      getVentasServicios();
    });
  };

  const inactivarVenta = (id, estado) => {
    const nuevoEstado = "Inactivo"; // Cambiar el estado a "Inactivo"
    updateVentaServicio(id, { estado: nuevoEstado }).then(() => {
      getVentasServicios();
    });
  };

  const mostrarAlertaCambiarEstado = (id, estado) => {
    const title = "Finalizar venta";
    const text = "¿Estás seguro de finalizar la venta?";

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
        cambiarEstado(id, estado); // Cambiar estado a "Finalizada"
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
          title: "Se ha finalizado la venta",
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
          title: "No se ha finalizado la venta",
        });
      }
    });
  };

  const exportarAExcel = useCallback(() => {
    const datos = ventasServicios.map((venta) => ({
      Mecanico: venta.mecanico.nombre_mecanico,
      Cliente: venta.cliente.nombre_cliente,
      "Precio de servicio": venta.precio_servicio,
      "Fecha de venta": new Date(venta.createdAt).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      Placa: venta.placa,
      Estado: venta.estado,
    }));

    const ws = XLSX.utils.json_to_sheet(datos);

    // Agregar formato y bordes
    for (let i = 1; i <= ventasServicios.length + 1; i++) {
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
    XLSX.utils.book_append_sheet(wb, ws, "VentasServicios");
    XLSX.writeFile(wb, "ventasServicios.xlsx");
  }, [ventasServicios]);

  const columns = [
    {
      field: "nombre_mecanico",
      headerName: "Mecánico",
      width: 180,
      headerClassName: "custom-header",
      valueGetter: (params) => params.row.mecanico.nombre_mecanico,
    },
    {
      field: "nombre_cliente",
      headerName: "Cliente",
      width: 160,
      headerClassName: "custom-header",
      valueGetter: (params) => params.row.cliente.nombre_cliente,
    },
    {
      field: "placa",
      headerName: "Placa",
      width: 90,
      headerClassName: "custom-header",
      valueGetter: (params) => params.value.toUpperCase(),
    },
    {
      field: "precio_servicio",
      headerName: "Precio servicio",
      width: 185,
      headerClassName: "custom-header",
      headerAlign: "center",
      valueFormatter: (params) => formatCurrency(params.value),
      align: "center", // Esto centra el contenido de la celda
    },

    // {
    //   field: "createdAt",
    //   headerName: "Fecha Venta",
    //   width: 140,
    //   headerClassName: 'custom-header',
    //   renderCell: (params) => {
    //     const date = new Date(params.value);
    //     date.toLocaleString("en-US", { timeZone: "America/Bogota" });
    //     const formattedDate = date.toLocaleDateString("es-ES", {
    //       month: "long",
    //       day: "numeric",
    //     });

    //     return <div>{formattedDate}</div>;
    //   },
    // },
    {
      field: "estado",
      headerName: "Estado",
      width: 130,
      headerClassName: "custom-header",
    },

    {
      field: "acciones",
      headerName: "Acciones",
      width: 260,
      headerClassName: "custom-header",
      // headerAlign: "left",
      renderCell: (params) => {
        const estado = params.row.estado;

        return (
          <div className="flex">
            <button
              title="Finalizar venta"
              onClick={() => mostrarAlertaCambiarEstado(params.row._id, estado)}
            >
              <FontAwesomeIcon
                icon={faCheck}
                className={`w-10 p-2 m-1 text-sm text-white font-semibold rounded-full border border-green-500 hover:text-white hover:bg-green-500 ${estado !== "Finalizada" && estado !== "Inactivo"
                    ? ""
                    : "hidden"
                  }`}
              />
            </button>

            <div className={estado === "En proceso" ? "mt-1" : "hidden"}>
              <Link title="Editar" to={`/ventas-servicios/${params.row._id}`}>
                <FontAwesomeIcon
                  icon={faPencil}
                  className="border border-indigo-500 w-10 p-2 rounded-full hover:text-white hover:bg-indigo-500"
                />
              </Link>
            </div>

            <button
              title="Inactivar"
              className={`px-5 py-1.5 m-1 text-sm text-white font-semibold rounded-full border ${estado === "En proceso"
                  ? "border-red-500 hover:text-white hover:bg-red-500"
                  : "border-indigo-500 hover:text-white hover:bg-indigo-500"
                } ${estado !== "Finalizada" ? "" : "hidden"}`}
              onClick={() => mostrarAlerta(params.row._id, estado)}
            >
              {estado === "En proceso" ? (
                <FontAwesomeIcon icon={faBan} />
              ) : (
                <FontAwesomeIcon icon={faLock} />
              )}
            </button>

            <button
              className={
                estado === "En proceso" || estado === "Finalizada"
                  ? "mt-1"
                  : "hidden"
              }
              title="Ver detalle"
            >
              <Detalle
                metodo={() => getVentasServicios(params.row._id)}
                id={params.row._id}
              >
                <table className="min-w-full">
                  <tbody>
                    <Titulo>
                      <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                      Detalles de la venta
                    </Titulo>
                    <tr>
                      <Tabla>
                        <FontAwesomeIcon icon={faUser} className="mr-2" />
                        Mecánico
                      </Tabla>
                      <Tabla>{params.row.mecanico.nombre_mecanico}</Tabla>
                    </tr>
                    <tr>
                      <Tabla>
                        <FontAwesomeIcon icon={faUser} className="mr-2" />
                        Cliente
                      </Tabla>
                      <Tabla>{params.row.cliente.nombre_cliente}</Tabla>
                    </tr>
                    <tr>
                      <Tabla>
                        <FontAwesomeIcon icon={faPen} className="mr-2" />
                        Placa
                      </Tabla>
                      <Tabla>{params.row.placa.toUpperCase()}</Tabla>
                    </tr>
                    <tr>
                      <Tabla>
                        <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                        Precio Servicio
                      </Tabla>
                      <Tabla>
                        {formatCurrency(params.row.precio_servicio)}
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla>
                        <FontAwesomeIcon
                          icon={faCalendarDay}
                          className="mr-2"
                        />
                        Fecha Venta
                      </Tabla>
                      <Tabla>
                        {new Date(params.row.createdAt).toLocaleDateString(
                          "es-ES",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla>
                        <FontAwesomeIcon icon={faPen} className="mr-2" />
                        Descripción
                      </Tabla>
                      <Tabla>{params.row.descripcion}</Tabla>
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

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const filteredVentasServicios = ventasServicios.filter((venta) =>
    venta.mecanico.nombre_mecanico.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venta.cliente.nombre_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venta.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venta.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venta.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venta.precio_servicio.toString().includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredVentasServicios.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(
    startIndex + itemsPerPage,
    filteredVentasServicios.length
  );
  const ventasServiciosToShow = filteredVentasServicios.slice(
    startIndex,
    endIndex
  );

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const permissions = user?.rol?.permissions || [];

  return (
    <>
      {permissions.includes("Ventas Servicio") ? (
        <>
          {!isMobile ? (
            <div className="mt-16 ">
              <div className="flex flex-col sm:flex-row justify-between items-center mx-16">
                <h1 className="text-2xl text-start sm:text-center ml-4 sm:ml-0 mb-4 sm:mb-0">
                  <FontAwesomeIcon icon={faHandshake} className="mr-2" />
                  Gestión de ventas servicios
                </h1>
                <div className="mx-4 sm:mx-0 justify-end flex">
                  <Link to="/add-venta-servicio">
                    <button
                      className="px-4 py-2 text-sm text-withe font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent"
                      title="Agregar"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </Link>
                  <button
                    onClick={exportarAExcel}
                    className="px-4 py-2 mx-2 text-sm text-white font-semibold rounded-full border border-green-600 hover:text-white hover:bg-green-600 hover:border-transparent"
                    title="Descargar excel"
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </button>
                </div>
              </div>
              <Box sx={{ width: "100%" }}>
                <DataGrid
                  className="bg-slate-700 shadow-lg shadow-blue-600/40 mx-16 my-4"
                  rows={ventasServicios}
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
                      fontSize: "15px", // Cambia el tamaño de fuente aquí
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
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  Gestión de ventas de servicios
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
                  <Link to="/add-venta-servicio">
                    <button
                      className="px-4 py-2 text-sm text-withe font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent"
                      title="Agregar"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </Link>
                  <button
                    onClick={exportarAExcel}
                    className="px-4 py-2 mx-2 text-sm text-white font-semibold rounded-full border border-green-600 hover:text-white hover:bg-green-600 hover:border-transparent"
                    title="Descargar excel"
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </button>
                </div>
              </div>

              <div>
                {ventasServiciosToShow.length === 0 ? (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-center text-red-500 mt-10">No se encontraron resultados</p>
                  </div>
                ) : (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mx-4 md:mx-16">
                    {ventasServiciosToShow.map((venta) => (
                      <div
                        key={venta._id}
                        className={`col ${venta.estado === "Finalizada"
                            ? "shadow-blue-600"
                            : venta.estado === "Inactivo"
                              ? "shadow-red-500"
                              : "shadow-green-800"
                          } rounded-lg p-4 shadow-md bg-slate-700`}
                      >
                        <h2 className="text-lg font-bold mb-2">
                          {venta.mecanico.nombre_mecanico}
                        </h2>
                        <p>Placa: {venta.placa}</p>
                        <p>Descripcion: {venta.descripcion}</p>
                        <div className="flex flex-wrap justify-center items-center mt-4">
                          {/* Botón para finalizar venta */}
                          {venta.estado !== "Finalizada" &&
                            venta.estado !== "Inactivo" && (
                              <button
                                title="Finalizar venta"
                                onClick={() =>
                                  mostrarAlertaCambiarEstado(
                                    venta._id,
                                    venta.estado
                                  )
                                }
                                className="button-margin"
                              >
                                <FontAwesomeIcon
                                  icon={faCheck}
                                  className="w-10 p-2 m-1 text-sm text-white font-semibold rounded-full border border-green-500 hover:text-white hover:bg-green-500"
                                />
                              </button>
                            )}

                          {/* Botón para editar */}
                          <Link
                            className={`${venta.estado === "En proceso" ? "mr-1" : "hidden"
                              } text-white button-margin`}
                            title="Editar"
                            to={`/ventas-servicios/${venta._id}`}
                          >
                            <FontAwesomeIcon
                              icon={faPencil}
                              className="border border-indigo-500 w-10 p-2 rounded-full"
                            />
                          </Link>

                          {/* Botón para inactivar */}
                          {venta.estado !== "Finalizada" && (
                            <button
                              title="Inactivar"
                              className={`${venta.estado === "En proceso"
                                  ? ""
                                  : ""
                                } button-margin`}
                              onClick={() => mostrarAlerta(venta._id, venta.estado)}
                            >
                              {venta.estado === "En proceso" ? (
                                <FontAwesomeIcon icon={faBan} className="border border-red-500 rounded-full p-2 w-10 text-white" />
                              ) : (
                                <FontAwesomeIcon icon={faLock} className="border border-indigo-500 rounded-full p-2 w-10 text-white" />
                              )}
                            </button>
                          )}
                          <div title="Ver detalle" className="ml-2">
                            <Detalle
                              metodo={() => getVentasServicios(venta._id)}
                              id={venta._id}
                            >
                              <table className="min-w-full">
                                <tbody>
                                  <Titulo>
                                    <FontAwesomeIcon
                                      icon={faInfoCircle}
                                      className="mr-2"
                                    />
                                    Detalles de la venta
                                  </Titulo>
                                  <tr>
                                    <Tabla>
                                      <FontAwesomeIcon
                                        icon={faUser}
                                        className="mr-2"
                                      />
                                      Mecánico
                                    </Tabla>
                                    <Tabla>{venta.mecanico.nombre_mecanico}</Tabla>
                                  </tr>
                                  <tr>
                                    <Tabla>
                                      <FontAwesomeIcon
                                        icon={faUser}
                                        className="mr-2"
                                      />
                                      Cliente
                                    </Tabla>
                                    <Tabla>{venta.cliente.nombre_cliente}</Tabla>
                                  </tr>
                                  <tr>
                                    <Tabla>
                                      <FontAwesomeIcon
                                        icon={faPen}
                                        className="mr-2"
                                      />
                                      Placa
                                    </Tabla>
                                    <Tabla>{venta.placa.toUpperCase()}</Tabla>
                                  </tr>
                                  <tr>
                                    <Tabla>
                                      <FontAwesomeIcon
                                        icon={faDollarSign}
                                        className="mr-2"
                                      />
                                      Precio Servicio
                                    </Tabla>
                                    <Tabla>
                                      {formatCurrency(venta.precio_servicio)}
                                    </Tabla>
                                  </tr>
                                  <tr>
                                    <Tabla>
                                      <FontAwesomeIcon
                                        icon={faCalendarDay}
                                        className="mr-2"
                                      />
                                      Fecha Venta
                                    </Tabla>
                                    <Tabla>
                                      {new Date(venta.createdAt).toLocaleDateString(
                                        "es-ES",
                                        {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        }
                                      )}
                                    </Tabla>
                                  </tr>
                                  <tr>
                                    <Tabla>
                                      <FontAwesomeIcon
                                        icon={faPen}
                                        className="mr-2"
                                      />
                                      Descripción
                                    </Tabla>
                                    <Tabla>{venta.descripcion}</Tabla>
                                  </tr>
                                </tbody>
                              </table>
                            </Detalle>
                          </div>
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
                    className={`relative inline-flex items-center px-4 py-2 rounded-l-lg text-white ${page === 1
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
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 ${index + 1 === page
                          ? "z-10 font-bold bg-blue-600"
                          : "text-gray-500"
                        }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    className={`relative inline-flex items-center px-4 py-2 rounded-r-lg shadow   ${page === totalPages
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
