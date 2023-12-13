import React, { useEffect } from "react";
import { useTablaRepuesto } from "../context/TablaRepuestoContext";
import Detalle from "./Detalle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faIdCard } from "@fortawesome/free-solid-svg-icons";
import { useRepuestos } from "../context/RepuestosContext";


export const Products = () => {
  const { getTablaRepuestos, tablaItems } = useTablaRepuesto();
  const { repuestos, getRepuesto, deleteRepuesto, updateRepuesto } = useRepuestos()

  useEffect(() => {
    try {
      getTablaRepuestos();
      getRepuesto(id);
      console.log("trayendo datos1", getTablaRepuestos());
    } catch (error) {
      console.error("Error al traer datos:", error);
    }
  }, []);

  return (
    <div className="mt-10">
      <h1>hola</h1>
      {tablaItems &&
        tablaItems.map((tablaItem, i) => (
          <div key={i}>
            <div>
              <p>{tablaItem.cantidad_repuesto}</p>
              <p>{tablaItem.precio_unitario}</p>
              <table>
                <thead>
                  <tr>
                    <th colSpan="2">Detalles del Cliente</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Nombre</td>
                    <td>
                      {
                        tablaItems.find(
                          (repuesto) => repuestos._id === tablaItem._id
                        )?.repuesto.nombre_repuesto
                      }
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
    </div>
  );
};

