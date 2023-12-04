import React, { useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { useClientes } from "../../context/ClientContext";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Detalle from "../../components/Detalle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faIdCard, faUser, faPhone, faPen, faPencil , faBan,  faCheck, faInfoCircle, faAddressCard} from "@fortawesome/free-solid-svg-icons";
import {Tabla, Titulo} from "../../components/Tabla";

export default function PageClientes() {
  const { clientes, getClientes, deleteCliente, updateCliente, getCliente } =
    useClientes();

  useEffect(() => {
    try {
      getClientes();
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  }, []);
  useEffect(() => {
    try {
      getCliente(id);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  }, []);

  const mostrarAlerta = (id, estado) => {
    const titulo = estado === "Activo" ? "Inhabilitar": "Habilitar"
    const text =
      estado === "Activo"
        ? "¿Estás seguro de inhabilitar el cliente?"
        : "¿Estás seguro de habilitar el cliente?";
    const texto = estado === "Activo" ? "Inhabilitado" : "Habilitado";

    //"px-4 py-1.5 m-1 text-sm text-white font-semibold rounded-full border border-green-500 hover:text-white hover:bg-green-500 ",

    Swal.fire({
      title: titulo,
      text: text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si",
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
  };

  const cambiarEstado = (id, estado) => {
    const nuevoEstado = estado === "Activo" ? "Inactivo" : "Activo";
    updateCliente(id, { estado: nuevoEstado }).then(() => {
      getClientes();
    });
  };

  const columns = [
    {
      field: "nombre_cliente",
      headerName: "Nombre",
      width: 280,
    },
    // {
    //   field: "sexo",
    //   headerName: "Sexo",
    //   width: 190,
    // },
    {
      field: "email_cliente",
      headerName: "Email",
      width: 290,
    },
    {
      field: "telefono_cliente",
      headerName: "Telefono",
      width: 200,
    },
    {
      field: "cedula",
      headerName: "Cedula",
      width: 200,
    },
    {
      field: "estado",
      headerName: "Estado",
      width: 100,
    },
    // {
    //   field: "createdAt",
    //   headerName: "Fecha Creacion",
    //   width: 240,

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
      renderCell: (params) => {
        const estado = params.row.estado;
        console.log("estado", estado);
        return (
          <div>
            <button className={estado === "Activo" ? "" : "hidden"}>
              <Link
                className="px-4 py-1.5 m-1 text-sm text-white font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500"
                to={`/cliente/${params.row._id}`}
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
                metodo={() => getCliente(params.row._id)}
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
                          clientes.find(
                            (cliente) => cliente._id === params.row._id
                          )?.nombre_cliente
                        }
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla >
                        <FontAwesomeIcon icon={faUser} className="mr-2" />
                        Sexo
                      </Tabla>
                      <Tabla >
                        {
                          clientes.find(
                            (cliente) => cliente._id === params.row._id
                          )?.sexo
                        }
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla >
                        <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                        Email
                      </Tabla>
                      <Tabla >
                      {
                    clientes.find((cliente) => cliente._id === params.row._id)
                      ?.email_cliente
                  }
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla >
                        <FontAwesomeIcon icon={faPhone} className="mr-2" />
                        Telefono
                      </Tabla>
                      <Tabla >
                      {
                    clientes.find((cliente) => cliente._id === params.row._id)
                      ?.telefono_cliente
                  }
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla >
                        <FontAwesomeIcon icon={faAddressCard} className="mr-2" />
                        Tipo Documento
                      </Tabla>
                      <Tabla >
                      {
                    clientes.find((cliente) => cliente._id === params.row._id)
                      ?.tipo
                  }
                      </Tabla>
                    </tr>
                    <tr>
                      <Tabla >
                        <FontAwesomeIcon icon={faAddressCard} className="mr-2" />
                        Cedula
                      </Tabla>
                      <Tabla >
                      {
                    clientes.find((cliente) => cliente._id === params.row._id)
                      ?.cedula
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
      <h1 className="text-2xl text-center mx-auto">Gestionar Clientes</h1>
      <div className="mx-10 justify-end flex">
        <Link to="/add-cliente">
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mx-8">
            +
          </button>
        </Link>
      </div>
      <Box sx={{ width: "100%" }}>
        <DataGrid
          className="bg-slate-700 shadow-lg shadow-blue-600/40 mx-16 my-4"
          rows={clientes}
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
