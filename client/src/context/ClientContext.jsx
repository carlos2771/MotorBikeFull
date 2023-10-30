import { useContext, useState, createContext, useEffect } from "react";
import {
  getClientesRequest,
  getClienteRequest,
  createClientesRequest,
  updateClientesRequest,
  deleteClientesRequest
} from "../api/clientes";


const ClienteContext = createContext();

export const useClientes = () => {
  const context = useContext(ClienteContext);
  if (!context) throw new Error("useClientes debe ser usado en ClienteProvider");
  return context;
};

export function ClienteProvider({ children }) {
  const [clientes, setClientes] = useState([]);
  // const [cliente, setCliente] = useState(null)
  const [errors, setErrors] = useState([]);

  const getClientes = async () => {
    try {
      const res = await getClientesRequest();
      console.log(res);
      setClientes(res)
    } catch (error) {
      console.error(error);
    }
  };

  const createCliente = async (cliente) => {
      try {
        return await createClientesRequest(cliente);
        // return response
        console.log("clientes:",response)
      } catch (error) {
        console.log(error);
        setErrors(error.response.data.message);
      }
    
  }

  const getCliente = async (id) => {
    try {
      const res = await getClienteRequest(id);
      return res;
    } catch (error) {
      console.error(error);
    }
  };

  const updateCliente = async (id, cliente) => {
    try {
      await updateClientesRequest(id, cliente);
    } catch (error) {
      console.error(error);
      setErrors(error.response.data.message)
    }
  };

  const deleteCliente = async (id) => {
    try {
      const res = await deleteClientesRequest(id);
      console.log(res);
      if (res.status === 204) setClientes(clientes.filter((cliente) => cliente._id !== id));
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
    <ClienteContext.Provider
      value={{
        clientes,
        // cliente,
        errors,
        getClientes,
        createCliente,
        updateCliente,
        deleteCliente,
        getCliente,
      }}
    >
      {children}
    </ClienteContext.Provider>
  );
}
