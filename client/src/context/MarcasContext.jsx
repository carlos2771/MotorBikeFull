import { useContext, useState, createContext, useEffect } from "react";
import {
    getMarcasRequest,
    getMarcaRequest,
<<<<<<< HEAD
    createMarcaRequest,
    updateMarcaRequest,
    deleteMarcaRequest
} from "../api/marca.js";


const MarcasContext = createContext();

export const useMarcas = () => {
  const context = useContext(MarcasContext);
  if (!context) throw new Error("useMarcas debe ser usado en MarcasProvider");
  return context;
};

export function MarcasProvider({ children }) {
  const [marcas, setMarcas] = useState([]);

=======
    createMarcasRequest,
    updateMarcasRequest,
    deleteMarcasRequest
} from "../api/marcas";


const MarcaContext = createContext();

export const useMarcas = () => {
  const context = useContext(MarcaContext);
  if (!context) throw new Error("useMarcas debe ser usado en MarcaProvider");
  return context;
};

export function MarcaProvider({ children }) {
  const [marcas, setMarcas] = useState([]);
  // const [cliente, setCliente] = useState(null)
>>>>>>> 60306eb967723c91bfbcf96a43887b3680169091
  const [errors, setErrors] = useState([]);

  const getMarcas = async () => {
    try {
      const res = await getMarcasRequest();
      console.log(res);
      setMarcas(res)
    } catch (error) {
      console.error(error);
    }
  };

<<<<<<< HEAD
  const createMarcas = async (marcas) => {
      try {
        return await createMarcaRequest(marcas);
        // return response
        console.log("Marcas:",response)
=======
  const createMarca = async (marca) => {
      try {
        return await createMarcasRequest(marca);
        // return response
        console.log("marcas:",response)
>>>>>>> 60306eb967723c91bfbcf96a43887b3680169091
      } catch (error) {
        console.log(error);
        setErrors(error.response.data.message);
      }
    
  }

  const getMarca = async (id) => {
    try {
      const res = await getMarcaRequest(id);
      return res;
    } catch (error) {
      console.error(error);
    }
  };

<<<<<<< HEAD
  const updateMarca = async (id, marcas) => {
    try {
      await updateMarcaRequest(id, marcas);
=======
  const updateMarca = async (id, marca) => {
    try {
      return await updateMarcasRequest(id, marca);
>>>>>>> 60306eb967723c91bfbcf96a43887b3680169091
    } catch (error) {
      console.error(error);
      setErrors(error.response.data.message)
    }
  };

  const deleteMarca = async (id) => {
    try {
<<<<<<< HEAD
      const res = await deleteMarcaRequest(id);
      console.log(res);
      if (res.status === 204) setMarcas(clientes.filter((marca) => marca._id !== id));
  } catch (error) {
=======
      const res = await deleteMarcasRequest(id);
      console.log(res);
      if (res.status === 204) setClientes(marcas.filter((marca) => marca._id !== id));
    } catch (error) {
>>>>>>> 60306eb967723c91bfbcf96a43887b3680169091
      console.error(error);
    }
  };

  useEffect(() => {
<<<<<<< HEAD
    if (errors.length > 0) {
=======
    if (errors?.length > 0) {
>>>>>>> 60306eb967723c91bfbcf96a43887b3680169091
      const timer = setTimeout(() => {
        setErrors([]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errors]);


  

  return (
<<<<<<< HEAD
    <MarcasContext.Provider
      value={{
        marcas,
        // cliente,
        errors,
        getMarcas,
        createMarcas,
        updateMarca,
        deleteMarca,
        getMarca,
      }}
    >
      {children}
    </MarcasContext.Provider>
=======
    <MarcaContext.Provider
        value={{
            marcas,
            // cliente,
            errors,
            getMarcas,
            createMarca,
            updateMarca,
            deleteMarca,
            getMarca,
        }}
    >
      {children}
    </MarcaContext.Provider>
>>>>>>> 60306eb967723c91bfbcf96a43887b3680169091
  );
}
