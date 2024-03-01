import { useContext, useState, createContext, useEffect } from "react";
import {
  getProductsRequest,
  getProductsCartRequest,
  addItemToCartRequest,
  editItemToCartRequest,
  putAmountRequest,
  deleteProductRequest,
} from "../api/cart";
import { axiosClient } from "../api/axiosInstance";
const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCart debe ser usado en VentaRepuestoProvider");
  return context;
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    try {
       const res = await getProductsRequest()
       console.log("los productos mani", res);
       setProducts(res)
    } catch (error) {
      console.log(error, "hay error");
    }
  };

  const getProductsCart = async () => {
    return await axiosClient
      .get("/products-cart")
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

  const cleartCart = async () => {
    try {
      const response = await axiosClient.post("products-cart/delete");
      setCartItems(response);
      console.log("datos eliminados", response);
    } catch (error) {
      console.error("Error al eliminar productos:", error);
    }
    getProducts();
    getProductsCart();
  };

  const putAmount = async(id,amount) =>{
    try {
      return await putAmountRequest(id, amount);
    } catch (error) {
      console.error(error);
      
    }
  }

  const deleteProduct = async (id) =>{
    try {
      console.log("entro");
      const res = await deleteProductRequest(id);
      getProducts();
      getProductsCart();
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        deleteProduct,
        putAmount,
        products,
        getProducts,
        addItemToCart,
        editItemToCart,
        cleartCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
export default CartContext;
