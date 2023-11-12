import { createContext, useEffect, useState } from "react";
import { registerRequest, loginRequest, verifyTokenRequest ,             enviarTokenRequest, validarTokenRequest, actualizarPasswordRequest, } from "../api/auth"; // Corregí "verifyTokentRequet" a "verifyTokenRequest".
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  // const signup = async (user) => {
  //   try {
  //     const res = await registerRequest(user);
  //     if (res.status === 200) {
  //       setUser(res.data);
  //       setIsAuthenticated(true);
  //       console.log("authh.res",isAuthenticated);
  //     }
  //   } catch (error) {
  //     console.log(error.response.data);
  //     setErrors(error.response.data.message);
  //   }
  // };
  const signup = async (user) => { // Registrarse
    try {
      // Realizar la solicitud de registro y obtener los datos del usuario
      const response = await registerRequest(user);
      console.log(response);
      setUser(response); // Actualizar el usuario con los datos recibidos
      setIsAuthenticated(true); // Establecer la autenticacións a true
    } catch (error) {
      console.log(error.response.data);
      setErrors(error.response.data.message); 
    } 
  };

  const signin = async (user) => {
    try {
      const response = await loginRequest(user);
      setUser(response);
      // setUser(response.data); si tiene algun error en el login, pruebe esto
      setIsAuthenticated(true);
      console.log("data",response);
    } catch (error) {
      console.log(error);
      setErrors(error.response.data.message);
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  const enviarToken = async (email) => {
    try {
      const response = await enviarTokenRequest(email);
      console.log(response);
      console.log("se creo correctamente el token")
      console.log("se envio correctamente el email")
    } catch (error) {
      console.log(error.response.data);
      setErrors(error.response.data.message);
    }
  };
  const validarToken = async (token) => {
    try {
      const response = await validarTokenRequest(token);
      console.log(response);
      console.log();
    } catch (error) {
      console.log(error.response.data);
      setErrors(error.response.data.message);
    }
  };
  const actualizarPassword = async (token, password, confirmPassword) => {
    try {
      const response = await actualizarPasswordRequest(token, password, confirmPassword);
      console.log(response);
    } catch (error) {
      console.log(error.response.data);
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
      console.log('entro');
      const cookies = Cookies.get();

      if (!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      try {
        const res = await verifyTokenRequest(cookies.token); // Corregí "verifyTokentRequet" a "verifyTokenRequest".
        if (!res.data) return setIsAuthenticated(false);
        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setIsAuthenticated(false);
        setLoading(false);
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
