import React, { useEffect, useState } from "react";
import { useMecanicos } from "../../context/MecanicosContext";
import { Link, useParams } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { jsPDF } from "jspdf";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faIdCard, faUser, faPhone, faHome, faCheck, faInfoCircle} from "@fortawesome/free-solid-svg-icons";



export default function DetalleMecanico() {
  const { getMecanico, errors: MecanicoErrors } = useMecanicos();
  const params = useParams();
  const [mecanico, setMecanico] = useState(null);

  useEffect(() => {
    const fetchMecanicoData = async () => {
      if (params.id) {
        try {
          // Llama a la función `getMecanico` del contexto para obtener datos del mecánico
          const mecanicoData = await getMecanico(params.id);
           // Establece los datos del mecánico en el estado local
          setMecanico(mecanicoData);
        } catch (error) {
          console.error("Error al obtener el mecánico:", error);
        }
      }
    };
    // Llama a la función `fetchMecanicoData` cuando cambia el parámetro `params.id` o `getMecanico`
    fetchMecanicoData();
  }, [params.id, getMecanico]);

  const handleDownloadPDF = async () => {
    try {
      // Verifica si hay datos del mecánico
      if (!mecanico) {
        throw new Error("Mecánico es null. No se puede generar el PDF.");
      }

      // Crear un nuevo objeto jsPDF
      const pdf = new jsPDF();


       // Configurar fuente para el resto del contenido
    pdf.setFont("helvetica");

    // Obtener la fecha actual
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

    // Agregar fecha, nombre del taller y dirección
    pdf.setFontSize(12);
    pdf.text(`Fecha: ${formattedDate}`, 20, 20);
    pdf.setFontSize(16);
    pdf.text("Taller Moto racer la 36", 20, 30);
    pdf.setFontSize(12);
    pdf.text("Dirección: cll 36 # 36-37", 20, 40);

    // Agregar nombre del administrador y lugar
    pdf.setFontSize(12);
    pdf.text("Nombre del Administrador: Jhonatan Arboleda", 20, 60);
    pdf.text("Lugar: Medellin", 20, 70);

    // Agregar contenido del mecánico
    pdf.setFontSize(18);
    pdf.text(`Información del Mecánico`, 20, 90);

    // Información del mecánico en letra grande
    pdf.setFontSize(14);
    pdf.text(`Cedula: ${mecanico.cedula_mecanico}`, 20, 110);
    pdf.text(`Nombre: ${mecanico.nombre_mecanico}`, 20, 120);
    pdf.text(`Telefono: ${mecanico.telefono_mecanico}`, 20, 130);
    pdf.text(`Direccion: ${mecanico.direccion_mecanico}`, 20, 140);
    pdf.text(`Estado: ${mecanico.estado}`, 20, 150);
      // Guardar el PDF utilizando el método Blob y createObjectURL
      const blob = pdf.output("blob");
      const url = URL.createObjectURL(blob);

      // Crear un enlace y hacer clic en él para descargar el PDF, es decir, Crea un enlace invisible, lo configura para descargar el PDF y lo simula haciendo clic
      const a = document.createElement("a");
      a.href = url;
      a.download = `DetalleMecanico_${mecanico.cedula_mecanico}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Liberar el objeto URL creado
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al generar el PDF:", error.message);
    }
  };


  if (!mecanico) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center">
      <div className="bg-slate-700 max-w-md w-full p-10 shadow-lg shadow-blue-600/40">
        {MecanicoErrors.map((error, i) => (
          <div className="bg-red-500 p-2 text-white" key={i}>
            {error}
          </div>
        ))}

        {/* <h1 className="text-2xl flex justify-center">Detalles del mecánico</h1> */}
        
        <table className="table-auto w-full border border-slate-700">
          <tbody>
            <tr>
            {/* bg-blue-50 bg-opacity-50  */}
              <td colSpan="2" className="border px-4 py-2 text-center text-2xl border-slate-700 shadow-lg rounded-t-lg bg-blue-600 bg-opacity-40 shadow-blue-600/40" ><FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                Detalles del mecánico
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 border-slate-700 shadow-lg shadow-blue-600/40"><FontAwesomeIcon icon={faIdCard} className="mr-2" />Cédula</td>
              <td className="border px-4 py-2 border-slate-700 shadow-lg shadow-blue-600/40">{mecanico.cedula_mecanico}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 border-slate-700 shadow-lg shadow-blue-600/40"><FontAwesomeIcon icon={faUser} className="mr-2" />Nombre</td>
              <td className="border px-4 py-2 border-slate-700 shadow-lg shadow-blue-600/40">{mecanico.nombre_mecanico}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 border-slate-700 shadow-lg shadow-blue-600/40" ><FontAwesomeIcon icon={faPhone} className="mr-2" />Teléfono</td>
              <td className="border px-4 py-2 border-slate-700 shadow-lg shadow-blue-600/40">{mecanico.telefono_mecanico}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 shadow-lg shadow-blue-600/40 border-slate-700"><FontAwesomeIcon icon={faHome} className="mr-2" />Dirección</td>
              <td className="border px-4 py-2 border-slate-700 shadow-lg shadow-blue-600/40">{mecanico.direccion_mecanico}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 shadow-lg shadow-blue-600/40 border-slate-700" ><FontAwesomeIcon icon={faCheck} className="mr-2" />Estado</td>
              <td className="border px-4 py-2 border-slate-700 shadow-lg shadow-blue-600/40">{mecanico.estado}</td>
            </tr>
          </tbody>
        </table>
        <br />
        <div className="flex justify-end">
          <button className="px-5 py-1 text-sm text-withe font-semibold rounded-full border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent shadow-lg shadow-zinc-300/30 ml-2 ">
              <Link to="/mecanicos">
                Volver
              </Link>
          </button>
          <button
            className="px-5 py-1 text-sm text-withe font-semibold rounded-full border border-red-500 hover:text-white hover:bg-red-500 hover:border-transparent shadow-lg shadow-zinc-300/30 ml-3"
            onClick={handleDownloadPDF}
            disabled={!mecanico}><FontAwesomeIcon icon={faFilePdf} className="mr-0" />
          </button>
          
        </div>
      </div>
    </div>
  );
}
