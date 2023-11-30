// import React, { useEffect, useState } from "react";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import { Pie } from "react-chartjs-2";
// import "./CharPie.css";
// import "chartjs-adapter-date-fns"; // <- Asegúrate de tener esta línea solo si la necesitas

// ChartJS.register(ArcElement, Tooltip, Legend);

// export function CharPie() {
//   const [mecanicos, setMecanicos] = useState([]);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const response = await fetch("http://localhost:3000/api/mecanicos", {
//         credentials: "include",
//       });

//       if (!response.ok) {
//         throw new Error("Error fetching data");
//       }

//       const data = await response.json();
//       setMecanicos(data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const data = {
//     labels: mecanicos.map((mecanico) => mecanico.nombre_mecanico),
//     datasets: [
//       {
//         label: "# of Votes",
//         data: mecanicos.map((mecanico) => mecanico.telefono_mecanico),
//         backgroundColor: [
//           "rgba(255, 99, 132, 0.2)",
//           "rgba(54, 162, 235, 0.2)",
//           "rgba(255, 206, 86, 0.2)",
//           "rgba(75, 192, 192, 0.2)",
//           "rgba(153, 102, 255, 0.2)",
//           "rgba(255, 159, 64, 0.2)",
//         ],
//         borderColor: [
//           "rgba(255, 99, 132, 1)",
//           "rgba(54, 162, 235, 1)",
//           "rgba(255, 206, 86, 1)",
//           "rgba(75, 192, 192, 1)",
//           "rgba(153, 102, 255, 1)",
//           "rgba(255, 159, 64, 1)",
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };

//   return (
//     <div className="chart-container chart-position">
//       <h2 className="chart-title">Telefonos por Mecánico</h2>
//       <Pie data={data} />
//     </div>
//   );
// }
