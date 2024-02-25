import React, { useEffect, useCallback } from 'react';
import { useVentasServicios } from '../../context/VentasServicioContex';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Link } from 'react-router-dom';
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import Detalle from "../../components/Detalle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faLock, faUser, faPen, faDownload, faPencil, faBan, faCalendarDay, faInfoCircle, faDollarSign, faCheck, faHandshake } from "@fortawesome/free-solid-svg-icons";
import { Tabla, Titulo } from "../../components/Tabla";


function formatCurrency(value) {
  // Agrega el signo de peso
  const formattedValue = `$${value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  return formattedValue;
}

export default function PageVentaServicios() {
  const { ventasServicios, getVentasServicios, deleteVentaServicio, updateVentaServicio } = useVentasServicios()

  useEffect(() => {
    try {
      getVentasServicios();
    } catch (error) {
      console.error("Error al obtener las ventas:", error);
    }
  }, []);

  const mostrarAlerta = (id, estado) => {
    const title = estado === "En proceso" ? "Inhabilitar venta" : "Habilitar";
    const text = estado === "En proceso" ? "¿Estás seguro de inhabilitar la venta?" : "¿Estás seguro de habilitar la venta ?";
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
            title: "Se ha modificado el servicio",
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
            title: "No se ha modificado el servicio",
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
      'Precio de servicio': venta.precio_servicio,
      'Fecha de venta': new Date(venta.createdAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
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
            left: { style: 'thin', color: { rgb: '#000000' } },
            right: { style: 'thin', color: { rgb: '#000000' } },
            top: { style: 'thin', color: { rgb: '#000000' } },
            bottom: { style: 'thin', color: { rgb: '#000000' } },
          },
        };
      }
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'VentasServicios');
    XLSX.writeFile(wb, 'ventasServicios.xlsx');
  }, [ventasServicios]);

  const columns = [
    {
      field: "nombre_mecanico",
      headerName: "Mecánico",
      width: 160,
      headerClassName: 'custom-header',
      valueGetter: (params) => params.row.mecanico.nombre_mecanico,
    },
    {
      field: "nombre_cliente",
      headerName: "Cliente",
      width: 160,
      headerClassName: 'custom-header',
      valueGetter: (params) => params.row.cliente.nombre_cliente,
    },
    {
      field: "placa",
      headerName: "Placa",
      width: 90,
      headerClassName: 'custom-header',
      valueGetter: (params) => params.value.toUpperCase(),
    },
    {
      field: "precio_servicio",
      headerName: "Precio Servicio",
      width: 185,
      headerClassName: 'custom-header',
      valueFormatter: (params) => formatCurrency(params.value),
      align: "center" // Esto centra el contenido de la celda
    },

    {
      field: "createdAt",
      headerName: "Fecha Venta",
      width: 190,
      headerClassName: 'custom-header',
      renderCell: (params) => {
        const date = new Date(params.value);
        date.toLocaleString("en-US", { timeZone: "America/Bogota" });
        const formattedDate = date.toLocaleDateString("es-ES", {
          month: "long",
          day: "numeric",
        });

        return <div>{formattedDate}</div>;
      },
    },
    {
      field: "estado",
      headerName: "Estado",
      width: 105,
      headerClassName: 'custom-header',
    },

    {
      field: "acciones",
      headerName: "Acciones",
      width: 200,
      headerClassName: "custom-header",
      renderCell: (params) => {
        const estado = params.row.estado;
        console.log("estado", estado);



        return (

          <div>
            <button
              title='Finalizar venta'
              className={`px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-white-500 hover:text-white hover:bg-gray-500 ${estado !== "Finalizada" && estado !== "Inactivo" ? "" : "hidden"}`}
              onClick={() => mostrarAlertaCambiarEstado(params.row._id, estado)}
            >
              <FontAwesomeIcon icon={faCheck} />
            </button>




            <button
              title='Inactivar'
              className={`px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border ${estado === "En proceso" ? "border-red-500 hover:text-white hover:bg-red-500" : "border-indigo-500 hover:text-white hover:bg-indigo-500"} ${estado !== "Finalizada" ? "" : "hidden"}`}
              onClick={() => mostrarAlerta(params.row._id, estado)}
            >
              {estado === "En proceso" ? <FontAwesomeIcon icon={faBan} /> : <FontAwesomeIcon icon={faLock} />}
            </button>

            <button
              className={estado === "En proceso" || estado === "Finalizada" ? "" : "hidden"} title='Ver detalle'>
              <Detalle metodo={() => getVentasServicios(params.row._id)} id={params.row._id}>
                <table>
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
                      <Tabla>{formatCurrency(params.row.precio_servicio)}</Tabla>
                    </tr>
                    <tr>
                      <Tabla>
                        <FontAwesomeIcon icon={faCalendarDay} className="mr-2" />
                        Fecha Venta
                      </Tabla>
                      <Tabla>
                        {new Date(params.row.createdAt).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
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

  return (
    <div className="mt-16 ">
      <div className="flex justify-between">
        <h1 className="text-2xl text-start ml-16"><FontAwesomeIcon icon={faHandshake} className="mr-2" />Gestión de ventas servicios</h1>
        <div className="mx-16 justify-end flex">
          <Link to="/add-venta-servicio">
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
          rows={ventasServicios}
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
            '& .MuiDataGrid-cell': {
              fontSize: '15px', // Cambia el tamaño de fuente aquí
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
