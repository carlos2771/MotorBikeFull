import React, { useEffect, useCallback  } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { useUsuario } from "../../context/usuariosContext";
import { Link, Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMotorcycle, faDownload, faPlus, faPencil , faBan,  faCheck, faUser, faInfoCircle, faAddressCard} from "@fortawesome/free-solid-svg-icons";
import Detalle from "../../components/Detalle";
import {Tabla, Titulo} from "../../components/Tabla";
import { useAuth } from "../../hooks/useAuth";

export default function PageUsuarios() {
  const { user: users , getUsuarios, updateUsuario} = useUsuario()
  
  console.log(users, "Hola mundo")
  const { user } = useAuth();
  console.log(user, "Putito")
  
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
      }else {
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
    }}
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
      width: 300,
      headerClassName: "font-custom text-lg"

    },
    {
      field: "estado",
      headerName: "Estado",
      width: 200,
      headerClassName: "font-custom text-lg",
      valueGetter: (params) => {
        const estado = params.row.estado;
    
        // Verifica si hay un rol asignado
        if (estado ) {
          return estado;
        } else {
          return ""; // Si no hay un rol asignado, devuelve una cadena vacía
        }
      },

    },
    {
      field: "name",
      headerName: "Rol",
      width: 200,
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
      width: 200,
      headerClassName: "font-custom text-lg",
      renderCell: (params) => {
        const estado = params.row.estado;
        const rol = params.row.rol?.name;
        const isAdmin = rol === "administrador";

        return (
          <div>
            {(() => {
                    const roleName = rol.toLowerCase();
                    return (
                      <>
                        {!isAdmin && (
                          <Link
                            to={`/usuarios/${params.row._id}`}
                            className={estado === "Activo" ? "" : "hidden"}
                            title="Editar"
                          >
                            <button className="px-4 py-1.5 m-1 text-sm text-white font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500">
                              <FontAwesomeIcon icon={faPencil} />
                            </button>
                          </Link>
                        )}
                        
                      </>
                    );
                  })()}
             {/* <button className={estado === "Activo" ? "" : "hidden"} title="Editar">
              <Link
                className="px-4 py-1.5 m-1 text-sm text-white font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500"
                to={`/usuarios/${params.row._id}`}
              >
                <FontAwesomeIcon icon={faPencil} />
              </Link>
            </button> */}
            <button
              title="Activar/Inactivar"
              className={
                estado === "Activo"
                  ? "px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-red-500 hover:text-white hover:bg-red-500"
                  : "px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500"
              }
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
                      confirmButton:
                        "px-5 py-1 m-1 text-lg text-white font-semibold rounded-full border-2 border-indigo-500 hover:text-white hover:bg-indigo-500",
                    },
                  });
                }
              }}
            >
              {estado === "Activo" ? (
                <FontAwesomeIcon icon={faBan} />
              ) : (
                <FontAwesomeIcon icon={faCheck} />
              )}
            </button>
            <button title="Ver detalle">
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
                        <FontAwesomeIcon icon={faAddressCard} className="mr-2" />
                        Nombre de Usuario
                      </Tabla>
                      <Tabla>
                        {users.find((user) => user._id === params.row._id)
                          ?.username}
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla>
                        <FontAwesomeIcon icon={faAddressCard} className="mr-2" />
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
                        Estado
                      </Tabla>
                      <Tabla>
                        {users.find((user) => user._id === params.row._id)
                          ?.estado}
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
            </button>
          </div>
        );
      },
    },
  ];


  const permissions = user?.rol?.permissions || [];

  return (
    <>
            {permissions.includes("Usuarios") ? (
    <div className="mt-16">
      <div className="flex flex-col sm:flex-row justify-between items-center mx-16">
      <h1 className="text-2xl text-start sm:text-center ml-4 sm:ml-0 mb-4 sm:mb-0"><FontAwesomeIcon icon={faUser} className="mr-2" />Gestión de usuarios</h1>
      <div className="mx-4 sm:mx-0 justify-end flex">
        <Link to="/add-usuario">
        <button  className="px-4 py-2 text-sm text-withe font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent" title="Agregar">
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
  ) : (
    <Navigate to='/tasks' />
)}
</>
  )
}
