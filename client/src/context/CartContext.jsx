import { useContext, useState, createContext, useEffect } from "react";
import {getProductsRequest, getProductsCartRequest, addItemToCartRequest, editItemToCartRequest} from "../api/cart"
import { axiosClient } from "../api/axiosInstance";
const CartContext = createContext()


export const useCart = () => {
    const context = useContext(CartContext);
    if (!context)
      throw new Error(
        "useCart debe ser usado en VentaRepuestoProvider"
      );
    return context;
  };

  export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [products, setProducts] = useState([]);
  
    const getProducts = async () => {
      await axiosClient.get("/products")
        .then(({ data }) => setProducts(data.products));
    };


    const getProductsCart = async () => {
      return await axiosClient.get("/products-cart")
        .then(({ data }) => setCartItems(data.productsCart))
        .catch((error) => console.error(error));
    };

    useEffect(() => {
        getProducts();
        getProductsCart();
      }, []);

      const addItemToCart = async (product) => {
        const { name, img, price } = product;
    
        await axiosClient.post("/products-cart", { name, img, price });
    
        getProducts();
        getProductsCart();
      };
 
  
      const editItemToCart = async (id, query, amount) => {
        if (query === "del" && amount === 1) {
          await axiosClient
            .delete(`/products-cart/${id}`)
            .then(({ data }) => console.log(data));
        } else {
          await axiosClient
            .put(`/products-cart/${id}?query=${query}`, {
              amount,
            })
            .then(({ data }) => console.log(data));
        }
    
        getProducts();
        getProductsCart();
      };
    

    return (
      <CartContext.Provider
        value={{
            cartItems, products,
          addItemToCart, editItemToCart
        }}
      >
        {children}
      </CartContext.Provider>
    );
  }
  export default CartContext