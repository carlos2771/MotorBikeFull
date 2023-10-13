import { createContext, useState } from "react";
import { registerRequest } from "../api/auth";
import axios from "axios";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([])

  const signup = async (userData) => {
    try {
      // Realizar la solicitud de registro y obtener los datos del usuario
      const response = await registerRequest(userData);
      console.log(response);
      setUser(response); // Actualizar el usuario con los datos recibidos
      setIsAuthenticated(true); // Establecer la autenticación a true
      
    } catch (error) {
      if(axios.isAxiosError(error)) setErrors(error.response.data)  
    } 
  };

  return (
    <AuthContext.Provider value={{ signup, user, isAuthenticated, errors }}>
      {children}
    </AuthContext.Provider>
  );
};
