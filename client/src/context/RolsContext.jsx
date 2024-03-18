import { useContext, useState, createContext, useEffect } from "react";
import {
    getRolesRequest,
    getRolRequest,
    createRolRequest,
    updateRolRequest,
    deleteRolRequest
} from "../api/rols";


const RolesContext = createContext();

export const useRoles = () => {
  const context = useContext(RolesContext);
  if (!context) throw new Error("useRoles debe ser usado en RolesContext");
  return context;
};

export function RolesProvider({ children }) {
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState([]);

  const getRoles = async () => {
    try {
      const res = await getRolesRequest();
      setRoles(res)
    } catch (error) {
      console.error(error);
    }
  };

  const createRol = async (roles) => {
      try {
        return await createRolRequest(roles);
        // return response
      } catch (error) {
        setErrors(error.response.data.message);
      }
    
  }

  const getRol = async (id) => {
    try {
      const res = await getRolRequest(id);
      return res;
    } catch (error) {
      console.error(error);
    }
  };

  const updateRol = async (id, updatedRol) => {
    try {
      const existingRoleNames = roles.map(role => role.name.toLowerCase());
      if (existingRoleNames.includes(updatedRol.name.toLowerCase())) {
        throw new Error("Ese rol ya existe");
      } else {
        const res = await updateRolRequest(id, updatedRol);
        return res;
      }
    } catch (error) {
      console.error(error);
      setErrors([error.message]);
    }
  };

  const deleteRol = async (id) => {
    try {
      const res = await deleteRolRequest(id);
      if (res.status === 204) setClientes(roles.filter((roles) => roles._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (errors?.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errors]);


  

  return (
    <RolesContext.Provider
        value={{
            roles,
            // cliente,
            errors,
            getRoles,
            createRol,
            updateRol,
            deleteRol,
            getRol,
        }}
    >
      {children}
    </RolesContext.Provider>
  );
}
