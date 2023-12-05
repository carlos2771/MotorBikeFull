import React, { useEffect } from 'react'
import { useVentasServicios } from '../../context/VentasServicioContex'
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Link } from 'react-router-dom';
import Swal from "sweetalert2";
import Detalle from "../../components/Detalle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUser,faPen, faPencil , faBan,  faCheck, faInfoCircle,faDollarSign,  faHandshake} from "@fortawesome/free-solid-svg-icons";
import {Tabla, Titulo} from "../../components/Tabla";


export default function PageVentaServicios() {
    const {ventasServicios, getVentasServicios, deleteVentaServicio,updateVentaServicio} = useVentasServicios()
   
    useEffect(() => {
        try {
            getVentasServicios();
            
        } catch (error) {
          console.error("Error al obtener las ventas:", error);
        }
      }, []);
      const mostrarAlerta = (id, estado) => {
        const title = estado === "Activo" ? "Inhabilitar" : "Habilitar";
        const text =estado === "Activo"? "¿Estás seguro de inhabilitar la venta ?": "¿Estás seguro de habilitar la venta ?";
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
        updateVentaServicio(id, { estado: nuevoEstado }).then(() => {
          getVentasServicios();
        });
      };
    
      
      
      const columns = [
        {
          field: "nombre_mecanico",
          headerName: "Mecanico",
          width: 160,   
          editable: true,
          headerClassName: 'custom-header',
          valueGetter: (params) => params.row.mecanico.nombre_mecanico,
        },
        {
          field: "nombre_cliente",
          headerName: "Cliente",
          width: 170,
          editable: true,
          headerClassName: 'custom-header',
          valueGetter: (params) => params.row.cliente.nombre_cliente,
        },
        {
          field: "precio_servicio",
          headerName: "Precio servicio ",
          width: 185,
          editable: true,
          headerClassName: 'custom-header',
        },
        // {
        //   field: "descripcion",
        //   headerName: "Descripcion",
        //   width: 170,
        //   editable: true,
        //   headerClassName: 'custom-header',
        // },
        {
          field: "estado",
          headerName: "Estado",
          width: 170,
          headerClassName: 'custom-header',
    
        },
        // {
        //   field: "createdAt",
        //   headerName: "Fecha Creacion",
        //   width: 300,
        //   editable: true,
        //   headerClassName: 'custom-header',
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
          headerClassName: "custom-header",
          renderCell: (params) => {
            const estado = params.row.estado;
            console.log("estado", estado);
            return (
              <div>
                <button className={estado === "Activo" ? "" : "hidden"}>
                  <Link
                    className="px-4 py-1.5 m-1 text-sm text-white font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500"
                    to={`/ventas-servicios/${params.row._id}`}
                  >
                    <FontAwesomeIcon icon={faPencil} />
                  </Link>
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
              {estado === "Activo" ? <FontAwesomeIcon icon={faBan} /> : <FontAwesomeIcon icon={faCheck} />}
            </button>
            <button className={estado === "Activo" ? "" : "hidden"}>
            <Detalle
                metodo={() => getVentasServicios(params.row._id)}
                id={params.row._id}
              >
                <table>
                  <tbody>
                    <Titulo>
                        <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                        Detalles de la venta
                    </Titulo>

                    <tr>
                      <Tabla >
                        <FontAwesomeIcon icon={faUser} className="mr-2" />
                        Cliente
                      </Tabla>
                      <Tabla >
                        {
                          ventasServicios.find(
                            (cliente) => cliente._id === params.row._id
                          )?.cliente.nombre_cliente
                        }
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla >
                        <FontAwesomeIcon icon={faUser} className="mr-2" />
                        Mecanico
                      </Tabla>
                      <Tabla >
                        {
                          ventasServicios.find(
                            (mecanico) => mecanico._id === params.row._id
                          )?.mecanico.nombre_mecanico
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
                    ventasServicios.find((precio) => precio._id === params.row._id)
                      ?.precio_servicio
                  }
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla >
                        <FontAwesomeIcon icon={faPen} className="mr-2" />
                        Descripción
                      </Tabla>
                      <Tabla >
                      {
                    ventasServicios.find((descripcion) => descripcion._id === params.row._id)
                      ?.descripcion
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
        <div className="mt-16 ">
          <div className="flex justify-between">
          <h1 className="text-2xl text-start ml-16"><FontAwesomeIcon icon={faHandshake} className="mr-2" />Gestionar ventas de servicios</h1>
          <div className="mx-10 justify-end">
              <Link to="/add-venta-servicio">
              <button  className="px-4 py-2 mr-8 text-sm text-withe font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent" title="Agregar">
            <FontAwesomeIcon icon={faPlus} />
            </button>
              </Link>
            </div>
          </div>
          <Box sx={{ width: "100%" }}>
            <DataGrid
              className="bg-slate-700 shadow-lg shadow-blue-600/40 mx-16 my-4"
              rows={ventasServicios}
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
///Comit
