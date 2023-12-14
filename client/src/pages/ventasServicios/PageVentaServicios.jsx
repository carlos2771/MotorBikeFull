import React, { useEffect, useCallback } from 'react'
import { useVentasServicios } from '../../context/VentasServicioContex'
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Link } from 'react-router-dom';
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import Detalle from "../../components/Detalle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faLock,faUser,faPen,faDownload,faPencil , faBan,faCalendarDay, faInfoCircle,faDollarSign,faShoppingCart,  faHandshake} from "@fortawesome/free-solid-svg-icons";
import {Tabla, Titulo} from "../../components/Tabla";


function formatCurrency(value) {
  // Agrega el signo de peso
  const formattedValue = `$${value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  return formattedValue;
}



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
  const text =
    estado === "Activo"
      ? "¿Estás seguro de inhabilitar la venta ?"
      : "¿Estás seguro de habilitar la venta ?";
  const texto = estado === "Activo" ? "Inhabilitado" : "Habilitado";

  if (estado === "Activo") {
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
          timer: 3000,
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
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "error",
          title: "No se ha modificado",
        });
      }
    });
  } else {
    // Si la venta está desactivada, solo mostrar un mensaje indicando que no se puede realizar ninguna acción
    Swal.fire({
      title: "Acción no permitida",
      text: "Esta venta ya está desactivada y no se puede modificar.",
      icon: "info",
      background: "#334155",
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
        const nuevoEstado = estado === "Activo" ? "Inactivo" : "Activo";
        updateVentaServicio(id, { estado: nuevoEstado }).then(() => {
          getVentasServicios();
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
          headerName: "Precio de servicio",
          width: 185,
          editable: true,
          headerClassName: 'custom-header',
          valueFormatter: (params) => formatCurrency(params.value),
        },
        // {
        //   field: "descripcion",
        //   headerName: "Descripcion",
        //   width: 170,
        //   editable: true,
        //   headerClassName: 'custom-header',
        // }

        {
          field: "createdAt",
          headerName: "Fecha de venta",
          width: 300,
          editable: true,
          headerClassName: 'custom-header',
          renderCell: (params) => {
            const date = new Date(params.value);
            date.toLocaleString("en-US", { timeZone: "America/Bogota" });
            const formattedDate = date.toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
        
            return <div>{formattedDate}</div>;
          },
        },
        {
          field: "estado",
          headerName: "Estado",
          width: 170,
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
                {/* <button
                  className="px-4 py-1 text-sm text-white font-semibold rounded-full border border-red-500 hover:text-white hover:bg-red-500"
                  onClick={() => {
                    deleteVentaServicio(params.row._id);
                  }}
                >
                  Eliminar
                </button> */}
                <button title='Inactivar'
                  className={
                    estado === "Activo"
                      ? "px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-red-500 hover:text-white hover:bg-red-500"
                      : "px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500"
              }
              onClick={() => mostrarAlerta(params.row._id, estado)}
            >
              {estado === "Activo" ? <FontAwesomeIcon icon={faBan} /> : <FontAwesomeIcon icon={faLock} />}
            </button>
            <button className={estado === "Activo" ? "" : "hidden"} title='Ver detalle'>
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
                        <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                        Precio de servicio
                      </Tabla>
                      <Tabla >
                      {
                      formatCurrency(
                        ventasServicios.find((precio) => precio._id === params.row._id)
                          ?.precio_servicio
                      )
                    }
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla>
                        <FontAwesomeIcon icon={faCalendarDay} className="mr-2" />
                        Fecha de venta
                      </Tabla>
                      <Tabla>
                        {
                          ventasServicios.find((venta) => venta._id === params.row._id)?.createdAt &&
                          new Date(ventasServicios.find((venta) => venta._id === params.row._id).createdAt).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
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
          <div className="mx-16 justify-end flex">
              <Link to="/add-venta-servicio">
              <button  className="px-4 py-2 text-sm text-withe font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent" title="Agregar">
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
            />
          </Box>
        </div>
      );
    }
///Comit