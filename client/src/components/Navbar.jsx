import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Render from "./Render";
import Header from "./Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTasks,
  faUser,
  faShop,
  faUserGear,
  faUsers,
  faMotorcycle,
  faTools,
  faShoppingCart,
  faHandshake,
  faShoppingBag,
  faChartBar,
  faSignOutAlt,
  faGears,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../pages/images/motorbike.png";

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [open, setOpen] = useState(true);
  const [usersOpen, setUsersOpen] = useState(false); // Estado para controlar la apertura del acordeón de usuarios
  const [ventasOpen, setVentasOpen] = useState(false);


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

  const permissions = user?.rol?.permissions || [];

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
                <FontAwesomeIcon icon={faTasks} />
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
              className={`${
                !open && "hidden"
              } bg-gray-600/50 min-h-screen  fixed top-0 left-0 right-0 transition-all duration-300`}
              onClick={() => setOpen(false)}
            ></div>

            <div
              className={`${
                open ? "w-62" : "w-0"
              } bg-slate-700 min-h-screen fixed top-0 left-0 transition-all duration-300`}
            >
              <div
                className={`${!open && "hidden"}`}
                style={{ maxHeight: "calc(100vh - 50px)", overflowY: "auto" }}
              >
                <button
                  className="bg-slate-700 text-white px-14 pt-2 sticky top-0 "
                  onClick={() => setOpen(false)}
                >
                  <h1 className=" flex p-2 text-xl font-bold text-white ">
                    <FontAwesomeIcon icon={faGears} className="mr-2" /> Motor{" "}
                    <span className="text-blue-300">Bike</span>
                  </h1>
                </button>
                <div onClick={() => setOpen(false)}>
                  <br />
                  <Render>
                    {permissions.includes("Dashboard") ? (
                      <Link to="/graficos" className="flex ms-8 p-3">
                        <FontAwesomeIcon icon={faChartBar} className="mr-2" />{" "}
                        Dashboard
                      </Link>
                    ) : (
                      <div className="hidden" />
                    )}
                  </Render>

                  {/* Acordeón para la sección de usuarios */}
                  {permissions.includes("Roles") ||
                  permissions.includes("Usuarios") ||
                  permissions.includes("Clientes") ? (
                    <div className="">
                      <button
                        className="flex items-center justify-between w-full py-3 text-white text-center
      text-white text-xl hover:bg-zinc-400 hover:bg-opacity-90"
                        onClick={toggleUsersAccordion}
                      >
                        <span className="mr-auto">
                          <FontAwesomeIcon
                            icon={faUsers}
                            className="ml-10 mr-2"
                          />
                          Usuarios
                        </span>
                        <FontAwesomeIcon
                          icon={usersOpen ? faChevronUp : faChevronDown}
                          className="mr-4"
                        />
                      </button>
                      {usersOpen && (
                        <div className="bg-slate-800">
                          <Render>
                            {permissions.includes("Roles") ? (
                              <Link
                                to="/rol"
                                className="flex ms-8 p-3 text-white"
                              >
                                <FontAwesomeIcon
                                  icon={faUserGear}
                                  className="mr-2"
                                />{" "}
                                Roles
                              </Link>
                            ) : (
                              <div className="hidden" />
                            )}
                          </Render>
                          <Render>
                            {permissions.includes("Usuarios") ? (
                              <Link
                                to="/usuarios"
                                className="flex ms-8 p-3 text-white"
                              >
                                <FontAwesomeIcon
                                  icon={faUser}
                                  className="mr-2"
                                />{" "}
                                Usuarios
                              </Link>
                            ) : (
                              <div className="hidden" />
                            )}
                          </Render>
                          <Render>
                            {permissions.includes("Clientes") ? (
                              <Link
                                to="/clientes"
                                className="flex ms-8 p-3 text-white"
                              >
                                <FontAwesomeIcon
                                  icon={faUsers}
                                  className="mr-2"
                                />{" "}
                                Clientes
                              </Link>
                            ) : (
                              <div className="hidden" />
                            )}
                          </Render>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="hidden" />
                  )}
                  {/* Fin del acordeón de usuarios */}

                  {/* Otros enlaces */}

                  <Render>
                    {permissions.includes("Mecánicos") ? (
                      <Link
                        to="/mecanicos"
                        className="flex ms-8 p-3 text-white"
                      >
                        <FontAwesomeIcon icon="wrench" className="mr-2" />{" "}
                        Mecánicos
                      </Link>
                    ) : (
                      <div className="hidden" />
                    )}
                  </Render>
                  <Render>
                    {permissions.includes("Marcas") ? (
                      <Link to="/marcas" className="flex ms-8 p-3 text-white">
                        <FontAwesomeIcon icon={faMotorcycle} className="mr-2" />{" "}
                        Marcas
                      </Link>
                    ) : (
                      <div className="hidden" />
                    )}
                  </Render>
                  <Render>
                    {permissions.includes("Repuestos") ? (
                      <Link
                        to="/repuestos"
                        className="flex ms-8 p-3 text-white"
                      >
                        <FontAwesomeIcon icon={faTools} className="mr-2" />{" "}
                        Repuestos
                      </Link>
                    ) : (
                      <div className="hidden" />
                    )}
                  </Render>
                  <Render>
                    {permissions.includes("Compras") ? (
                      <Link to="/compras" className="flex ms-8 p-3 text-white">
                        <FontAwesomeIcon
                          icon={faShoppingBag}
                          className="mr-2"
                        />{" "}
                        Compras
                      </Link>
                    ) : (
                      <div className="hidden" />
                    )}
                  </Render>
                  {permissions.includes("Venta Repuesto") ||
                  permissions.includes("Ventas Servicio") ? (
                    <div className="">
                      <button
                        className="flex items-center justify-between w-full py-3 text-white text-center
      text-white text-xl hover:bg-zinc-400 hover:bg-opacity-90"
                        onClick={toggleVentasAccordion}
                      >
                        <span className="mr-auto">
                          <FontAwesomeIcon
                            icon={faShop}
                            className="ml-10 mr-2"
                          />
                          Ventas
                        </span>
                        <FontAwesomeIcon
                          icon={ventasOpen ? faChevronUp : faChevronDown}
                          className="mr-4"
                        />
                      </button>
                      {ventasOpen && (
                        <div className="bg-slate-800">
                          <Render>
                            {permissions.includes("Venta Repuesto") ? (
                              <Link
                                to="/home-page"
                                className="flex ms-8 p-3 text-white"
                              >
                                <FontAwesomeIcon
                                  icon={faShoppingCart}
                                  className="mr-2"
                                />
                                Ventas repuestos
                              </Link>
                            ) : (
                              <div className="hidden" />
                            )}
                          </Render>
                          <Render>
                            {permissions.includes("Ventas Servicio") ? (
                              <Link
                                to="/ventas-servicios"
                                className="flex ms-8 p-3 text-white"
                              >
                                <FontAwesomeIcon
                                  icon={faHandshake}
                                  className="mr-2"
                                />{" "}
                                Ventas servicios
                              </Link>
                            ) : (
                              <div className="hidden" />
                            )}
                          </Render>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="hidden" />
                  )}
                  {/* Fin del acordeón de usuarios */}
                  <Render>
                    <Link to="/tasks" className="flex ms-8 p-3 text-white">
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