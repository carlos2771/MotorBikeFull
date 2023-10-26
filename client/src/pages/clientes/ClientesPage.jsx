import { useEffect, useState } from "react";
import MuiDataTable from "mui-datatables";
import { useClientes } from "../../context/ClientContext";

export default function ClientesPage() {
  const { clientes, getClientes } = useClientes();

  useEffect(() => {
    getClientes();
  }, []);

  if (clientes.length === 0) return <h1>No hay tareas</h1>;

  const columns = [
    {
      name: "_id",
      label: "ID",
    },
    {
      name: "nombre_cliente",
      label: "Nombre",
    },
    {
      name: "email_cliente",
      label: "Email",
    },
    {
      name: "updatedAt",
      label: "Fecha Creacion",
      options: {
        customBodyRender: (value) => {
          // Formatea la fecha en el formato deseado
          const date = new Date(value);
          return date.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        },
      },
    },
  ];

  return (
    <div>
      <MuiDataTable title={"Clientes"} data={clientes} columns={columns} />
    </div>
  );
}
