import React, { useEffect, useCallback } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { useRoles } from "../../context/RolsContext";
import { Link, Navigate } from "react-router-dom";
import Detalle from "../../components/Detalle";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tabla, Titulo } from "../../components/Tabla";

import {
  faMotorcycle,
  faDownload,
  faPlus,
  faPencil,
  faBan,
  faCheck,
  faInfoCircle,
  faAddressCard,
  faUserGear,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../hooks/useAuth";

export default function PageRoles() {
  const { roles, getRoles, deleteRol, updateRol } = useRoles();
  const { user } = useAuth();

  useEffect(() => {
    try {
      getRoles();
    } catch (error) {
      console.error("Error al obtener roles:", error);
    }
  }, []);

  const mostrarAlerta = (id, status) => {
    if (status === "Activo" && id === roles[0]._id) {
      Swal.fire({
        title: "Error",
        text: "No se puede desactivar el Administrador",
        icon: "error",
        background: "linear-gradient(to right, #0f172a, #082f49, #0f172a)",
        color: "white",
        iconColor: "#2563eb",
        buttonsStyling: false,
        customClass: {
          confirmButton:
            "px-5 py-1 m-1 text-lg text-white font-semibold rounded-full border-2 border-indigo-500 hover:text-white hover:bg-indigo-500",
        },
      });
    } else {
      const title = status === "Activo" ? "Inhabilitar" : "Habilitar";
      const text =
        status === "Activo"
          ? "¿Estás seguro de inhabilitar el rol?"
          : "¿Estás seguro de habilitar el rol?";
      const texto = status === "Activo" ? "Inhabilitado" : "Habilitado";

      Swal.fire({
        title: title,
        text: text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
        background: "linear-gradient(to right, #0f172a, #082f49, #0f172a)",
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
          cambiarEstado(id, status);
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            background: "linear-gradient(to right, #0f172a, #082f49, #0f172a)",
            color: "white",
            timer: 4000,
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
            background: "linear-gradient(to right, #0f172a, #082f49, #0f172a)",
            color: "white",
            timer: 4000,
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
    }
  };

  const cambiarEstado = (id, status) => {
    const nuevoEstado = status === "Activo" ? "Inactivo" : "Activo";
    updateRol(id, { status: nuevoEstado }).then(() => {
      getRoles(id); // Aquí pasamos el id como argumento
    });
  };

  const permissions = user?.rol?.permissions || [];

  
  return (
    <>
      {permissions.includes("Roles") ? (
        <>
          <div className="mt-16">
            <div className="flex flex-col sm:flex-row justify-between items-center mx-4 md:mx-16">
              <h1 className="text-2xl text-start sm:text-center ml-4 sm:ml-0 mb-4 sm:mb-0">
                <FontAwesomeIcon icon={faUserGear} className="mr-2" />
                Gestión de roles
              </h1>
              <div className="mx-4 sm:mx-0 justify-end flex">
                <Link to="/add-roles">
                  <button
                    className="px-4 py-2 text-sm text-withe font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent"
                    title="Agregar"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-4 md:mx-16">
            {roles.map((role) => (
              <div
                key={role._id}
                className={`col ${role.status === "Activo" ? "shadow-lg shadow-blue-600/40" : "shadow-lg shadow-red-800/40"} bg-slate-700 w-full p-4 rounded-md mb-2`}
              >
                <h2 className="text-xl font-semibold mb-2 text-center">
                  {role.name}
                </h2>
                <p className="mb-4">{role.permissions.join(", ")}</p>
                <div className="flex justify-center">
                  {(() => {
                    const status = role.status;
                    const roleName = role.name.toLowerCase();
                    const isAdministrator = roleName === "administrador";

                    return (
                      <>
                        {!isAdministrator && (
                          <Link
                            to={`/rol/${role._id}`}
                            className={role.status === "Activo" ? "" : "hidden"}
                            title="Editar"
                          >
                            <button className="px-4 py-1.5 m-1 text-sm text-white font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500">
                              <FontAwesomeIcon icon={faPencil} />
                            </button>
                          </Link>
                        )}
                        {!isAdministrator && (
                        <button
                          title="Activar/Inactivar"
                          className={`px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border ${
                            role.status === "Activo"
                              ? "border-red-500 hover:text-white hover:bg-red-500"
                              : "border-indigo-500 hover:text-white hover:bg-indigo-500"
                          }`}
                          onClick={() => mostrarAlerta(role._id, role.status)}
                        >
                          {role.status === "Activo" ? (
                            <FontAwesomeIcon icon={faBan} />
                          ) : (
                            <FontAwesomeIcon icon={faCheck} />
                          )}
                        </button>
                        )}
                      </>
                    );
                  })()}
                  <button title="Ver detalle">
                    <Detalle metodo={() => getRoles(role._id)} id={role._id}>
                      <table className="min-w-full">
                        <tbody className="">
                          <Titulo>
                            <FontAwesomeIcon
                              icon={faInfoCircle}
                              className="mr-2"
                            />
                            Detalles del Rol
                          </Titulo>
                          <tr>
                            <Tabla>
                              <FontAwesomeIcon
                                icon={faAddressCard}
                                className="mr-2"
                              />
                              Nombre de rol
                            </Tabla>
                            <Tabla>
                              {roles.find((rol) => rol._id === role._id)?.name}
                            </Tabla>
                          </tr>
                          <tr>
                            <Tabla>
                              <FontAwesomeIcon
                                icon={faAddressCard}
                                className="mr-2"
                              />
                              Permisos
                            </Tabla>
                            <Tabla>
                              {roles
                                .find((rol) => rol._id === role._id)
                                ?.permissions.join(", ")}
                            </Tabla>
                          </tr>
                        </tbody>
                      </table>
                    </Detalle>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <Navigate to="/tasks" />
      )}
    </>
  );
}