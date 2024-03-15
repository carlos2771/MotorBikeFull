import React, { useEffect, useCallback, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { useUsuario } from "../../context/usuariosContext";
import { Link, Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMotorcycle, faDownload, faPlus, faPencil, faBan, faCheck, faUser, faInfoCircle, faAddressCard, faEnvelope, faChevronRight, faChevronLeft} from "@fortawesome/free-solid-svg-icons";
import Detalle from "../../components/Detalle";
import { Tabla, Titulo } from "../../components/Tabla";
import { useAuth } from "../../hooks/useAuth";

export default function PageUsuarios() {
  const { user: users, getUsuarios, updateUsuario, getUsuario } = useUsuario()
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;


  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  useEffect(() => {
    try {
      getUsuarios();
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  }, []);

  const mostrarAlerta = (id, estado) => {
    const title = estado === "Activo" ? "Inhabilitar" : "Habilitar";
    const text = estado === "Activo" ? "¿Estás seguro de inhabilitar el usuario?" : "¿Estás seguro de habilitar el usuario?";
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
    updateUsuario(id, { estado: nuevoEstado }).then(() => {
      getUsuarios();
    });
  };


  const columns = [
    {
      field: "username",
      headerName: "Nombre Usuario",
      minWidth: 200,
      headerClassName: "font-custom text-lg",
      flex: 1
    },
    {
      field: "estado",
      headerName: "Estado",
      minWidth: 150,
      flex: 1,
      headerClassName: "font-custom text-lg",
      valueGetter: (params) => {
        const estado = params.row.estado;

        // Verifica si hay un rol asignado
        if (estado) {
          return estado;
        } else {
          return ""; // Si no hay un rol asignado, devuelve una cadena vacía
        }
      },

    },
    {
      field: "name",
      headerName: "Rol",
      minWidth: 150,
      flex: 1,
      headerClassName: "font-custom text-lg",
      valueGetter: (params) => params.row.rol.name,

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
      minWidth: 200,
      flex: 1,
      headerClassName: "font-custom text-lg",
      renderCell: (params) => {
        const estado = params.row.estado;
        const rol = params.row.rol?.name;
        const isAdmin = rol === "administrador";

        return (
          <div className="flex">
            {!isAdmin && estado === "Activo" && (
              <Link
                to={`/usuarios/${params.row._id}`}
                title="Editar"
              >
                <button className="m-1">
                  <FontAwesomeIcon icon={faPencil} className="border border-indigo-500 w-10 p-2 rounded-full hover:text-white hover:bg-indigo-500"/>
                </button>
              </Link>
            )}
            {!isAdmin && (
              <button
                title="Activar/Inactivar"
                onClick={() => {
                  if (!isAdmin) {
                    mostrarAlerta(params.row._id, estado);
                  } else {
                    Swal.fire({
                      icon: "error",
                      title: "No se puede desactivar",
                      text: "Este usuario es un administrador y no se puede desactivar.",
                      background: "linear-gradient(to right, #0f172a, #082f49, #0f172a)",
                      color: "white",
                      buttonsStyling: false,
                      customClass: {
                        confirmButton: "px-5 py-1 m-1 text-lg text-white font-semibold rounded-full border-2 border-indigo-500 hover:text-white hover:bg-indigo-500"
                      },
                    });
                  }
                }}
              >
                {estado === "Activo" ? (
                  <FontAwesomeIcon icon={faBan} className={`border border-red-500 rounded-full p-2 w-10 text-white ${estado === "Activo" ? "border-red-500 hover:bg-red-500" : "border-indigo-500 hover:bg-indigo-500"}`}/>
                ) : (
                  <FontAwesomeIcon icon={faCheck} className={`border border-indigo-500 rounded-full p-2 w-10 text-white ${estado === "Activo" ? "border-red-500 hover:bg-red-500" : "border-indigo-500 hover:bg-indigo-500"}`}/>
                )}
              </button>
            )}
            <div title="Ver detalle" className="m-1">
              <Detalle
                metodo={() => getUsuarios(params.row._id)}
                id={params.row._id}
              >
                <table className="min-w-full">
                  <tbody className="">
                    <Titulo>
                      <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                      Detalles del Usuario
                    </Titulo>
                    <tr>
                      <Tabla>
                        <FontAwesomeIcon icon={faUser} className="mr-2" />
                        Nombre de Usuario
                      </Tabla>
                      <Tabla>
                        {users.find((user) => user._id === params.row._id)
                          ?.username}
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla>
                        <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                        Correo Electrónico
                      </Tabla>
                      <Tabla>
                        {users.find((user) => user._id === params.row._id)
                          ?.email}
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla>
                        <FontAwesomeIcon icon={faAddressCard} className="mr-2" />
                        Rol
                      </Tabla>
                      <Tabla>
                        {users.find((user) => user.rol.name === params.row.rol.name)
                          ?.rol.name}
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla>
                        <FontAwesomeIcon icon={faAddressCard} className="mr-2" />
                        Fecha de creación
                      </Tabla>
                      <Tabla>
                        {users.find((user) => user._id === params.row._id)?.createdAt
                          ? new Date(
                            users.find((user) => user._id === params.row._id)
                              ?.createdAt
                          ).toLocaleDateString()
                          : ""}
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

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.rol.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const permissions = user?.rol?.permissions || [];

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredUsers.length);
  const usersToShow = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };
  return (
    <>
      {permissions.includes("Usuarios") ? (
        <>
          {!isMobile ? (
            <div className="mt-16">
              <div className="flex flex-col sm:flex-row justify-between items-center mx-16">
                <h1 className="text-2xl text-start sm:text-center ml-4 sm:ml-0 mb-4 sm:mb-0">
                  <FontAwesomeIcon icon={faUser} className="mr-2" />Gestión de usuarios
                </h1>
                <div className="mx-4 sm:mx-0 justify-end flex">
                  <Link to="/add-usuario">
                    <button className="px-4 py-2 text-sm text-withe font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent" title="Agregar">
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </Link>
                </div>
              </div>
              <Box sx={{ width: "100%" }}>
                <DataGrid
                  className="bg-slate-700 shadow-lg shadow-blue-600/40 mx-16 my-4"
                  rows={users || []}
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
                    background: "linear-gradient(to right, #0f172a, #082f49, #0f172a)",
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
                    }
                  }}
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
            </div>) : (
            <>
            <div className="mt-16">
              <h1 className="text-2xl text-start sm:text-center ml-4 sm:ml-0 mb-4 sm:mb-0">
                <FontAwesomeIcon icon={faUser} className="mr-2" />Gestión de usuarios
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
                <Link to="/add-usuario">
                  <FontAwesomeIcon icon={faPlus} className="px-4 py-2 text-sm text-withe font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent" />
                </Link>
              </div>
            </div>
          
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-4 md:mx-16">
              {usersToShow.map((user) => {
                const isAdmin = user.rol.name === "administrador";
          
                return (
                  <div
                    key={user._id}
                    className={`col ${user.estado === "Activo" ? "shadow-blue-600" : "shadow-red-500"} rounded-lg p-4 shadow-md bg-slate-700`}
                  >
                    <h2 className="text-lg font-bold mb-2">{user.username}</h2>
                    <p>Correo Electrónico: {user.email}</p>
                    <p>Rol: {user.rol.name}</p>
                    <div className="flex justify-center mt-4">
                      {!isAdmin && (
                        <Link
                          to={`/usuarios/${user._id}`}
                          className={`${user.estado === "Activo" ? "mr-2" : "hidden"} text-white`}
                          title="Editar"
                        >
                          <FontAwesomeIcon icon={faPencil} className="border border-indigo-500 w-10 p-2 rounded-full" />
                        </Link>
                      )}
                      {!isAdmin && (
                        <button
                          title="Activar/Inactivar"
                          className={``}
                          onClick={() => mostrarAlerta(user._id, user.estado)}
                        >
                          {user.estado === "Activo" ? (
                            <FontAwesomeIcon icon={faBan} className="border border-red-500 rounded-full p-2 w-10 text-white" />
                          ) : (
                            <FontAwesomeIcon icon={faCheck} className="border border-indigo-500 rounded-full p-2 w-10 text-white" />
                          )}
                        </button>
                      )}
                      <div title="Ver detalle" className="ml-2" >
                        <Detalle
                          metodo={() => getUsuario(user._id)}
                          id={user._id}
                        >
                          <table className="min-w-full">
                            <tbody className="">
                              <Titulo>
                                  <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                                  Detalles del Usuario
                              </Titulo>
                              <tr>
                                <Tabla>
                                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                                  Nombre de Usuario
                                </Tabla>
                                <Tabla>
                                  {user.username}
                                </Tabla>
                              </tr>
                              <tr>
                                <Tabla>
                                  <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                                  Correo Electrónico
                                </Tabla>
                                <Tabla>
                                  {user.email}
                                </Tabla>
                              </tr>
                              <tr>
                                <Tabla>
                                  <FontAwesomeIcon icon={faAddressCard} className="mr-2" />
                                  Rol
                                </Tabla>
                                <Tabla>
                                  {user.rol.name}
                                </Tabla>
                              </tr>
                              <tr>
                                <Tabla>
                                  <FontAwesomeIcon icon={faAddressCard} className="mr-2" />
                                  Fecha de creación
                                </Tabla>
                                <Tabla>
                                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""}
                                </Tabla>
                              </tr>
                            </tbody>
                          </table>
                        </Detalle>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          
            <div className="flex items-center justify-center mt-4 mx-auto">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm shadow-sky-100 -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  className={`relative inline-flex items-center px-4 py-2 rounded-l-lg text-white ${page === 1 ? "cursor-not-allowed opacity-50 bg-slate-800 text-white" : "bg-blue-500"}`}
                  disabled={page === 1}
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 ${index + 1 === page ? "z-10 font-bold bg-blue-600" : "text-gray-500"}`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  className={`relative inline-flex items-center px-4 py-2 rounded-r-lg shadow   ${page === totalPages ? "cursor-not-allowed opacity-50 bg-slate-800" : "bg-blue-500"}`}
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