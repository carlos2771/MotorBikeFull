import React, { useEffect, useCallback  } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { useUsuario } from "../../context/usuariosContext";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMotorcycle, faDownload, faPlus, faPencil , faBan,  faCheck } from "@fortawesome/free-solid-svg-icons";

export default function PageUsuarios() {
  const { user, getUsuarios, updateUsuario} = useUsuario()
  
  
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
      background: "#334155",
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
          timer: 3000,
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
        timer: 3000,
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
        console.log("estadin", estado);
        return (
          <div>
            <button className={estado === "Activo" ? "" : "hidden"} title="Editar">
              <Link
                className="px-4 py-1.5 m-1 text-sm text-white font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500"
                to={`/usuarios/${params.row._id}`}
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
      <h1 className="text-2xl text-start ml-16"><FontAwesomeIcon icon={faMotorcycle} className="mr-2" />Gestión de Usuarios</h1>
      <div className="mx-16 justify-end flex">
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
          rows={user || []}
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
        />
      </Box>
    </div>
  );
}
