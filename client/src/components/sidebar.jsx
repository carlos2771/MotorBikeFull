import React from "react";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <a href="/tasks">Tareas</a>
        </li>
        <li>
          <a href="/clientes">Clientes</a>
        </li>
        <li>
          <a href="/mecanicos">Mecánicos</a>
        </li>
        <li>
          <a href="/ventas-respuestos">Ventas Repuestos</a>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
