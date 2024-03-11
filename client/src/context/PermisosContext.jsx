import { useContext, useState, createContext, useEffect } from "react";
import {
  createPermisosRequest,
  deletePermisosRequest,
  getPermisoRequest,
  updatePermisosRequest,
  getPermisosRequest
} from "../api/permisos";

const PermisoContext = createContext();

export const usePermisos = () => {
  const context = useContext(PermisoContext);
  if (!context)
    throw new Error(
      "usePermisos debe ser usado en PermisoProvider"
    );
  return context;
};

export function PermisoProvider({ children }) {
  const [permisos, setPermisos] = useState([]);
  const [errors, setErrors] = useState([]);

  const getPermisos = async () => {
    try {
      const res = await getPermisosRequest();
      setPermisos(res);
    } catch (error) {
      console.error(error);
    }
  };

  const createPermiso = async (permisos) => {
    try {
      return await createPermisosRequest(permisos);
    } catch (error) {
      setErrors(error.response.data.message);
    }
  };

  const getPermiso = async (id) => {
    try {
      const res = await getPermisoRequest(id);
      return res;
    } catch (error) {
      console.error(error);
    }
  };

  const updatePermiso = async (id, permisos) => {
    try {
      await updatePermisosRequest(id, permisos);
    } catch (error) {
      console.error(error);
      setErrors(error.response.data.message);
    }
  };
  
  const deletePermiso = async (id) => {
    try {
      const res = await deletePermisosRequest(id);
      if (res.status === 204) {
        setPermisos(permisos.filter((permisos) => permisos._id !== id));
      }
    } catch (error) {
      console.error(error);
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

  return (
    <PermisoContext.Provider
      value={{
        permisos,
        errors,
        getPermisos,
        createPermiso,
        getPermiso,
        updatePermiso,
        deletePermiso
      }}
    >
      {children}
    </PermisoContext.Provider>
  );
}
