import React, { useEffect, } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { useMarcas } from "../../context/MarcasContext";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function PageMarcas() {
  const { marcas, getMarcas, deleteMarca,updateMarca } = useMarcas();
  
  
  useEffect(() => {
    try {
      getMarcas();
    } catch (error) {
      console.error("Error al obtener marcas:", error);
    }
  }, []);

  const mostrarAlerta = (id, estado) => {
    const title = estado === "Activo" ? "Inhabilitar" : "Habilitar";
    const text = estado === "Activo" ? "¿Estás seguro de inhabilitar la marca?" : "¿Estás seguro de habilitar la marca?";
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
        Swal.fire(`${texto}`, `La marca ha sido ${texto} `, "success");
      }
    });
  };

  const cambiarEstado = (id, estado) => {
    const nuevoEstado = estado === "Activo" ? "Inactivo" : "Activo";
    updateMarca(id, { estado: nuevoEstado }).then(() => {
        getMarcas();
    });
  };

  const columns = [
    {
      field: "nombre_marca",
      headerName: "Nombre de Marca",
      width: 250,

    },
    {
      field: "estado",
      headerName: "Estado",
      width: 200,

    },
    {
      field: "createdAt",
      headerName: "Fecha Creacion",
      width: 340,
 
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
        console.log("estadin", estado);
        return (
          <div>
            <button
                className={estado === "Activo" ? "px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-green-500 hover:text-white hover:bg-green-500" : "hidden"}
            >
                <Link to={`/marca/${params.row._id}`}>Editar</Link>
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
      <h1 className="text-2xl text-center mx-auto">Marcas</h1>
      <div className="mx-10 justify-end flex">
        <Link to="/add-marca">
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mx-8">
            Agregar Marca
          </button>
        </Link>
      </div>
      <Box sx={{ width: "100%" }}>
        <DataGrid
          className="bg-slate-700 shadow-lg shadow-blue-600/40 mx-16 my-4"
          rows={marcas}
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
