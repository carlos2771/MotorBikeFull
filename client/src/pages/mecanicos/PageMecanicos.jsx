<<<<<<< HEAD
import React, { useEffect } from "react";
=======
import React, { useEffect , useCallback } from "react";
>>>>>>> 60306eb967723c91bfbcf96a43887b3680169091
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { useMecanicos } from "../../context/MecanicosContext";
import { Link } from "react-router-dom";
<<<<<<< HEAD

export default function PageClientes() {
  const { mecanicos, getMecanicos, deleteMecanico } = useMecanicos();

=======
import Swal from "sweetalert2";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWrench , faPlus, faDownload} from '@fortawesome/free-solid-svg-icons';
import * as XLSX from "xlsx";
import Detalle from "../../components/Detalle";
import { faEnvelope, faIdCard, faUser, faPhone, faPen, faPencil , faBan,  faCheck, faInfoCircle, faAddressCard, faHome} from "@fortawesome/free-solid-svg-icons";
import {Tabla, Titulo} from "../../components/Tabla";

// Agrega el icono a la biblioteca
library.add(faWrench, faPlus);

export default function PageMecanico() {
  const { mecanicos, getMecanicos, deleteMecanico,updateMecanico } = useMecanicos();
  
  
>>>>>>> 60306eb967723c91bfbcf96a43887b3680169091
  useEffect(() => {
    try {
        getMecanicos();
    } catch (error) {
      console.error("Error al obtener mecanicos:", error);
    }
  }, []);

<<<<<<< HEAD
  const columns = [
    {
      field: "nombre_mecanico",
      headerName: "Nombre",
      width: 200,
      editable: true,
    },
    {
        field: "cedula_mecanico",
        headerName: "Cedula",
        width: 200,
        editable: true,
      },
    {
      field: "telefono_mecanico",
      headerName: "Telefono",
      width: 200,
      editable: true,
    },
    {
        field: "direccion_mecanico",
        headerName: "Direccion",
        width: 200,
        editable: true,
      },
    {
      field: "createdAt",
      headerName: "Fecha Creacion",
      width: 200,
      editable: true,
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
        return (
          <div>
            <button
              className="px-4 py-1 text-sm text-white font-semibold rounded-full border border-red-500 hover:text-white hover:bg-red-500"
              onClick={() => {
                deleteMecanico(params.row._id); // Suponiendo que params.row contiene la información del cliente
              }}
            >
              Eliminar
            </button>
            <button
              className="px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-green-500 hover:text-white hover:bg-green-600"
            >
              <Link to={`/mecanico/${params.row._id}`}>Editar</Link>
            </button>
          </div>
=======
  const mostrarAlerta = (id, estado) => {
    const title = estado === "Activo" ? "Inhabilitar" : "Habilitar";
    const text = estado === "Activo" ? "¿Estás seguro de inhabilitar el mecánico?" : "¿Estás seguro de habilitar el mecánico?";
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
    updateMecanico(id, { estado: nuevoEstado }).then(() => {
      getMecanicos();
    });
  };

  const exportarAExcel = useCallback(() => {
    const datos = mecanicos.map((mecanico) => ({
      Cedula: mecanico.cedula_mecanico,
      Nombre: mecanico.nombre_mecanico,
      Telefono: mecanico.telefono_mecanico,
      Direccion: mecanico.direccion_mecanico,
      Estado: mecanico.estado,
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
    for (let i = 2; i <= mecanicos.length + 1; i++) {
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
    XLSX.utils.book_append_sheet(wb, ws, "Mecanicos");
    XLSX.writeFile(wb, "mecanicos.xlsx");

  }, [mecanicos]);

  const columns = [
    {
      field: "tipo",
      headerName: "Tipo Documento",
      width: 200,
      headerClassName: "font-custom text-lg",
    },
    {
        field: "cedula_mecanico",
        headerName: "Documento",
        width: 200,
        headerClassName: "font-custom text-lg",
    },
    {
      field: "nombre_mecanico",
      headerName: "Nombre Completo",
      width: 250,
      headerClassName: "font-bold text-lg"

    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 250,
      headerClassName: "font-bold text-lg",
      renderCell: (params) => {
        const estado = params.row.estado;
        console.log("Estado", estado);
        return (
          <div>
            <button className={estado === "Activo" ? "" : "hidden"} title="Editar">
              <Link
                className="px-4 py-1.5 m-1 text-sm text-white font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500"
                to={`/mecanico/${params.row._id}`}
                
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
            <button className={estado === "Activo" ? "" : "hidden"} title="Ver detalle">
              <Detalle
                metodo={() => getMecanicos(params.row._id)}
                id={params.row._id}
              >
                <table>
                  <tbody>
                    <Titulo>
                        <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                        Detalles del Mecánico
                    </Titulo>

                    <tr>
                      <Tabla >
                        <FontAwesomeIcon icon={faIdCard} className="mr-2" />
                        Tipo de documento
                      </Tabla>
                      <Tabla >
                        {
                          mecanicos.find(
                            (mecanicos) => mecanicos._id === params.row._id
                          )?.tipo
                        }
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla >
                        <FontAwesomeIcon icon={faIdCard} className="mr-2" />
                        Documento
                      </Tabla>
                      <Tabla >
                        {
                          mecanicos.find(
                            (mecanicos) => mecanicos._id === params.row._id
                          )?.cedula_mecanico
                        }
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla >
                        <FontAwesomeIcon icon={faUser} className="mr-2" />
                        Nombre Completo
                      </Tabla>
                      <Tabla >
                      {
                    mecanicos.find((mecanicos) => mecanicos._id === params.row._id)
                      ?.nombre_mecanico
                  }
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla >
                        <FontAwesomeIcon icon={faPhone} className="mr-2" />
                        Teléfono
                      </Tabla>
                      <Tabla >
                      {
                    mecanicos.find((mecanicos) => mecanicos._id === params.row._id)
                      ?.telefono_mecanico
                  }
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla >
                        <FontAwesomeIcon icon={faHome} className="mr-2" />
                        Dirección
                      </Tabla>
                      <Tabla >
                      {
                    mecanicos.find((mecanicos) => mecanicos._id === params.row._id)
                      ?.direccion_mecanico
                  }
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla >
                        <FontAwesomeIcon icon={faCheck} className="mr-2" />
                        Estado
                      </Tabla>
                      <Tabla >
                      {
                    mecanicos.find((mecanicos) => mecanicos._id === params.row._id)
                      ?.estado
                  }
                      </Tabla>
                    </tr>
                  </tbody>
                  
                </table>
                
              </Detalle>
            </button>
        </div>
>>>>>>> 60306eb967723c91bfbcf96a43887b3680169091
        );
      },
    },
  ];

  return (
<<<<<<< HEAD
    <div className="mt-16 ">
      <h1 className="text-2xl text-center mx-auto">Mecánicos</h1>
      <div className="mx-10 justify-end flex ">
        <Link to="/add-mecanico">
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mx-8">
            Agregar Mecanico
          </button>
        </Link>
      </div>
      <Box sx={{ width: "100%" }}>
        <DataGrid
          className="bg-neutral-700 mx-16 my-4"
=======
    <div className="mt-16">
      <div className="flex justify-between">
      <h1 className="text-2xl mx-auto ml-16 font-custom"> <FontAwesomeIcon icon="wrench" className="mr-2" />Gestión de Mecánicos</h1>
      <div className="mx-16 justify-end flex">
        <Link to="/add-mecanico">
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
      
      <Box sx={{ width: "100%" }}>
        <DataGrid
          className="bg-slate-700 shadow-lg shadow-blue-600/40 mx-16 my-4"
>>>>>>> 60306eb967723c91bfbcf96a43887b3680169091
          rows={mecanicos}
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
<<<<<<< HEAD
          checkboxSelection
          disableRowSelectionOnClick
          sx={{
            color: "white",
=======
         
          disableRowSelectionOnClick
          sx={{
            color: "white",
            '& .MuiDataGrid-cell': {
              fontSize: '15px',
            },
>>>>>>> 60306eb967723c91bfbcf96a43887b3680169091
          }}
          slots={{ toolbar: GridToolbar }}
        />
      </Box>
    </div>
  );
}
