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
      setLoading(false)
       // Establecer la autenticacións a true
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
      setLoading(false)
      console.log("data",response);
    } catch (error) {
      console.log(error);
      setErrors(error.response.data.message);
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null)
    setIsAuthenticated(false);
    
  };

  // const enviarToken = async (email) => {
  //   try {
  //     const response = await enviarTokenRequest(email);
  //     console.log(response);
  //     console.log("se creo correctamente el token")
  //     console.log("se envio correctamente el email")
  //   } catch (error) {
  //     console.log(error.response.data);
  //     setErrors(error.response.data.message);
  //   }
  // };

  // AuthContext.jsx
  const enviarToken = async (email) => {
    try {
        // Lógica para enviar el token al correo electrónico (debería implementarse según tus necesidades)
        console.log('se envio correctamente el email');
        
        // Lógica para verificar si el correo electrónico está registrado (debería implementarse según tus necesidades)
        const isEmailRegistered = await enviarTokenRequest(email);

        if (isEmailRegistered) {
            console.log('se creo correctamente el token');
            return true;  // El correo electrónico está registrado
        } else {
            console.log(`El correo electrónico ${email} no está registrado.`);
            return false;  // El correo electrónico no está registrado
        }
    } catch (error) {
        console.error(error);
        return false;  // Manejo de errores, el correo electrónico no está registrado
    }
  };

  // const validarToken = async (code) => {
  //   try {
  //     const response = await validarTokenRequest(code);
  //     console.log(response);
  //     console.log();
  //   } catch (error) {
  //     console.log(error.response.data);
  //     setErrors(error.response.data.message);
  //   }
  // };

  const validarToken = async (code) => {
    try {
      // Hacer la solicitud para validar el token
      const response = await validarTokenRequest(code);
      // setUser(response)
  
      // Verificar si la respuesta indica que el código es válido
      // const isValidCode = response && response.status === 200 && response.data && response.data.valid;
  
      if (response) {
        console.log('El código es válido.');
        return true;
      } else {
        console.log('El código no es válido.');
        return false;
      }
    } catch (error) {
      console.error(error);
      setErrors(error.response?.data?.message || 'Error al validar el código.');
      return false;
    }
  };
  
  const actualizarPassword = async (code,  password, confirmPassword ) => {
    try {
      console.log("Código:", code);
      console.log("Contraseña:", password, "Confirmar contraseña:", confirmPassword);
      const response = await actualizarPasswordRequest(code,  password, confirmPassword);
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
        console.log(error);
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
