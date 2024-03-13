import { createContext, useEffect, useState } from "react";
import { registerRequest, loginRequest, verifyTokenRequest , enviarTokenRequest, validarTokenRequest, actualizarPasswordRequest, } from "../api/auth"; // Corregí "verifyTokentRequet" a "verifyTokenRequest".
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkLocalStorage = async () => {
      // Simular un tiempo de espera antes de realizar la verificación
      setTimeout(() => {
        try{
          const storedUser = localStorage.getItem('user');
          const token = Cookies.get('token');
    
          if (!token && storedUser) {
            localStorage.removeItem("user");
            setIsAuthenticated(false);
          }
    
          if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
    
        }catch (error){
          console.error(error)
        }
        
        setLoading(false);
      }, 2000); // Cambia el valor de 1000 a la cantidad de milisegundos que desees
    };
  
    checkLocalStorage();
  }, []);
  const signup = async (user) => { // Registrarse
    try {
      const response = await registerRequest(user);
      setUser(response);
      setIsAuthenticated(false) 
      setLoading(false)
      return response
    } catch (error) {
      setErrors(error.response.data.message); 
    } 
  };

  const signin = async (user) => {
    try {
      const response = await loginRequest(user);
      setUser(response);
      // setUser(response.data); si tiene algun error en el login, pruebe esto
      setIsAuthenticated(true);
      setLoading(false)
      localStorage.setItem('user', JSON.stringify(response));
    } catch (error) {
      setErrors(error.response.data.message);
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null)
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  // AuthContext.jsx
  const enviarToken = async (email) => {
    try {
      // Lógica para verificar si el correo electrónico está registrado (debería implementarse según tus necesidades)
        const isEmailRegistered = await enviarTokenRequest(email);

        if (isEmailRegistered) {
            return true;  // El correo electrónico está registrado
        } else {
            return false;  // El correo electrónico no está registrado
        }
    } catch (error) {
        return false;  // Manejo de errores, el correo electrónico no está registrado
    }
  };

  const validarToken = async (code) => {
    try {
      // Hacer la solicitud para validar el token
      const response = await validarTokenRequest(code);
      // setUser(response)
  
      // Verificar si la respuesta indica que el código es válido
      // const isValidCode = response && response.status === 200 && response.data && response.data.valid;
  
      if (response) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      setErrors(error.response?.data?.message || 'Error al validar el código.');
      return false;
    }
  };
  
  const actualizarPassword = async (code,  password, confirmPassword ) => {
    try {
      const response = await actualizarPasswordRequest(code,  password, confirmPassword);
    } catch (error) {
      setErrors(error.response.data.message);
    }
  };


  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  useEffect(() => {
    const checkLogin = async () => {
      const cookies = Cookies.get();

      if (cookies.token) {
        setLoading(false);
        setIsAuthenticated(true);
        return;
      }
      try {
        const res = await verifyTokenRequest(cookies.token); 
        if (res.data) return setIsAuthenticated(true);
        setIsAuthenticated(false);
        setUser(res.data);
        setLoading(false)
      } catch (error) {
        setIsAuthenticated(false);
        setLoading(true);
      }
    };

    checkLogin();
  }, []);



  return (
    <AuthContext.Provider value={{ signup, signin, logout, enviarToken,
      validarToken, actualizarPassword, loading, user, isAuthenticated, errors }}>
      {children}  
    </AuthContext.Provider>
  );
};