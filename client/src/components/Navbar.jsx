import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  console.log(user);

  return (
    <nav className="bg-zinc-700 my-2 flex justify-between py-5 px-10 rounded-lg">
      <Link to="/">
        <h1 className="text-2xl font-bold">Motor Bike</h1>
      </Link>
      <ul className="flex gap-x-2">
        {isAuthenticated ? (
          <>
           <li>
                Bienvenido {user.username}
            </li>
            <li>
                <Link to="/add-task">Agregar Tarea</Link>
            </li>
            <li>
                <Link to="/tasks">Ver Tareas</Link>
            </li>
            <li >
                <Link className="bg-indigo-500 px-4 py-1 rounded-sm" 
                to="/" onClick={()=>{
                    logout()
                }}>Logout</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link className="bg-indigo-500 px-4 py-1 rounded-sm" 
              to="/login">Login</Link>
            </li>
            <li>
              <Link className="bg-indigo-500 px-4 py-1 rounded-sm"
               to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
