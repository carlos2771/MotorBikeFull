import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';
import "./CharBar.css"; // Importa el archivo de estilos CSS
import Swal from 'sweetalert2';
import { startOfDay, endOfDay } from 'date-fns'; // Importar funciones de date-fns

const LineChart = () => {
  const [data, setData] = useState({});
  const [startDate, setStartDate] = useState(startOfDay(new Date())); // Configurar la fecha inicial al comienzo del día actual
  const [endDate, setEndDate] = useState(endOfDay(new Date())); // Configurar la fecha final al final del día actual

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    try {
      if (startDate > endDate) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La fecha de inicio no puede ser mayor que la fecha de final',
          background: "#334155",
          color: "white",
          buttonsStyling: false,
          customClass: {
            confirmButton: "px-5 py-1 m-1 text-lg text-white font-semibold rounded-full border-2 border-indigo-500 hover:text-white hover:bg-indigo-500"
          }
        });
        return;
      }

      const url = 'http://localhost:3000/api/compras';
      const response = await axios.get(url, { withCredentials: true });
      console.log('Response:', response);
      if (!response.data || response.data.length === 0) {
        throw new Error('No data found');
      }

      const fetchedData = response.data.filter(compra => !compra.anulado); // Filtrar las compras que no están anuladas y que estén dentro del rango de fechas
      const filteredData = fetchedData.filter(compra => {
        const fechaCompra = new Date(compra.fecha);
        return fechaCompra >= startDate && fechaCompra <= endDate;
      });

      console.log('Fetched data:', fetchedData);
      console.log('Filtered data:', filteredData);
  
      const totalPorMes = {};
      filteredData.forEach(compra => {
        const fechaCompra = new Date(compra.fecha);
        const mes = fechaCompra.toLocaleString('default', { month: 'long' });
        const dia = fechaCompra.getDate();
        const label = `${mes} ${dia}`;
        totalPorMes[label] = (totalPorMes[label] || 0) + 1;
      });
      console.log('Total por mes:', totalPorMes);
  
      if (Object.keys(totalPorMes).length === 0) {
        console.log('No hay datos para mostrar en la gráfica');
        return;
      }

      const chartData = {
        labels: Object.keys(totalPorMes),
        datasets: [
          {
            label: 'Total de compras realizadas',
            data: Object.values(totalPorMes),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            barThickness: 30, // Ancho de las barras
          },
        ],
      };
      console.log('Chart data:', chartData);

      setData(chartData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="chart-bar-container">
      <h2 className="chart-bar-title">Ventas y compras por día</h2>
      <div className="chart-bar-chart-container">
        <div className="chart-bar-date-input-container">
          <div>
            <label>Fecha inicial: </label>
            <input
              className="chart-bar-date-input"
              type="date"
              value={startDate.toISOString().split('T')[0]}
              onChange={(e) => setStartDate(startOfDay(new Date(e.target.value)))}
            />
          </div>
          <div>
            <label>Fecha final: </label>
            <input
              className="chart-bar-date-input"
              type="date"
              value={endDate.toISOString().split('T')[0]}
              onChange={(e) => setEndDate(endOfDay(new Date(e.target.value)))}
            />
          </div>
        </div>
        {Object.keys(data).length > 0 ? (
          <Line
            data={data}
            options={{
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
                    precision: 0, // Redondear los valores del eje Y a números enteros
                  },
                },
              },
              indexAxis: 'x',
            }}
          />
        ) : (
          <p>No hay datos disponibles para mostrar en la gráfica</p>
        )}
      </div>
    </div>
  );
};

export default LineChart;
