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
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  
  
  const getUsuarios = async () => {
    try {
      const res = await getUsuariosRequest();
      setUsuarios(res);
    } catch (error) {
      console.error(error);
      setErrors([error.message]);
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

  const createUsuario = async (usuario) => {
    try {
      const res = await createUsuarioRequest(usuario);
      setUsuarios([...usuarios, res]);
    } catch (error) {
      console.error(error);
      setErrors([error.message]);
    }
  };

  const updateUsuario = async (id, usuario) => {
    try {
      const res = await updateUsuarioRequest(id, usuario);
      setUsuarios(usuarios.map((u) => (u.id === id ? { ...u, ...res } : u)));
    } catch (error) {
      console.error(error);
      setErrors([error.message]);
    }
  };

  const deleteUsuario = async (id) => {
    try {
      await deleteUsuarioRequest(id);
      setUsuarios(usuarios.filter((u) => u.id !== id));
    } catch (error) {
      console.error(error);
      setErrors([error.message]);
    }
  };

  useEffect(() => {
    getUsuarios();
  }, []);



  return (
    <UsuarioContext.Provider 
    value={{
      errors, usuarios,
      getUsuarios,
      createUsuario,
      updateUsuario,
      deleteUsuario,
      getUsuario }}>
      {children}
    </UsuarioContext.Provider>
  );
};
