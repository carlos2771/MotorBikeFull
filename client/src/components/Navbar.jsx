import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Render from "./Render";
import Header from "./Header";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faUsers, faMotorcycle, faTools, faShoppingCart, faHandshake, faShoppingBag, faChartBar, faSignOutAlt, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [open, setOpen] = useState(true);
  console.log(user);

  return (
    <div>
      {isAuthenticated ? (
        <>
          <div
            className="bg-slate-700 fixed top-0 left-0 right-0 shadow-md "
            style={{ zIndex: 1000 }}
          >
            <div className="flex justify-between m-2">
            <button className=" px-3" onClick={() => setOpen(true)}>
              <FontAwesomeIcon icon={faTasks}/>
            </button>

            <Render>
                    <Link
                      to="/"
                      
                      onClick={() => {
                        logout();
                      }}
                      className="hover:bg-zinc-400 hover:bg-opacity-90 px-3"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} /> 
                    </Link>
                  </Render>
            </div>
            

            <div
              className={`${!open && "hidden"
                } bg-gray-600/50 min-h-screen  fixed top-0 left-0 right-0 transition-all duration-300`}
              onClick={() => setOpen(false)}
            ></div>

            <div
              className={`${open ? "w-80" : "w-0"
                } bg-slate-700 min-h-screen fixed top-0 left-0 transition-all duration-300`}
            >
              <div className={`${!open && "hidden"} pt-3`}>
                <button
                  className="ml-4 text-white "
                  onClick={() => setOpen(false)}
                >
                 <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <div onClick={() => setOpen(false)}>
                <Render>
                    <Link
                      to="/graficos"  
                      className="flex ms-10 p-2"
                    >
                      <FontAwesomeIcon icon={faChartBar} className="mr-2" /> Dashboard
                    </Link>
                  </Render>
                  <Render>
                    <Link to="/rol" className="flex ms-10 p-2">
                      <FontAwesomeIcon icon={faUsers} className="mr-2" /> Roles
                    </Link>
                  </Render>
                  <Render>
                    <Link to="/usuarios" className="flex ms-10 p-2">
                      <FontAwesomeIcon icon={faUsers} className="mr-2" /> Usuarios
                    </Link>
                  </Render>
                  <Render>
                    <Link to="/clientes" className="flex ms-10 p-2">
                      <FontAwesomeIcon icon={faUsers} className="mr-2" /> Clientes
                    </Link>
                  </Render>
                  <Render>
                    <Link to="/mecanicos" className="flex ms-10 p-2">
                      <FontAwesomeIcon icon="wrench" className="mr-2" /> Mecánicos
                    </Link>
                  </Render>
                  <Render>
                    <Link to="/marcas" className="flex ms-10 p-2">
                      <FontAwesomeIcon icon={faMotorcycle} className="mr-2" /> Marcas
                    </Link>
                  </Render>
                  <Render>
                    <Link to="/repuestos" className="flex ms-10 p-2">
                      <FontAwesomeIcon icon={faTools} className="mr-2" /> Repuestos
                    </Link>
                  </Render>
                  <Render>
                    <Link
                      to="/compras"
                      className="flex ms-10 p-2"
                    >
                      <FontAwesomeIcon icon={faShoppingBag} className="mr-2" /> Compras
                    </Link>
                  </Render>
                  <Render>
                    <Link to="/home-page" className="flex ms-10 p-2">
                      <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />Ventas repuestos
                    </Link>
                  </Render>
                  {/* <Render>
                    <Link
                      to="/ventas-repuestos"
                      className="flex ms-10 p-2"
                    >
                      <FontAwesomeIcon icon={faShoppingCart} className="mr-2" /> Ventas Repuestos
                    </Link>
                  </Render> */}
                  <Render>
                    <Link
                      to="/ventas-servicios"
                      className="flex ms-10 p-2"
                    >
                      <FontAwesomeIcon icon={faHandshake} className="mr-2" /> Ventas Servicios
                    </Link>
                  </Render>
                  <Render>
                    <Link
                      to="/tasks"
                      className="flex ms-10 p-2"
                    >
                      <FontAwesomeIcon icon={faTasks} className="mr-2" /> Tareas
                    </Link>
                  </Render>
                  
                  {/* <Render>
                    <Link
                      to="/"
                      
                      onClick={() => {
                        logout();
                      }}
                      className="absolute  inset-x-0 bottom-0 hover:bg-zinc-400 hover:bg-opacity-90 p-3 "
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
                    </Link>
                  </Render> */}
                </div>
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
