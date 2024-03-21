import React, { useEffect, useCallback, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { useClientes } from "../../context/ClientContext";
import { Link, Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import Detalle from "../../components/Detalle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faIdCard,
  faUsers,
  faUser,
  faPhone,
  faPlus,
  faPencil,
  faBan,
  faMars,
  faCheck,
  faInfoCircle,
  faAddressCard,
  faCircleInfo,
  faDownload,
  faChevronRight, faChevronLeft
} from "@fortawesome/free-solid-svg-icons";
import { Tabla, Titulo } from "../../components/Tabla";
import * as XLSX from "xlsx";

import { useAuth } from "../../hooks/useAuth";

export default function PageClientes() {
  const { clientes, getClientes, deleteCliente, updateCliente, getCliente } =
    useClientes();
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
      getClientes();
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  }, []);

  // useEffect(() => {
  //   try {
  //     getCliente(id);
  //   } catch (error) {
  //     console.error("Error al obtener clientes:", error);
  //   }
  // }, []);

  const mostrarAlerta = (id, estado) => {
    const titulo = estado === "Activo" ? "Inhabilitar" : "Habilitar";
    const text =
      estado === "Activo"
        ? "¿Estás seguro de inhabilitar el cliente?"
        : "¿Estás seguro de habilitar el cliente?";
    const texto = estado === "Activo" ? "Inhabilitado" : "Habilitado";

    //"px-4 py-1.5 m-1 text-sm text-white font-semibold rounded-full border border-green-500 hover:text-white hover:bg-green-500 ",

    Swal.fire({
      title: titulo,
      text: text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si",
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
    updateCliente(id, { estado: nuevoEstado }).then(() => {
      getClientes();
    });
  };

  const exportarAExcel = useCallback(() => {
    const datos = clientes.map((cliente) => ({
      Tipo: cliente.tipo,
      Cedula: cliente.cedula,
      Nombre: cliente.nombre_cliente,
      Genero: cliente.sexo,
      Email: cliente.email_cliente,
      Telefono: cliente.telefono_cliente,
      Estado: cliente.estado,
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
    for (let i = 2; i <= clientes.length + 1; i++) {
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
    XLSX.utils.book_append_sheet(wb, ws, "Clientes");
    XLSX.writeFile(wb, "clientes.xlsx");
  }, [clientes]);

  const columns = [
    // {
    //   field: "tipo",
    //   headerName: "Tipo Documento",
    //   minwidth: 200,
    //   flex:1,
    //   headerClassName: "font-custom text-lg",
    // },
    {
      field: "cedula",
      headerName: "Documento",
      minwidth: 180,
      flex:1,
      headerClassName: "font-custom text-lg",
    },
    {
      field: "nombre_cliente",
      headerName: "Nombre Completo",
      minwidth: 200,
      flex:1,
      headerClassName: "font-custom text-lg",
    },
    // {
    //   field: "sexo",
    //   headerName: "Sexo",
    //   width: 190,
    // },
    // {
    //   field: "email_cliente",
    //   headerName: "Email",
    //   width: 290,
    // },
    {
      field: "telefono_cliente",
      headerName: "Teléfono",
      width: 150,
      flex:1,
      headerClassName: "font-custom text-lg",
    },
    {
      field: "estado",
      headerName: "Estado",
      width: 120,
      flex:1,
      headerClassName: "font-custom text-lg",
    },
    // {
    //   field: "createdAt",
    //   headerName: "Fecha Creacion",
    //   width: 240,

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
        return (
          <div className="flex">
            <div className={estado === "Activo" ? "mt-1" : "hidden"}>
              <Link
                title="Editar"
                to={`/cliente/${params.row._id}`}
              >
                <button className="m-1">
                <FontAwesomeIcon icon={faPencil}  className="border border-indigo-500 w-10 p-2 rounded-full hover:text-white hover:bg-indigo-500"/>
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
              className={
                estado === "Activo"
                  ? "mt-1"
                  : ""
              }
              onClick={() => mostrarAlerta(params.row._id, estado)}
              title="Activar/Inactivar"
            >
              {estado === "Activo" ? (
                <FontAwesomeIcon icon={faBan} className={`border border-red-500 rounded-full p-2 w-10 text-white ${estado === "Activo" ? "border-red-500 hover:bg-red-500" : "border-indigo-500 hover:bg-indigo-500"}`}/>
              ) : (
                <FontAwesomeIcon icon={faCheck} className={`border border-indigo-500 rounded-full p-2 w-10 text-white ${estado === "Activo" ? "border-red-500 hover:bg-red-500" : "border-indigo-500 hover:bg-indigo-500"}`}/>
              )}
            </button>
            <div
              className={estado === "Activo" ? "ml-1 mt-2" : "hidden"}
              title="Ver detalle"
            >
              <Detalle
                metodo={() => getCliente(params.row._id)}
                id={params.row._id}
              >
                <table className="min-w-full">
                  <tbody>
                    <Titulo>
                      <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                      Detalles del Cliente
                    </Titulo>
                    <tr>
                      <Tabla>
                        <FontAwesomeIcon
                          icon={faAddressCard}
                          className="mr-2"
                        />
                        Tipo Documento
                      </Tabla>
                      <Tabla>
                        {
                          clientes.find(
                            (cliente) => cliente._id === params.row._id
                          )?.tipo
                        }
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla>
                        <FontAwesomeIcon
                          icon={faAddressCard}
                          className="mr-2"
                        />
                        Documento
                      </Tabla>
                      <Tabla>
                        {
                          clientes.find(
                            (cliente) => cliente._id === params.row._id
                          )?.cedula
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
                          clientes.find(
                            (cliente) => cliente._id === params.row._id
                          )?.nombre_cliente
                        }
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla>
                        <FontAwesomeIcon icon={faMars} className="mr-2" />
                        Sexo
                      </Tabla>
                      <Tabla>
                        {
                          clientes.find(
                            (cliente) => cliente._id === params.row._id
                          )?.sexo
                        }
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla>
                        <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                        Correo Electrónico
                      </Tabla>
                      <Tabla>
                        {
                          clientes.find(
                            (cliente) => cliente._id === params.row._id
                          )?.email_cliente
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
                          clientes.find(
                            (cliente) => cliente._id === params.row._id
                          )?.telefono_cliente
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

  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.nombre_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.telefono_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.sexo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const permissions = user?.rol?.permissions || [];

  const totalPages = Math.ceil(filteredClientes.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredClientes.length);
  const clienteToShow = filteredClientes.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  return (
    <>
      {permissions.includes("Clientes") ? (
        <>
          {!isMobile ? (
            <div className="mt-16">
              <div className="flex flex-col sm:flex-row justify-between items-center mx-16">
                <h1 className="text-2xl text-start sm:text-center ml-4 sm:ml-0 mb-4 sm:mb-0">
                  <FontAwesomeIcon icon={faUsers} className="mr-2" />
                  Gestión de clientes
                </h1>
                <div className="mx-4 sm:mx-0 justify-end flex">
                  <Link to="/add-cliente">
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
                  rows={clientes}
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
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  Gestión de clientes
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
                  <Link to="/add-cliente">
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
              {clienteToShow.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                <p className="text-center text-red-500">No se encontraron resultados</p>
              </div>
              ) : (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mx-4 md:mx-16">
                {clienteToShow.map((cliente) => (
                  <div
                    key={cliente._id}
                    className={`col ${
                      cliente.estado === "Activo"
                        ? "shadow-blue-600"
                        : "shadow-red-500"
                    } rounded-lg p-4 shadow-md bg-slate-700`}
                  >
                    <h2 className="text-lg font-bold mb-2">
                      {cliente.nombre_cliente}
                    </h2>
                    <p>Correo Electrónico: {cliente.email_cliente}</p>
                    <p>Teléfono: {cliente.telefono_cliente}</p>
                    <div className="flex justify-center mt-4">
                    
                        <Link
                          className={`${cliente.estado === "Activo" ? "mr-2" : "hidden"} text-white`}
                          title="Editar"
                          to={`/cliente/${cliente._id}`}
                        >
                          <FontAwesomeIcon icon={faPencil}  className="border border-indigo-500 w-10 p-2 rounded-full"/>
                        </Link>
                      
                      <button
                        className={``}
                        onClick={() =>
                          mostrarAlerta(cliente._id, cliente.estado)
                        }
                        title="Activar/Inactivar"
                      >
                        {cliente.estado === "Activo" ? (
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
                          metodo={() => getCliente(cliente._id)}
                          id={cliente._id}
                        >
                          <table className="min-w-full">
                            <tbody className="">
                              <Titulo>
                                <FontAwesomeIcon
                                  icon={faInfoCircle}
                                  className="mr-2"
                                />
                                Detalles del Cliente
                              </Titulo>
                              <tr>
                                <Tabla>
                                  <FontAwesomeIcon
                                    icon={faAddressCard}
                                    className="mr-2"
                                  />
                                  Tipo Documento
                                </Tabla>
                                <Tabla>{cliente.tipo}</Tabla>
                              </tr>
                              <tr>
                                <Tabla>
                                  <FontAwesomeIcon
                                    icon={faAddressCard}
                                    className="mr-2"
                                  />
                                  Documento
                                </Tabla>
                                <Tabla>
                                {cliente.cedula}
                                </Tabla>
                              </tr>
                              <tr>
                                <Tabla>
                                  <FontAwesomeIcon
                                    icon={faUser}
                                    className="mr-2"
                                  />
                                  Nombre Completo
                                </Tabla>
                                <Tabla>
                                {cliente.nombre_cliente}
                                </Tabla>
                              </tr>
                              <tr>
                                <Tabla>
                                  <FontAwesomeIcon
                                    icon={faMars}
                                    className="mr-2"
                                  />
                                  Sexo
                                </Tabla>
                                <Tabla>
                                {cliente.sexo}
                                </Tabla>
                              </tr>
                              <tr>
                                <Tabla>
                                  <FontAwesomeIcon
                                    icon={faEnvelope}
                                    className="mr-2"
                                  />
                                  Correo Electrónico
                                </Tabla>
                                <Tabla>
                                  {cliente.email_cliente}
                                </Tabla>
                              </tr>
                              <tr>
                                <Tabla>
                                  <FontAwesomeIcon
                                    icon={faPhone}
                                    className="mr-2"
                                  />
                                  Teléfono
                                </Tabla>
                                <Tabla>
                                {cliente.telefono_cliente}
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
