<<<<<<< HEAD
import React, { useEffect } from "react";
=======
import React, { useEffect, } from "react";
>>>>>>> 60306eb967723c91bfbcf96a43887b3680169091
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { useMarcas } from "../../context/MarcasContext";
import { Link } from "react-router-dom";
<<<<<<< HEAD

export default function PageClientes() {
  const { marcas, getMarcas, deleteMarca } = useMarcas();

  useEffect(() => {
    try {
        getMarcas();
    } catch (error) {
      console.error("Error al obtener las marcas:", error);
    }
  }, []);

  const columns = [
    {
      field: "nombre_marca",
      headerName: "Nombre Marca",
      width: 300,
      editable: true,
=======
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faIdCard, faUsers, faUser, faPhone, faPlus, faPencil , faBan,  faCheck, faInfoCircle, faAddressCard, faBuilding} from "@fortawesome/free-solid-svg-icons";

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

>>>>>>> 60306eb967723c91bfbcf96a43887b3680169091
    },
    {
      field: "createdAt",
      headerName: "Fecha Creacion",
<<<<<<< HEAD
      width: 300,
      editable: true,
=======
      width: 340,
 
>>>>>>> 60306eb967723c91bfbcf96a43887b3680169091
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
<<<<<<< HEAD
      width: 300,
      renderCell: (params) => {
        return (
          <div>
            <button
              className="px-4 py-1 text-sm text-white font-semibold rounded-full border border-red-500 hover:text-white hover:bg-red-500"
              onClick={() => {
                deleteMarca(params.row._id); // Suponiendo que params.row contiene la información del cliente
              }}
            >
              Eliminar
            </button>
            <button
              className="px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-green-500 hover:text-white hover:bg-green-600"
            >
              <Link to={`/marca/${params.row._id}`}>Editar</Link>
            </button>
          </div>
=======
      width: 200,
      renderCell: (params) => {
        const estado = params.row.estado;
        console.log("estadin", estado);
        return (
          <div>
            <button
                className={estado === "Activo" ? "" : "hidden"}
            >
                <Link className="px-4 py-1.5 m-1 text-sm text-white font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500" to={`/marca/${params.row._id}`}>Editar</Link>
            </button>
          {/* <button
            className="px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-red-500 hover:text-white hover-bg-red-500"
            onClick={() => mostrarAlerta(params.row._id)}
          >
            Eliminar
          </button> */}
           <button
              className={estado === "Activo" ?  "px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-red-500 hover:text-white hover:bg-red-500" : "px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500"}
              onClick={() => mostrarAlerta(params.row._id, estado)}
            >
              {estado === "Activo" ? "Inhabilitar" : "Habilitar"}
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
      <h1 className="text-2xl text-center mx-auto">Marcas</h1>
      <div className="mx-10 justify-end flex ">
        <Link to="/add-marca">
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mx-8">
            Agregar Marca
          </button>
        </Link>
      </div>
      <Box sx={{ width: "100%" }}>
        <DataGrid
          className="bg-neutral-700 mx-16 my-4"
          rows={marcas}
          columns={columns}
          getRowId={(row) => row._id}
=======
    <div className="mt-16">
      <div className="flex justify-between">
      <h1 className="text-2xl text-start ml-16"><FontAwesomeIcon icon={faBuilding} className="mr-2" />Gestión de Marcas</h1>
      <div className="mx-10 justify-end">
        <Link to="/add-marca">
        <button  className="px-4 py-2 mr-8 text-sm text-withe font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent" title="Agregar">
        <FontAwesomeIcon icon={faPlus} />
          </button>
        </Link>
      </div>
      </div>



      
      <Box sx={{ width: "100%" }}>
        <DataGrid
          className="bg-slate-700 shadow-lg shadow-blue-600/40 mx-16 my-4"
          rows={marcas}
          columns={columns}
          getRowId={(row) => row._id}
         
>>>>>>> 60306eb967723c91bfbcf96a43887b3680169091
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
              fontSize: '18px',
            },
>>>>>>> 60306eb967723c91bfbcf96a43887b3680169091
          }}
          slots={{ toolbar: GridToolbar }}
        />
      </Box>
    </div>
  );
}
