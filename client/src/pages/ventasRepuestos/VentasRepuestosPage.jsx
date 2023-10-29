import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import MuiDataTable from "mui-datatables";
import { useVentasRepuestos } from '../../context/VentasRepuestoContex';

export default   function VentasRepuestosPage() {
  const { getVentasRepuestos,ventasRepuestos,deleteVentaRepuesto } = useVentasRepuestos()
  useEffect(() => {
       getVentasRepuestos();
  }, [getVentasRepuestos]);
    
    const columns = [
        {
          name: "contador",
          label: "ID",
          options: {
            customBodyRender: (value, tableMeta) => {
              return tableMeta.rowIndex + 1; // Comenzar el conteo en 1 en lugar de 0
            },
          },
        },
        {
          name: "repuesto",
          label: "Repuesto",
          options: {
            customBodyRender: (value) => {
              return value.nombre_repuesto; // Muestra el nombre del repuesto
            },
          },
        },
        {
          name: "cantidad_repuesto",
          label: "cantidad repuesto",
        },
        {
          name: "precio_unitario",
          label: "precio unitario",
        },
        {
          name: "precio_total",
          label: "precio total",
        },
        {
          name: "cliente",
          label: "cliente",
          options: {
            customBodyRender: (value) => {
              return value.nombre_cliente; // Muestra el nombre del cliente
            },
          },
        },
        {
          name: "createdAt",
          label: "Fecha Creacion",
          options: {
            customBodyRender: (value) => {
              const date = new Date(value);
              return date.toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });
            },
          },
        },
        // {
        //   name: "updatedAt",
        //   label: "Fecha Creacion",
        //   options: {
        //     customBodyRender: (value) => {
        //       const date = new Date(value);
        //       return date.toLocaleDateString("es-ES", {
        //         year: "numeric",
        //         month: "long",
        //         day: "numeric",
        //       });
        //     },
        //   },
        // },
        // {
        //   name: "date",
        //   label: "fecha de venta",
        //   options: {
        //     customBodyRender: (value) => {
        //       const date = new Date(value);
        //       return date.toLocaleDateString("es-ES", {
        //         year: "numeric",
        //         month: "long",
        //         day: "numeric",
        //       });
        //     },
        //   },
        // },
        {
          name: "Acciones",
          options: {
            customBodyRender: (value, tableMeta) => {
              return (
                <div>
                  <button
                    className="px-4 py-1 text-sm text-black font-semibold rounded-full border border-red-500 hover:text-white hover:bg-red-500 hover:border-transparent"
                    onClick={() => {
                      deleteVentaRepuesto(ventasRepuestos[tableMeta.rowIndex]._id);
                    }}
                  >
                    Eliminar
                  </button>
                  <button className="px-4 py-1 m-1 text-sm text-black font-semibold rounded-full border border-green-500  hover:text-white hover:bg-green-600 focus:outline-none focus:ring-2  focus:ring-offset-2">
                    <Link to={`/venta-respuesto/${ventasRepuestos[tableMeta.rowIndex]._id}`}>
                      Editar
                    </Link>
                  </button>
                </div>
              );
            },
          },
        },
      ];
    
      return (
        <div>
          <button className="px-4 py-2 m-2 text-sm text-white font-semibold rounded-full border border-blue-500 hover:text-white hover:bg-blue-500 hover:border-transparent">
            <Link to={"/add-venta-respuesto"}>Añadir Venta</Link>
          </button>
          <MuiDataTable
            title={"Ventas Repuestos"}
            data={ventasRepuestos}
            columns={columns}
            options={{ selectableRows: "none" }}
          />
        </div>
      );
}
