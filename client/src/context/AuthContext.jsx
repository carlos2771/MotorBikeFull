import { createContext, useState } from "react";
import { registerRequest } from "../api/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const signup = async (userData) => {
    try {
      // Realizar la solicitud de registro y obtener los datos del usuario
      const response = await registerRequest(userData);
      console.log(response);
      if (response && response.data) {
        setUser(response.data); // Actualizar el usuario con los datos recibidos
        setIsAuthenticated(true); // Establecer la autenticación a true
      } else {
        console.error("No se recibieron datos válidos del servidor.");
      }
    } catch (error) {
      console.error("Error al registrar usuario:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ signup, user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
