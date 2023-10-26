import { useContext, useState, createContext } from "react";
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

  const getClientes = async () => {
    try {
      const res = await getClientesRequest();
      console.log(res);
      setClientes(res);
    } catch (error) {
      console.error(error);
    }
  };

  const createCliente = async (cliente) => {
    const res = await createClientesRequest(cliente);
    console.log(res);
  };

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
    }
  };

  const deleteCliente = async (id) => {
    try {
      const res = await deleteClientesRequest(id);
      console.log(res);
      if (res.status === 204) setClientes(clientes.filter((c) => c._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ClienteContext.Provider
      value={{
        clientes,
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
