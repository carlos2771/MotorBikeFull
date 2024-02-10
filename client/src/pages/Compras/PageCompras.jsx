import React, { useEffect, useCallback, useState } from "react";
import { useCompras } from "../../context/ComprasContext";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import utc from 'dayjs/plugin/utc';
import * as XLSX from "xlsx";
import { faLock, faBan, faDownload, faShoppingBag, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import createTheme from '@mui/material/styles/createTheme';
import MUIDataTable from "mui-datatables";
import { Tabla } from "../../components/Tabla";
import Detalle from "../../components/Detalle"

import { faUser, faBarcode, faCalendarDays } from "@fortawesome/free-solid-svg-icons";



dayjs.locale('es');
dayjs.extend(utc);

function formatCurrency(value) {
  const formattedValue = `$${value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  return formattedValue;
}

function formatCurrency2(value) {
  const formattedValue = value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return formattedValue;
}

const calcularPrecioTotalCompra = (compra) => {
  return formatCurrency(compra.repuestos.reduce((total, repuesto) => {
    return total + repuesto.precio_total;
  }, 0));
};

export default function PageCompras() {
  const {
    compras,
    getCompras,
    deleteCompra,
    updateCompra,
  } = useCompras();

  useEffect(() => {
    try {
      getCompras();
    } catch (error) {
      console.error("Error al obtener compras:", error);
    }
  }, []);

  const mostrarAlerta = (id, anulado) => {
    const title = anulado ? "Anulado" : "Anular";
    const text = anulado
      ? "Esta compra ya ha sido anulada."
      : "¿Estás seguro de anular la compra?";
    const buttonText = anulado ? "Entendido" : "Sí";
    
   if (!anulado) {
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
      if (result.isConfirmed) {
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
  }else {
    // Si la compra está anulada, solo mostrar un mensaje indicando que no se puede realizar ninguna acción
    Swal.fire({
      title: "Acción no permitida",
      text: "Esta compra ya ha sido anulada y no se puede modificar.",
      icon: "info",
      background: "#334155",
      color: "white",
      iconColor: "#2563eb",
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "px-5 py-1 m-1 text-lg text-white font-semibold rounded-full border-2 border-blue-600 hover:text-white hover:bg-blue-600",
      },
    });
  }
};

  const cambiarEstado = (id, anulado) => {
    const nuevoEstado = anulado ? "Activo" : "Inactivo";
    updateCompra(id, { estado: nuevoEstado }).then(() => {
      getCompras();
    });
  };




  const exportarAExcel = useCallback(() => {
    const datos = compras.map((compra) => ({
      'Nombre': compra.repuestos.map(repuesto => repuesto.repuesto.name).join(', '),
      'Cantidad': compra.repuestos.map(repuesto => repuesto.cantidad_repuesto).join(', '),
      'precio unitario': compra.repuestos.map(repuesto => repuesto.precio_unitario).join(', '),
      'precio total': compra.repuestos.map(repuesto => repuesto.precio_total).join(', '),
      'Total compra': compra.repuestos.reduce((total, repuesto) => total + repuesto.precio_total, 0),
      'Fecha de compra': dayjs.utc(compra.fecha).locale('es').format("DD [de] MMMM [de] YYYY"),

    }));

    const theme = createTheme();
    const ws = XLSX.utils.json_to_sheet(datos);

    for (let i = 1; i <= compras.length + 1; i++) {
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
    XLSX.writeFile(wb, 'compras.xlsx');
  }, [compras]);

  const currentDate = new Date();
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = new Intl.DateTimeFormat('es-ES', options).format(currentDate);



  const columnas2 = [
    { name: "repuesto", label: "Repuesto", options: { filter: true, sort: true } },
    { name: "cantidad", label: "Cantidad", options: { filter: true, sort: false } },
    { name: "precioUnitario", label: "Precio Unitario", options: { filter: true, sort: false } },
    { name: "precioTotal", label: "Precio Total", options: { filter: true, sort: false } },
  ];




  // ESTE ES EL DEFINITIVO..




  const opcion = { filterType: 'checkbox' };


  const columns = [
    {
      field: "repuestos",
      headerName: "Repuesto",
      width: 400,
      headerClassName: "custom-header",
      valueGetter: (params) => {
        const repuestos = params.row.repuestos;
        if (repuestos && repuestos.length > 0) {
          const nombresRepuestos = repuestos.map((repuesto) => repuesto.repuesto.name);
          return nombresRepuestos.join(', ');
        } else {
          return "Nombre no disponible";
        }
      },
    },
    {
      field: "createdAt",
      headerName: "Fecha Creacion",
      width: 300,
      headerClassName: "custom-header",
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
      width: 170,
      headerClassName: "custom-header",
      renderCell: (params) => {
        const estado = params.row.estado;
        return (
          <div>
            <button
              className={
                params.row.anulado
                  ? "px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-orange-500 hover:text-white hover:bg-orange-500"
                  : "px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-blue-600 hover:text-white hover:bg-blue-600"
              }
              onClick={() => mostrarAlerta(params.row._id, params.row.anulado)}
            >
              {params.row.anulado ? <FontAwesomeIcon icon={faLock} /> : <FontAwesomeIcon icon={faBan} />}
            </button>
            <button>
              <Detalle
                metodo={() => getCompras(params.row._id)}
                id={params.row._id}
                repuestos={params.row.repuestos}
              >




                <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
                  <MUIDataTable
                    className="miTablaPersonalizada"
                    title={"Detalle Compras"}
                    data={compras.find((compra) => compra._id === params.row._id)
                      ?.repuestos.map((repuesto) => ({
                        repuesto: repuesto.repuesto.name,
                        cantidad: formatCurrency2(repuesto.cantidad_repuesto),
                        precioUnitario: formatCurrency(repuesto.precio_unitario),
                        precioTotal: formatCurrency(repuesto.precio_total),
                      }))}
                    columns={columnas2}
                    options={{
                      sort: false,
                      responsive: 'standard',
                      rowsPerPage: 3,
                      rowsPerPageOptions: 3,
                      selectableRows: false,
                      print: false,
                      download: false,
                      viewColumns: false,
                      textLabels: {
                        toolbar: {
                          search: "Buscar",
                          filterTable: "Filtrar tabla",
                        },
                        pagination: {
                          displayRows: "de",
                          rowsPerPage: "Filas por página:",
                        },
                        filter: {
                          all: 'Todos',
                          title: 'Filtros',
                          reset: 'Reiniciar',
                        }
                      },
                    }}
                    style={{ width: '100%' }} // Ajusta el ancho de la tabla al 100%
                  />
                </div>


                <style>{
                  `

                // .tss-ynxllk-MUIDataTableFilter-root{
                //   background-color: #1e293b;
                // }
                .miTablaPersonalizada .tss-11quiee-MUIDataTable-paper{
                  background-color: #1e293b;
                }


                .miTablaPersonalizada .tss-1qtl85h-MUIDataTableBodyCell-root{
                  background-color: #1e293b;
                  color: white;
                }

                .miTablaPersonalizada .tss-gm6zfk-MUIDataTableHeadCell-fixedHeader{
                  background-color: #1e293b;
                  color: white; 
                  
                  
                  
}

                .miTablaPersonalizada .css-rqglhn-MuiTable-root{
                  margin-top: 10px;
                  


                }

                // PRIMER CAJA DE LA TABLA
                .miTablaPersonalizada .tss-gm6zfk-MUIDataTableHeadCell-fixedHeaderr{
                  background-color: red; 
                  color: red;
                  
                }

                // ULTIMA CAJA DE LA TABLA
                .miTablaPersonalizada .tss-1ork7hi-MUIDataTablePagination-tableCellContainer{
                   background-color: red
                
                }


                .miTablaPersonalizada .tss-1ork7hi-MUIDataTablePagination-tableCellContainer{
                 
                  
                  padding: 10px;
                  background-color: #1e293b; 
                }

                .miTablaPersonalizada .MuiToolbar-gutters{
                  
                  // background-color: #93c5fd;
                   background-color: #1e293b;
                  color: white; 
                  
                }

                .miTablaPersonalizada .css-i4bv87-MuiSvgIcon-root{
                  color: white;
                }

                .miTablaPersonalizada .css-1x51dt5-MuiInputBase-input-MuiInput-input{
                  color: white;
                }



            

                // .miTablaPersonalizada .MuiToolbar-root{
                
                //   color: white;
                // }
                

                .miTablaPersonalizada .tss-1qjwhn0-MUIDataTableBody-emptyTitle{
                  color: white; 
                }

                .miTablaPersonalizada .tss-1cdcmys-MUIDataTable-responsiveBase{
                  background-color: #1e293b;
                }


                


                // NO HAY REPUESTOS AÚN
                .miTablaPersonalizada .MuiTypography-body1{
                  color: red;
                  
                }

                .miTablaPersonalizada {
                  background-color: #1e293b;
                  margin-top
                  border: 1px solid #2563eb
                  
              }

                
                `}</style>
                <table style={{ marginLeft: '1px' }}>
                  <tbody>
                    <tr>
                      <Tabla >
                        <FontAwesomeIcon icon={faUser} /> Proveedor
                      </Tabla>
                      <Tabla >
                        <FontAwesomeIcon icon={faBarcode} /> Codigo
                      </Tabla>
                      <Tabla >
                        <FontAwesomeIcon icon={faCalendarDays} />  Fecha
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla >
                        {params.row.proveedor}
                      </Tabla>
                      <Tabla >
                        {params.row.codigo}
                      </Tabla>
                      <Tabla >
                        {dayjs.utc(params.row.fecha).format("DD/MM/YYYY")}
                      </Tabla>
                    </tr>

                  </tbody>

                </table>
{/* TOTAL DE LA COMPRA */}
                <h1>Total {calcularPrecioTotalCompra(params.row)}
                </h1>
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
        <h1 className="text-2xl text-start ml-16"><FontAwesomeIcon icon={faShoppingBag} className="mr-2" />Gestión de Compras</h1>
        <div className="mx-10 justify-end">
          <Link to="/add-compra">
            <button className="px-4 py-2 mr-8 text-sm text-withe font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent" title="Agregar">
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
          rows={compras}
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
