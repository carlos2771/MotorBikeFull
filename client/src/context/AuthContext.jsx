import { createContext, useEffect, useState } from "react";
import { registerRequest, loginRequest, verifyTokentRequet } from "../api/auth";
import axios from "axios";
import Cookies from "js-cookie"
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([])

  const signup = async (userData) => { // Registrarse
    try {
      // Realizar la solicitud de registro y obtener los datos del usuario
      const response = await registerRequest(userData);
      console.log(response);
      setUser(response); // Actualizar el usuario con los datos recibidos
      setIsAuthenticated(true); // Establecer la autenticacións a true
      
    } catch (error) {
      console.log(error);
      if(axios.isAxiosError(error)) setErrors(error.response.data)  
    } 
  };

  const signin = async (user) =>{
    try {
      const res =  await loginRequest(user)
      console.log(res);
      setIsAuthenticated(true);
      setUser(res.data) // estos son los datos del usuario
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
        if(Array.isArray(error.response.data)) return setErrors(error.response.data)
        setErrors([error.response.data.message])
      }
    }
  }

  useEffect(()=>{ // si hay errores y ya pasaron 3 segundos eliminese el alerta
    const timer = setTimeout(()=>{
      setErrors([])
    }, 3000)
    return () => clearTimeout(timer)
  })

  useEffect(()=>{
    const checkLogin = async() => {
      console.log('entro')
      const cookies = Cookies.get()
      console.log(cookies)
    if(cookies.token) {
      try {
        const res = await verifyTokentRequet(cookies.token)
        console.log(res);
        if(!res.data) return setIsAuthenticated(false)
        
        setIsAuthenticated(true)
        setUser(res.data)
      } catch (error) {
        console.log(error)
        setIsAuthenticated(false)
        setUser(null)
      }
    }
    }
    checkLogin()
  },[])

  return (
    <AuthContext.Provider value={{ signup, signin, user, isAuthenticated, errors }}>
      {children}
    </AuthContext.Provider>
  );
};
