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


import { ClienteProvider } from "./context/ClientContext";
import FormCliente from "./pages/clientes/FormCliente";

import FormVentaRepuesto from "./pages/ventasRepuestos/FormVentaRepuesto";

import { VentasRepuestoProvider} from "./context/VentasRepuestoContex"

import { RepuestoProvider } from "./context/RepuestosContext";

import PermisosPage from "./pages/Permisos/PermisosPage";
import { PermisoProvider } from "./context/PermisosContext";
import FormPermisos from "./pages/Permisos/FormPermiso";
import PageClientes from "./pages/clientes/PageClientes";
import PageVentaRepuestos from "./pages/ventasRepuestos/PageVentaRepuestos";





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
                  {/* // para que los componentes se compartan las props entre si, sin necesidad de hacerlo manualmente (context) */}
                  <BrowserRouter>
                    <main className="container mx-auto  ">  
                      <Navbar/>
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

                          <Route path="/ventas-respuestos" element={<PageVentaRepuestos/>} />
                          <Route path="/add-venta-respuesto" element={<FormVentaRepuesto />} />
                          <Route path="/venta-respuesto/:id" element={<FormVentaRepuesto />} />
                        </Route>
                      </Routes>
                    </main>
                  </BrowserRouter>
                </PermisoProvider>
              </RepuestoProvider>
            </VentasRepuestoProvider>
          </ClienteProvider>
        </TaskProvider>
      </AuthProvider>
    </div>
  );
}
