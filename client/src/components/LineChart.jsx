import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';
import "./LineChar.css";
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
      
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');
      const purchasesUrl = `http://localhost:3000/api/compras?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
      const salesUrl = `http://localhost:3000/api/Cart-cliente?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;

      const [purchasesResponse, salesResponse] = await Promise.all([
        axios.get(purchasesUrl, { withCredentials: true }),
        axios.get(salesUrl, { withCredentials: true })
      ]);

      const purchasesData = purchasesResponse.data.filter(compra => !compra.anulado);
      const salesData = salesResponse.data;

      const purchasesByDate = processData(purchasesData);
      const salesByDate = processData(salesData);

      const datesInRange = getDatesInRange(startDate, endDate);

      const chartData = {
        labels: datesInRange.map(date => format(date, 'yyyy-MM-dd')),
        datasets: [
          {
            label: 'Total de compras realizadas',
            data: datesInRange.map(date => purchasesByDate[startOfDay(date).getTime()] || 0),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
          {
            label: 'Total de ventas realizadas',
            data: datesInRange.map(date => salesByDate[startOfDay(date).getTime()] || 0),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
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
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const processData = (data) => {
    const processedData = {};

    data.forEach(item => {
      const dateKey = startOfDay(new Date(item.createdAt)).getTime();
      processedData[dateKey] = (processedData[dateKey] || 0) + 1;
    });

    return processedData;
  };

  return (
    <div className="chart-line-container chart-position">
      
      <h2 className="chart-line-title">Ventas y compras por día</h2>
      <div className="chart-line-chart-container">
        <div className="chart-line-date-input-container">
          <div>
            <label>Fecha inicial: </label>
            <input
              className="chart-line-date-input"
              type="date"
              onChange={(e) => setStartDate(new Date(e.target.value))}
            />
          </div>
          <div>
            <label>Fecha final: </label>
            <input
              className="chart-line-date-input"
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
