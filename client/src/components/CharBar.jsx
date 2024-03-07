import React, { useEffect, useState } from "react";
import { Chart as ChartJS, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from "chart.js";
import { Bar } from "react-chartjs-2";
import { format, startOfDay, endOfDay } from 'date-fns';  
import "./CharBar.css";
import Swal from 'sweetalert2';
import 'chart.js/auto';

ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

export function CharBar() {
  const [ventasServicios, setVentasServicios] = useState([]);
  const [startDate, setStartDate] = useState(startOfDay(new Date()));  // Iniciar con el comienzo del día actual
  const [endDate, setEndDate] = useState(endOfDay(new Date()));  
 

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    try {
      if (startDate && endDate && startDate > endDate) {
        console.error("Error: La fecha de inicio no puede ser mayor que la fecha de fin");
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La fecha de inicio no puede ser mayor que la fecha de final',
          background: "#334155",
          color: "white",
          buttonsStyling: false,
          customClass: {
            confirmButton: "px-5 py-1 m-1 text-lg text-white font-semibold rounded-full border-2 border-indigo-500 hover:text-white hover:bg-indigo-500"} 
        });
        return;
      }
  
      let url = "http://localhost:3000/api/ventas_servicios";
  
      if (startDate && endDate) {
        const formattedStartDate = startDate.toISOString().split("T")[0];
        const formattedEndDate = endDate.toISOString().split("T")[0];
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
    }
  };

  const sumarVentasPorMecanico = () => {
    const sumas = {};
  
    ventasServicios.forEach((venta) => {
      const nombreMecanico = venta.mecanico.nombre_mecanico;
      const precioServicio = venta.precio_servicio;
      const estado = venta.estado;
      const fechaVenta = venta.createdAt ? new Date(venta.createdAt) : null;
  
      if (fechaVenta && estado === "Finalizada") {
        if (startDate && endDate) {
          const formattedStartDate = formatDate(startDate);
          const formattedEndDate = formatDate(endDate);
          const formattedVentaDate = formatDate(fechaVenta);
  
          if (formattedVentaDate >= formattedStartDate && formattedVentaDate <= formattedEndDate) {
            if (sumas[nombreMecanico]) {
              sumas[nombreMecanico] += precioServicio;
            } else {
              sumas[nombreMecanico] = precioServicio;
            }
          }
        } else if (startDate && !endDate) {
          const formattedStartDate = formatDate(startDate);
          const formattedVentaDate = formatDate(fechaVenta);
  
          if (formattedVentaDate >= formattedStartDate) {
            if (sumas[nombreMecanico]) {
              sumas[nombreMecanico] += precioServicio;
            } else {
              sumas[nombreMecanico] = precioServicio;
            }
          }
        } else if (!startDate && endDate) {
          const formattedEndDate = formatDate(endDate);
          const formattedVentaDate = formatDate(fechaVenta);
  
          if (formattedVentaDate <= formattedEndDate) {
            if (sumas[nombreMecanico]) {
              sumas[nombreMecanico] += precioServicio;
            } else {
              sumas[nombreMecanico] = precioServicio;
            }
          }
        } else if (!startDate && !endDate) {
          const formattedToday = formatDate(new Date());
  
          if (formattedToday === formatDate(fechaVenta)) {
            if (sumas[nombreMecanico]) {
              sumas[nombreMecanico] += precioServicio;
            } else {
              sumas[nombreMecanico] = precioServicio;
            }
          }
        }
      }
    });
  
    return sumas;
  };
  
  const formatDate = (date) => date.toISOString().split("T")[0];

  const sumasPorMecanico = sumarVentasPorMecanico();

  const data = {
    labels: Object.keys(sumasPorMecanico),
    datasets: [
      {
        label: "Precio de los servicios",
        data: Object.values(sumasPorMecanico),
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
        barThickness: 30,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        grid: {
          color: 'gray', // Color de la línea de la cuadrícula en el eje X
        },
        ticks: {
          color: 'gray', // Color de las marcas del eje X
        },
      },
      y: {
        grid: {
          color: 'gray', // Color de la línea de la cuadrícula en el eje Y
        },
        ticks: {
          color: 'gray', // Color de las marcas del eje Y
        },
      },
    },
    indexAxis: 'y',
  };

  return (
    <div className="chart-bar-container chart-position">
  
      <h2 className="chart-bar-title">Servicios por Mecánico</h2>
      <div className="chart-bar-date-input-container">
        <div>
          <label>Fecha inicial: </label>
          <input 
          className="chart-bar-date-input" 
          type="date"
           onChange={(e) => setStartDate(new Date(e.target.value))} />
        </div>
        <div>
          <label>Fecha final: </label>
          <input className="chart-bar-date-input" type="date" onChange={(e) => setEndDate(new Date(e.target.value))} />
        </div>
      </div>
      {Object.keys(sumasPorMecanico).length === 0 ? (
        <p>No hay datos disponibles para mostrar en la gráfica</p>
      ) : (
        <Bar data={data} options={options} />
      )}
    </div>
  );
}
