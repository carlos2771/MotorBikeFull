import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Link, Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMotorcycle,
  faDownload,
  faPlus,
  faPencil,
  faBan,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

import { useMarcas } from "../../context/MarcasContext";
import { useAuth } from "../../hooks/useAuth";

export default function PageMarcas() {
  const { marcas, getMarcas, updateMarca } = useMarcas();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getMarcas();
  }, []);

  const mostrarAlerta = (id, nombreMarca, estado) => {
    const title = estado === "Activo" ? "Inhabilitar" : "Habilitar";
    const text =
      estado === "Activo"
        ? `¿Estás seguro de inhabilitar la marca ${nombreMarca}?`
        : `¿Estás seguro de habilitar la marca ${nombreMarca}?`;

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
        cambiarEstado(id, estado);
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
          title: "No se ha Inhabilitado",
        });
      }
    });
  };

  const cambiarEstado = (id, estado) => {
    const nuevoEstado = estado === "Activo" ? "Inactivo" : "Activo";

    updateMarca(id, { estado: nuevoEstado })
      .then((marca) => {
        if (!marca) {
          // Si la marca no se encuentra, muestra un mensaje de error
          throw new Error(
            "La marca no se puede inhabilitar, por que esta asociada a un repuesto"
          );
        }
        // Muestra un mensaje de éxito según el estado de la marca
        const successMessage = `La marca se ha ${nuevoEstado === "Activo" ? "habilitado" : "inhabilitado"
          } correctamente`;
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
          title: successMessage,
        });
        // Actualiza la lista de marcas
        getMarcas();
      })
      .catch((error) => {
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
          title:
            error.message || "Hubo un error al cambiar el estado de la marca",
        });
      });
  };

  const exportarAExcel = () => {
    const datos = marcas.map((marca) => ({
      "Nombre de Marca": marca.nombre_marca,
      Estado: marca.estado,
      "Fecha Creacion": marca.createdAt,
    }));

    const ws = XLSX.utils.json_to_sheet(datos);

    ws["!cols"] = [{ wch: 25 }, { wch: 20 }, { wch: 30 }];
    ws["!rows"] = [{ hpx: 20, outlineLevel: 0, hidden: false }];

    for (let i = 0; i < 3; i++) {
      const col = String.fromCharCode(65 + i);
      ws[`${col}1`].s = {
        font: { bold: true },
        fill: { patternType: "solid", fgColor: { rgb: "#66FFCC" } },
      };
    }

    for (let i = 2; i <= marcas.length + 1; i++) {
      for (let j = 0; j < 3; j++) {
        const col = String.fromCharCode(65 + j);
        const cell = `${col}${i}`;
        ws[cell].s = {
          fill: { patternType: "solid", fgColor: { rgb: "#FFFFFF" } },
          border: {
            left: { style: "thin", color: { rgb: "#000000" } },
            right: { style: "thin", color: { rgb: "#000000" } },
            top: { style: "thin", color: { rgb: "#000000" } },
            bottom: { style: "thin", color: { rgb: "#000000" } },
          },
        };
      }
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Marcas");
    XLSX.writeFile(wb, "marcas.xlsx");
  };



  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value); // 2. Manejar cambios en el término de búsqueda
  };

  const filteredMarcas = marcas.filter((marca) =>
    marca.nombre_marca.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const permissions = user?.rol?.permissions || [];

  return (
    <>
      {permissions.includes("Marcas") ? (
        <div className="mt-16">
           <h1 className="text-2xl text-start sm:text-center md:text-center lg:text-start ml-4 sm:ml-0 mb-4 sm:mb-0">
              <FontAwesomeIcon icon={faMotorcycle} className="ml-4 mr-2 sm:ml-4 md:ml-16" />
              Gestión de marcas
            </h1>
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
            <div className="mx-4 sm:mx-0 justify-end flex">
              <div className="flex">

                <Link to="/add-marca">
                  <button
                    className="px-4 py-2 mt-2 sm:mt-0 text-sm text-white font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent"
                    title="Agregar"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mx-4 md:mx-16">
            {filteredMarcas.map((marca) => (
              <div
                key={marca._id}
                className={`col ${marca.estado === "Activo"
                    ? "shadow-lg shadow-blue-600/40"
                    : "shadow-lg shadow-red-800/40"
                  } bg-slate-700 w-full p-4 rounded-md mb-2`}
              >
                <h3 className="text-xl font-semibold mb-2 text-center">
                  {marca.nombre_marca}
                </h3>

                <div className="mb-2 text-center">
                  {marca.estado === "Activo" && (
                    <Link
                      to={`/marca/${marca._id}`}
                      className="px-4 py-1.5 m-1 text-sm text-white font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500"
                    >
                      <FontAwesomeIcon icon={faPencil} />
                    </Link>
                  )}
                  <button
                    onClick={() =>
                      mostrarAlerta(marca._id, marca.nombre_marca, marca.estado)
                    }
                    className={`px-4 py-1 m-1 text-sm text-white font-semibold rounded-full border ${marca.estado === "Activo"
                        ? "border-red-500 hover:bg-red-500"
                        : "border-indigo-500 hover:bg-indigo-500"
                      }`}
                  >
                    {marca.estado === "Activo" ? (
                      <FontAwesomeIcon icon={faBan} />
                    ) : (
                      <FontAwesomeIcon icon={faCheck} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Navigate to="/tasks" />
      )}
    </>
  );
}