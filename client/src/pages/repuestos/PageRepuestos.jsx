import React, { useEffect } from 'react'
import { useRepuestos } from '../../context/RepuestosContext'
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Link } from 'react-router-dom';
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faIdCard, faUsers, faUser, faPhone, faPlus, faPencil , faBan,  faCheck, faInfoCircle, faAddressCard, faBuilding, faTools} from "@fortawesome/free-solid-svg-icons";



export default function PageRepuestos() {
  const { repuestos, getRepuestos, deleteRepuesto, updateRepuesto } = useRepuestos()

  useEffect(() => {
    try {
      getRepuestos();

    } catch (error) {
      console.error("Error al obtener los repuestos:", error);
    }
  }, []);
  const mostrarAlerta = (id, estado) => {
    const title = estado === "Activo" ? "Inhabilitar" : "Habilitar";
    const text = estado === "Activo" ? "¿Estás seguro de inhabilitar la venta ?" : "¿Estás seguro de habilitar la venta ?";
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
      } else {
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
      }
    }
    );

  };

  const cambiarEstado = (id, estado) => {
    const nuevoEstado = estado === "Activo" ? "Inactivo" : "Activo";
    updateRepuesto(id, { estado: nuevoEstado }).then(() => {
      getRepuestos();
    });
  };



  const columns = [
    {
      field: "nombre_repuesto",
      headerName: "Repuesto",
      width: 160,
      editable: true,
      headerClassName: 'custom-header',

    },
    {
      field: "marca",
      headerName: "Marca",
      width: 170,
      editable: true,
      headerClassName: 'custom-header',
      valueGetter: (params) => params.row.marca.nombre_marca,
    },
    {
      field: "cantidad",
      headerName: "Cantidad",
      width: 185,
      editable: true,
      headerClassName: 'custom-header',
    },
    {
      field: "precio",
      headerName: "Precio",
      width: 170,
      editable: true,
      headerClassName: 'custom-header',
    },
    {
      field: "estado",
      headerName: "Estado",
      width: 170,
      headerClassName: 'custom-header',

    },
    {
      field: "createdAt",
      headerName: "Fecha Creacion",
      width: 300,
      editable: true,
      headerClassName: 'custom-header',
      renderCell: (params) => {
        const date = new Date(params.value);
        const formattedDate = date.toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        return <div>{formattedDate}</div>;
      },
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 200,
      headerClassName: 'custom-header',
      renderCell: (params) => {
        const estado = params.row.estado;
        return (
          <div>
            <button
              className={estado === "Activo" ? "px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500" : "hidden"}
            >
              <Link to={`/repuestos/${params.row._id}`}>Editar</Link>
            </button>
            {/* <button
                  className="px-4 py-1 text-sm text-white font-semibold rounded-full border border-red-500 hover:text-white hover:bg-red-500"
                  onClick={() => {
                    deleteVentaServicio(params.row._id);
                  }}
                >
                  Eliminar
                </button> */}
            <button
              className={
                estado === "Activo"
                  ? "px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-red-500 hover:text-white hover:bg-red-500"
                  : "px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500"
              }
              onClick={() => mostrarAlerta(params.row._id, estado)}
            >
              {estado === "Activo" ? "Inhabilitar" : "Habilitar"}
            </button>
          </div>
        );
      },
    },
  ];


  return (
    <div className="mt-16 ">
      <div className="flex justify-between">
      <h1 className="text-2xl text-start ml-16"><FontAwesomeIcon icon={faTools} className="mr-2" />Gestión de Marcas</h1>
        <div className="mx-10 justify-end">
          <Link to="/add-repuesto">
            <button  className="px-4 py-2 mr-8 text-sm text-withe font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent" title="Agregar">
            <FontAwesomeIcon icon={faPlus} />
            </button>
          </Link>
        </div>
      </div>
      

{/* <div className="flex justify-between">
      <h1 className="text-2xl text-start ml-16"><FontAwesomeIcon icon={faBuilding} className="mr-2" />Gestión de Marcas</h1>
      <div className="mx-10 justify-end">
        <Link to="/add-marca">
        <button  className="px-4 py-2 mr-8 text-sm text-withe font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent" title="Agregar">
        <FontAwesomeIcon icon={faPlus} />
          </button>
        </Link>
      </div>
      </div> */}

      <Box sx={{ width: "100%" }}>
        <DataGrid
          className="bg-slate-700 shadow-lg shadow-blue-600/40 mx-16 my-4"
          rows={repuestos}
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
              fontSize: '18px', // Cambia el tamaño de fuente aquí
            },
          }}
          slots={{ toolbar: GridToolbar }}
        />
      </Box>
    </div>
  );
}
