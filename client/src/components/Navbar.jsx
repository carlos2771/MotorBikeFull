import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Render from "./Render";
import Header from "./Header";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks,faUser, faShop ,faUserGear ,faUsers, faMotorcycle, faTools, faShoppingCart, faHandshake, faShoppingBag, faChartBar, faSignOutAlt, faGears, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import logo from '../pages/images/motorbike.png';

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [open, setOpen] = useState(true);
  const [usersOpen, setUsersOpen] = useState(false); // Estado para controlar la apertura del acordeón de usuarios
  const [ventasOpen, setVentasOpen] = useState(false);
  console.log(user);

  const toggleNavbar = () => {
    setOpen(!open);
  };

  const toggleUsersAccordion = (e) => {
    e.stopPropagation(); // Evita la propagación del evento
    setUsersOpen(!usersOpen);
  };

  const toggleVentasAccordion = (e) => {
    e.stopPropagation(); // Evita la propagación del evento
    setVentasOpen(!ventasOpen);
  };

  return (
    <div>
      {isAuthenticated ? (
        <>
          <div
            className="bg-slate-700 fixed top-0 left-0 right-0 shadow-md "
            style={{ zIndex: 1000 }}
          >
            <div className="flex justify-between m-2">
              <button className="px-3" onClick={toggleNavbar}>
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
              className={`${open ? "w-64" : "w-0"
                } bg-slate-700 min-h-screen fixed top-0 left-0 transition-all duration-300`}
            >
              <div className={`${!open && "hidden"} pt-3`} style={{ maxHeight: 'calc(100vh - 50px)', overflowY: 'auto' }}>
                <button
                  className="ml-4 text-white "
                  onClick={() => setOpen(false)}
                >
                 <h1 className=" flex ml-5 pt-1 text-[20px] font-bold text-white"><FontAwesomeIcon icon={faGears} className="mr-2"/>  Motor <span className='text-blue-300'>Bike</span></h1> 
                </button>
                <div onClick={() => setOpen(false)}>
                  <br />  
                  <Render>
                    <Link
                      to="/graficos"  
                      className="flex ms-8 p-3"
                    >
                      <FontAwesomeIcon icon={faChartBar} className="mr-2" /> Dashboard
                    </Link>
                  </Render>

                  {/* Acordeón para la sección de usuarios */}
                  <div className="">
                    <button
                      className="flex items-center justify-between w-full py-3 text-white text-center
                      text-white text-xl hover:bg-zinc-400 hover:bg-opacity-90"
                      onClick={toggleUsersAccordion} // Cambiado aquí
                    >
                      <span className="mr-auto">
                        <FontAwesomeIcon icon={faUsers} className="ml-10 mr-2" />
                        Usuarios
                      </span>
                      <FontAwesomeIcon icon={usersOpen ? faChevronUp : faChevronDown}  className="mr-4" />
                    </button>
                    {usersOpen && (
                      <div className="bg-slate-800">
                        <Render>
                          <Link to="/rol" className="flex ms-8 p-3 text-white">
                            <FontAwesomeIcon icon={faUserGear} className="mr-2" /> Roles
                          </Link>
                        </Render>
                        <Render>
                          <Link to="/usuarios" className="flex ms-8 p-3 text-white">
                            <FontAwesomeIcon icon={faUser} className="mr-2" /> Usuarios
                          </Link>
                        </Render>
                        <Render>
                          <Link to="/clientes" className="flex ms-8 p-3 text-white">
                            <FontAwesomeIcon icon={faUsers} className="mr-2" /> Clientes
                          </Link>
                        </Render>
                      </div>
                    )}
                  </div>
                  {/* Fin del acordeón de usuarios */}

                  {/* Otros enlaces */}
                  
                  <Render>
                          <Link to="/mecanicos" className="flex ms-8 p-3 text-white">
                            <FontAwesomeIcon icon="wrench" className="mr-2" /> Mecánicos
                          </Link>
                        </Render>
                  <Render>
                    <Link to="/marcas" className="flex ms-8 p-3 text-white">
                      <FontAwesomeIcon icon={faMotorcycle} className="mr-2" /> Marcas
                    </Link>
                  </Render>
                  <Render>
                    <Link to="/repuestos" className="flex ms-8 p-3 text-white">
                      <FontAwesomeIcon icon={faTools} className="mr-2" /> Repuestos
                    </Link>
                  </Render>
                  <Render>
                    <Link
                      to="/compras"
                      className="flex ms-8 p-3 text-white"
                    >
                      <FontAwesomeIcon icon={faShoppingBag} className="mr-2" /> Compras
                    </Link>
                  </Render>
                  <div className="">
                    <button
                      className="flex items-center justify-between w-full py-3 text-white text-center
                      text-white text-xl hover:bg-zinc-400 hover:bg-opacity-90"
                      onClick={toggleVentasAccordion} // Cambiado aquí
                    >
                      <span className="mr-auto">
                        <FontAwesomeIcon icon={faShop} className="ml-10 mr-2" />
                        Ventas
                      </span>
                      <FontAwesomeIcon icon={ventasOpen ? faChevronUp : faChevronDown}  className="mr-4"/>
                    </button>
                    {ventasOpen && (
                      <div className="bg-slate-800">
                  <Render>
                    <Link to="/home-page" className="flex ms-8 p-3 text-white">
                      <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />Ventas repuestos
                    </Link>
                  </Render>
                  <Render>
                    <Link
                      to="/ventas-servicios"
                      className="flex ms-8 p-3 text-white"
                    >
                      <FontAwesomeIcon icon={faHandshake} className="mr-2" /> Ventas Servicios
                    </Link>
                  </Render>
                  </div>
                    )}
                  </div>
                  {/* Fin del acordeón de usuarios */}
                  <Render>
                    <Link
                      to="/tasks"
                      className="flex ms-8 p-3 text-white"
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
