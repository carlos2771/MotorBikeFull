import React, { useEffect } from "react";
import { useVentasRepuestos } from "../../context/VentasRepuestoContex";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Link, Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  faLock,
  faDollarSign,
  faPlus,
  faBan,
  faInfoCircle,
  faIdCard,
  faScrewdriverWrench,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tabla, Titulo } from "../../components/Tabla";
import Detalle from "../../components/Detalle";
import { useAuth } from "../../hooks/useAuth";

export default function PageVentaRepuestos() {
  const {
    ventasRepuestos,
    getVentasRepuestos,
    getVentaRepuesto,
    deleteVentaRepuesto,
    updateVentaRepuesto,
  } = useVentasRepuestos();

  const { user } = useAuth();

  useEffect(() => {
    try {
      getVentasRepuestos();
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  }, []);
  useEffect(() => {
    try {
      getVentaRepuesto(id);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  }, []);

  const mostrarAlerta = (id, anulado) => {
    const title = anulado ? "Anulado" : "Anular";
    const text = anulado
      ? "Esta venta ya ha sido anulada."
      : "¿Estás seguro de anular la venta?";
    const buttonText = anulado ? "Entendido" : "Sí";

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
      if (!anulado && result.isConfirmed) {
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
  };

  const cambiarEstado = (id, anulado) => {
    const nuevoEstado = anulado ? "Activo" : "Inactivo";
    updateVentaRepuesto(id, { estado: nuevoEstado }).then(() => {
      getVentasRepuestos();
    });
  };

  const columns = [
    {
      field: "repuestos",
      headerName: "Repuesto",
      width: 160,
      headerClassName: "custom-header",
      valueGetter: (params) => {
        const repuestos = params.row.repuestos;

        // Verifica si hay repuestos
        if (repuestos && repuestos.length > 0) {
          // Mapea los nombres de repuestos y únelos con una coma
          const nombresRepuestos = repuestos.map(
            (repuesto) => repuesto.repuesto.nombre_repuesto
          );
          return nombresRepuestos.join(", ");
        }
      },
    },
    {
      field: "cantidad_vender",
      headerName: "Cantidad Repuesto",
      width: 175,
      headerClassName: "custom-header",
      valueGetter: (params) => {
        const repuestos = params.row.repuestos;

        // Verifica si hay repuestos
        if (repuestos && repuestos.length > 0) {
          // Mapea las cantidades de repuestos y únelas con una coma
          const cantidadesRepuestos = repuestos.map(
            (repuesto) => repuesto.cantidad_vender
          );
          return cantidadesRepuestos.join("");
        }
      },
    },
    {
      field: "precio_total",
      headerName: "Precio Total",
      width: 170,
      headerClassName: "custom-header",
    },
    {
      field: "nombre_cliente",
      headerName: "Cliente",
      width: 170,
      headerClassName: "custom-header",
      valueGetter: (params) => params.row.cliente.nombre_cliente,
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
                metodo={() => getVentaRepuesto(params.row._id)}
                id={params.row._id}
              >
                <table>
                  <tbody>
                    <Titulo>
                      <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                      Detalles del Cliente
                    </Titulo>

                    <tr>
                      <Tabla>
                        <FontAwesomeIcon icon={faIdCard} className="mr-2" />
                        Nombre
                      </Tabla>
                      <Tabla>
                        {
                          ventasRepuestos.find(
                            (cliente) => cliente._id === params.row._id
                          )?.cliente.nombre_cliente
                        }
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla>
                        <FontAwesomeIcon
                          icon={faScrewdriverWrench}
                          className="mr-2"
                        />
                        Repuesto
                      </Tabla>
                      <Tabla>
                        {ventasRepuestos
                          .find((venta) => venta._id === params.row._id)
                          ?.repuestos.map((repuesto, index) => (
                            <span key={index}>
                              {repuesto.repuesto.nombre_repuesto}
                            </span>
                          ))}
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla>
                        <FontAwesomeIcon
                          icon={faScrewdriverWrench}
                          className="mr-2"
                        />
                        Cantidad Repuesto
                      </Tabla>
                      <Tabla>
                        {
                          ventasRepuestos.find(
                            (cantidad) => cantidad._id === params.row._id
                          )?.cantidad_repuesto
                        }
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla>
                        <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                        Precio Unitario
                      </Tabla>
                      <Tabla>
                        {
                          ventasRepuestos.find(
                            (precio) => precio._id === params.row._id
                          )?.precio_unitario
                        }
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla>
                        <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                        Precio Total
                      </Tabla>
                      <Tabla>
                        {
                          ventasRepuestos.find(
                            (precio) => precio._id === params.row._id
                          )?.precio_total
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
      {permissions.includes("Venta Repuesto") ? (
        <div className="mt-16">
          <h1 className="text-2xl text-start ml-20">
            Gestionar ventas repuestos
          </h1>
          <div className="mx-10 justify-end flex">
            <Link to="/add-venta-repuesto">
              <button className="px-4 py-2 mr-8 text-sm text-withe font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent">
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </Link>
          </div>
          <Box sx={{ width: "100%" }}>
            <DataGrid
              className="bg-slate-700 shadow-lg shadow-blue-600/40 mx-16 my-4"
              rows={ventasRepuestos}
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
                  fontSize: "18px", // Cambia el tamaño de fuente aquí
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
