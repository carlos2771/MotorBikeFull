import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  console.log(user);

  return (
    <nav className="bg-zinc-700 my-2 flex justify-between py-5 px-10 rounded-lg ">
      <Link to={
        isAuthenticated ? "/tasks" : "/"
      }>
        <h1 className="text-2xl font-bold">Motor Bike</h1>
      </Link>
      <ul className="flex gap-x-2">
        {isAuthenticated ? (
          <>
           <li>
                Bienvenido {user.username}
            </li>
            <li>
                <Link to="/tasks">Tareas</Link>
            </li>
            <li>
                <Link to="/clientes">Clientes</Link>
            </li>
            <li>
                <Link to="/ventas-respuestos" className="">Ventas Repuestos</Link>
            </li>
            <li >
                <Link className="px-5 py-1 text-sm text-withe font-semibold rounded-full border border-indigo-500 hover:text-white hover:bg-indigo-500 hover:border-transparent shadow-lg shadow-zinc-300/30 "
                to="/" onClick={()=>{
                    logout()
                }}>Logout</Link>
            </li>
           
            
          </>
        ) : (
          <>
            <li>
              <Link className="px-5 py-1 text-sm text-withe font-semibold rounded-full border border-blue-500 hover:text-white hover:bg-blue-500 hover:border-transparent shadow-lg shadow-zinc-300/30" 
              to="/login">Login</Link>
            </li>
            <li>
              <Link className="px-5 py-1 text-sm text-withe font-semibold rounded-full border border-blue-500 hover:text-white hover:bg-blue-500 hover:border-transparent shadow-lg shadow-zinc-300/30"
               to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>

    
  );
}