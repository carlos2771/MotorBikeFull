import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Render from "./Render";
import Header from "./Header";

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [open, setOpen] = useState(false);
  console.log(user);
  
  return (
    <div>
      {isAuthenticated ? (
        <>
          <div className="bg-zinc-700 py-3 fixed top-0 left-0 right-0 shadow-md" style={{ zIndex: 1000 }}>
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
              } bg-cyan-600 min-h-screen fixed top-0 left-0 transition-all duration-300`}
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
                  <Link to="/tasks">Tareas</Link>
                </Render>
                <Render>
                  <Link to="/add-task">agg Tareas</Link>
                </Render>
                <Render>
                  <Link to="/clientes">clientes</Link>
                </Render>
                <Render>
                  <Link to="/ventas-respuestos" className="">
                    Ventas Repuestos
                  </Link>
                </Render>
                <Render>
                  <Link to="/permisos" className="">
                    Permisos
                  </Link>
                </Render>
                <Render>
                <Link 
                to="/" onClick={()=>{
                    logout()
                }}>Logout</Link>
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
