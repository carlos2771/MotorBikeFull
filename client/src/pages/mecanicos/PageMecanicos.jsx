import React, { useEffect, useCallback } from "react";
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
} from "@fortawesome/free-solid-svg-icons";
import { Tabla, Titulo } from "../../components/Tabla";
import { jsPDF } from "jspdf";
import { useAuth } from "../../hooks/useAuth";

// Agrega el icono a la biblioteca
library.add(faWrench, faPlus);

export default function PageMecanico() {
  const { mecanicos, getMecanicos, deleteMecanico, updateMecanico } =
    useMecanicos();
  const { user } = useAuth();

  useEffect(() => {
    try {
      getMecanicos();
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
      const formattedDate = `${currentDate.getDate()}/${
        currentDate.getMonth() + 1
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
          <div>
            <button
              className={estado === "Activo" ? "" : "hidden"}
              title="Editar"
            >
              <Link
                className="px-4 py-1.5 m-1 text-sm text-white font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500"
                to={`/mecanico/${params.row._id}`}
              >
                <FontAwesomeIcon icon={faPencil} />
              </Link>
            </button>
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
                  ? "px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-red-500 hover:text-white hover:bg-red-500"
                  : "px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500"
              }
              onClick={() => mostrarAlerta(params.row._id, estado)}
            >
              {estado === "Activo" ? (
                <FontAwesomeIcon icon={faBan} />
              ) : (
                <FontAwesomeIcon icon={faCheck} />
              )}
            </button>
            <button
              className={estado === "Activo" ? "" : "hidden"}
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
            </button>
          </div>
        );
      },
    },
  ];

  const permissions = user?.rol?.permissions || [];

  return (
    <>
      {permissions.includes("Mecánicos") ? (
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