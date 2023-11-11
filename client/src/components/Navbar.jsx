import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Render from "./Render";
import Header from "./Header";

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [open, setOpen] = useState(true);
  console.log(user);

  return (
    <div>
      {isAuthenticated ? (
        <>
          <div className="bg-slate-700  py-3 fixed top-0 left-0 right-0 shadow-md " style={{ zIndex: 1000 }}>
            <button className="ml-4" onClick={() => setOpen(true)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>

            <div
              className={`${
                !open && "hidden"
              } bg-gray-600/50 min-h-screen  fixed top-0 left-0 right-0 transition-all duration-300`}
              onClick={() => setOpen(false)}
            ></div>

            <div
              className={`${
                open ? "w-80" : "w-0"
              } bg-slate-700 min-h-screen fixed top-0 left-0 transition-all duration-300`}
            >
              <div className={`${!open && "hidden"} pt-3`}>
                <button
                  className="ml-4 text-white mb-14"
                  onClick={() => setOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <Render>
                  <Link to="/tasks" className="flex justify-center p-4">Tareas</Link>
                </Render>
                <Render>
                  <Link to="/clientes" className="flex justify-center p-4">Clientes</Link>
                </Render>
                <Render>
                  <Link to="/marcas" className="flex justify-center p-4">
                    Marcas
                  </Link>
                </Render>
                <Render>
                  <Link to="/repuestos" className="flex justify-center p-4">Repuestos</Link>
                </Render>
                <Render>
                  <Link to="/mecanicos" className="flex justify-center p-4">Mecanicos</Link>
                </Render>
                <Render>
                  <Link to="/ventas-repuestos" className="flex justify-center p-4">
                    Ventas Repuestos
                  </Link>
                </Render>
                <Render>
                  <Link to="/ventas-servicios" className="flex justify-center p-4">
                    Ventas Servicios
                  </Link>
                </Render>
                <Render>
                  <Link to="/compras" className="">
                    Compras
                  </Link>
                </Render>
                <Render>
                <Link 
                to="/" onClick={()=>{
                    logout()
                }} className="flex justify-center p-4">Logout</Link>
                </Render>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <Header />
        </>
      )}
    </div>
  );
}

