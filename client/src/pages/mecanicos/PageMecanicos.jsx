import React, { useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { useMecanicos } from "../../context/MecanicosContext";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function PageMecanico() {
  const { mecanicos, getMecanicos, deleteMecanico,updateMecanico } = useMecanicos();
  
  
  useEffect(() => {
    try {
        getMecanicos();
    } catch (error) {
      console.error("Error al obtener mecanicos:", error);
    }
  }, []);

  const mostrarAlerta = (id, estado) => {
    const title = estado === "Activo" ? "Inhabilitar" : "Habilitar";
    const text = estado === "Activo" ? "¿Estás seguro de inhabilitar el cliente?" : "¿Estás seguro de habilitar el cliente?";
    const texto = estado === "Activo" ? "Inhabilitado" : "Habilitado";

    Swal.fire({
      title: title,
      text: text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        cambiarEstado(id, estado);
        Swal.fire(`${texto}`, `El mecanico ha sido ${texto} `, "success");
      }
    });
  };

  const cambiarEstado = (id, estado) => {
    const nuevoEstado = estado === "Activo" ? "Inactivo" : "Activo";
    updateMecanico(id, { estado: nuevoEstado }).then(() => {
      getMecanicos();
    });
  };

  const columns = [

    {
        field: "cedula_mecanico",
        headerName: "Cedula",
        width: 200,
       
    },
    {
      field: "nombre_mecanico",
      headerName: "Nombre",
      width: 190,

    },
    {
      field: "telefono_mecanico",
      headerName: "Telefono",
      width: 200,
     
    },
    {
      field: "direccion_mecanico",
      headerName: "Direccion",
      width: 200,
     
    },
    {
      field: "estado",
      headerName: "Estado",
      width: 100,

    },
    {
      field: "createdAt",
      headerName: "Fecha Creacion",
      width: 240,
 
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
      width: 300,
      renderCell: (params) => {
        const estado = params.row.estado;
        console.log("Estado", estado);
        return (
          <div>
            <button
            className={estado === "Activo" ? "px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-green-500 hover:text-white hover:bg-green-500" : "hidden"}
          >
            <Link to={`/mecanicos/${params.row._id}`}>Ver</Link>
          </button>
          <button
            className={estado === "Activo" ? "px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-green-500 hover:text-white hover:bg-green-500" : "hidden"}
          >
            <Link to={`/mecanico/${params.row._id}`}>Editar</Link>
          </button>
          {/* <button
            className="px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-red-500 hover:text-white hover-bg-red-500"
            onClick={() => mostrarAlerta(params.row._id)}
          >
            Eliminar
          </button> */}
           <button
              className={estado === "Activo" ?  "px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-red-500 hover:text-white hover:bg-red-500" : "px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-yellow-500 hover:text-white hover:bg-yellow-500"}
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
    <div className="mt-16">
      <h1 className="text-2xl text-center mx-auto">Mecánicos</h1>
      <div className="mx-10 justify-end flex">
        <Link to="/add-mecanico">
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mx-8">
            Agregar Mecánico
          </button>
        </Link>
      </div>
      <Box sx={{ width: "100%" }}>
        <DataGrid
          className="bg-slate-700 shadow-lg shadow-blue-600/40 mx-16 my-4"
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
         
          disableRowSelectionOnClick
          sx={{
            color: "white",
            '& .MuiDataGrid-cell': {
              fontSize: '18px',
            },
          }}
          slots={{ toolbar: GridToolbar }}
        />
      </Box>
    </div>
  );
}
