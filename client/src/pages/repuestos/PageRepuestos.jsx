import React, { useEffect } from 'react'
import { useRepuestos } from '../../context/RepuestosContext'
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Link } from 'react-router-dom';
import Swal from "sweetalert2";


// NUEVAS IMPORTS AGREGADAS
import Detalle from "../../components/Detalle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faIdCard, faUser, faPhone, faPen, faPencil , faBan,  faCheck, faInfoCircle, faAddressCard, faRegistered, faDollarSign, faHashtag} from "@fortawesome/free-solid-svg-icons";
import {Tabla, Titulo} from "../../components/Tabla";

function formatCurrency(value) {
  // Agrega el signo de peso
  const formattedValue = `$${value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  return formattedValue;
}


function formatCurrency2(value) {
  // Solo separa los miles sin agregar el signo de pesos
  const formattedValue = value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return formattedValue;
}

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
      headerName: "cantidad",
      width: 185,
      editable: false,
      headerClassName: 'custom-header',
      valueFormatter: (params) => formatCurrency2(params.value),
    },
    {
      field: "precio",
      headerName: "Precio",
      width: 170,
      editable: false,
      headerClassName: 'custom-header',
      valueFormatter: (params) => formatCurrency(params.value),
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
      renderCell: (params) => {
        const estado = params.row.estado;
        console.log("estado", estado);
        return (
          <div>
            <button className={estado === "Activo" ? "" : "hidden"}>
              <Link
                className="px-4 py-1.5 m-1 text-sm text-white font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500"
                to={`/repuestos/${params.row._id}`}
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
            <button
              className={
                estado === "Activo"
                  ? "px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-red-500 hover:text-white hover:bg-red-500"
                  : "px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500"
              }
              onClick={() => mostrarAlerta(params.row._id, estado)}
            >
              {estado === "Activo" ? <FontAwesomeIcon icon={faBan} /> : <FontAwesomeIcon icon={faCheck} />}
            </button>
            <button className={estado === "Activo" ? "" : "hidden"}>
              <Detalle
                metodo={() => getRepuestos (params.row._id)}
                id={params.row._id}
              >
                <table>
                  <tbody>
                    <Titulo>
                        <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                        Detalles del Repuesto
                    </Titulo>

                    <tr>
                      <Tabla >
                        <FontAwesomeIcon icon={faIdCard} className="mr-2" />
                        Nombre
                      </Tabla>
                      <Tabla >
                        {
                          repuestos.find(
                            (repuesto) => repuesto._id === params.row._id
                          )?.nombre_repuesto
                        }
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla >
                        <FontAwesomeIcon icon={faRegistered} className="mr-2" />
                        Marca
                      </Tabla>
                      <Tabla >
                        {
                          repuestos.find(
                            (marca) => marca._id === params.row._id
                          )?.marca.nombre_marca
                        }
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla >
                        <FontAwesomeIcon icon={faHashtag} className="mr-2" />
                        Cantidad
                      </Tabla>
                      <Tabla >
                      {
                    repuestos.find((repuesto) => repuesto._id === params.row._id)
                      ?.cantidad
                  }
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla >
                        <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                        Precio
                      </Tabla>
                      <Tabla >
                      {
                    repuestos.find((repuesto) => repuesto._id === params.row._id)
                      ?.precio
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

  return (
    <div className="mt-16">
      <h1 className="text-2xl text-start ml-20">Gestionar Repuestos</h1>
      <div className="mx-10 justify-end flex">
        <Link to="/add-repuesto">
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mx-8">
            +
          </button>
        </Link>
      </div>
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
            "& .MuiDataGrid-cell": {
              fontSize: "18px",
            },
          }}
          slots={{ toolbar: GridToolbar }}
        />
      </Box>
    </div>
  );
}
