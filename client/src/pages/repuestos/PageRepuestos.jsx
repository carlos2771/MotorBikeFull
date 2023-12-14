import React, { useEffect, useCallback} from 'react'
import { useRepuestos } from '../../context/RepuestosContext'
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Link } from 'react-router-dom';
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faDownload ,faIdCard, faUser, faPhone, faPen, faTools, faPlus,faPencil , faBan,  faCheck, faInfoCircle, faAddressCard, faRegistered, faDollarSign, faHashtag} from "@fortawesome/free-solid-svg-icons";

import Detalle from "../../components/Detalle";
import {Tabla, Titulo} from "../../components/Tabla";

function formatCurrency(value) {
  // Agrega el signo de peso
  const formattedValue = `$${value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  return formattedValue;
}

import * as XLSX from "xlsx";

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

  const exportarAExcel = useCallback(() => {
    const datos = repuestos.map((repuesto) => ({
      Nombre: repuesto.nombre_repuesto,
      Marca: repuesto.marca.nombre_marca,
      Cantidad: repuesto.cantidad,
      Precio: repuesto.precio,
      Estado: repuesto.estado,
    }));

    const ws = XLSX.utils.json_to_sheet(datos);

    // Agregar formato a los títulos (encabezados) y establecer autoFilter
    ws["!cols"] = [{ wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 30 }, { wch: 15 }];
    ws["!rows"] = [{ hpx: 20, outlineLevel: 0, hidden: false }];

    // Establecer el formato de fondo y negrita para los títulos
    for (let i = 0; i < 5; i++) {
      const col = String.fromCharCode(65 + i); // Convertir número a letra (A, B, C, ...)
      ws[`${col}1`].s = { font: { bold: true }, fill: { patternType: "solid", fgColor: { rgb: "#66FFCC" } } };
    }

    // Agregar formato a las celdas de datos y bordes
    for (let i = 2; i <= repuestos.length + 1; i++) {
      for (let j = 0; j < 5; j++) {
        const col = String.fromCharCode(65 + j);
        const cell = `${col}${i}`;
        ws[cell].s = {
          fill: { patternType: "solid", fgColor: { rgb: "#FFFFFF" } },
          border: { left: { style: "thin", color: { rgb: "#000000" } }, right: { style: "thin", color: { rgb: "#000000" } }, top: { style: "thin", color: { rgb: "#000000" } }, bottom: { style: "thin", color: { rgb: "#000000" } } },
        };
      }
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Repuestos");
    XLSX.writeFile(wb, "repuestos.xlsx");

  }, [repuestos]);


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
      width: 120,
      editable: true,
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
      width: 120,
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
      headerClassName: 'custom-header',
      renderCell: (params) => {
        const estado = params.row.estado;
        console.log("estado", estado);
        return (
          <div>
            <button className={estado === "Activo" ? "" : "hidden"} title='Editar'>
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
            <button title='Activar/Inactivar'
              className={
                estado === "Activo"
                  ? "px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-red-500 hover:text-white hover:bg-red-500"
                  : "px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500"
              }
              onClick={() => mostrarAlerta(params.row._id, estado)}
            >
              {estado === "Activo" ? <FontAwesomeIcon icon={faBan} /> : <FontAwesomeIcon icon={faCheck} />}
            </button>
            <button className={estado === "Activo" ? "" : "hidden"} title='Ver detalle'>
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
    <div className="mt-16 ">
      <div className="flex justify-between">
      <h1 className="text-2xl text-start ml-16"><FontAwesomeIcon icon={faTools} className="mr-2" />Gestión de Repuestos</h1>
        <div className="mx-16 justify-end">
          <Link to="/add-repuesto">
            <button  className="px-4 py-2 text-sm text-withe font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent" title="Agregar">
            <FontAwesomeIcon icon={faPlus} />
            </button>
          </Link>
          <button
          onClick={exportarAExcel}
          className="px-4 py-2 mx-2 text-sm text-withe font-semibold rounded-full border border-green-600 hover:text-white hover:bg-green-600 hover:border-transparent" title="Descargar excel"
        ><FontAwesomeIcon icon={faDownload} />
        </button>
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
            "& .MuiDataGrid-cell": {
              fontSize: "15px",
            },
          }}
          slots={{ toolbar: GridToolbar }}
        />
      </Box>
    </div>
  );
}