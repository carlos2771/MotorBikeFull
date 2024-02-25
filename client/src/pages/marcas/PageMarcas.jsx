import React, { useEffect, useCallback } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { useMarcas } from "../../context/MarcasContext";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMotorcycle, faDownload, faPlus, faPencil, faBan, faCheck } from "@fortawesome/free-solid-svg-icons";

export default function PageMarcas() {
  const { marcas, getMarcas, deleteMarca, updateMarca } = useMarcas();


  useEffect(() => {
    try {
      getMarcas();
    } catch (error) {
      console.error("Error al obtener marcas:", error);
    }
  }, []);

  const mostrarAlerta = (id, estado) => {
    const title = estado === "Activo" ? "Inhabilitar" : "Habilitar";
    const text = estado === "Activo" ? "¿Estás seguro de inhabilitar la marca?" : "¿Estás seguro de habilitar la marca?";
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
        confirmButton: "px-5 py-1 m-1 text-lg text-white font-semibold rounded-full border-2 border-indigo-500 hover:text-white hover:bg-indigo-500",
        cancelButton: "px-4 py-1 m-1 text-lg text-white font-semibold rounded-full border-2 border-red-500 hover:text-white hover:bg-red-500"
      }
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
          }
        });
        Toast.fire({
          icon: "success",
          title: "Se ha modificado"
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
          }
        });
        Toast.fire({
          icon: "error",
          title: "No se ha modificado"
        });
      }
    }
    );

  };

  const cambiarEstado = (id, estado) => {
    const nuevoEstado = estado === "Activo" ? "Inactivo" : "Activo";
    updateMarca(id, { estado: nuevoEstado }).then(() => {
      getMarcas();
    });
  };
  const exportarAExcel = useCallback(() => {
    const datos = marcas.map((marca) => ({
      "Nombre de Marca": marca.nombre_marca,
      Estado: marca.estado,
      "Fecha Creacion": marca.createdAt,
    }));

    const ws = XLSX.utils.json_to_sheet(datos);

    // Agregar formato a los títulos (encabezados) y establecer autoFilter
    ws["!cols"] = [
      { wch: 25 },
      { wch: 20 },
      { wch: 30 },
    ];
    ws["!rows"] = [{ hpx: 20, outlineLevel: 0, hidden: false }];

    // Establecer el formato de fondo y negrita para los títulos
    for (let i = 0; i < 3; i++) {
      const col = String.fromCharCode(65 + i); // Convertir número a letra (A, B, C, ...)
      ws[`${col}1`].s = {
        font: { bold: true },
        fill: { patternType: "solid", fgColor: { rgb: "#66FFCC" } },
      };
    }

    // Agregar formato a las celdas de datos y bordes
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
  }, [marcas]);

  const columns = [
    {
      field: "nombre_marca",
      headerName: "Nombre  Marca",
      width: 450,
      headerClassName: "font-custom text-lg"

    },
    {
      field: "estado",
      headerName: "Estado",
      width: 200,
      headerClassName: "font-custom text-lg"

    },
    // {
    //   field: "createdAt",
    //   headerName: "Fecha Creacion",
    //   width: 220,
    //   headerClassName: "font-custom text-lg",

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
      headerClassName: "font-custom text-lg",
      renderCell: (params) => {
        const estado = params.row.estado;
        console.log("estadin", estado);
        return (
          <div>
            <button className={estado === "Activo" ? "" : "hidden"} title="Editar">
              <Link
                className="px-4 py-1.5 m-1 text-sm text-white font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500"
                to={`/marca/${params.row._id}`}
              >
                <FontAwesomeIcon icon={faPencil} />
              </Link>
            </button>
            {/* <button
            className="px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-red-500 hover:text-white hover-bg-red-500"
            onClick={() => mostrarAlerta(params.row._id)}
          >
            Eliminar
          </button> */}
            <button title="Activar/Inactivar"
              className={
                estado === "Activo"
                  ? "px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-red-500 hover:text-white hover:bg-red-500"
                  : "px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500"
              }
              onClick={() => mostrarAlerta(params.row._id, estado)}
            >
              {estado === "Activo" ? <FontAwesomeIcon icon={faBan} /> : <FontAwesomeIcon icon={faCheck} />}
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="mt-16">
      <div className="flex justify-between">
        <h1 className="text-2xl text-start ml-16"><FontAwesomeIcon icon={faMotorcycle} className="mr-2" />Gestión de marcas</h1>
        <div className="mx-16 justify-end flex">
          <Link to="/add-marca">
            <button className="px-4 py-2 text-sm text-withe font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent" title="Agregar">
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
            color: "white",
            '& .MuiDataGrid-cell': {
              fontSize: '15px',
            },
          }}
          slots={{ toolbar: GridToolbar }}

          slotProps={{
            toolbar: {
                printOptions: { disableToolbarButton: true },
                csvOptions: { disableToolbarButton: true },
        }}}


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
            columnMenuManageColumns: "Manejar columnas"
        }}
        />
      </Box>
    </div>
  );
}
