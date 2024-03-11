import React, { useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Link, Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMotorcycle,
  faDownload,
  faPlus,
  faPencil,
  faBan,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

import { useMarcas } from "../../context/MarcasContext";
import { useAuth } from "../../hooks/useAuth";

export default function PageMarcas() {
  const { marcas, getMarcas, updateMarca } = useMarcas();
  const { user } = useAuth();

  useEffect(() => {
    getMarcas();
  }, []);

  const mostrarAlerta = (id, nombreMarca, estado) => {
    const title = estado === "Activo" ? "Inhabilitar" : "Habilitar";
    const text = estado === "Activo" ? `¿Estás seguro de inhabilitar la marca ${nombreMarca}?` : `¿Estás seguro de habilitar la marca ${nombreMarca}?`;

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
      }else{
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
        });Toast.fire({
          icon: "error",
          title: "No se ha Inhabilitado",
        });
      }
    });
  };

  const cambiarEstado = (id, estado) => {
    const nuevoEstado = estado === "Activo" ? "Inactivo" : "Activo";
  
    updateMarca(id, { estado: nuevoEstado })
      .then((marca) => {
        if (!marca) {
          // Si la marca no se encuentra, muestra un mensaje de error
          throw new Error("La marca no se puede inhabilitar, por que esta asociada a un repuesto");
        }
        // Muestra un mensaje de éxito según el estado de la marca
        const successMessage = `La marca se ha ${nuevoEstado === "Activo" ? "habilitado" : "inhabilitado"} correctamente`;
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
        });Toast.fire({
          icon: "success",
          title: successMessage,
        });
        // Actualiza la lista de marcas
        getMarcas();
      })
      .catch((error) => {
       
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
        });Toast.fire({
          icon: "error",
          title: error.message || "Hubo un error al cambiar el estado de la marca",
        });
      });
  };
  

  const exportarAExcel = () => {
    const datos = marcas.map((marca) => ({
      "Nombre de Marca": marca.nombre_marca,
      Estado: marca.estado,
      "Fecha Creacion": marca.createdAt,
    }));

    const ws = XLSX.utils.json_to_sheet(datos);

    ws["!cols"] = [
      { wch: 25 },
      { wch: 20 },
      { wch: 30 },
    ];
    ws["!rows"] = [{ hpx: 20, outlineLevel: 0, hidden: false }];

    for (let i = 0; i < 3; i++) {
      const col = String.fromCharCode(65 + i);
      ws[`${col}1`].s = {
        font: { bold: true },
        fill: { patternType: "solid", fgColor: { rgb: "#66FFCC" } },
      };
    }

    for (let i = 2; i <= marcas.length + 1; i++) {
      for (let j = 0; j < 3; j++) {
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
    XLSX.utils.book_append_sheet(wb, ws, "Marcas");
    XLSX.writeFile(wb, "marcas.xlsx");
  };

  const columns = [
    {
      field: "nombre_marca",
      headerName: "Nombre  Marca",
      width: 450,
      headerClassName: "font-custom text-lg",
    },
    {
      field: "estado",
      headerName: "Estado",
      width: 200,
      headerClassName: "font-custom text-lg"
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 200,
      headerClassName: "font-custom text-lg",
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
                to={`/marca/${params.row._id}`}
              >
                <FontAwesomeIcon icon={faPencil} />
              </Link>
            </button>
            <button title={estado === "Activo" ? "Inhabilitar" : "Habilitar"}
              className={`px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border ${estado === "Activo" ? "border-red-500 hover:bg-red-500" : "border-indigo-500 hover:bg-indigo-500"}`}
              onClick={() => mostrarAlerta(params.row._id, params.row.nombre_marca, estado)}
            >
              {estado === "Activo" ? (
                <FontAwesomeIcon icon={faBan} />
              ) : (
                <FontAwesomeIcon icon={faCheck} />
              )}
            </button>
          </div>
        );
      },
    },
  ];

  const permissions = user?.rol?.permissions || [];

  return (
    <>
      {permissions.includes("Marcas") ? (
        <div className="mt-16">
          <div className="flex flex-col sm:flex-row justify-between items-center mx-16">
            <h1 className="text-2xl text-start sm:text-center ml-4 sm:ml-0 mb-4 sm:mb-0">
              <FontAwesomeIcon icon={faMotorcycle} className="mr-2" />
              Gestión de marcas
            </h1>
            <div className="mx-4 sm:mx-0 justify-end flex">
              <div className="flex">
                <Link to="/add-marca">
                  <button
                    className="px-4 py-2 text-sm text-white font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent"
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
          </div>

          <Box sx={{ width: "100%" }}>
            <DataGrid
              className="bg-slate-700 shadow-lg shadow-blue-600/40 mx-16 my-4"
              rows={marcas}
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