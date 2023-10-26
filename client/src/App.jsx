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

export default function App() {
  return (
    <div>
      <AuthProvider>
        {/* Para validar las rutas de las tareas */}
        <TaskProvider>
          {/* // para que los componentes se compartan las props entre si, sin necesidad de hacerlo manualmente (context) */}
          <BrowserRouter>
            <main className="container mx-auto px-10">
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
              </Route>
            </Routes>
            </main>


          </BrowserRouter>
        </TaskProvider>
      </AuthProvider>
    </div>
  );
}
