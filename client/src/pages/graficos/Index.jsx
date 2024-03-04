import React from "react";
import { CharBar } from "../../components/CharBar";
import LineChart from "../../components/LineChart"; // Importa el componente LineChart
import SimpleCard from "../../components/SimpleCard";
import SimpleCard3 from "../../components/SimpleCard3";
import SimpleCard2 from "../../components/SimpleCard2";
import SimpleCard4 from "../../components/SimpleCard4";

import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";


export default function GraficosPage() {

  const { user } = useAuth();

  const permissions = user?.rol?.permissions || [];

  return (
    <>
            {permissions.includes("Dashboard") ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div>
        <SimpleCard2 />  
      </div>

      <div>
        <SimpleCard />
      </div>

      <div>
        <SimpleCard3 />
      </div>

      <div>
        <SimpleCard4 />
      </div>

      <div className="md:col-span-2 md:col-span-2 lg:col-span-2">
        <CharBar/>
      </div>

      <div className="md:col-span-2 md:col-span-2 lg:col-span-2">
        <LineChart/>
      </div>
    </div>
  ) : (
    <Navigate to='/tasks' />
)}
</>
  )
}
