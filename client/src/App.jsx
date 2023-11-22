import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./context/AuthContext";
import TaskPaje from "./pages/TaskPaje";
import TaskFormPage from "./pages/TaskFormPage";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./ProtectedRoute";
import { TaskProvider } from "./context/TasksContext";
import Navbar from "./components/Navbar";

import PageClientes from "./pages/clientes/PageClientes";
import { ClienteProvider } from "./context/ClientContext";
import FormCliente from "./pages/clientes/FormCliente";

import PageVentaRepuestos from "./pages/ventasRepuestos/PageVentaRepuestos";
import FormVentaRepuesto from "./pages/ventasRepuestos/FormVentaRepuesto";
import { VentasRepuestoProvider } from "./context/VentasRepuestoContex"

import PermisosPage from "./pages/Permisos/PermisosPage";
import { PermisoProvider } from "./context/PermisosContext";
import FormPermisos from "./pages/Permisos/FormPermiso";

import PageVentaServicios from "./pages/ventasServicios/PageVentaServicios";
import { VentasServicioProvider } from "./context/VentasServicioContex";
import FormVentaServicio from "./pages/ventasServicios/FormVentaServicio";
// import VentasServicioPage from "./pages/ventasServicios/VentasServiciosPage";

import PageRepuestos from "./pages/repuestos/PageRepuestos";
import { RepuestoProvider } from "./context/RepuestosContext";
import FormRepuesto from "./pages/repuestos/FormRepuestos";

import { MecanicoProvider } from "./context/MecanicosContext";
import PageMecanico from "./pages/mecanicos/PageMecanicos";
import FormMecanico from "./pages/mecanicos/FormMecanicos";

import { MarcaProvider } from "./context/MarcasContext";
import PageMarcas from "./pages/marcas/PageMarcas";
import FormMarca from "./pages/marcas/FormMarca";


import { CompraProvider } from "./context/ComprasContext";
import PageCompras from "./pages/compras/PageCompras";
import FormCompras from "./pages/compras/FormCompras";


export default function App() {

  return (
    <div>
      <AuthProvider>
        {/* Para validar las rutas de las tareas */}

        <TaskProvider>
          <ClienteProvider>
            <VentasRepuestoProvider>
              <RepuestoProvider>
                <PermisoProvider>
                  <VentasServicioProvider>
                    <RepuestoProvider>
                      <MecanicoProvider>
                        <MarcaProvider>
                          <CompraProvider>
                            {/* // para que los componentes se compartan las props entre si, sin necesidad de hacerlo manualmente (context) */}
                            <BrowserRouter>
                              <main className='min-h-screen bg-gradient-to-tr from-[#1E293B] via-[#0f172a] to-[#1E293B] px-8 md:px-14 lg:px-36 pb-10 pt-7'>
                                <Navbar />
                                <Routes>
                                  <Route path="/" element={<HomePage />} />
                                  <Route path="/login" element={<LoginPage />} />
                                  <Route path="/register" element={<RegisterPage />} />
                                  {/* rutas protegidas se envuelven en otro Route */}
                                  <Route element={<ProtectedRoute />}>
                                    <Route path="/tasks" element={<TaskPaje />} />
                                    <Route path="/add-task" element={<TaskFormPage />} />
                                    <Route path="/tasks/:id" element={<TaskFormPage />} />

                                    <Route path="/profile" element={<ProfilePage />} />
                                    <Route path="/clientes" element={<PageClientes />} />
                                    <Route path="/add-cliente" element={<FormCliente />} />
                                    <Route path="/cliente/:id" element={<FormCliente />} />

                                    <Route path="/permisos" element={<PermisosPage />} />
                                    <Route path="/add-permiso" element={<FormPermisos />} />
                                    <Route path="/permiso/:id" element={<FormPermisos />} />

                                    <Route path="/ventas-repuestos" element={<PageVentaRepuestos />} />
                                    <Route path="/add-venta-repuesto" element={<FormVentaRepuesto />} />
                                    <Route path="/venta-repuesto/:id" element={<FormVentaRepuesto />} />

                                    <Route path="/ventas-servicios" element={<PageVentaServicios />} />
                                    <Route path="/add-venta-servicio" element={<FormVentaServicio />} />
                                    <Route path="/ventas-servicios/:id" element={<FormVentaServicio />} />

                                    <Route path="/repuestos" element={<PageRepuestos />} />
                                    <Route path="/add-repuesto" element={<FormRepuesto />} />
                                    <Route path="/repuestos/:id" element={<FormRepuesto />} />

                                    <Route path="/mecanicos" element={<PageMecanico />} />
                                    <Route path="/add-mecanico" element={<FormMecanico />} />
                                    <Route path="/mecanico/:id" element={<FormMecanico />} />

                                    <Route path="/marcas" element={<PageMarcas />} />
                                    <Route path="/add-marca" element={<FormMarca />} />
                                    <Route path="/marca/:id" element={<FormMarca />} />


                                    <Route path="/compras" element={<PageCompras />} />
                                    <Route path="/add-compra" element={<FormCompras />} />
                                    <Route path="/compras/:id" element={<FormCompras />} />

                                  </Route>
                                </Routes>
                              </main>
                            </BrowserRouter>
                            </CompraProvider>
                          </MarcaProvider>
                      </MecanicoProvider>
                    </RepuestoProvider>
                  </VentasServicioProvider>
                </PermisoProvider>
              </RepuestoProvider>
            </VentasRepuestoProvider>
          </ClienteProvider>
        </TaskProvider>
      </AuthProvider>
    </div>
  );
}
