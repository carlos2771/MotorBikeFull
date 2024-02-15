import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';
import "./CharBar.css";
import Swal from 'sweetalert2';
import { format, startOfDay, endOfDay } from 'date-fns';

const LineChart = () => {
  const [data, setData] = useState({});
  const [startDate, setStartDate] = useState(startOfDay(new Date()));
  const [endDate, setEndDate] = useState(endOfDay(new Date()));

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    try {
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');
      const url = `http://localhost:3000/api/compras?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
      const response = await axios.get(url, { withCredentials: true });

      if (!response.data || response.data.length === 0) {
        throw new Error('No se encontraron datos');
      }

      const fetchedData = response.data.filter(compra => !compra.anulado);

      const purchasesByDate = {};

      fetchedData.forEach(compra => {
        const fechaCompra = new Date(compra.fecha).toISOString().split('T')[0];
        purchasesByDate[fechaCompra] = (purchasesByDate[fechaCompra] || 0) + 1;
      });

      const datesInRange = getDatesInRange(startDate, endDate);

      const chartData = {
        labels: datesInRange,
        datasets: [
          {
            label: 'Total de compras realizadas',
            data: datesInRange.map(date => purchasesByDate[date] || 0),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
      };

      setData(chartData);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al obtener los datos',
        background: "#334155",
        color: "white",
        buttonsStyling: false,
        customClass: {
          confirmButton: "px-5 py-1 m-1 text-lg text-white font-semibold rounded-full border-2 border-indigo-500 hover:text-white hover:bg-indigo-500"} 
      });
    }
  };

  const getDatesInRange = (startDate, endDate) => {
    const dates = [];
    const currentDate = new Date(startDate);
    const endDateObj = new Date(endDate);

    while (currentDate <= endDateObj) {
      dates.push(format(currentDate, 'yyyy-MM-dd'));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  return (
    <div className="chart-bar-container chart-position">
      
      <h2 className="chart-bar-title">Ventas y compras por día</h2>
      <div className="chart-bar-chart-container">
        <div className="chart-bar-date-input-container">
          <div>
            <label>Fecha inicial: </label>
            <input
              className="chart-bar-date-input"
              type="date"
              onChange={(e) => setStartDate(new Date(e.target.value))}
            />
          </div>
          <div>
            <label>Fecha final: </label>
            <input
              className="chart-bar-date-input"
              type="date"
              onChange={(e) => setEndDate(new Date(e.target.value))}
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
                    color: 'gray',
                  },
                  ticks: {
                    color: 'gray',
                  },
                },
                y: {
                  grid: {
                    color: 'gray',
                  },
                  ticks: {
                    color: 'gray',
                    precision: 0,
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
