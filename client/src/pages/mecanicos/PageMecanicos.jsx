import React, { useEffect, useCallback, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { useMecanicos } from "../../context/MecanicosContext";
import { Link, Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWrench,
  faPlus,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";
import Detalle from "../../components/Detalle";
import {
  faEnvelope,
  faIdCard,
  faFilePdf,
  faUser,
  faPhone,
  faPen,
  faPencil,
  faBan,
  faCheck,
  faInfoCircle,
  faAddressCard,
  faHome,
  faChevronRight,
  faChevronLeft
} from "@fortawesome/free-solid-svg-icons";
import { Tabla, Titulo } from "../../components/Tabla";
import { jsPDF } from "jspdf";
import { useAuth } from "../../hooks/useAuth";

// Agrega el icono a la biblioteca
library.add(faWrench, faPlus);

export default function PageMecanico() {
  const { mecanicos, getMecanicos, deleteMecanico, updateMecanico, getMecanico } =
    useMecanicos();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

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
      getMecanicos();
      // getMecanico(id);
    } catch (error) {
      console.error("Error al obtener mecanicos:", error);
    }
  }, []);

  const mostrarAlerta = (id, estado) => {
    const title = estado === "Activo" ? "Inhabilitar" : "Habilitar";
    const text =
      estado === "Activo"
        ? "¿Estás seguro de inhabilitar el mecánico?"
        : "¿Estás seguro de habilitar el mecánico?";
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
          title: "Se ha inhabilitado",
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
          title: "No se ha inhabilitado",
        });
      }
    });
  };

  const cambiarEstado = (id, estado) => {
    const nuevoEstado = estado === "Activo" ? "Inactivo" : "Activo";
    updateMecanico(id, { estado: nuevoEstado }).then(() => {
      getMecanicos();
    });
  };

  const handleDownloadPDF = async (mecanico) => {
    try {
      if (!mecanico) {
        throw new Error("Mecánico es null. No se puede generar el PDF.");
      }

      const pdf = new jsPDF();

      pdf.setFont("helvetica");
      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1
        }/${currentDate.getFullYear()}`;

      pdf.setFontSize(12);
      pdf.text(`Fecha: ${formattedDate}`, 20, 20);
      pdf.setFontSize(16);
      pdf.text("Taller Moto racer la 36", 20, 30);
      pdf.setFontSize(12);
      pdf.text("Dirección: cll 36 # 36-37", 20, 40);

      pdf.setFontSize(12);
      pdf.text("Nombre del Administrador: Jhonatan Arboleda", 20, 60);
      pdf.text("Lugar: Medellin", 20, 70);

      pdf.setFontSize(18);
      pdf.text(`Información del Mecánico`, 20, 90);

      pdf.setFontSize(14);
      pdf.text(`Cedula: ${mecanico.cedula_mecanico}`, 20, 110);
      pdf.text(`Nombre: ${mecanico.nombre_mecanico}`, 20, 120);
      pdf.text(`Telefono: ${mecanico.telefono_mecanico}`, 20, 130);
      pdf.text(`Direccion: ${mecanico.direccion_mecanico}`, 20, 140);
      pdf.text(`Estado: ${mecanico.estado}`, 20, 150);

      const blob = pdf.output("blob");
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `DetalleMecanico_${mecanico.cedula_mecanico}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al generar el PDF:", error.message);
    }
  };

  const exportarAExcel = useCallback(() => {
    const datos = mecanicos.map((mecanico) => ({
      Cedula: mecanico.cedula_mecanico,
      Nombre: mecanico.nombre_mecanico,
      Telefono: mecanico.telefono_mecanico,
      Direccion: mecanico.direccion_mecanico,
      Estado: mecanico.estado,
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
    for (let i = 2; i <= mecanicos.length + 1; i++) {
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
    XLSX.utils.book_append_sheet(wb, ws, "Mecanicos");
    XLSX.writeFile(wb, "mecanicos.xlsx");
  }, [mecanicos]);

  const columns = [
    {
      field: "tipo",
      headerName: "Tipo Documento",
      width: 250,
      headerClassName: "font-custom text-lg ",
    },
    {
      field: "cedula_mecanico",
      headerName: "Documento",
      width: 200,
      headerClassName: "font-custom text-lg",
    },
    {
      field: "nombre_mecanico",
      headerName: "Nombre Completo",
      width: 240,
      headerClassName: "font-bold text-lg",
    },
    {
      field: "telefono_mecanico",
      headerName: "Teléfono",
      width: 190,
      headerClassName: "font-bold text-lg",
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 250,
      headerClassName: "font-bold text-lg",
      renderCell: (params) => {
        const estado = params.row.estado;
        return (
          <div className="flex">
            <div
              className={estado === "Activo" ? "mt-1" : "hidden"}
              title="Editar"
            >
              <Link
                to={`/mecanico/${params.row._id}`}
              >
                <button className="m-1">
                  <FontAwesomeIcon icon={faPencil} className="border border-indigo-500 w-10 p-2 rounded-full hover:text-white hover:bg-indigo-500" />
                </button>
              </Link>
            </div>
            {/* <button
              className="px-5 py-1 text-sm text-withe font-semibold rounded-full border border-red-500 hover:text-white hover:bg-red-500 hover:border-transparent shadow-lg shadow-zinc-300/30 ml-3"
              onClick={() => handleDownloadPDF(params.row)}
              disabled={!mecanicos}
            >
              <FontAwesomeIcon icon={faFilePdf} className="mr-0" />
            </button> */}
            {/* <button
            className="px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-red-500 hover:text-white hover-bg-red-500"
            onClick={() => mostrarAlerta(params.row._id)}
          >
            Eliminar
          </button> */}
            <button
              title="Activar/Inactivar"
              className={
                estado === "Activo"
                  ? "mt-1"
                  : ""
              }
              onClick={() => mostrarAlerta(params.row._id, estado)}
            >
              {estado === "Activo" ? (
                <FontAwesomeIcon icon={faBan} className={`border border-red-500 rounded-full p-2 w-10 text-white ${estado === "Activo" ? "border-red-500 hover:bg-red-500" : "border-indigo-500 hover:bg-indigo-500"}`} />
              ) : (
                <FontAwesomeIcon icon={faCheck} className={`border border-indigo-500 rounded-full p-2 w-10 text-white ${estado === "Activo" ? "border-red-500 hover:bg-red-500" : "border-indigo-500 hover:bg-indigo-500"}`} />
              )}
            </button>
            <div
              className={estado === "Activo" ? "ml-1 mt-2" : "hidden"}
              title="Ver detalle"
            >
              <Detalle
                metodo={() => getMecanicos(params.row._id)}
                id={params.row._id}
              >
                <table className="min-w-full">
                  <tbody>
                    <Titulo>
                      <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                      Detalles del Mecánico
                    </Titulo>

                    <tr>
                      <Tabla>
                        <FontAwesomeIcon icon={faIdCard} className="mr-2" />
                        Tipo de documento
                      </Tabla>
                      <Tabla>
                        {
                          mecanicos.find(
                            (mecanicos) => mecanicos._id === params.row._id
                          )?.tipo
                        }
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla>
                        <FontAwesomeIcon icon={faIdCard} className="mr-2" />
                        Documento
                      </Tabla>
                      <Tabla>
                        {
                          mecanicos.find(
                            (mecanicos) => mecanicos._id === params.row._id
                          )?.cedula_mecanico
                        }
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla>
                        <FontAwesomeIcon icon={faUser} className="mr-2" />
                        Nombre Completo
                      </Tabla>
                      <Tabla>
                        {
                          mecanicos.find(
                            (mecanicos) => mecanicos._id === params.row._id
                          )?.nombre_mecanico
                        }
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla>
                        <FontAwesomeIcon icon={faPhone} className="mr-2" />
                        Teléfono
                      </Tabla>
                      <Tabla>
                        {
                          mecanicos.find(
                            (mecanicos) => mecanicos._id === params.row._id
                          )?.telefono_mecanico
                        }
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla>
                        <FontAwesomeIcon icon={faHome} className="mr-2" />
                        Dirección
                      </Tabla>
                      <Tabla>
                        {
                          mecanicos.find(
                            (mecanicos) => mecanicos._id === params.row._id
                          )?.direccion_mecanico
                        }
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla>
                        <FontAwesomeIcon icon={faCheck} className="mr-2" />
                        Estado
                      </Tabla>
                      <Tabla>
                        {
                          mecanicos.find(
                            (mecanicos) => mecanicos._id === params.row._id
                          )?.estado
                        }
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

  const filteredMecanicos = mecanicos.filter(
    (mecanicos) =>
      mecanicos.nombre_mecanico.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mecanicos.cedula_mecanico.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mecanicos.telefono_mecanico.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mecanicos.direccion_mecanico.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMecanicos.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredMecanicos.length);
  const mecanicoToShow = filteredMecanicos.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };


  const permissions = user?.rol?.permissions || [];

  return (
    <>
      {permissions.includes("Mecánicos") ? (
        <>
          {!isMobile ? (
            <div className="mt-16">
              <div className="flex flex-col sm:flex-row justify-between items-center mx-16">
                <h1 className="text-2xl text-start sm:text-center ml-4 sm:ml-0 mb-4 sm:mb-0">
                  {" "}
                  <FontAwesomeIcon icon="wrench" className="mr-2" />
                  Gestión de mecánicos
                </h1>
                <div className="mx-4 sm:mx-0 justify-end flex">
                  <Link to="/add-mecanico">
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
                  rows={mecanicos}
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
                    columnsPanelTextFieldPlaceholder: "Nombre de la columna",
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
                  Gestión de mecánicos
                </h1>
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
                    <Link to="/add-mecanico">
                      <FontAwesomeIcon
                        icon={faPlus}
                        className="px-4 py-2 text-sm text-withe font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent"
                      />
                    </Link>
                    <button
                    onClick={exportarAExcel}
                    title="Descargar excel"
                  >
                    <FontAwesomeIcon icon={faDownload} className="px-4 py-2 mx-2 text-sm text-withe font-semibold rounded-full border border-green-600 hover:text-white hover:bg-green-600 hover:border-transparent"/>
                  </button>
                  </div>
                </div>

                <div>
                  {mecanicoToShow.length === 0 ? (
                    <div className="flex justify-center items-center h-full">
                    <p className="text-center text-red-500">No se encontraron resultados</p>
                  </div>
                  ) : (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mx-4 md:mx-16">
                  {mecanicoToShow.map((mecanico) => (
                    <div
                      key={mecanico._id}
                      className={`col ${mecanico.estado === "Activo" ? "shadow-blue-600" : "shadow-red-500"} rounded-lg p-4 shadow-md bg-slate-700`}
                      
                    >
                      <h2 className="text-lg font-bold mb-2">
                        {mecanico.nombre_mecanico}
                      </h2>
                      <p>Documento: {mecanico.cedula_mecanico}</p>
                      <p>Teléfono: {mecanico.telefono_mecanico}</p>
                      <div className="flex justify-center mt-4">
                        <Link className={`${mecanico.estado === "Activo" ? "mr-2" : "hidden"} text-white`} title="Editar" to={`/mecanico/${mecanico._id}`}>
                          <FontAwesomeIcon icon={faPencil} className="border border-indigo-500 w-10 p-2 rounded-full" />
                        </Link>
                        <button
                          className={``}
                          onClick={() => mostrarAlerta(mecanico._id, mecanico.estado)}
                          title="Activar/Inactivar"
                        >
                          {mecanico.estado === "Activo" ? (
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
                          <Detalle metodo={() => getMecanico(mecanico._id)} id={mecanico._id}>
                            <table className="min-w-full">
                              <tbody>
                                <Titulo>
                                  <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                                  Detalles del Mecánico
                                </Titulo>

                                <tr>
                                  <Tabla>
                                    <FontAwesomeIcon icon={faIdCard} className="mr-2" />
                                    Tipo de documento
                                  </Tabla>
                                  <Tabla>
                                    {mecanico.tipo}
                                  </Tabla>
                                </tr>
                                <tr>
                                  <Tabla>
                                    <FontAwesomeIcon icon={faIdCard} className="mr-2" />
                                    Documento
                                  </Tabla>
                                  <Tabla>
                                    {mecanico.cedula_mecanico}
                                  </Tabla>
                                </tr>
                                <tr>
                                  <Tabla>
                                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                                    Nombre Completo
                                  </Tabla>
                                  <Tabla>
                                    {mecanico.nombre_mecanico}
                                  </Tabla>
                                </tr>
                                <tr>
                                  <Tabla>
                                    <FontAwesomeIcon icon={faPhone} className="mr-2" />
                                    Teléfono
                                  </Tabla>
                                  <Tabla>
                                    {mecanico.telefono_mecanico}
                                  </Tabla>
                                </tr>
                                <tr>
                                  <Tabla>
                                    <FontAwesomeIcon icon={faHome} className="mr-2" />
                                    Dirección
                                  </Tabla>
                                  <Tabla>
                                    {mecanico.direccion_mecanico}
                                  </Tabla>
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
