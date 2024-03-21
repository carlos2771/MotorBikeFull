import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link, Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPencil,
  faBan,
  faCheck,
  faUserGear,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../hooks/useAuth";
import { useRoles } from "../../context/RolsContext";

export default function PageRoles() {
  const { roles, getRoles, updateRol } = useRoles();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [userLoaded, setUserLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    if (user) {
      setUserLoaded(true);
    }
  }, []);

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
      getRoles(); // No necesitamos pasar el id aquí
    });
  };

  const permissions = user?.rol?.permissions || [];

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredRoles.length);
  const rolesToShow = filteredRoles.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  if (!userLoaded) {
    return <div>Cargando usuario...</div>;
  }

  return (
    <>
      {permissions.includes("Roles") ? (
        <>
          <div className="mt-9">
            <h1 className="text-2xl text-start sm:text-center md:text-center lg:text-start ml-4 sm:ml-0 mb-4 sm:mb-0">
              <FontAwesomeIcon
                icon={faUserGear}
                className="ml-4 mr-2 sm:ml-4 md:ml-16"
              />
              Gestión de roles
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center mx-16 sm:mx-4 md:mx-16 mt-2">
            <div className="">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={handleSearchTermChange}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 text-black"
              />
            </div>
            <div className="mx-4 sm:mx-0 justify-end flex mt-2 md:mt-0 sm:mt-0 ">
              <Link to="/add-roles">
                <div
                  className="px-4 py-2  text-sm text-white font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent"
                  title="Agregar"
                >
                  <FontAwesomeIcon icon={faPlus} />
                </div>
              </Link>
            </div>
          </div>

          <div className="mt-4 mx-4 md:mx-16">
            {rolesToShow.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <p className="text-center text-red-500">No se encontraron roles</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {rolesToShow.map((role) => (
                  <div
                    key={role._id}
                    className={`col ${role.status === "Activo"
                        ? "shadow-lg shadow-blue-600/40"
                        : "shadow-lg shadow-red-800/40"
                      } bg-slate-700 w-full p-4 rounded-md mb-2`}
                  >
                    <h2 className="text-lg font-bold mb-2 text-center">
                      {role.name}
                    </h2>
                    <div className="mb-1">
                      {permissions.length > 0 && (
                        <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-1 justify-center text-sm">
                          {role.permissions
                            .sort()
                            .map((permission) => (
                              <p key={permission} className="">
                                {permission}
                              </p>
                            ))}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-center">
                      {!(
                        role.name.toLowerCase() === "administrador" ||
                        role.name.toLowerCase() === "usuario"
                      ) && (
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
                      {!(
                        role.name.toLowerCase() === "administrador" ||
                        role.name.toLowerCase() === "usuario"
                      ) && (
                          <button
                            title="Activar/Inactivar"
                            className={`px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border ${role.status === "Activo"
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>


          <div className="flex items-center justify-center mt-4 mx-auto">
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm shadow-sky-100 -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={() => handlePageChange(page - 1)}
                className={`relative inline-flex items-center px-4 py-2 rounded-l-lg text-white ${page === 1
                    ? "cursor-not-allowed opacity-50 bg-slate-800 text-white"
                    : "bg-blue-500"
                  }`}
                disabled={page === 1}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 ${index + 1 === page
                      ? "z-10 font-bold bg-blue-600"
                      : "text-gray-500"
                    }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(page + 1)}
                className={`relative inline-flex items-center px-4 py-2 rounded-r-lg shadow ${page === totalPages
                    ? "cursor-not-allowed opacity-50 bg-slate-800"
                    : "bg-blue-500"
                  }`}
                disabled={page === totalPages}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </nav>
          </div>
        </>
      ) : (
        <Navigate to="/tasks" />
      )}
    </>
  );
}
