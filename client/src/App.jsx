import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/registerPage";
import LoginPage from "./pages/loginPage";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <div>
      <AuthProvider>
        {" "}
        {/* // para que los componentes se compartan las props entre si, sin necesidad de hacerlo manualmente (context) */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<h1>Home page </h1>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/tasks" element={<h1>Tasks</h1>} />
            <Route path="/add-task" element={<h1>Home page </h1>} />
            <Route path="/tasks/:id" element={<h1>Home page </h1>} />
            <Route path="/add-task" element={<h1>Home page </h1>} />
            <Route path="/profile" element={<h1>Home page </h1>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}
