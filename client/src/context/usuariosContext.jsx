import { createContext, useEffect, useState, useContext } from "react";
import { getUsuariosRequest, getUsuarioRequest , createUsuarioRequest, updateUsuarioRequest, deleteUsuarioRequest,} from "../api/usuarios"; // Corregí "verifyTokentRequet" a "verifyTokenRequest".
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";


export const UsuarioContext = createContext();

export const useUsuario = () => {
  const context = useContext(UsuarioContext);
  if (!context) throw new Error('useUsuario debe ser usado en UsuarioProvider');
  return context;
};


export const UsuarioProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [errors, setErrors] = useState([]);
  
  
  const getUsuarios = async () => {
    try {
      const res = await getUsuariosRequest();
      setUser(res);
      console.log(res);
    } catch (error) {
      console.error("error get,",error);
    }
  };

  const createUsuario = async (usuario) => {
    try {
      const response = await createUsuarioRequest(usuario);
      setUser(response);
      return response
    } catch (error) {
      setErrors(error.response.data.message);
    }
  };

  const getUsuario = async (id) => {
    try {
      const res = await getUsuarioRequest(id);
      return res;
    } catch (error) {
      console.error(error);
    }
  };

  const updateUsuario = async (id, usuario) => {
    try {
      return await updateUsuarioRequest(id, usuario);
     
    } catch (error) {
      console.error(error);
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

  const deleteUsuario = async (id) => {
    try {
      await deleteUsuarioRequest(id);
    } catch (error) {
      console.error(error);
      setErrors(error.message.data);
    }
  };




  return (
    <UsuarioContext.Provider 
    value={{
      errors,
      user,
      getUsuarios,
      createUsuario,
      updateUsuario,
      deleteUsuario,
      getUsuario }}>
      {children}
    </UsuarioContext.Provider>
  );
};
