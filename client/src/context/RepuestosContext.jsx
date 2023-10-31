import { useContext, useState, createContext, useEffect } from "react";
import { getrRepuestosRequest } from "../api/repuestos";


const RepuestoContext = createContext();

export const useRepuestos = () => {
  const context = useContext(RepuestoContext);
  if (!context)
    throw new Error(
      "useRepuestos debe ser usado en VentaRepuestoProvider"
    );
  return context;
};

export function RepuestoProvider({ children }) {
  const [repuestos, setRepuestos] = useState([]);
  const [errors, setErrors] = useState([]);

  const getRepuestos = async () => {
    try {
      const res = await getrRepuestosRequest();
      console.log(res);
      setRepuestos(res);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <RepuestoContext.Provider
      value={{
        repuestos,
        getRepuestos,
      }}
    >
      {children}
    </RepuestoContext.Provider>
  );
}