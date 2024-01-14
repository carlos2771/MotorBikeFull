import { useContext, useState, createContext, useEffect } from "react";


import { createCartClienteRequest, getCartClientesRequest } from "../api/cartCliente";


const CartClienteContext = createContext()

export const useCartCliente = () => {
    const context = useContext(CartClienteContext);
    if (!context) throw new Error("useCartClienteContext debe ser usado en useCartClienteContext ");
    return context;
  };



export function CartClienteProvider({children}){
    const [cartClientes, setCartClientes] = useState([]);
    const [errors, setErrors] = useState([]);



    const getCartClient = async () => {
        try {
          const res = await getCartClientesRequest();
          console.log("ress1",res);
          setCartClientes(res)
        } catch (error) {
          console.error("cont",error);
        }
      };


      const createCartCliente = async (data) => {
        try {
          return await createCartClienteRequest(data);
          // return response
          console.log("clientes:",response)
        } catch (error) {
          console.log(error);
          setErrors(error.response.data.message);
        }
    }

    return(
        <CartClienteContext.Provider 
        value={{
            cartClientes,
            errors,
            getCartClient,
            createCartCliente
        }}
        >
            {children}
        </CartClienteContext.Provider>
    )
}