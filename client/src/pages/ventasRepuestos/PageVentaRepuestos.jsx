import React, { useEffect } from "react";
import { useVentasRepuestos } from "../../context/VentasRepuestoContex";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {faLock, faDollarSign,faPlus, faBan, faInfoCircle, faIdCard,faScrewdriverWrench, faShoppingCart} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {Tabla, Titulo} from "../../components/Tabla";
import Detalle from "../../components/Detalle";


export default function PageVentaRepuestos() {
  const {
    ventasRepuestos,
    getVentasRepuestos,
    getVentaRepuesto,
    deleteVentaRepuesto,
    updateVentaRepuesto,
  } = useVentasRepuestos();



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
      background: "#334155",
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
      field: "repuesto",
      headerName: "Repuesto",
      width: 160,
      headerClassName: "custom-header",
      valueGetter: (params) => params.row.repuesto.nombre_repuesto,
    },
    {
      field: "cantidad_repuesto",
      headerName: "Cantidad Repuesto",
      width: 175,
      headerClassName: "custom-header",
    },
    // {
    //   field: "precio_unitario",
    //   headerName: "Precio Unitario",
    //   width: 170,
    //   headerClassName: "custom-header",
    // },
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
    // {
    //   field: "estado",
    //   headerName: "Estado",
    //   width: 100,
    //   headerClassName: "custom-header",
    // },
    // {
    //   field: "createdAt",
    //   headerName: "Fecha Creacion",
    //   width: 300,
    //   headerClassName: "custom-header",
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
      width: 170,
      headerClassName: "custom-header",
      renderCell: (params) => {
        const estado = params.row.estado;
        return (
          <div>
            {/* <button
              className={
                params.row.anulado
                  ? "px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500"
                  : "hidden"
              }
            >
              <Link to={`/venta-repuesto/${params.row._id}`}>Editar</Link>
            </button> */}
            <button title="Anular"
              className={
                params.row.anulado
                  ? "px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-orange-500 hover:text-white hover:bg-orange-500"
                  : "px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-red-600 hover:text-white hover:bg-red-600"
              }
              onClick={() => mostrarAlerta(params.row._id, params.row.anulado)}
            >
              {params.row.anulado ? <FontAwesomeIcon icon={faLock} /> : <FontAwesomeIcon icon={faBan} />}
            </button>
            <button title="Ver detalle">
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
                      <Tabla >
                        <FontAwesomeIcon icon={faIdCard} className="mr-2" />
                        Nombre
                      </Tabla>
                      <Tabla >
                        {
                          ventasRepuestos.find(
                            (cliente) => cliente._id === params.row._id
                          )?.cliente.nombre_cliente
                        }
                      </Tabla>
                      </tr>
                      <tr>
                      <Tabla >
                      <FontAwesomeIcon icon={faScrewdriverWrench}className="mr-2" />
                        Repuesto
                      </Tabla>
                      <Tabla >
                        { 
                          ventasRepuestos.find(
                            (repuesto) => repuesto._id === params.row._id
                          )?.repuesto.nombre_repuesto
                        }
                      </Tabla>
                    </tr>
                      <tr>
                      <Tabla >
                      <FontAwesomeIcon icon={faScrewdriverWrench}className="mr-2" />
                        Cantidad Repuesto
                      </Tabla>
                      <Tabla >
                        { 
                           ventasRepuestos.find(
                            (cantidad) => cantidad._id === params.row._id
                            )?.cantidad_repuesto
                        }
                      </Tabla>
                    </tr>
                      <tr>
                      <Tabla >
                      <FontAwesomeIcon icon={faDollarSign} className="mr-2"/>
                        Precio Unitario
                      </Tabla>
                      <Tabla >
                        { 
                           ventasRepuestos.find(
                            (precio) => precio._id === params.row._id
                            )?.precio_unitario
                        }
                      </Tabla>
                    </tr>
                      <tr>
                      <Tabla >
                      <FontAwesomeIcon icon={faDollarSign} className="mr-2"  />
                        Precio Total
                      </Tabla>
                      <Tabla >
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

  return (
    <div className="mt-16">
      <div className="flex justify-between">
      <h1 className="text-2xl text-start ml-16"><FontAwesomeIcon icon={faShoppingCart} className="mr-2" />Gestión de Ventas Repuestos</h1>
        <div className="mx-10 justify-end">
          <Link to="/add-venta-repuesto">
          <button  className="px-4 py-2 mr-8 text-sm text-withe font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent" title="Agregar">
            <FontAwesomeIcon icon={faPlus} />
              
            </button>
          </Link>
        </div>
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
            color: "white",
            "& .MuiDataGrid-cell": {
              fontSize: "18px", // Cambia el tamaño de fuente aquí
            },
          }}
          slots={{ toolbar: GridToolbar }}
        />
      </Box>
    </div>
  );
}
