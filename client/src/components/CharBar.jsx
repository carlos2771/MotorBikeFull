import React, { useEffect, useState } from "react";
import { Chart as ChartJS, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from "chart.js";
import { Bar } from "react-chartjs-2";
import "./CharBar.css";

ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

export function CharBar() {
  const [ventasServicios, setVentasServicios] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    try {
      if (startDate && endDate && startDate > endDate) {
        console.error("Error: La fecha de inicio no puede ser mayor que la fecha de fin");
        // Puedes mostrar un mensaje de error al usuario, por ejemplo:
        alert("La fecha de inicio no puede ser mayor que la fecha de fin");
        return;
      }
  
      let url = "http://localhost:3000/api/ventas_servicios";
  
      if (startDate && endDate) {
        const formattedStartDate = startDate.toISOString().split("T")[0];
        const formattedEndDate = endDate.toISOString().split("T")[0];
        console.log("Fecha de inicio formateada:", formattedStartDate);
        console.log("Fecha de fin formateada:", formattedEndDate);
        url += `?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
      }
  
      const response = await fetch(url, {
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("Error fetching data");
      }
  
      const data = await response.json();
      setVentasServicios(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Puedes manejar el error como desees
    }
  };

  const sumarVentasPorMecanico = () => {
    const sumas = {};
  
    ventasServicios.forEach((venta) => {
      const nombreMecanico = venta.mecanico.nombre_mecanico;
      const precioServicio = venta.precio_servicio;
      const fechaVenta = venta.createdAt ? new Date(venta.createdAt) : null;
  
      if (startDate && endDate) {
        const formattedStartDate = startDate.toISOString().split("T")[0];
        const formattedEndDate = endDate.toISOString().split("T")[0];
  
        if (
          fechaVenta &&
          formattedStartDate <= formatDate(fechaVenta) &&
          formattedEndDate >= formatDate(fechaVenta)
        ) {
          if (sumas[nombreMecanico]) {
            sumas[nombreMecanico] += precioServicio;
          } else {
            sumas[nombreMecanico] = precioServicio;
          }
        }
      } else {
        if (sumas[nombreMecanico]) {
          sumas[nombreMecanico] += precioServicio;
        } else {
          sumas[nombreMecanico] = precioServicio;
        }
      }
    });
  
    return sumas;
  };

  // Función para formatear una fecha como "YYYY-MM-DD"
  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const data = {
    labels: Object.keys(sumarVentasPorMecanico()),
    datasets: [
      {
        label: "Precio de los servicios",
        data: Object.values(sumarVentasPorMecanico()),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
        barThickness: 20,
        
      },
    ],
  };

  return (
    <div className="chart-container">
      <div className="date-input-container">
        <div>
          <label>Fecha inicial: </label>
          <input className="date-input" type="date" onChange={(e) => setStartDate(new Date(e.target.value))} />
        </div>
        <div>
          <label>Fecha final: </label>
          <input className="date-input" type="date" onChange={(e) => setEndDate(new Date(e.target.value))} />
        </div>
      </div>
      <Bar data={data} />
    </div>
  );
}

export default CharBar;
